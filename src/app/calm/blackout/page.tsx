import type { Metadata } from "next";
import { BlackoutGame } from "./BlackoutGame";

export const metadata: Metadata = {
  title: "מה עושים כשנתקעים",
  description: "שלושה רגעים שקורים בכל מבחן, ומה כדאי לעשות בכל אחד מהם.",
};

export default function BlackoutPage() {
  return <BlackoutGame />;
}
