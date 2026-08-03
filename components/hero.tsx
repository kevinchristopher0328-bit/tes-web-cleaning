"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  HomeCleanIcon,
  SofaIcon,
  AcIcon,
} from "./service-icons";
import { animationsEnabled } from "@/lib/anim";

gsap.registerPlugin(useGSAP, ScrollTrigger);
// Abaikan resize akibat address bar iOS Safari muncul/hilang agar ScrollTrigger
// tidak refresh berlebihan / salah hitung posisi di mobile.
ScrollTrigger.config({ ignoreMobileResize: true });

// Format angka count-up (mis. 12000 -> "12.000", 4.9 -> "4.9").
function formatCount(n: number, decimals: number, thousand: boolean) {
  const fixed = decimals > 0 ? n.toFixed(decimals) : String(Math.round(n));
  if (!thousand) return fixed;
  const [intPart, frac] = fixed.split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return frac ? `${grouped}.${frac}` : grouped;
}

/* -------------------------------------------------------------------------- */
/*  Animasi: stagger fade-up, 60ms antar elemen                                */
/* -------------------------------------------------------------------------- */

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/* -------------------------------------------------------------------------- */
/*  Ikon kecil                                                                 */
/* -------------------------------------------------------------------------- */

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="m12 3 2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9 6.7 19l1-5.8L3.5 9.1l5.9-.9z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Kartu layanan floating (kolom kanan)                                       */
/* -------------------------------------------------------------------------- */

const cards = [
  { title: "Bersih Rumah", meta: "mulai Rp 90rb", Icon: HomeCleanIcon, tone: "lg:-rotate-2" },
  { title: "Servis AC", meta: "★ 4.9 · 2rb ulasan", Icon: AcIcon, tone: "lg:rotate-1" },
  { title: "Cuci Sofa", meta: "bebas tungau", Icon: SofaIcon, tone: "lg:rotate-2" },
];

