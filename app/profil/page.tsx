"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, MapPin, Pencil, Trash2, Star, Plus } from "lucide-react";
import { supabase, type Profile } from "@/lib/supabase";
import { formatRupiah } from "@/components/pesan/schema";

type OrderSummary = {
  id: string;
  nama: string;
  layanan: string;
  tanggal: string | null;
  jam: string;
  total: number;
  status: string;
  createdAt: string | null;
};

const inputCls =
  "w-full rounded-xl border border-input bg-card px-4 py-2.5 text-base text-card-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";

function initialsOf(name?: string | null) {
  if (!name) return "B";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "B";
}

function fmtDate(d: string | null) {
  if (!d) return "-";
  const parsed = new Date(d);
  if (Number.isNaN(parsed.getTime())) return d;
  return parsed.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Emoji + rekomendasi frekuensi per layanan, untuk indikator jadwal di riwayat.
const SERVICE_META: Record<
  string,
  { emoji: string; intervalDays: number; intervalLabel: string }
> = {
  "Bersih Rumah": { emoji: "🧹", intervalDays: 14, intervalLabel: "2 minggu" },
  "Cuci Sofa & Kasur": { emoji: "🛋️", intervalDays: 90, intervalLabel: "3 bulan" },
  "Dapur & Kamar Mandi": { emoji: "🧽", intervalDays: 30, intervalLabel: "1 bulan" },
  "Servis AC": { emoji: "❄️", intervalDays: 90, intervalLabel: "3 bulan" },
  "Taman & Kebun": { emoji: "🌿", intervalDays: 14, intervalLabel: "2 minggu" },
};

const DAY_MS = 86_400_000;

type ScheduleTone = "success" | "accent" | "danger";

type Schedule = { tone: ScheduleTone; statusText: string; pct: number };

// hijau = masih terjadwal, oranye = jatuh tempo <= 3 hari, merah = terlewat.
function scheduleFor(intervalDays: number, dateStr: string | null): Schedule | null {
  if (!dateStr) return null;
  const last = new Date(dateStr).getTime();
  if (Number.isNaN(last)) return null;
  const elapsed = Math.floor((Date.now() - last) / DAY_MS);
  const daysLeft = intervalDays - elapsed;
  const pct = Math.max(0, Math.min(100, (elapsed / intervalDays) * 100));
  if (daysLeft < 0) {
    return { tone: "danger", statusText: `Terlewat ${-daysLeft} hari`, pct: 100 };
  }
  if (daysLeft <= 3) {
    return {
      tone: "accent",
      statusText: daysLeft === 0 ? "Jatuh tempo hari ini" : `Jatuh tempo ${daysLeft} hari lagi`,
      pct,
    };
  }
  return { tone: "success", statusText: "Masih terjadwal", pct };
}

const TONE_BG: Record<ScheduleTone, string> = {
  success: "bg-success",
  accent: "bg-accent",
  danger: "bg-danger",
};

const TONE_TEXT: Record<ScheduleTone, string> = {
  success: "text-success",
  accent: "text-accent-subtle-foreground",
  danger: "text-danger",
};

export default function ProfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Data pribadi editing
  const [editingProfile, setEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Alamat editing (slot 1/2)
  const [editingSlot, setEditingSlot] = useState<1 | 2 | null>(null);
  const [addrInput, setAddrInput] = useState("");
  const [labelInput, setLabelInput] = useState("");
  const [savingAddr, setSavingAddr] = useState(false);

  // Pesanan dari Notion
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const refreshProfile = useCallback(async (id: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", id).single();
    setProfile((data as Profile) ?? null);
    return (data as Profile) ?? null;
  }, []);

  const loadOrders = useCallback(async (phone: string | null | undefined) => {
    if (!phone) {
      setOrders([]);
      return;
    }
    setOrdersLoading(true);
    try {
      const res = await fetch(`/api/orders?phone=${encodeURIComponent(phone)}`);
      const json = (await res.json().catch(() => null)) as { orders?: OrderSummary[] } | null;
      setOrders(json?.orders ?? []);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!active) return;
      if (!user) {
        router.replace("/login");
        return;
      }
      setUserId(user.id);
      setEmail(user.email ?? null);
      const p = await refreshProfile(user.id);
      if (!active) return;
      setLoading(false);
      loadOrders(p?.phone);
    })();
    return () => {
      active = false;
    };
  }, [router, refreshProfile, loadOrders]);

  async function saveProfile() {
    if (!userId) return;
    setSavingProfile(true);
    try {
      await supabase.from("profiles").upsert({
        id: userId,
        full_name: nameInput || null,
        phone: phoneInput || null,
      });
      const p = await refreshProfile(userId);
      setEditingProfile(false);
      loadOrders(p?.phone);
    } finally {
      setSavingProfile(false);
    }
  }

  function startEditAddr(slot: 1 | 2) {
    setEditingSlot(slot);
    setAddrInput((slot === 1 ? profile?.address_1 : profile?.address_2) ?? "");
    setLabelInput((slot === 1 ? profile?.address_1_label : profile?.address_2_label) ?? "");
  }

  async function saveAddr(slot: 1 | 2) {
    if (!userId) return;
    setSavingAddr(true);
    try {
      const payload: Record<string, string | null> = { id: userId };
      if (slot === 1) {
        payload.address_1 = addrInput || null;
        payload.address_1_label = labelInput || null;
      } else {
        payload.address_2 = addrInput || null;
        payload.address_2_label = labelInput || null;
      }
      await supabase.from("profiles").upsert(payload);
      await refreshProfile(userId);
      setEditingSlot(null);
    } finally {
      setSavingAddr(false);
    }
  }

  async function deleteAddr(slot: 1 | 2) {
    if (!userId) return;
    const payload: Record<string, string | null> =
      slot === 1
        ? { id: userId, address_1: null, address_1_label: null }
        : { id: userId, address_2: null, address_2_label: null };
    await supabase.from("profiles").upsert(payload);
    await refreshProfile(userId);
  }

  // Jadikan utama = tukar slot 1 dan slot 2.
  async function setPrimary() {
    if (!userId || !profile) return;
    await supabase.from("profiles").upsert({
      id: userId,
      address_1: profile.address_2,
      address_1_label: profile.address_2_label,
      address_2: profile.address_1,
      address_2_label: profile.address_1_label,
    });
    await refreshProfile(userId);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  const ongoing = orders.filter((o) => o.status !== "Lunas");
  const history = orders.filter((o) => o.status === "Lunas");

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <p className="py-24 text-center text-sm text-muted-foreground">Memuat profil…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-extrabold text-foreground">
            Beres<span className="text-primary">.</span>
          </Link>
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Kembali ke beranda
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-8 px-6 py-8">
        {/* Header profil — avatar inisial, bg biru gelap */}
        <div className="rounded-3xl bg-blue-700 p-6 text-white shadow-md">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/15 text-xl font-extrabold">
              {initialsOf(profile?.full_name)}
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold">
                {profile?.full_name || "Pengguna Beres"}
              </h1>
              <p className="truncate text-sm text-blue-100/90">{email}</p>
            </div>
          </div>
        </div>

        {/* Data pribadi */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Data Pribadi</h2>
            {!editingProfile && (
              <button
                type="button"
                onClick={() => {
                  setNameInput(profile?.full_name ?? "");
                  setPhoneInput(profile?.phone ?? "");
                  setEditingProfile(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary-subtle"
              >
                <Pencil size={15} />
                Ubah
              </button>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            {editingProfile ? (
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-foreground">Nama</span>
                  <input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Nama lengkap"
                    className={inputCls}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-foreground">Nomor HP</span>
                  <input
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="08123456789"
                    inputMode="tel"
                    className={inputCls}
                  />
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={saveProfile}
                    disabled={savingProfile}
                    className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
                  >
                    {savingProfile ? "Menyimpan…" : "Simpan"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProfile(false)}
                    disabled={savingProfile}
                    className="rounded-xl px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <dl className="divide-y divide-border">
                <div className="flex items-center justify-between py-2 text-sm">
                  <dt className="text-muted-foreground">Nama</dt>
                  <dd className="font-medium text-foreground">{profile?.full_name || "-"}</dd>
                </div>
                <div className="flex items-center justify-between py-2 text-sm">
                  <dt className="text-muted-foreground">Nomor HP</dt>
                  <dd className="font-medium text-foreground">{profile?.phone || "-"}</dd>
                </div>
              </dl>
            )}
          </div>
        </section>

        {/* Alamat tersimpan */}
        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">Alamat Tersimpan</h2>
          <div className="space-y-3">
            {([1, 2] as const).map((slot) => {
              const addr = slot === 1 ? profile?.address_1 : profile?.address_2;
              const label = slot === 1 ? profile?.address_1_label : profile?.address_2_label;

              if (editingSlot === slot) {
                return (
                  <div key={slot} className="rounded-2xl border border-primary/40 bg-card p-5">
                    <div className="space-y-3">
                      <input
                        value={labelInput}
                        onChange={(e) => setLabelInput(e.target.value)}
                        placeholder="Label (mis. Rumah, Kantor)"
                        className={inputCls}
                      />
                      <textarea
                        value={addrInput}
                        onChange={(e) => setAddrInput(e.target.value)}
                        rows={2}
                        placeholder="Alamat lengkap"
                        className={inputCls}
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => saveAddr(slot)}
                          disabled={savingAddr || addrInput.trim().length === 0}
                          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60"
                        >
                          {savingAddr ? "Menyimpan…" : "Simpan"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingSlot(null)}
                          disabled={savingAddr}
                          className="rounded-xl px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              if (!addr) {
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => startEditAddr(slot)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card px-4 py-5 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    <Plus size={16} />
                    Tambah alamat
                  </button>
                );
              }

              return (
                <div key={slot} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary">
                      <MapPin size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-card-foreground">
                          {label || `Alamat ${slot}`}
                        </span>
                        {slot === 1 && (
                          <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                            Utama
                          </span>
                        )}
                      </div>
                      <p className="mt-1 break-words text-sm text-muted-foreground">{addr}</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => startEditAddr(slot)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                        >
                          <Pencil size={14} />
                          Ubah
                        </button>
                        {slot === 2 && (
                          <button
                            type="button"
                            onClick={setPrimary}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                          >
                            <Star size={14} />
                            Jadikan utama
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteAddr(slot)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-danger transition-colors hover:bg-danger-subtle"
                        >
                          <Trash2 size={14} />
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Pesanan berjalan */}
        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">Pesanan Berjalan</h2>
          <OrderList
            orders={ongoing}
            loading={ordersLoading}
            hasPhone={!!profile?.phone}
            empty="Belum ada pesanan berjalan."
          />
        </section>

        {/* Riwayat pesanan */}
        <section>
          <h2 className="mb-3 text-base font-bold text-foreground">Riwayat Pesanan</h2>
          <HistoryList
            orders={history}
            loading={ordersLoading}
            hasPhone={!!profile?.phone}
          />
        </section>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </main>
    </div>
  );
}

function OrderList({
  orders,
  loading,
  hasPhone,
  empty,
}: {
  orders: OrderSummary[];
  loading: boolean;
  hasPhone: boolean;
  empty: string;
}) {
  if (loading) {
    return <p className="text-sm text-muted-foreground">Memuat pesanan…</p>;
  }
  if (!hasPhone) {
    return (
      <p className="text-sm text-muted-foreground">
        Tambahkan nomor HP di Data Pribadi untuk melacak pesananmu.
      </p>
    );
  }
  if (orders.length === 0) {
    return <p className="text-sm text-muted-foreground">{empty}</p>;
  }
  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <OrderCard key={o.id} order={o} />
      ))}
    </div>
  );
}

function OrderCard({ order }: { order: OrderSummary }) {
  const paid = order.status === "Lunas";
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-bold text-card-foreground">
            {order.layanan || "Pesanan"}
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {fmtDate(order.tanggal)}
            {order.jam ? ` · ${order.jam}` : ""}
          </div>
        </div>
        <span
          className={[
            "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold",
            paid
              ? "bg-success-subtle text-success"
              : "bg-accent-subtle text-accent-subtle-foreground",
          ].join(" ")}
        >
          {order.status || "-"}
        </span>
      </div>
      <div className="mt-2 text-sm font-extrabold text-primary">
        {formatRupiah(order.total)}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Riwayat pesanan — kartu dengan indikator jadwal (tanpa harga/rebook).      */
/* -------------------------------------------------------------------------- */

function HistoryList({
  orders,
  loading,
  hasPhone,
}: {
  orders: OrderSummary[];
  loading: boolean;
  hasPhone: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <HistorySkeleton key={i} />
        ))}
      </div>
    );
  }
  if (!hasPhone) {
    return (
      <p className="text-sm text-muted-foreground">
        Tambahkan nomor HP di Data Pribadi untuk melacak pesananmu.
      </p>
    );
  }
  if (orders.length === 0) {
    return <p className="text-sm text-muted-foreground">Belum ada riwayat pesanan.</p>;
  }
  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <HistoryOrderCard key={o.id} order={o} />
      ))}
    </div>
  );
}

function HistoryOrderCard({ order }: { order: OrderSummary }) {
  const first = (order.layanan.split(",")[0] ?? "").trim() || "Pesanan";
  const meta = SERVICE_META[first];
  const date = order.tanggal ?? order.createdAt;
  const schedule = meta ? scheduleFor(meta.intervalDays, date) : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-xl"
          aria-hidden
        >
          {meta?.emoji ?? "🧾"}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-bold text-card-foreground">{first}</span>
            {schedule && (
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${TONE_BG[schedule.tone]}`}
                aria-hidden
              />
            )}
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">{fmtDate(date)}</div>
        </div>
      </div>

      {meta && schedule && (
        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full ${TONE_BG[schedule.tone]} transition-[width] duration-500`}
              style={{ width: `${schedule.pct}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">
              Rekomendasi tiap {meta.intervalLabel}
            </span>
            <span className={`font-semibold ${TONE_TEXT[schedule.tone]}`}>
              {schedule.statusText}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function HistorySkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          <div className="h-2.5 w-20 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="mt-3 h-2 w-full animate-pulse rounded-full bg-muted" />
    </div>
  );
}
