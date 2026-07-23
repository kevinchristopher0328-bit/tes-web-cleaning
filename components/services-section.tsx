"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { services } from "@/src/data/services";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const card: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Munculkan sekali saat 20% section masuk viewport.
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const show = reduce || inView; // reduced-motion: tampil langsung tanpa scroll

  return (
    <section id="layanan" className="bg-muted/40 py-24">
      <div className="mx-auto max-w-content px-6">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-subtle-foreground">
            Layanan Kami
          </p>
          <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            Semua kebutuhan rumah, satu aplikasi
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Pilih layanan, tentukan jadwal, dan biarkan mitra terverifikasi kami
            yang mengerjakan.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={show ? "show" : "hidden"}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <motion.article
                key={s.slug}
                variants={card}
                className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/60 hover:shadow-glow"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-subtle text-primary transition-transform duration-300 ease-out group-hover:rotate-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon size={24} strokeWidth={1.75} />
                </span>

                <h3 className="mt-4 text-lg font-bold text-card-foreground">
                  {s.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {s.description}
                </p>

                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <span className="block text-xs text-muted-foreground">
                      Mulai dari
                    </span>
                    <span className="text-lg font-extrabold text-primary">
                      {s.priceFrom}
                    </span>
                  </div>
                  <Link
                    href={s.href}
                    className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    Pesan
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
