"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ShieldCheck, RefreshCw, Wallet, Tag } from "lucide-react";
import { animationsEnabled } from "@/lib/anim";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const reasons = [
  {
    Icon: ShieldCheck,
    title: "Mitra terverifikasi",
    desc: "Setiap mitra lolos verifikasi identitas, wawancara, dan pelatihan standar Beres.",
  },
  {
    Icon: RefreshCw,
    title: "Garansi 24 jam",
    desc: "Kurang puas dengan hasilnya? Kami kerjakan ulang gratis dalam 24 jam.",
  },
  {
    Icon: Wallet,
    title: "Bayar setelah selesai",
    desc: "Pembayaran hanya dilakukan setelah pekerjaan beres dan kamu puas.",
  },
  {
    Icon: Tag,
    title: "Harga transparan",
    desc: "Estimasi jelas di depan, tanpa biaya tersembunyi atau kejutan di akhir.",
  },
];

export default function WhyBeres() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!animationsEnabled() || !gridRef.current) return;
      gsap.from(".js-why-card", {
        opacity: 0,
        x: -40,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
        clearProps: "all",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: gridRef },
  );

  return (
    <section id="kenapa-beres" className="bg-muted/40 py-24">
      <div className="mx-auto max-w-content px-6">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-subtle-foreground">
            Kenapa Beres
          </p>
          <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
            Kenapa pilih Beres?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Ribuan keluarga mempercayakan urusan rumahnya ke Beres. Ini alasannya.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {reasons.map((r) => (
            <article
              key={r.title}
              className="js-why-card rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/40"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-subtle text-primary">
                <r.Icon size={24} strokeWidth={1.75} />
              </span>
              <h3 className="mt-4 text-base font-bold text-card-foreground">{r.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
