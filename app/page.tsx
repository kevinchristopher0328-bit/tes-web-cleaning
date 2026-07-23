import Link from "next/link";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import ServicesSection from "@/components/services-section";

const steps = [
  { n: "1", title: "Pilih layanan", desc: "Tentukan jenis jasa dan jadwal yang pas." },
  { n: "2", title: "Cocokkan mitra", desc: "Kami carikan mitra terverifikasi terdekat." },
  { n: "3", title: "Beres!", desc: "Bayar setelah pekerjaan selesai & memuaskan." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <Hero />

      {/* CARA KERJA */}
      <section id="cara-kerja" className="mx-auto max-w-content px-6 py-24">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-subtle-foreground">
            Cara Kerja
          </p>
          <h2 className="mt-2 text-3xl font-bold text-foreground">
            Tiga langkah, langsung beres
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                {s.n}
              </span>
              <h3 className="mt-4 text-lg font-bold text-card-foreground">
                {s.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LAYANAN */}
      <ServicesSection />

      {/* HARGA */}
      <section id="harga" className="mx-auto max-w-content px-6 py-24">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-subtle-foreground">
            Harga
          </p>
          <h2 className="mt-2 text-3xl font-bold text-foreground">
            Transparan, tanpa biaya tersembunyi
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { name: "Sekali Bersih", price: "Rp 90rb", feats: ["2 jam kerja", "Alat dari mitra", "Garansi ulang"] },
            { name: "Langganan Mingguan", price: "Rp 320rb", feats: ["4x kunjungan", "Mitra tetap", "Prioritas jadwal"], featured: true },
            { name: "Borongan", price: "Custom", feats: ["Deep cleaning", "Tim 2-4 orang", "Survei gratis"] },
          ].map((p) => (
            <div
              key={p.name}
              className={[
                "rounded-2xl border p-6 shadow-sm",
                p.featured
                  ? "border-primary bg-card ring-2 ring-primary/20"
                  : "border-border bg-card",
              ].join(" ")}
            >
              {p.featured && (
                <span className="mb-3 inline-block rounded-full bg-accent-subtle px-3 py-1 text-xs font-semibold text-accent-subtle-foreground">
                  Paling laris
                </span>
              )}
              <h3 className="text-lg font-bold text-card-foreground">{p.name}</h3>
              <div className="mt-2 text-3xl font-extrabold text-primary">
                {p.price}
              </div>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                {p.feats.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-success">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="#pesan"
                className={[
                  "mt-6 flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
                  p.featured
                    ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                    : "border border-input bg-card text-card-foreground hover:bg-muted",
                ].join(" ")}
              >
                Pilih paket
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer id="tentang" className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-content flex-col items-center gap-3 px-6 py-12 text-center">
          <span className="text-xl font-extrabold text-foreground">
            Beres<span className="text-primary">.</span>
          </span>
          <p className="max-w-md text-sm text-muted-foreground">
            Marketplace jasa rumah tangga Indonesia. Dibangun dengan design
            system yang konsisten —{" "}
            <Link href="/styleguide" className="font-semibold text-primary hover:underline">
              lihat styleguide
            </Link>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
