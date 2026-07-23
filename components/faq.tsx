"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "Bagaimana cara memesan layanan?",
    a: "Cukup pilih layanan, masukkan lokasi dan jadwal, lalu tekan “Cari”. Kami akan mencocokkanmu dengan mitra terverifikasi terdekat dalam hitungan menit.",
  },
  {
    q: "Apakah mitra sudah terverifikasi?",
    a: "Ya. Setiap mitra melewati verifikasi identitas, wawancara, dan pelatihan standar Beres sebelum menerima pesanan pertama mereka.",
  },
  {
    q: "Kapan saya harus membayar?",
    a: "Pembayaran baru dilakukan setelah pekerjaan selesai dan kamu puas. Tersedia pembayaran non-tunai maupun tunai langsung ke mitra.",
  },
  {
    q: "Bagaimana jika hasilnya kurang memuaskan?",
    a: "Kami memberikan garansi ulang 24 jam. Laporkan lewat aplikasi dan kami kirim mitra untuk membereskan tanpa biaya tambahan.",
  },
  {
    q: "Apakah bisa berlangganan dengan mitra yang sama?",
    a: "Bisa. Paket Langganan Mingguan memungkinkanmu mendapatkan mitra tetap yang sama setiap kunjungan agar lebih konsisten.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <div className="mb-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-subtle-foreground">
          FAQ
        </p>
        <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
          Pertanyaan yang sering diajukan
        </h2>
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card"
      >
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-muted/60"
              >
                <span className="text-base font-semibold text-card-foreground">
                  {f.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
                    isOpen ? "bg-primary text-primary-foreground" : "bg-primary-subtle text-primary",
                  ].join(" ")}
                >
                  <Plus size={18} strokeWidth={2.5} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {f.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
