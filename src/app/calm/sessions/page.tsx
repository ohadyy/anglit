import type { Metadata } from "next";
import { SESSIONS } from "@/content/calmSessions";
import { countWord } from "@/content/facts";
import { SessionsPlayer } from "./SessionsPlayer";

export const metadata: Metadata = {
  title: "סשנים קוליים | אנג'לה",
  description: `${countWord(SESSIONS.length, "f")} הקלטות קצרות לפני המבחן ובדרך אליו.`,
};

export default function SessionsPage() {
  return <SessionsPlayer />;
}
