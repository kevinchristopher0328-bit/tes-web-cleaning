"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  HomeCleanIcon,
  IronIcon,
  SofaIcon,
  SprayIcon,
  AcIcon,
  LeafIcon,
} from "./service-icons";

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

const services = [
  { title: "Bersih Rumah", desc: "Sapu, pel, rapikan", href: "#", Icon: HomeCleanIcon },
  { title: "Setrika", desc: "Kiloan, antar-jemput", href: "#", Icon: IronIcon },
  { title: "Cuci Sofa & Kasur", desc: "Bebas tungau", href: "#", Icon: SofaIcon },
  { title: "Dapur & Kamar Mandi", desc: "Deep cleaning", href: "#", Icon: SprayIcon },
  { title: "Servis AC", desc: "Cuci & isi freon", href: "#", Icon: AcIcon },
  { title: "Taman & Kebun", desc: "Rapikan halaman", href: "#", Icon: LeafIcon },
];

const links = [
  { label: "Cara Kerja", href: "#cara-kerja" },
  { label: "Harga", href: "#harga" },
  { label: "Tentang", href: "#tentang" },
];

const NAV_H = 72; // px — tinggi bar tetap, tidak pernah berubah (no layout shift)

/* -------------------------------------------------------------------------- */
/*  Chevron                                                                    */
/* -------------------------------------------------------------------------- */

function Chevron({ open }: { open: boolean }) {
  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.2 }}
      className="opacity-70"
    >
      <path d="m6 9 6 6 6-6" />
    </motion.svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mega menu (desktop)                                                        */
/* -------------------------------------------------------------------------- */

function MegaMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="absolute left-1/2 top-full z-10 mt-3 w-[640px] -translate-x-1/2"
    >
      <div className="rounded-2xl border border-border bg-popover p-3 shadow-xl">
        <div className="grid grid-cols-2 gap-1">
          {services.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              onClick={onNavigate}
              className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-muted"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <s.Icon width={20} height={20} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-popover-foreground">
                  {s.title}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {s.desc}
                </span>
              </span>
            </Link>
          ))}
        </div>
        <Link
          href="#layanan"
          onClick={onNavigate}
          className="mt-1 flex items-center justify-between rounded-xl bg-primary-subtle px-4 py-3 text-sm font-semibold text-primary-subtle-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          Lihat semua layanan
          <span aria-hidden>→</span>
        </Link>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mobile overlay                                                             */
/* -------------------------------------------------------------------------- */

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.2, when: "beforeChildren", staggerChildren: 0.06, delayChildren: 0.08 },
  },
  exit: { opacity: 0, transition: { duration: 0.15, when: "afterChildren", staggerChildren: 0.03, staggerDirection: -1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.15 } },
};

function MobileOverlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="fixed inset-0 z-[60] flex flex-col bg-background md:hidden"
    >
      <div
        className="flex items-center justify-between px-6"
        style={{ height: NAV_H }}
      >
        <span className="text-lg font-bold text-foreground">
          Beres<span className="text-primary">.</span>
        </span>
        <button
          onClick={onClose}
          aria-label="Tutup menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-6 pb-8 pt-2">
        <motion.p
          variants={itemVariants}
          className="px-2 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Layanan
        </motion.p>
        {services.map((s) => (
          <motion.div key={s.title} variants={itemVariants}>
            <Link
              href={s.href}
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-muted"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-subtle text-primary">
                <s.Icon width={20} height={20} />
              </span>
              <span className="text-base font-medium text-foreground">
                {s.title}
              </span>
            </Link>
          </motion.div>
        ))}

        <div className="my-2 h-px bg-border" />

        {links.map((l) => (
          <motion.div key={l.href} variants={itemVariants}>
            <Link
              href={l.href}
              onClick={onClose}
              className="block rounded-xl px-2 py-3 text-lg font-semibold text-foreground transition-colors hover:bg-muted"
            >
              {l.label}
            </Link>
          </motion.div>
        ))}

        <motion.div variants={itemVariants} className="mt-4">
          <Link
            href="/pesan"
            onClick={onClose}
            className="flex items-center justify-center rounded-lg bg-accent px-6 py-3.5 text-base font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover"
          >
            Pesan Sekarang
          </Link>
        </motion.div>
      </nav>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Navbar                                                                     */
/* -------------------------------------------------------------------------- */

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Transparan di atas hero → solid setelah scroll 80px.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Kunci scroll body saat overlay mobile terbuka.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Bar tampil solid bila sudah scroll ATAU mega menu sedang terbuka.
  const solid = scrolled || megaOpen;
  const onDark = !solid; // teks terang saat transparan di atas hero gelap

  return (
    <>
      <header
        style={{ height: NAV_H }}
        className={[
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter,border-color] duration-300 ease-out",
          solid
            ? "border-b border-border bg-background/80 shadow-sm backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        ].join(" ")}
      >
        <div className="mx-auto flex h-full max-w-content items-center justify-between gap-4 px-6">
          {/* Logo */}
          <Link
            href="/"
            className={[
              "text-xl font-extrabold transition-colors",
              onDark ? "text-white" : "text-foreground",
            ].join(" ")}
          >
            Beres<span className="text-primary">.</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {/* Layanan — mega menu */}
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button
                className={[
                  "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  onDark
                    ? "text-white/90 hover:bg-white/10 hover:text-white"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground",
                ].join(" ")}
                aria-expanded={megaOpen}
              >
                Layanan
                <Chevron open={megaOpen} />
              </button>
              <AnimatePresence>
                {megaOpen && <MegaMenu onNavigate={() => setMegaOpen(false)} />}
              </AnimatePresence>
            </div>

            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={[
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  onDark
                    ? "text-white/90 hover:bg-white/10 hover:text-white"
                    : "text-foreground/80 hover:bg-muted hover:text-foreground",
                ].join(" ")}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              href="/pesan"
              className="hidden rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover md:inline-flex"
            >
              Pesan Sekarang
            </Link>

            {/* Hamburger (mobile) */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Buka menu"
              className={[
                "flex h-10 w-10 items-center justify-center rounded-lg transition-colors md:hidden",
                onDark
                  ? "text-white hover:bg-white/10"
                  : "text-foreground hover:bg-muted",
              ].join(" ")}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && <MobileOverlay onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
