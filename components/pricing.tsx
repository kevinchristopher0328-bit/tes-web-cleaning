"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { Check } from "lucide-react";

type Tier = {
  name: string;
  price: string;
  period?: string;
  desc: string;
  features: string[];
  featured?: boolean;
  cta: string;
};

const tiers: Tier[] = [
  {
    name: "Sekali Bersih",
    price: "Rp 90rb",
    period: "/kunjungan",
    desc: "Untuk kebutuhan mendadak atau coba-coba.",
    features: ["2 jam kerja", "Alat dari mitra", "Garansi ulang 24 jam"],
    cta: "Pilih paket",
  },
  {
    name: "Langganan Mingguan",
    price: "Rp 320rb",
    period: "/bulan",
    desc: "Rumah selalu rapi tanpa perlu mikir.",
    features: [
      "4x kunjungan / bulan",
      "Mitra tetap yang sama",
      "Prioritas jadwal",
      "Diskon 10% layanan lain",
    ],
    featured: true,
    cta: "Mulai langganan",
  },
  {
    name: "Borongan",
    price: "Custom",
    desc: "Deep cleaning atau pindahan besar.",
    features: ["Tim 2–4 orang", "Survei gratis", "Penawaran fleksibel"],
    cta: "Minta penawaran",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const show = reduce || inView;

  return (
    <section id="harga" className="mx-auto max-w-content px-6 py-24">
      <div className="mb-14 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-subtle-foreground">
          Harga
        </p>
        <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
          Transparan, tanpa biaya tersembunyi
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Pilih paket yang sesuai. Bisa ganti atau berhenti kapan saja.
        </p>
      </div>

      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={show ? "show" : "hidden"}
        className="grid grid-cols-1 items-center gap-6 md:grid-cols-3"
      >
        {tiers.map((t) => (
          <motion.div
            key={t.name}
            variants={item}
            className={[
              "relative flex h-full flex-col rounded-3xl border p-7 transition-shadow",
              t.featured
                ? "border-primary bg-card shadow-glow md:scale-[1.04] md:py-9"
                : "border-border bg-card shadow-sm hover:shadow-md",
            ].join(" ")}
          >
            {t.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground shadow-sm">
                Paling laris
              </span>
            )}

            <h3 className="text-lg font-bold text-card-foreground">{t.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>

            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-foreground">
                {t.price}
              </span>
              {t.period && (
                <span className="text-sm text-muted-foreground">{t.period}</span>
              )}
            </div>

            <ul className="mt-6 space-y-3">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-card-foreground">
                  <span
                    className={[
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                      t.featured ? "bg-primary text-primary-foreground" : "bg-primary-subtle text-primary",
                    ].join(" ")}
                  >
                    <Check size={13} strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href="/pesan"
              className={[
                "mt-8 flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-colors",
                t.featured
                  ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover"
                  : "border border-input bg-card text-card-foreground hover:bg-muted",
              ].join(" ")}
            >
              {t.cta}
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
