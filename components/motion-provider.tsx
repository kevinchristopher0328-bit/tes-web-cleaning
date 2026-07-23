"use client";

import { MotionConfig } from "framer-motion";

/**
 * Membungkus seluruh app dengan reducedMotion="user": saat pengguna
 * mengaktifkan "prefers-reduced-motion", Framer Motion otomatis menonaktifkan
 * animasi transform/layout (x/y/scale/rotate) dan hanya menyisakan opacity.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
