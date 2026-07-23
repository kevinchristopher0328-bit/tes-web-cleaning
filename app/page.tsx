import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-content flex-col items-center justify-center gap-8 px-6 py-24 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-subtle px-4 py-1.5 text-sm font-semibold text-primary-subtle-foreground">
          <span className="h-2 w-2 rounded-full bg-primary" />
          Design System v0.1
        </span>

        <h1 className="max-w-3xl text-5xl font-extrabold text-foreground">
          Beres.{" "}
          <span className="text-primary">Jasa rumah tangga</span> yang
          rapi &amp; terpercaya.
        </h1>

        <p className="max-w-xl text-lg text-muted-foreground">
          Fondasi visual untuk marketplace jasa rumah tangga Indonesia —
          warna hangat, tipografi jelas, token yang konsisten.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/styleguide"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary-hover"
          >
            Lihat Styleguide
            <span aria-hidden>→</span>
          </Link>
          <a
            href="https://fonts.google.com/specimen/Plus+Jakarta+Sans"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 text-base font-semibold text-card-foreground shadow-xs transition-colors hover:bg-muted"
          >
            Tentang font
          </a>
        </div>
      </div>
    </main>
  );
}
