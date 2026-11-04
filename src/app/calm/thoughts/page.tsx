import type { Metadata } from "next";
import { ThoughtsGame } from "./ThoughtsGame";

export const metadata: Metadata = {
  title: "לסנן את הרעש",
  description: "דקה של מחשבות: מחליקים החוצה את אלו שמעכבות ושומרים את אלו שעוזרות.",
};

export default function ThoughtsPage() {
  return <ThoughtsGame />;
}
