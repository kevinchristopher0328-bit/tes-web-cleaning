import type { SVGProps } from "react";

/**
 * Ikon layanan — SVG stroke sederhana (currentColor) supaya ikut warna token.
 * Sengaja hand-rolled agar tidak menambah dependency ikon.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function HomeCleanIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
      <path d="M9.5 21v-4a2.5 2.5 0 0 1 5 0v4" />
    </svg>
  );
}

export function IronIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 15a7 7 0 0 1 7-7h6a5 5 0 0 1 5 5v2H3z" />
      <path d="M3 15v2a2 2 0 0 0 2 2h2" />
      <path d="M10 8V6a2 2 0 0 1 2-2h3" />
    </svg>
  );
}

export function SofaIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" />
      <path d="M3 12a2 2 0 0 1 2 2v3h14v-3a2 2 0 1 1 2-2v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <path d="M7 17v2M17 17v2" />
    </svg>
  );
}

export function SprayIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 8h5a2 2 0 0 1 2 2v10a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1z" />
      <path d="M9 8V5a1 1 0 0 1 1-1h3" />
      <path d="M16 6h2M19 4v.01M20 7v.01M17 3v.01M12.5 13v3" />
    </svg>
  );
}

export function AcIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="8" rx="2" />
      <path d="M7 9h8" />
      <path d="M7 16.5c0 1 .8 1.5 1.8 1.5M12 17c0 1.2 1 2 2.2 2M16.5 16.5c0 1 .8 1.5 1.8 1.5" />
    </svg>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20c0-8 6-14 16-14 0 10-6 14-14 14" />
      <path d="M4 20c2-6 6-9 11-10" />
    </svg>
  );
}