function FloatingCards() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax halus — tiap kartu bergerak beda kecepatan.
  const y0 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70]);
  const y1 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -28]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -100]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -46]);
  const ys = [y0, y1, y2, y3];

  // Float lembut & terus-menerus pada tiap kartu (wrapper terpisah agar tidak
  // bentrok dengan parallax framer di luar & hover-lift di dalam).
  useGSAP(
    () => {
      if (!animationsEnabled() || !ref.current) return;
      const floats = ref.current.querySelectorAll<HTMLElement>(".js-float-card");
      gsap.fromTo(
        floats,
        { y: -8 },
        {
          y: 8,
          duration: 3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          stagger: { each: 0.6, from: "random" },
        },
      );
    },
    { scope: ref },
  );

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate="show"
      className="relative grid grid-cols-2 gap-4 sm:gap-5"
    >
      {/* glow di belakang kartu */}
      <div className="pointer-events-none absolute inset-0 -z-10 mx-auto h-3/4 w-3/4 rounded-full bg-blue-400/20 blur-3xl" />

      {cards.map((c, i) => (
        <motion.div key={c.title} variants={fadeUp} style={{ y: ys[i] }}>
          <div className="js-float-card">
            <div
              className={[
                "rounded-2xl border border-white/15 bg-white/10 p-4 shadow-xl backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 sm:p-5",
                i % 2 === 1 ? "mt-6 sm:mt-10" : "",
                c.tone,
              ].join(" ")}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                <c.Icon width={22} height={22} />
              </span>
              <h3 className="mt-3 text-base font-bold text-white">{c.title}</h3>
              <p className="mt-0.5 text-xs text-blue-100/80">{c.meta}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Search bar                                                                 */
/* -------------------------------------------------------------------------- */

const serviceOptions = [
  "Bersih Rumah",
  "Cuci Sofa & Kasur",
  "Dapur & Kamar Mandi",
  "Servis AC",
  "Taman & Kebun",
];

function SearchBar() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-2 rounded-2xl bg-card p-2 shadow-xl sm:flex-row sm:items-center"
    >
      {/* Lokasi */}
      <label className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5 text-card-foreground focus-within:bg-muted">
        <span className="text-muted-foreground">
          <PinIcon />
        </span>
        <span className="sr-only">Lokasi</span>
        <input
          type="text"
          placeholder="Masukkan lokasi"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </label>

      <span className="hidden h-8 w-px bg-border sm:block" />

      {/* Layanan */}
      <div className="relative flex-1">
        <span className="sr-only">Pilih layanan</span>
        <select
          aria-label="Pilih layanan"
          defaultValue=""
          className="w-full appearance-none rounded-xl bg-transparent px-3 py-2.5 text-sm text-card-foreground outline-none focus:bg-muted"
        >
          <option value="" disabled>
            Pilih layanan
          </option>
          {serviceOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>

      {/* Tombol cari */}
      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
      >
        <SearchIcon />
        Cari
      </button>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

// Ikon latar mengambang (14) — tersebar, transparan, tiap ikon float unik.
const bgIcons = [
  { e: "🧹", top: "7%", left: "5%", size: 34, op: 0.13, dur: 9, delay: 0, y: -14, r: 5 },
  { e: "🔧", top: "11%", left: "23%", size: 26, op: 0.11, dur: 11, delay: 1.2, y: -10, r: -4 },
  { e: "🧽", top: "8%", left: "45%", size: 30, op: 0.12, dur: 7, delay: 0.5, y: -16, r: 6 },
  { e: "🔨", top: "6%", left: "67%", size: 40, op: 0.1, dur: 12, delay: 2, y: -12, r: -6 },
  { e: "🫧", top: "13%", left: "88%", size: 24, op: 0.14, dur: 8, delay: 0.8, y: -18, r: 4 },
  { e: "🪛", top: "33%", left: "11%", size: 28, op: 0.11, dur: 10, delay: 1.6, y: -9, r: -5 },
  { e: "🧴", top: "41%", left: "33%", size: 22, op: 0.12, dur: 13, delay: 0.3, y: -8, r: 6 },
  { e: "🔩", top: "29%", left: "57%", size: 32, op: 0.1, dur: 6, delay: 2.4, y: -15, r: -4 },
  { e: "❄️", top: "45%", left: "82%", size: 30, op: 0.13, dur: 9.5, delay: 1, y: -13, r: 5 },
  { e: "🧺", top: "63%", left: "7%", size: 38, op: 0.11, dur: 11.5, delay: 0.6, y: -12, r: -6 },
  { e: "💧", top: "71%", left: "27%", size: 24, op: 0.14, dur: 7.5, delay: 1.9, y: -17, r: 4 },
  { e: "⚙️", top: "58%", left: "49%", size: 44, op: 0.1, dur: 12.5, delay: 0.4, y: -10, r: -5 },
  { e: "🪣", top: "73%", left: "70%", size: 28, op: 0.12, dur: 8.5, delay: 2.2, y: -14, r: 6 },
  { e: "🪚", top: "66%", left: "91%", size: 34, op: 0.11, dur: 10.5, delay: 1.4, y: -11, r: -4 },
];

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!animationsEnabled() || !rootRef.current) return;

      // Masuk: badge pop dulu, lalu headline per baris, lalu elemen lainnya.
      const tl = gsap.timeline({ defaults: { clearProps: "all" } });
      tl.from(".js-badge", {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: "power2.out",
      })
        .from(
          ".js-headline-line",
          {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power4.out",
            stagger: 0.12,
          },
          "-=0.2",
        )
        .from(
          ".js-hero-item",
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1,
          },
          "-=0.5",
        );

      // Count-up angka statistik saat terlihat, dengan ease halus.
      const counters = rootRef.current.querySelectorAll<HTMLElement>(".js-count");
      counters.forEach((el) => {
        const value = parseFloat(el.dataset.value ?? "0");
        const decimals = parseInt(el.dataset.decimals ?? "0", 10);
        const thousand = el.dataset.thousand === "1";
        const suffix = el.dataset.suffix ?? "";
        const proxy = { n: 0 };
        gsap.to(proxy, {
          n: value,
          duration: 1.6,
          ease: "power1.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = formatCount(proxy.n, decimals, thousand) + suffix;
          },
        });
      });

      // Recalculate posisi ScrollTrigger setelah web font selesai dimuat
      // (next/font swap bisa menggeser layout, terutama di iOS Safari).
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="hero-gradient-anim relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1a1f6e, #2d3494, #3b5bdb, #1a1f6e)",
        backgroundSize: "300% 300%",
      }}
    >
      {/* dekorasi */}
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-1/2 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />

      {/* Ikon latar mengambang (z-0, di belakang konten) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {bgIcons.map((ic, i) => (
          <span
            key={i}
            className="hero-float-icon absolute select-none leading-none"
            style={
              {
                top: ic.top,
                left: ic.left,
                fontSize: `${ic.size}px`,
                opacity: ic.op,
                animationDuration: `${ic.dur}s`,
                animationDelay: `${ic.delay}s`,
                "--hf-y": `${ic.y}px`,
                "--hf-r": `${ic.r}deg`,
              } as React.CSSProperties
            }
          >
            {ic.e}
          </span>
        ))}
      </div>

      <div className="relative z-[1] mx-auto grid max-w-content items-center gap-12 px-6 pb-20 pt-32 sm:pt-36 lg:grid-cols-2 lg:gap-8 lg:pb-28 lg:pt-40">
        {/* Kolom kiri: teks + search + trust */}
        <div>
          <span className="js-badge inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-accent" />
            #1 marketplace jasa rumah tangga
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            <span className="js-headline-line block">Urusan rumah beres,</span>
            <span className="js-headline-line block text-blue-200">hidup kamu lega.</span>
          </h1>

          <p className="js-hero-item mt-5 max-w-lg text-base text-blue-100/90 sm:text-lg">
            Pesan mitra terverifikasi untuk bersih-bersih, servis AC,
            dan lainnya. Cukup pilih lokasi dan layanan — sisanya kami yang urus.
          </p>

          <div className="js-hero-item mt-8">
            <SearchBar />
          </div>

          {/* Trust bar */}
          <div className="js-hero-item mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-blue-100/90">
            <span
              className="js-count font-semibold text-white"
              data-value="12000"
              data-decimals="0"
              data-thousand="1"
              data-suffix="+"
            >
              12.000+
            </span>
            <span>pesanan selesai</span>
            <span className="text-white/30">·</span>
            <span className="inline-flex items-center gap-1 font-semibold text-white">
              <span className="text-accent">
                <StarIcon />
              </span>
              Rating{" "}
              <span className="js-count" data-value="4.9" data-decimals="1">
                4.9
              </span>
            </span>
            <span className="text-white/30">·</span>
            <span className="inline-flex items-center gap-1">
              <span aria-hidden>✓</span> Mitra terverifikasi
            </span>
          </div>
        </div>

        {/* Kolom kanan: kartu floating + parallax */}
        <div className="lg:pl-6">
          <FloatingCards />
        </div>
      </div>
    </section>
  );
}
