import type { Metadata } from "next";
import { ContentClient } from "./ContentClient";

export const metadata: Metadata = {
  title: "בחירת טקסטים",
  robots: { index: false, follow: false },
};

export default function ContentPage() {
  return <ContentClient />;
}
