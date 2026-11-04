import type { Metadata } from "next";
import { SessionsPlayer } from "./SessionsPlayer";

export const metadata: Metadata = {
  title: "סשנים קוליים | אנג'לה",
  description: "שלוש הקלטות קצרות לפני המבחן ובדרך אליו.",
};

export default function SessionsPage() {
  return <SessionsPlayer />;
}
