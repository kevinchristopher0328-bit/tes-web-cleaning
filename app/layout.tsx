import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
