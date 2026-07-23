import Link from "next/link";
import { AtSign, Send, MessageCircle, Mail, ArrowRight } from "lucide-react";
import { services } from "@/src/data/services";

const cols: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Layanan",
    links: services.slice(0, 5).map((s) => ({ label: s.name, href: s.href })),
  },
  {
    title: "Perusahaan",
    links: [
      { label: "Tentang Kami", href: "#tentang" },
      { label: "Karier", href: "#" },
      { label: "Jadi Mitra", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "Pusat Bantuan", href: "#faq" },
      { label: "Cara Kerja", href: "#cara-kerja" },
      { label: "Syarat & Ketentuan", href: "#" },
      { label: "Kebijakan Privasi", href: "#" },
    ],
  },
];

const socials = [
  { Icon: AtSign, label: "Instagram", href: "#" },
  { Icon: Send, label: "Twitter/X", href: "#" },
  { Icon: MessageCircle, label: "WhatsApp", href: "#" },
  { Icon: Mail, label: "Email", href: "#" },
];

export default function SiteFooter() {
  return (
    <footer id="tentang" className="bg-background">
      {/* CTA banner */}
      <div className="mx-auto max-w-content px-6" id="pesan">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 to-blue-950 px-6 py-14 text-center shadow-xl sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-blue-400/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">
              Siap bikin urusan rumah beres?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-blue-100/90">
              Pesan mitra terpercaya sekarang — gratis biaya pendaftaran, bayar
              hanya saat pekerjaan selesai.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/pesan"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-base font-semibold text-accent-foreground shadow-lg transition-colors hover:bg-accent-hover"
              >
                Pesan Sekarang
                <ArrowRight size={18} />
              </Link>
              <Link
                href="#harga"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
              >
                Lihat harga
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer utama */}
      <div className="mx-auto max-w-content px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <span className="text-2xl font-extrabold text-foreground">
              Beres<span className="text-primary">.</span>
            </span>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Marketplace jasa rumah tangga Indonesia. Mitra terverifikasi,
              harga transparan, hasil dijamin.
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map(({ Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary-subtle hover:text-primary"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>© 2026 Beres. Seluruh hak cipta dilindungi.</p>
          <Link href="/styleguide" className="font-medium text-primary hover:underline">
            Lihat design system →
          </Link>
        </div>
      </div>
    </footer>
  );
}
