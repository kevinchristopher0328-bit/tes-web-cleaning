"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Plus } from "lucide-react";

// Tag terstruktur yang disisipkan bot saat merekomendasikan layanan:
//   [SERVICE:nama|deskripsi|harga|path]  -> kartu layanan
//   [SEKALIAN]                           -> tombol tambah layanan lain
// Frontend mengubahnya jadi UI; tag mentah tidak pernah ditampilkan.
const CHAT_TAG = /\[SERVICE:([^\]]+)\]|\[SEKALIAN\]/g;

/* -------------------------------------------------------------------------- */
/*  Asisten AI "Bantu" — widget chat mengambang.                              */
/*  Memanggil /api/chat (streaming) yang di-backing oleh Claude.             */
/* -------------------------------------------------------------------------- */

type Msg = { role: "user" | "assistant"; content: string };

const GREETING =
  "Halo! Aku Bantu, asisten Beres 👋 Mau tanya soal layanan, harga, atau butuh bantuan memesan? Tanya aku aja.";

const SUGGESTIONS = [
  "Layanan apa saja yang ada?",
  "Sofa saya bau apak, pakai layanan apa?",
  "Bagaimana cara memesan?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const reduce = useReducedMotion();

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: reduce ? "auto" : "smooth",
    });
  }, [messages, open, reduce]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setBusy(true);

    // Placeholder assistant message yang akan diisi lewat streaming.
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Kirim tanpa greeting agar konteks bersih.
        body: JSON.stringify({ messages: next.filter((_, i) => i !== 0) }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Gagal terhubung ke asisten.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            role: "assistant",
            content: copy[copy.length - 1].content + chunk,
          };
          return copy;
        });
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Maaf, terjadi kendala. Coba lagi ya.";
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: message };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <>
      {/* Tombol pemicu */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Tutup asisten" : "Buka asisten Beres"}
        aria-expanded={open}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-4 focus-visible:ring-ring/40"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {open ? <X size={24} /> : <MessageCircle size={24} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Asisten Beres"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-5 z-50 flex h-[560px] max-h-[70vh] w-[min(92vw,380px)] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border bg-primary px-4 py-3 text-primary-foreground">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <Sparkles size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold leading-tight">Bantu · Asisten Beres</p>
                <p className="text-xs text-blue-100/90">Biasanya balas dalam hitungan detik</p>
              </div>
            </div>

            {/* Riwayat pesan */}
            <div
              ref={scrollRef}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((m, i) => (
                <Bubble key={i} role={m.role} content={m.content} busy={busy && i === messages.length - 1} />
              ))}

              {/* Saran cepat — hanya di awal percakapan */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs font-medium text-card-foreground transition-colors hover:bg-muted"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={onSubmit}
              className="flex items-center gap-2 border-t border-border bg-card px-3 py-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tulis pesan…"
                // text-base (16px) mencegah iOS Safari auto-zoom saat input difokus.
                className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
              />
              <button
                type="submit"
                disabled={busy || input.trim().length === 0}
                aria-label="Kirim"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-40"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({
  role,
  content,
  busy,
}: {
  role: "user" | "assistant";
  content: string;
  busy: boolean;
}) {
  const isUser = role === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <div
        className={[
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-card-foreground",
        ].join(" ")}
      >
        {isUser
          ? content
          : content
            ? renderAssistantContent(content)
            : busy
              ? <TypingDots />
              : null}
      </div>
    </div>
  );
}

/** Ambil slug dari path tag, mis. "/pesan?service=servis-ac" -> "servis-ac". */
function slugFromPath(path: string): string | null {
  const m = path.match(/service=([^&\s]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

/**
 * Ubah teks balasan bot jadi ReactNode: teks biasa + kartu info untuk tiap
 * tag [SERVICE:...] (tanpa tombol), lalu SATU tombol "Pesan Sekarang" untuk
 * memesan semua layanan sekaligus, diikuti tombol [SEKALIAN]. Tag mentahnya
 * dihapus dari tampilan.
 */
function renderAssistantContent(content: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  const slugs: string[] = [];
  let lastIndex = 0;
  let key = 0;
  let bookingRendered = false;
  let match: RegExpExecArray | null;

  const pushText = (text: string) => {
    const t = text.trim();
    if (t.length > 0) nodes.push(<span key={key++}>{t}</span>);
  };

  // Satu tombol pesan untuk SEMUA layanan yang direkomendasikan di pesan ini.
  const renderBooking = () => {
    if (bookingRendered || slugs.length === 0) return;
    bookingRendered = true;
    nodes.push(<BookingButton key={key++} slugs={[...slugs]} />);
  };

  CHAT_TAG.lastIndex = 0;
  while ((match = CHAT_TAG.exec(content)) !== null) {
    pushText(content.slice(lastIndex, match.index));

    if (match[1] !== undefined) {
      // [SERVICE:nama|deskripsi|harga|path] — kartu info saja (tanpa tombol)
      const [nama = "", deskripsi = "", harga = "", path = ""] = match[1]
        .split("|")
        .map((s) => s.trim());
      const slug = slugFromPath(path);
      if (slug) slugs.push(slug);
      nodes.push(
        <ServiceCard key={key++} nama={nama} deskripsi={deskripsi} harga={harga} />,
      );
    } else {
      // [SEKALIAN] — tombol pesan gabungan dulu, lalu tombol tambah layanan
      renderBooking();
      nodes.push(<SekalianButton key={key++} />);
    }

    lastIndex = match.index + match[0].length;
  }

  pushText(content.slice(lastIndex));
  renderBooking(); // jaga-jaga bila tidak ada tag [SEKALIAN]
  return nodes;
}

function ServiceCard({
  nama,
  deskripsi,
  harga,
}: {
  nama: string;
  deskripsi: string;
  harga: string;
}) {
  return (
    <div className="mt-2 flex flex-col gap-1.5 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="text-sm font-bold text-card-foreground">{nama}</div>
      {deskripsi && (
        <div className="text-xs leading-relaxed text-muted-foreground">{deskripsi}</div>
      )}
      {harga && (
        <div className="text-base font-extrabold text-accent-subtle-foreground">{harga}</div>
      )}
    </div>
  );
}

/** Satu tombol untuk memesan semua layanan: /pesan?service=a&service=b */
function BookingButton({ slugs }: { slugs: string[] }) {
  const params = new URLSearchParams();
  slugs.forEach((s) => params.append("service", s));
  const href = `/pesan?${params.toString()}`;
  return (
    <a
      href={href}
      className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
    >
      <Sparkles size={14} />
      Pesan Sekarang
    </a>
  );
}

function SekalianButton() {
  return (
    <a
      href="/pesan"
      className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-full border border-primary/40 bg-transparent px-4 py-2.5 text-xs font-bold text-primary transition-colors hover:bg-primary-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
    >
      <Plus size={14} />
      Sekalian, tambah layanan lain
    </a>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="Mengetik…">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </span>
  );
}
