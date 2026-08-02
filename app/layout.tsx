import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/motion-provider";
import ChatWidget from "@/components/chat-widget";

// Display: Plus Jakarta Sans — didesain di Jakarta, geometris-ramah,
// tegas untuk heading tapi tetap approachable.
const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

// Body: Inter — workhorse UI, sangat legible pada ukuran kecil.
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Beres — Design System",
  description:
    "Design system marketplace jasa rumah tangga Indonesia. Hangat, terpercaya, blue + white.",
};

// maximum-scale=1 mencegah iOS Safari auto-zoom saat input chat difokus.
// Menghasilkan: <meta name="viewport"
//   content="width=device-width, initial-scale=1, maximum-scale=1" />
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable}`}>
      <body>
        <MotionProvider>{children}</MotionProvider>
        <ChatWidget />
      </body>
    </html>
  );
}
