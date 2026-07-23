"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { CalendarCheck, UserCheck, PartyPopper } from "lucide-react";

const steps = [
  {
    n: 1,
    title: "Pilih layanan",
    desc: "Tentukan jenis jasa, lokasi, dan jadwal yang pas untukmu.",
    Icon: CalendarCheck,
  },
  {
    n: 2,
    title: "Cocokkan mitra",
    desc: "Kami carikan mitra terverifikasi terdekat dalam hitungan menit.",
    Icon: UserCheck,
  },
  {
    n: 3,
    title: "Beres!",
    desc: "Bayar setelah pekerjaan selesai dan kamu puas dengan hasilnya.",
    Icon: PartyPopper,
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "0px 0px -20% 0px" });

  // Garis penghubung ter-draw progresif mengikuti scroll.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 75%", "center 55%"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="cara-kerja"
      ref={sectionRef}
      className="mx-auto max-w-content px-6 py-24"
    >
      <div className="mb-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-subtle-foreground">
          Cara Kerja
        </p>
        <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
          Tiga langkah, langsung beres
        </h2>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="relative"
      >
        {/* Garis horizontal (desktop) — draw progresif */}
        <div className="pointer-events-none absolute left-[16.667%] right-[16.667%] top-9 hidden md:block">
          <svg
            className="h-2 w-full"
            viewBox="0 0 100 2"
            preserveAspectRatio="none"
            fill="none"
          >
            <line x1="0" y1="1" x2="100" y2="1" className="stroke-border" strokeWidth={2} strokeDasharray="1 2" />
            <motion.line
              x1="0"
              y1="1"
              x2="100"
              y2="1"
              className="stroke-primary"
              strokeWidth={2}
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </svg>
        </div>

        {/* Garis vertikal (mobile) */}
        <div className="pointer-events-none absolute bottom-10 left-9 top-10 w-px bg-border md:hidden" />

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((s) => (
            <motion.div
              key={s.n}
              variants={item}
              className="relative flex items-start gap-4 md:flex-col md:items-center md:text-center"
            >
              <div className="relative z-10 flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
                <s.Icon className="text-primary" size={30} strokeWidth={1.75} />
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm">
                  {s.n}
                </span>
              </div>
              <div className="md:mt-5">
                <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
