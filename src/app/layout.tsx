import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { MetaPixel } from "@/components/MetaPixel";
import { SiteChrome } from "@/components/SiteChrome";
import { PageTransition } from "@/components/PageTransition";
import { copy } from "@/content/copy";
import { themeScript } from "@/lib/themeScript";
import { site } from "@/lib/site";
import "./globals.css";

// Google Sans variable font, subset to Latin + Hebrew (see fonts/OFL.txt)
const googleSans = localFont({
  src: "./fonts/GoogleSans.woff2",
  variable: "--font-google-sans",
  weight: "400 700",
  display: "swap",
});

// Rubik for headings (OFL) and Gadi Almog for handwritten accents (free license, see fonts/GadiAlmog-license.pdf)
const rubik = localFont({
  src: "./fonts/Rubik-Bold.ttf",
  variable: "--font-rubik",
  weight: "700",
  display: "swap",
});

const gadiAlmog = localFont({
  src: "./fonts/GadiAlmog-Regular.woff2",
  variable: "--font-gadi-almog",
  weight: "400",
  display: "swap",
});

// Gevora — decorative display font, used only for the big watermark letter in
// the hero background.
const gevora = localFont({
  src: "./fonts/Gevora.ttf",
  variable: "--font-gevora-face",
  display: "swap",
  // Only the hero watermark uses it, so it is not preloaded on every page
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: copy.seoTitle,
    template: "%s · Anglit",
  },
  description: copy.seoDescription,
  alternates: { canonical: "/" },
  // Opening from the iPhone home screen hides the browser bar — cleaner recordings
  appleWebApp: { capable: true, title: "Anglit", statusBarStyle: "default" },
  // Meta business domain verification (Business Manager → Brand safety → Domains)
  other: { "facebook-domain-verification": "we24xrkueg3joxpeu8g5derw3uar74" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="he"
      dir="rtl"
      data-theme="light"
      suppressHydrationWarning
      className={`${googleSans.variable} ${gevora.variable} ${rubik.variable} ${gadiAlmog.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <MetaPixel />
        <PageTransition>
          <SiteChrome>{children}</SiteChrome>
        </PageTransition>
      </body>
    </html>
  );
}
