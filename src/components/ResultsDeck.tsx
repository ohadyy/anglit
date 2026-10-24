"use client";

// Draggable card stack, adapted from kokonutui's "Throw Deck" (MIT, @dorianbaffier).
// Trimmed to what Anglit needs: no details view, no price, no motion/lucide dependency.
// Drag or tap the top card and it flies off and lands under the pile.

import Image from "next/image";
import { type KeyboardEvent, type PointerEvent, useCallback, useEffect, useRef, useState } from "react";

export interface DeckCard {
  letter: string;
  before: number;
  after: number;
  avatar: string;
}

// ---------------------------------------------------------------------------
// Physics
// ---------------------------------------------------------------------------

// Resting pose of each slot: the top card sits straight, the ones beneath keep a fixed tilt
const TILTS = [0, -2, 1.5, -1];
const SLOT_Y = 9;
const SLOT_SCALE = 0.035;
const MAX_SLOT = TILTS.length - 1;

const MAX_DRAG_ROTATION = 18;
// A release throws the card when it is this fast (px/ms) or this far (share of the card's width)
const THROW_VELOCITY = 0.5;
const THROW_DISTANCE = 0.35;
// Moves smaller than this (px) count as a tap
const TAP_SLOP = 5;
const VELOCITY_WINDOW = 90;

// Springs as stiffness / damping (per second)
const HOME = { k: 420, c: 30 };
const FLIGHT = { k: 150, c: 15 };
const RETURN = { k: 240, c: 26 };

const TOP_Z = 1000;

type Phase = "rest" | "drag" | "out" | "return";

interface Pose {
  x: number;
  y: number;
  r: number;
  s: number;
}

interface Body extends Pose {
  vx: number;
  vy: number;
  vr: number;
  vs: number;
  phase: Phase;
  out: Pose;
  dx: number;
  dy: number;
  z: number | null;
  apexZ: number | null;
}

interface Drag {
  pointerId: number;
  index: number;
  startX: number;
  startY: number;
  baseX: number;
  baseY: number;
  width: number;
  /** +1 when grabbed in the top half, -1 in the bottom half */
  lever: number;
  moved: boolean;
  samples: { t: number; x: number; y: number }[];
}

function slotPose(depth: number): Pose {
  const d = Math.min(depth, MAX_SLOT);
  return { x: 0, y: d * SLOT_Y, r: TILTS[d] ?? 0, s: 1 - d * SLOT_SCALE };
}

function lerpPose(a: Pose, b: Pose, t: number): Pose {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, r: a.r + (b.r - a.r) * t, s: a.s + (b.s - a.s) * t };
}

function poseTransform({ x, y, r, s }: Pose) {
  return `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${r.toFixed(3)}deg) scale(${s.toFixed(4)})`;
}

function makeBody(depth: number): Body {
  const pose = slotPose(depth);
  return { ...pose, vx: 0, vy: 0, vr: 0, vs: 0, phase: "rest", out: pose, dx: 1, dy: 0, z: null, apexZ: null };
}

function springAxis(value: number, velocity: number, target: number, spring: { k: number; c: number }, dt: number) {
  const accel = -spring.k * (value - target) - spring.c * velocity;
  const v = velocity + accel * dt;
  return [value + v * dt, v] as const;
}

function stepBody(body: Body, target: Pose, dt: number) {
  const spring = body.phase === "out" ? FLIGHT : body.phase === "return" ? RETURN : HOME;
  // Sub-step so a stiff spring stays stable on a slow frame
  const steps = Math.max(1, Math.ceil(dt * 240));
  const h = dt / steps;
  for (let i = 0; i < steps; i++) {
    [body.x, body.vx] = springAxis(body.x, body.vx, target.x, spring, h);
    [body.y, body.vy] = springAxis(body.y, body.vy, target.y, spring, h);
    [body.r, body.vr] = springAxis(body.r, body.vr, target.r, spring, h);
    [body.s, body.vs] = springAxis(body.s, body.vs, target.s, spring, h);
  }
}

function isSettled(body: Body, target: Pose) {
  return (
    Math.abs(body.x - target.x) < 0.1 &&
    Math.abs(body.y - target.y) < 0.1 &&
    Math.abs(body.r - target.r) < 0.02 &&
    Math.abs(body.s - target.s) < 0.0005 &&
    Math.abs(body.vx) + Math.abs(body.vy) < 2 &&
    Math.abs(body.vr) < 1 &&
    Math.abs(body.vs) < 0.01
  );
}

