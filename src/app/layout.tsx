import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { copy } from "@/content/copy";
import { themeScript } from "@/lib/themeScript";
import "./globals.css";

// Google Sans variable font, subset to Latin + Hebrew (see fonts/OFL.txt)
const googleSans = localFont({
  src: "./fonts/GoogleSans.woff2",
  variable: "--font-google-sans",
  weight: "400 700",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: copy.seoTitle,
    template: "%s · Anglit",
  },
  description: copy.seoDescription,
  // Pre-launch: keep the draft out of search results. Remove at launch.
  robots: { index: false, follow: false },
  // Opening from the iPhone home screen hides the browser bar — cleaner recordings
  appleWebApp: { capable: true, title: "Anglit", statusBarStyle: "default" },
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
      className={`${googleSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script id="theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
