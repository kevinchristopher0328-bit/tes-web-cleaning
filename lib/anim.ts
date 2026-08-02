/**
 * Animasi hias hanya dijalankan di desktop (>=1024px) dan dimatikan bila
 * pengguna memilih prefers-reduced-motion. Di luar itu elemen tampil normal
 * tanpa animasi (tidak pernah tersembunyi).
 */
export function animationsEnabled() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(min-width: 1024px)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