/** Distance along (ux, uy) at which a w×h card no longer covers the deck */
function clearance(w: number, h: number, ux: number, uy: number) {
  const along = Math.min(ux === 0 ? Infinity : w / Math.abs(ux), uy === 0 ? Infinity : h / Math.abs(uy));
  return along + 24;
}

function releaseVelocity(samples: Drag["samples"]) {
  const last = samples.at(-1);
  const first = samples.find((sample) => last && last.t - sample.t <= VELOCITY_WINDOW);
  if (!(first && last) || last.t - first.t < 8) return { vx: 0, vy: 0 };
  const dt = last.t - first.t;
  return { vx: (last.x - first.x) / dt, vy: (last.y - first.y) / dt };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ResultsDeck({ cards }: { cards: DeckCard[] }) {
  const count = cards.length;
  const [order, setOrder] = useState(() => cards.map((_, i) => i));

  const orderRef = useRef(order);
  const bodies = useRef<Body[]>(cards.map((_, i) => makeBody(i)));
  const nodes = useRef<(HTMLButtonElement | null)[]>([]);
  const drag = useRef<Drag | null>(null);
  // 0-1: how close the current drag is to a throw. The card beneath rises to meet it.
  const progress = useRef(0);
  const raf = useRef(0);
  const last = useRef(0);
  const reduced = useRef(false);
  const focusTop = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const write = useCallback((index: number, depth: number) => {
    const node = nodes.current[index];
    const body = bodies.current[index];
    if (!(node && body)) return;
    node.style.transform = poseTransform(body);
    node.style.zIndex = String(body.z ?? orderRef.current.length - depth);
    const state = body.phase === "drag" ? "drag" : body.phase === "rest" ? "rest" : "fly";
    if (node.dataset.state !== state) node.dataset.state = state;
  }, []);

  const targetFor = useCallback((body: Body, depth: number): Pose => {
    if (body.phase === "out") return body.out;
    const pose = slotPose(depth);
    if (depth > 0 && progress.current > 0) return lerpPose(pose, slotPose(depth - 1), progress.current * 0.6);
    return pose;
  }, []);

  const advance = useCallback(
    (index: number, depth: number, dt: number) => {
      const body = bodies.current[index];
      if (!body) return false;
      if (body.phase === "drag") {
        write(index, depth);
        return true;
      }
      if (reduced.current && body.phase === "out") {
        body.phase = "rest";
        body.z = null;
      }
      const target = targetFor(body, depth);
      if (reduced.current) Object.assign(body, target, { vx: 0, vy: 0, vr: 0, vs: 0 });
      else stepBody(body, target, dt);
      // Top of the arc: the card stops travelling outward, swaps to its new layer, and heads home
      if (body.phase === "out" && body.vx * body.dx + body.vy * body.dy <= 0) {
        body.phase = "return";
        body.z = body.apexZ;
      }
      const settled = isSettled(body, target);
      if (settled && body.phase !== "out") {
        body.phase = "rest";
        body.z = null;
      }
      write(index, depth);
      return !settled;
    },
    [targetFor, write],
  );

  // The loop calls itself through a ref, since a callback cannot reference its own name
  const tickRef = useRef<(now: number) => void>(() => {});
  const tick = useCallback(
    (now: number) => {
      const dt = Math.min((now - last.current) / 1000, 1 / 30);
      last.current = now;
      let active = false;
      orderRef.current.forEach((index, depth) => {
        if (advance(index, depth, dt)) active = true;
      });
      raf.current = active ? requestAnimationFrame((t) => tickRef.current(t)) : 0;
    },
    [advance],
  );
  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  // The loop sleeps whenever every card has settled; anything that moves a card wakes it
  const kick = useCallback(() => {
    if (raf.current) return;
    last.current = performance.now();
    raf.current = requestAnimationFrame((t) => tickRef.current(t));
  }, []);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const commitOrder = useCallback(
    (next: number[]) => {
      orderRef.current = next;
      setOrder(next);
      kick();
    },
    [kick],
  );

  // Send the top card flying along (vx, vy) px/ms; it comes back under the pile.
  // (fx, fy) is the direction to use when there is no real velocity.
  const throwTop = useCallback(
    (vx: number, vy: number, fx: number, fy: number) => {
      const current = orderRef.current;
      const index = current[0];
      if (index === undefined || current.length < 2) return;
      const body = bodies.current[index];
      const node = nodes.current[index];
      if (!body) return;
      const speed = Math.hypot(vx, vy);
      const rawX = speed > 0.05 ? vx : fx;
      const rawY = speed > 0.05 ? vy : fy;
      const norm = Math.hypot(rawX, rawY) || 1;
      const ux = rawX / norm;
      const uy = rawY / norm;
      const distance = clearance(node?.offsetWidth ?? 256, node?.offsetHeight ?? 320, ux, uy) + Math.min(speed * 50, 90);
      // Keep some speed so a slow but far drag still leaves with intent
      const launch = Math.max(speed, 0.9) * 1000;
      body.phase = "out";
      body.dx = ux;
      body.dy = uy;
      body.out = { x: ux * distance, y: uy * distance, r: Math.max(-40, Math.min(40, body.r + ux * 26)), s: 1 };
      body.vx = ux * launch;
      body.vy = uy * launch;
      body.vr += ux * launch * 0.05;
      body.z = TOP_Z;
      body.apexZ = null;
      commitOrder([...current.slice(1), index]);
    },
    [commitOrder],
  );

  // The bottom card slips out to the side, swaps on top at its apex and lands as the new top card
  const bringBack = useCallback(() => {
    const current = orderRef.current;
    const index = current.at(-1);
    if (index === undefined || current.length < 2) return;
    const body = bodies.current[index];
    const node = nodes.current[index];
    if (!body) return;
    const ux = -0.97;
    const uy = -0.24;
    const distance = clearance(node?.offsetWidth ?? 256, node?.offsetHeight ?? 320, ux, uy) + 20;
    body.phase = "out";
    body.dx = ux;
    body.dy = uy;
    body.out = { x: ux * distance, y: uy * distance, r: -16, s: 1 };
    body.vx = ux * 1100;
    body.vy = uy * 1100;
    body.z = 0;
    body.apexZ = TOP_Z - 1;
    commitOrder([index, ...current.slice(0, -1)]);
  }, [commitOrder]);

  const cycle = useCallback(
    (direction: 1 | -1) => {
      if (direction === 1) throwTop(1.3, -0.35, 1, 0);
      else bringBack();
    },
    [throwTop, bringBack],
  );

  // Keep keyboard focus on whichever card is now on top
  useEffect(() => {
    if (!focusTop.current) return;
    focusTop.current = false;
    const topCard = order[0];
    if (topCard !== undefined) nodes.current[topCard]?.focus({ preventScroll: true });
  }, [order]);

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>, index: number) => {
    if (drag.current || orderRef.current[0] !== index) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const body = bodies.current[index];
    if (!body) return;
    const node = event.currentTarget;
    const rect = node.getBoundingClientRect();
    node.setPointerCapture(event.pointerId);
    drag.current = {
      pointerId: event.pointerId,
      index,
      startX: event.clientX,
      startY: event.clientY,
      baseX: body.x,
      baseY: body.y,
      width: node.offsetWidth,
      lever: event.clientY - rect.top < rect.height / 2 ? 1 : -1,
      moved: false,
      samples: [{ t: event.timeStamp, x: event.clientX, y: event.clientY }],
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    if (!current.moved) {
      if (Math.hypot(dx, dy) < TAP_SLOP) return;
      // Axis lock for touch: a mostly vertical swipe is a page scroll, so let go and leave it to the browser
      if (event.pointerType !== "mouse" && Math.abs(dy) > Math.abs(dx)) {
        drag.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        return;
      }
    }
    const body = bodies.current[current.index];
    if (!body) return;
    current.moved = true;
    current.samples.push({ t: event.timeStamp, x: event.clientX, y: event.clientY });
    if (current.samples.length > 24) current.samples.shift();
    body.phase = "drag";
    body.x = current.baseX + dx;
    body.y = current.baseY + dy;
    body.s = 1;
    // Pivot at the bottom edge: grabbing the top half swings the top out, the bottom half swings it the other way
    body.r = Math.max(-1, Math.min(1, body.x / current.width)) * MAX_DRAG_ROTATION * current.lever;
    body.vx = 0;
    body.vy = 0;
    body.vr = 0;
    body.vs = 0;
    progress.current = Math.min(Math.hypot(body.x, body.y) / (current.width * THROW_DISTANCE), 1);
    kick();
  };

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>, cancelled = false) => {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    drag.current = null;
    progress.current = 0;
    const body = bodies.current[current.index];
    if (!(body && current.moved)) {
      // A tap on the top card sends it to the back
      if (!cancelled) cycle(1);
      else kick();
      return;
    }
    if (cancelled) {
      // The browser took the gesture: no throw, just spring home
      body.phase = "rest";
      kick();
      return;
    }
    const { vx, vy } = releaseVelocity(current.samples);
    const speed = Math.hypot(vx, vy);
    const distance = Math.hypot(body.x, body.y);
    // A flick back toward the deck is a change of mind, not a throw
    const heading = distance > 0 ? (vx * body.x + vy * body.y) / distance : 0;
    const fast = speed > THROW_VELOCITY && heading > -0.2;
    const far = distance > current.width * THROW_DISTANCE && heading > -0.3;
    if (fast || far) {
      throwTop(vx, vy, body.x / (distance || 1), body.y / (distance || 1));
      return;
    }
    // Spring home, carrying the release velocity into the spring
    body.phase = "rest";
    body.vx = vx * 1000;
    body.vy = vy * 1000;
    body.vr = ((vx * 1000) / current.width) * MAX_DRAG_ROTATION * current.lever;
    kick();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      focusTop.current = true;
      cycle(1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      focusTop.current = true;
      cycle(-1);
    }
  };

  const NAV =
    "flex size-11 shrink-0 touch-manipulation items-center justify-center rounded-full border border-fg/25 transition-colors hover:bg-fg/5 active:bg-fg/10";

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center py-4">
      <section
        aria-label="תוצאות של תלמידים. גוררים כרטיס הצידה או משתמשים בחצים כדי לעבור בין הכרטיסים."
        className="relative aspect-[4/5] w-[min(16rem,calc(100%-5rem))]"
      >
        {cards.map((card, index) => {
          const depth = order.indexOf(index);
          const isTop = depth === 0;
          return (
            <button
              aria-label={`${card.letter}׳: מציון ${card.before} לציון ${card.after}`}
              className={`absolute inset-0 origin-bottom touch-pan-y select-none rounded-2xl text-center outline-none will-change-transform shadow-[0_1px_2px_rgb(0_0_0/0.05),0_4px_12px_-4px_rgb(0_0_0/0.18)] transition-shadow duration-200 data-[state=drag]:shadow-[0_2px_4px_rgb(0_0_0/0.05),0_28px_48px_-16px_rgb(0_0_0/0.3)] data-[state=fly]:shadow-[0_2px_4px_rgb(0_0_0/0.05),0_28px_48px_-16px_rgb(0_0_0/0.3)] focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-4 ${isTop ? "cursor-grab data-[state=drag]:cursor-grabbing" : ""}`}
              data-state="rest"
              inert={!isTop}
              key={card.letter}
              onKeyDown={handleKeyDown}
              onLostPointerCapture={(event) => handlePointerUp(event, true)}
              onPointerCancel={(event) => handlePointerUp(event, true)}
              onPointerDown={(event) => handlePointerDown(event, index)}
              onPointerMove={handlePointerMove}
              onPointerUp={(event) => handlePointerUp(event)}
              ref={(node) => {
                nodes.current[index] = node;
              }}
              style={{ transform: poseTransform(slotPose(index)), zIndex: count - index }}
              tabIndex={isTop ? 0 : -1}
              type="button"
            >
              <span className="flex h-full flex-col rounded-2xl border border-line bg-white p-2">
                <span className="relative block min-h-0 flex-1 overflow-hidden rounded-xl">
                  <Image
                    src={card.avatar}
                    alt=""
                    fill
                    sizes="256px"
                    draggable={false}
                    className="pointer-events-none select-none object-cover"
                  />
                </span>
                <span className="flex items-center justify-between gap-3 px-2 pb-1 pt-3">
                  <span className="text-2xl font-bold">{card.letter}</span>
                  <span className="flex items-center gap-2 text-2xl font-bold tabular-nums">
                    <bdi className="opacity-50">{card.before}</bdi>
                    <span aria-hidden className="text-lg opacity-50">←</span>
                    <bdi>{card.after}</bdi>
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </section>

      <div className="mt-8 flex items-center justify-center gap-6">
        <button aria-label="הכרטיס הקודם" className={NAV} onClick={() => cycle(-1)} type="button">
          <span aria-hidden>→</span>
        </button>
        <p aria-live="polite" className="text-sm tabular-nums opacity-70">
          <bdi dir="ltr">
            {(order[0] ?? 0) + 1} / {count}
          </bdi>
        </p>
        <button aria-label="הכרטיס הבא" className={NAV} onClick={() => cycle(1)} type="button">
          <span aria-hidden>←</span>
        </button>
      </div>
    </div>
  );
}
