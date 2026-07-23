"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*  Helper primitives                                                          */
/* -------------------------------------------------------------------------- */

function Section({
  id,
  title,
  desc,
  children,
}: {
  id: string;
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border py-14">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        {desc && <p className="mt-2 max-w-2xl text-muted-foreground">{desc}</p>}
      </div>
      {children}
    </section>
  );
}

function Swatch({
  name,
  varName,
  className,
  hint,
}: {
  name: string;
  varName?: string;
  className: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`h-16 w-full rounded-md border border-border/60 ${className}`}
      />
      <div className="leading-tight">
        <p className="text-sm font-semibold text-foreground">{name}</p>
        {varName && (
          <code className="text-xs text-muted-foreground">{varName}</code>
        )}
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

const blueScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const amberScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const neutralScale = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const semanticColors: { name: string; className: string; varName: string }[] = [
  { name: "Background", className: "bg-background", varName: "--background" },
  { name: "Foreground", className: "bg-foreground", varName: "--foreground" },
  { name: "Card", className: "bg-card", varName: "--card" },
  { name: "Muted", className: "bg-muted", varName: "--muted" },
  { name: "Primary", className: "bg-primary", varName: "--primary" },
  { name: "Primary subtle", className: "bg-primary-subtle", varName: "--primary-subtle" },
  { name: "Accent", className: "bg-accent", varName: "--accent" },
  { name: "Accent subtle", className: "bg-accent-subtle", varName: "--accent-subtle" },
  { name: "Secondary", className: "bg-secondary", varName: "--secondary" },
  { name: "Border", className: "bg-border", varName: "--border" },
  { name: "Success", className: "bg-success", varName: "--success" },
  { name: "Warning", className: "bg-warning", varName: "--warning" },
  { name: "Danger", className: "bg-danger", varName: "--danger" },
  { name: "Info", className: "bg-info", varName: "--info" },
];

const typeScale: {
  label: string;
  cls: string;
  font: string;
  meta: string;
}[] = [
  { label: "Display 6xl", cls: "text-6xl font-display font-extrabold", font: "Plus Jakarta Sans", meta: "64px" },
  { label: "Display 5xl", cls: "text-5xl font-display font-extrabold", font: "Plus Jakarta Sans", meta: "52px" },
  { label: "Heading 4xl", cls: "text-4xl font-display font-bold", font: "Plus Jakarta Sans", meta: "40px" },
  { label: "Heading 3xl", cls: "text-3xl font-display font-bold", font: "Plus Jakarta Sans", meta: "32px" },
  { label: "Heading 2xl", cls: "text-2xl font-display font-semibold", font: "Plus Jakarta Sans", meta: "26px" },
  { label: "Heading xl", cls: "text-xl font-display font-semibold", font: "Plus Jakarta Sans", meta: "22px" },
  { label: "Body lg", cls: "text-lg font-body", font: "Inter", meta: "18px" },
  { label: "Body base", cls: "text-base font-body", font: "Inter", meta: "16px" },
  { label: "Body sm", cls: "text-sm font-body", font: "Inter", meta: "14px" },
  { label: "Caption xs", cls: "text-xs font-body uppercase tracking-wide", font: "Inter", meta: "12px" },
];

const radii = [
  { name: "xs", cls: "rounded-xs", val: "4px" },
  { name: "sm", cls: "rounded-sm", val: "6px" },
  { name: "md", cls: "rounded-md", val: "10px" },
  { name: "lg", cls: "rounded-lg", val: "14px" },
  { name: "xl", cls: "rounded-xl", val: "20px" },
  { name: "2xl", cls: "rounded-2xl", val: "28px" },
  { name: "full", cls: "rounded-full", val: "999px" },
];

const shadows = [
  { name: "xs", cls: "shadow-xs" },
  { name: "sm", cls: "shadow-sm" },
  { name: "md", cls: "shadow-md" },
  { name: "lg", cls: "shadow-lg" },
  { name: "xl", cls: "shadow-xl" },
];

const spacings = [
  { name: "1", cls: "w-1", val: "4" },
  { name: "2", cls: "w-2", val: "8" },
  { name: "3", cls: "w-3", val: "12" },
  { name: "4", cls: "w-4", val: "16" },
  { name: "6", cls: "w-6", val: "24" },
  { name: "8", cls: "w-8", val: "32" },
  { name: "12", cls: "w-12", val: "48" },
  { name: "16", cls: "w-16", val: "64" },
  { name: "24", cls: "w-24", val: "96" },
];

const nav = [
  ["colors", "Warna"],
  ["typography", "Tipografi"],
  ["radius", "Radius"],
  ["shadow", "Shadow"],
  ["spacing", "Spacing"],
  ["components", "Komponen"],
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function StyleGuide() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-content items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-bold text-foreground">
              Beres<span className="text-primary">.</span>
            </Link>
            <span className="hidden rounded-full bg-primary-subtle px-2.5 py-0.5 text-xs font-semibold text-primary-subtle-foreground sm:inline">
              Styleguide
            </span>
          </div>
          <nav className="hidden items-center gap-4 md:flex">
            {nav.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>
          <button
            onClick={() => setDark((d) => !d)}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-semibold text-card-foreground shadow-xs transition-colors hover:bg-muted"
          >
            {dark ? "☀︎ Terang" : "☾ Gelap"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-content px-6">
        {/* Hero */}
        <div className="py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-subtle-foreground">
            Design Tokens
          </p>
          <h1 className="mt-3 text-5xl font-extrabold text-foreground">
            Beres Design System
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Fondasi visual marketplace jasa rumah tangga. Arah warna{" "}
            <strong className="text-foreground">blue + white</strong> — biru
            kustom yang tenang &amp; terpercaya, putih hangat, dengan aksen amber
            untuk kehangatan. Semua token bersumber dari CSS variable.
          </p>
        </div>

        {/* COLORS */}
        <Section
          id="colors"
          title="Warna"
          desc="Biru sengaja lebih dalam dari default agar terasa terpercaya. Neutral di-tint hangat supaya putihnya ramah, bukan abu-abu klinis. Amber dipakai hemat sebagai aksen."
        >
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Primer — Blue
          </h3>
          <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {blueScale.map((s) => (
              <Swatch
                key={s}
                name={`blue-${s}`}
                varName={`--blue-${s}`}
                className={`bg-blue-${s}`}
              />
            ))}
          </div>

          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Aksen — Amber
          </h3>
          <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {amberScale.map((s) => (
              <Swatch
                key={s}
                name={`amber-${s}`}
                varName={`--amber-${s}`}
                className={`bg-amber-${s}`}
              />
            ))}
          </div>

          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Neutral (warm-tinted)
          </h3>
          <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {neutralScale.map((s) => (
              <Swatch
                key={s}
                name={`neutral-${s}`}
                varName={`--neutral-${s}`}
                className={`bg-neutral-${s}`}
              />
            ))}
          </div>

          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Token Semantik
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {semanticColors.map((c) => (
              <Swatch
                key={c.name}
                name={c.name}
                varName={c.varName}
                className={c.className}
              />
            ))}
          </div>
        </Section>

        {/* TYPOGRAPHY */}
        <Section
          id="typography"
          title="Tipografi"
          desc="Display: Plus Jakarta Sans (didesain di Jakarta) untuk heading. Body: Inter untuk teks & UI. Skala modular ±1.2."
        >
          <div className="divide-y divide-border rounded-xl border border-border bg-card">
            {typeScale.map((t) => (
              <div
                key={t.label}
                className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <span className={`${t.cls} text-card-foreground`}>
                  Rumah bersih, hati tenang
                </span>
                <span className="shrink-0 text-xs text-muted-foreground sm:text-right">
                  {t.label} · {t.font} · {t.meta}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* RADIUS */}
        <Section
          id="radius"
          title="Radius"
          desc="Radius dasar 14px (lg). Konsisten dari xs (4px) hingga full."
        >
          <div className="flex flex-wrap gap-6">
            {radii.map((r) => (
              <div key={r.name} className="flex flex-col items-center gap-2">
                <div
                  className={`h-20 w-20 border border-primary/30 bg-primary-subtle ${r.cls}`}
                />
                <p className="text-sm font-semibold text-foreground">
                  {r.name}
                </p>
                <code className="text-xs text-muted-foreground">{r.val}</code>
              </div>
            ))}
          </div>
        </Section>

        {/* SHADOW */}
        <Section
          id="shadow"
          title="Shadow"
          desc="Di-tint navy (biru gelap), bukan hitam murni — bayangan terasa lebih lembut."
        >
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {shadows.map((s) => (
              <div key={s.name} className="flex flex-col items-center gap-3">
                <div
                  className={`flex h-24 w-full items-center justify-center rounded-xl bg-card ${s.cls}`}
                >
                  <span className="text-sm font-semibold text-card-foreground">
                    {s.name}
                  </span>
                </div>
                <code className="text-xs text-muted-foreground">
                  shadow-{s.name}
                </code>
              </div>
            ))}
          </div>
        </Section>

        {/* SPACING */}
        <Section
          id="spacing"
          title="Spacing"
          desc="Skala berbasis 4px. Dipakai konsisten untuk padding, gap, dan margin."
        >
          <div className="flex flex-col gap-3">
            {spacings.map((sp) => (
              <div key={sp.name} className="flex items-center gap-4">
                <code className="w-16 text-xs text-muted-foreground">
                  space-{sp.name}
                </code>
                <div className={`h-4 rounded-sm bg-primary ${sp.cls}`} />
                <span className="text-xs text-muted-foreground">{sp.val}px</span>
              </div>
            ))}
          </div>
        </Section>

        {/* COMPONENTS */}
        <Section
          id="components"
          title="Komponen Contoh"
          desc="Contoh penerapan token pada elemen nyata."
        >
          {/* Buttons */}
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Tombol
          </h3>
          <div className="mb-10 flex flex-wrap items-center gap-3">
            <button className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover">
              Pesan Sekarang
            </button>
            <button className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover">
              Promo Hari Ini
            </button>
            <button className="rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-muted">
              Sekunder
            </button>
            <button className="rounded-lg border border-input bg-card px-5 py-2.5 text-sm font-semibold text-card-foreground shadow-xs transition-colors hover:bg-muted">
              Outline
            </button>
            <button className="rounded-lg px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-subtle">
              Ghost
            </button>
            <button
              disabled
              className="cursor-not-allowed rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground opacity-50"
            >
              Disabled
            </button>
          </div>

          {/* Badges */}
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Badge
          </h3>
          <div className="mb-10 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-success-subtle px-3 py-1 text-xs font-semibold text-success">
              ✓ Terverifikasi
            </span>
            <span className="rounded-full bg-warning-subtle px-3 py-1 text-xs font-semibold text-warning-foreground">
              ● Menunggu
            </span>
            <span className="rounded-full bg-danger-subtle px-3 py-1 text-xs font-semibold text-danger">
              ✕ Dibatalkan
            </span>
            <span className="rounded-full bg-info-subtle px-3 py-1 text-xs font-semibold text-info">
              ⓘ Info
            </span>
            <span className="rounded-full bg-primary-subtle px-3 py-1 text-xs font-semibold text-primary-subtle-foreground">
              Terlaris
            </span>
          </div>

          {/* Inputs */}
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Form
          </h3>
          <div className="mb-10 grid max-w-md gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">
                Alamat lengkap
              </span>
              <input
                placeholder="Jl. Melati No. 12, Jakarta"
                className="rounded-lg border border-input bg-card px-4 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-foreground">
                Catatan untuk mitra
              </span>
              <textarea
                rows={3}
                placeholder="Contoh: fokus di dapur & kamar mandi"
                className="rounded-lg border border-input bg-card px-4 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary"
              />
            </label>
          </div>

          {/* Service card */}
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Kartu Jasa
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Bersih Rumah", price: "Rp 90.000", rating: "4.9", tag: "Terlaris" },
              { title: "Setrika Kiloan", price: "Rp 8.000/kg", rating: "4.8", tag: "Hemat" },
              { title: "Cuci Sofa", price: "Rp 150.000", rating: "5.0", tag: "Pro" },
            ].map((s) => (
              <article
                key={s.title}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="flex h-32 items-center justify-center bg-gradient-to-br from-primary-subtle to-accent-subtle text-4xl">
                  🧹
                </div>
                <div className="p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full bg-primary-subtle px-2.5 py-0.5 text-xs font-semibold text-primary-subtle-foreground">
                      {s.tag}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      ★ {s.rating}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-card-foreground">
                    {s.title}
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Mitra terverifikasi · datang tepat waktu
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-extrabold text-primary">
                      {s.price}
                    </span>
                    <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover">
                      Pesan
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
          Beres Design System · dibuat untuk marketplace jasa rumah tangga
          Indonesia
        </footer>
      </main>
    </div>
  );
}
