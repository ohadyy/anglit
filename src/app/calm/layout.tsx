import { CalmBackdrop } from "./CalmArt";
import { CalmTop } from "./CalmTop";

export default function CalmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="calm-bg relative min-h-dvh">
      <CalmBackdrop />
      <CalmTop />
      <div className="relative">{children}</div>
    </div>
  );
}
