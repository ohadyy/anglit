import type { Passage } from "@/content/questions";
import { CORE_SECTIONS, type ExamPlanItem } from "@/lib/examStructure";
import type { PlatinumTestBank } from "@/content/platinum/build";
import { meridian } from "@/content/platinum/t1";
import { obsidian } from "@/content/platinum/t2";
import { sovereign } from "@/content/platinum/t3";
import { vanguard } from "@/content/platinum/t4";
import { zenith } from "@/content/platinum/t5";

// Server-only: this module holds the Platinum answer key, so client components must not import it.
const banks: Record<string, PlatinumTestBank> = { P1: meridian, P2: obsidian, P3: sovereign, P4: vanguard, P5: zenith };

/** A Platinum test has the real exam's six core chapters (same sizes and minutes as the
 * regular tests) and no experimental ones: it is hand-written, not drawn from a bank. */
export function buildPlatinumExam(number: string): ExamPlanItem[] {
  const bank = banks[number];
  if (!bank) throw new Error(`unknown platinum test ${number}`);
  const taken = { sentence: 0, restatement: 0, reading: 0 };
  return CORE_SECTIONS.map((section) => {
    const type = section.type as keyof typeof taken;
    const start = taken[type];
    taken[type] += section.count;
    return { section, questions: bank[type].slice(start, start + section.count) };
  });
}

export function platinumPassage(number: string): Passage {
  return banks[number].passage;
}
