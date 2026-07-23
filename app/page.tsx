import Link from "next/link";
import Navbar from "@/components/navbar";
import {
  HomeCleanIcon,
  IronIcon,
  SofaIcon,
  SprayIcon,
  AcIcon,
  LeafIcon,
} from "@/components/service-icons";

const services = [
  { title: "Bersih Rumah", desc: "Sapu, pel, dan rapikan seluruh ruangan.", Icon: HomeCleanIcon },
  { title: "Setrika", desc: "Kiloan dengan antar-jemput ke rumah.", Icon: IronIcon },
  { title: "Cuci Sofa & Kasur", desc: "Bebas tungau dan noda membandel.", Icon: SofaIcon },
  { title: "Dapur & Kamar Mandi", desc: "Deep cleaning area paling kotor.", Icon: SprayIcon },
  { title: "Servis AC", desc: "Cuci unit dan isi ulang freon.", Icon: AcIcon },
  { title: "Taman & Kebun", desc: "Rapikan rumput dan tanaman.", Icon: LeafIcon },
];

const steps = [
  { n: "1", title: "Pilih layanan", desc: "Tentukan jenis jasa dan jadwal yang pas." },
  { n: "2", title: "Cocokkan mitra", desc: "Kami carikan mitra terverifikasi terdekat." },
  { n: "3", title: "Beres!", desc: "Bayar setelah pekerjaan selesai & memuaskan." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-800 to-blue-950">
        {/* glow dekoratif */}
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative mx-auto flex max-w-content flex-col items-center px-6 pb-24 pt-40 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Mitra terverifikasi di 12 kota
          </span>

          <h1 className="mt-6 max-w-3xl text-5xl font-extrabold leading-tight text-white">
            Rumah beres,{" "}
            <span className="text-blue-200">hati tenang.</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg text-blue-100/90">
            Pesan jasa rumah tangga terpercaya — bersih-bersih, setrika, servis
            AC — hanya dalam beberapa ketukan.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#pesan"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-base font-semibold text-accent-foreground shadow-lg transition-colors hover:bg-accent-hover"
            >
              Pesan Sekarang
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/styleguide"
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-6 py-3 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              Lihat Styleguide
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-white">
            {[
              ["4.9/5", "Rating rata-rata"],
              ["25rb+", "Pesanan selesai"],
              ["100%", "Uang kembali"],
            ].map(([stat, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-extrabold">{stat}</div>
                <div className="text-sm text-blue-100/80">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
      <section id="layanan" className="bg-muted/50 py-24">
        <div className="mx-auto max-w-content px-6">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-subtle-foreground">
              Layanan
            </p>
            <h2 className="mt-2 text-3xl font-bold text-foreground">
              Semua kebutuhan rumah, satu aplikasi
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-subtle text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <s.Icon width={24} height={24} />
                </span>
                <h3 className="mt-4 text-lg font-bold text-card-foreground">
                  {s.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
