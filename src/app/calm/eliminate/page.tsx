import type { Metadata } from "next";
import { EliminateGame } from "./EliminateGame";

export const metadata: Metadata = {
  title: "לפסול ולהמשיך",
  description: "תרגול קצר: בכל שאלה פוסלים שתי תשובות שאי אפשר שיהיו נכונות, גם בלי לדעת את התשובה.",
};

export default function EliminatePage() {
  return <EliminateGame />;
}
