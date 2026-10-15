import type { Metadata } from "next";
import { DiploactJoinForm } from "./DiploactJoinForm";

export const metadata: Metadata = {
  title: "הרשמה חינם",
  robots: { index: false },
};

export default function DiploactJoinPage() {
  return <DiploactJoinForm />;
}
