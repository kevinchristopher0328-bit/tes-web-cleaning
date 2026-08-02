"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, MapPin, Mail, User } from "lucide-react";
import { supabase, type Profile } from "@/lib/supabase";

export default function ProfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

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
      setEmail(user.email ?? null);
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, phone, address, city, postal_code")
        .eq("id", user.id)
        .single();
      if (!active) return;
      setProfile(
        data ?? {
          id: user.id,
          full_name: (user.user_metadata?.full_name as string) ?? null,
          phone: null,
          address: null,
          city: null,
          postal_code: null,
        },
      );
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  const fullAddress = profile
    ? [profile.address, profile.city, profile.postal_code].filter(Boolean).join(", ")
    : "";

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

      <main className="mx-auto max-w-2xl px-6 py-10">
        {loading ? (
          <p className="py-16 text-center text-sm text-muted-foreground">Memuat profil…</p>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-subtle text-primary">
                <User size={28} />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {profile?.full_name || "Pengguna Beres"}
                </h1>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <InfoRow icon={<User size={18} />} label="Nama" value={profile?.full_name} />
              <InfoRow icon={<Mail size={18} />} label="Email" value={email} />
              <InfoRow icon={<MapPin size={18} />} label="Alamat tersimpan" value={fullAddress} />
              {profile?.phone && (
                <InfoRow icon={<User size={18} />} label="Nomor HP" value={profile.phone} />
              )}
            </div>

            {!fullAddress && (
              <p className="mt-4 text-sm text-muted-foreground">
                Belum ada alamat tersimpan. Alamat akan otomatis tersimpan saat kamu memesan
                layanan.{" "}
                <Link href="/pesan" className="font-semibold text-primary hover:underline">
                  Pesan sekarang
                </Link>
              </p>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="mt-10 inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <LogOut size={18} />
              Keluar
            </button>
          </>
        )}
      </main>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="mt-0.5 break-words text-sm font-medium text-card-foreground">
          {value || "-"}
        </div>
      </div>
    </div>
  );
}
