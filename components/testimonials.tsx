"use client";

import { Star } from "lucide-react";

type Testi = {
  name: string;
  role: string;
  quote: string;
  initial: string;
  tone: string; // kelas warna avatar
};

const testimonials: Testi[] = [
  { name: "Sarah W.", role: "Jakarta Selatan", initial: "S", tone: "bg-primary text-primary-foreground", quote: "Mitranya datang tepat waktu dan hasilnya rapi banget. Rumah langsung kinclong!" },
  { name: "Budi P.", role: "Bandung", initial: "B", tone: "bg-accent text-accent-foreground", quote: "Booking gampang, harga transparan. Servis AC-nya dingin lagi seperti baru." },
  { name: "Maya R.", role: "Surabaya", initial: "M", tone: "bg-success text-success-foreground", quote: "Langganan mingguan bikin hidup lebih santai. Mitra tetap jadi udah hafal maunya." },
  { name: "Andi K.", role: "Tangerang", initial: "A", tone: "bg-info text-info-foreground", quote: "Cuci sofa hasilnya di luar ekspektasi. Noda lama hilang, bau apak juga hilang." },
  { name: "Dewi L.", role: "Depok", initial: "D", tone: "bg-primary text-primary-foreground", quote: "Aplikasinya intuitif, mitranya ramah dan profesional. Recommended banget!" },
  { name: "Rizal F.", role: "Bekasi", initial: "R", tone: "bg-accent text-accent-foreground", quote: "Servis AC cepat dan rapi, hemat waktu buat yang sibuk kerja seperti saya." },
];

function Card({ t }: { t: Testi }) {
  return (
    <figure className="flex w-80 shrink-0 flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex gap-0.5 text-accent" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
        ))}
      </div>
      <span className="sr-only">Rating 5 dari 5</span>
      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-card-foreground">
        “{t.quote}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${t.tone}`}>
          {t.initial}
        </span>
        <span>
          <span className="block text-sm font-semibold text-card-foreground">{t.name}</span>
          <span className="block text-xs text-muted-foreground">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Testimonials() {
  // Digandakan agar loop mulus; translateX -50% = tepat satu salinan.
  const loop = [...testimonials, ...testimonials];

  return (
    <section id="testimoni" className="overflow-hidden bg-muted py-24">
      <div className="mx-auto mb-14 max-w-content px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-subtle-foreground">
          Testimoni
        </p>
        <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">
          Dipercaya ribuan keluarga
        </h2>
      </div>

      {/* Track marquee — pause saat hover, berhenti untuk reduced-motion */}
      <div className="group relative">
        {/* fade tepi kiri/kanan */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-muted to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-muted to-transparent sm:w-28" />

        <div className="flex w-max gap-5 animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {loop.map((t, i) => (
            <Card key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
