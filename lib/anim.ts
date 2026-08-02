/**
 * Animasi hias berjalan di semua ukuran layar (termasuk mobile/iOS), dan hanya
 * dimatikan bila pengguna memilih prefers-reduced-motion. Saat dimatikan,
 * elemen tampil normal tanpa animasi (tidak pernah tersembunyi).
 */
export function animationsEnabled() {
  if (typeof window === "undefined") return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
