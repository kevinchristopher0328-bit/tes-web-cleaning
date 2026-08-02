"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { services } from "@/src/data/services";
import { animationsEnabled } from "@/lib/anim";

gsap.registerPlugin(useGSAP, ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export default function ServicesSection() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!animationsEnabled() || !gridRef.current) return;

      const cards = gridRef.current.querySelectorAll<HTMLElement>(".js-service-card");
      // Matikan CSS transition selama GSAP menganimasikan transform (hindari jank),
      // pulihkan setelah selesai agar efek hover tetap halus.
      cards.forEach((c) => (c.style.transition = "none"));

      gsap.from(cards, {
        opacity: 0,
        y: 40,
        duration: 0.6,
        ease: "back.out(1.2)", // sedikit overshoot alami
        stagger: 0.15,
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
          once: true,
        },
        onComplete: () => cards.forEach((c) => (c.style.transition = "")),
      });
    },
    { scope: gridRef },
  );

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

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <article
                key={s.slug}
                className="js-service-card group relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/60 hover:shadow-glow"
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
                    href={`/pesan?service=${s.slug}`}
                    className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    Pesan
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
