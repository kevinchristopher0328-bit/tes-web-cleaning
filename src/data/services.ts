import {
  AirVent,
  Leaf,
  Shirt,
  Sofa,
  Sparkles,
  SprayCan,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  slug: string;
  name: string;
  description: string;
  /** Harga "mulai dari" — sudah diformat untuk ditampilkan. */
  priceFrom: string;
  icon: LucideIcon;
  href: string;
};

/**
 * Data layanan — sumber tunggal, dipakai ulang di section "Layanan Kami",
 * mega menu navbar, halaman detail, dsb.
 */
export const services: Service[] = [
  {
    slug: "bersih-rumah",
    name: "Bersih Rumah",
    description: "Sapu, pel, dan rapikan seluruh ruangan.",
    priceFrom: "Rp 90.000",
    icon: Sparkles,
    href: "/layanan/bersih-rumah",
  },
  {
    slug: "setrika",
    name: "Setrika",
    description: "Kiloan rapi dengan antar-jemput.",
    priceFrom: "Rp 8.000/kg",
    icon: Shirt,
    href: "/layanan/setrika",
  },
  {
    slug: "cuci-sofa",
    name: "Cuci Sofa & Kasur",
    description: "Bebas tungau, debu, dan noda membandel.",
    priceFrom: "Rp 150.000",
    icon: Sofa,
    href: "/layanan/cuci-sofa",
  },
  {
    slug: "dapur-kamar-mandi",
    name: "Dapur & Kamar Mandi",
    description: "Deep cleaning area paling kotor di rumah.",
    priceFrom: "Rp 120.000",
    icon: SprayCan,
    href: "/layanan/dapur-kamar-mandi",
  },
  {
    slug: "servis-ac",
    name: "Servis AC",
    description: "Cuci unit dan isi ulang freon.",
    priceFrom: "Rp 75.000",
    icon: AirVent,
    href: "/layanan/servis-ac",
  },
  {
    slug: "taman-kebun",
    name: "Taman & Kebun",
    description: "Rapikan rumput dan rawat tanaman.",
    priceFrom: "Rp 100.000",
    icon: Leaf,
    href: "/layanan/taman-kebun",
  },
];
