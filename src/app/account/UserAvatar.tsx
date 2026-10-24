"use client";

import { Blobatar } from "@blobatar/react";
import { useGaze } from "@blobatar/react/gaze";
import "blobatar/motion.css";
import "blobatar/gaze.css";

// Eyes follow the pointer, or the finger while touching
export function UserAvatar({ seed }: { seed: string }) {
  const { ref } = useGaze({ travel: 3, lookAt: "pointer" });
  return <Blobatar ref={ref} name={seed} animate="always" size={64} className="shrink-0 rounded-full" />;
}
