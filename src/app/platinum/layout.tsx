import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Pinyon_Script } from "next/font/google";
import { PlatinumTheme } from "./PlatinumTheme";

// Serif for headings and stems, a script face for the certificate signature. Loaded only on /platinum.
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-plat-serif",
  display: "swap",
});
const script = Pinyon_Script({ subsets: ["latin"], weight: "400", variable: "--font-plat-script", display: "swap" });

// The test names (Gold, Platinum, ...)
const cinzel = Cinzel({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-plat-cinzel", display: "swap" });

export const metadata: Metadata = {
  title: "Anglit Platinum",
  robots: { index: false },
};

// Colors the phone's status bar to match the black page
export const viewport: Viewport = { themeColor: "#0a0a0a" };

export default function PlatinumLayout({ children }: LayoutProps<"/platinum">) {
  return (
    // data-theme on the wrapper paints the first frame dark; PlatinumTheme then themes <html> too
    <div data-theme="platinum" className={`plat-root ${serif.variable} ${script.variable} ${cinzel.variable}`}>
      <PlatinumTheme />
      {children}
    </div>
  );
}
