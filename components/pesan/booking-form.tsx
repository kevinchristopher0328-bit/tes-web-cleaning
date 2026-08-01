"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FormProvider,
  useForm,
  useFormContext,
  type FieldPath,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CheckCircle2 } from "lucide-react";
import { services } from "@/src/data/services";
import {
  bookingSchema,
  estimatePrice,
  formatRupiah,
  stepFields,
  STEP_LABELS,
  SERVICE_SLUGS,
  FREQUENCIES,
  PROPERTY_TYPES,
  DURATIONS,
  TIME_SLOTS,
  type BookingData,
} from "./schema";

const TOTAL = STEP_LABELS.length;

/* -------------------------------------------------------------------------- */
/*  Primitives                                                                 */
/* -------------------------------------------------------------------------- */

function ErrorMsg({ name }: { name: FieldPath<BookingData> }) {
  const {
    formState: { errors },
  } = useFormContext<BookingData>();
  const msg = errors[name]?.message as string | undefined;
  if (!msg) return null;
  return <p className="mt-1.5 text-xs font-medium text-danger">{msg}</p>;
}

function Field({
  label,
  name,
  children,
  hint,
}: {
  label: string;
  name: FieldPath<BookingData>;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-sm font-medium text-foreground">
        {label}
        {hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}
      </span>
      {children}
      <ErrorMsg name={name} />
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-card-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";

/** Kartu pilihan (radio) generik. */
function SelectCard({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative rounded-2xl border p-4 text-left transition-all",
        active
          ? "border-primary bg-primary-subtle shadow-glow"
          : "border-border bg-card hover:border-primary/40 hover:bg-muted/50",
      ].join(" ")}
    >
      {active && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check size={12} strokeWidth={3} />
        </span>
      )}
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 1 — Pilih Layanan                                                     */
/* -------------------------------------------------------------------------- */

function StepService() {
  const { watch, setValue } = useFormContext<BookingData>();
  const service = watch("service");
  const frequency = watch("frequency");

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-1 text-sm font-medium text-foreground">Mau pesan layanan apa?</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <SelectCard
                key={s.slug}
                active={service === s.slug}
                onClick={() =>
                  setValue("service", s.slug as BookingData["service"], {
                    shouldValidate: true,
                    shouldTouch: true,
                  })
                }
              >
                <div className="flex items-start gap-3 pr-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-primary">
                    <Icon size={20} strokeWidth={1.75} />
                  </span>
                  <div>
                    <div className="text-sm font-bold text-card-foreground">{s.name}</div>
                    <div className="text-xs text-muted-foreground">Mulai {s.priceFrom}</div>
                  </div>
                </div>
              </SelectCard>
            );
          })}
        </div>
        <ErrorMsg name="service" />
      </div>

      <div>
        <h3 className="mb-1 text-sm font-medium text-foreground">Seberapa sering?</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {FREQUENCIES.map((f) => (
            <SelectCard
              key={f.value}
              active={frequency === f.value}
              onClick={() => setValue("frequency", f.value, { shouldValidate: true, shouldTouch: true })}
            >
              <div className="pr-6">
                <div className="text-sm font-bold text-card-foreground">{f.label}</div>
                <div className="text-xs text-muted-foreground">{f.desc}</div>
              </div>
            </SelectCard>
          ))}
        </div>
        <ErrorMsg name="frequency" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 2 — Detail & Jadwal                                                   */
/* -------------------------------------------------------------------------- */

function StepDetails() {
  const { register, watch, setValue } = useFormContext<BookingData>();
  const propertyType = watch("propertyType");
  const duration = watch("duration");
  const time = watch("time");
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-7">
      <div>
        <h3 className="mb-1 text-sm font-medium text-foreground">Tipe properti</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setValue("propertyType", p, { shouldValidate: true, shouldTouch: true })}
              className={[
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                propertyType === p
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-card-foreground hover:bg-muted",
              ].join(" ")}
            >
              {p}
            </button>
          ))}
        </div>
        <ErrorMsg name="propertyType" />
      </div>

      <div>
        <h3 className="mb-1 text-sm font-medium text-foreground">Perkiraan durasi</h3>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {DURATIONS.map((d) => (
            <SelectCard
              key={d.value}
              active={duration === d.value}
              onClick={() => setValue("duration", d.value, { shouldValidate: true, shouldTouch: true })}
            >
              <div className="pr-4">
                <div className="text-sm font-bold text-card-foreground">{d.label}</div>
                <div className="text-xs text-muted-foreground">{d.desc}</div>
              </div>
            </SelectCard>
          ))}
        </div>
        <ErrorMsg name="duration" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Tanggal" name="date">
          <input type="date" min={today} className={inputCls} {...register("date")} />
        </Field>
        <div>
          <span className="mb-1.5 block text-sm font-medium text-foreground">Waktu kedatangan</span>
          <div className="grid grid-cols-2 gap-2">
            {TIME_SLOTS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setValue("time", t, { shouldValidate: true, shouldTouch: true })}
                className={[
                  "rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                  time === t
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-card-foreground hover:bg-muted",
                ].join(" ")}
              >
                {t}
              </button>
            ))}
          </div>
          <ErrorMsg name="time" />
        </div>
      </div>

      <Field label="Catatan untuk mitra" name="notes" hint="opsional">
        <textarea
          rows={3}
          placeholder="Contoh: fokus di dapur & kamar mandi, ada hewan peliharaan"
          className={inputCls}
          {...register("notes")}
        />
      </Field>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 3 — Alamat                                                            */
/* -------------------------------------------------------------------------- */

function StepAddress() {
  const { register } = useFormContext<BookingData>();
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nama lengkap" name="fullName">
          <input placeholder="Nama penerima" className={inputCls} {...register("fullName")} />
        </Field>
        <Field label="Nomor HP" name="phone">
          <input inputMode="tel" placeholder="08123456789" className={inputCls} {...register("phone")} />
        </Field>
      </div>

      <Field label="Alamat lengkap" name="address">
        <textarea
          rows={2}
          placeholder="Jl. Melati No. 12, RT 03 / RW 05, Kel. Cipete"
          className={inputCls}
          {...register("address")}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Kota / Kabupaten" name="city">
          <input placeholder="Jakarta Selatan" className={inputCls} {...register("city")} />
        </Field>
        <Field label="Kode pos" name="postalCode">
          <input inputMode="numeric" placeholder="12345" maxLength={5} className={inputCls} {...register("postalCode")} />
        </Field>
      </div>

      <Field label="Patokan" name="addressNote" hint="opsional">
        <input placeholder="Contoh: pagar hijau, sebelah warung" className={inputCls} {...register("addressNote")} />
      </Field>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step 4 — Konfirmasi                                                        */
/* -------------------------------------------------------------------------- */

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value || "-"}</span>
    </div>
  );
}

function StepConfirm() {
  const { watch, register } = useFormContext<BookingData>();
  const v = watch();
  const price = estimatePrice(v);
  const serviceName = services.find((s) => s.slug === v.service)?.name;
  const freqLabel = FREQUENCIES.find((f) => f.value === v.frequency)?.label;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-1 text-base font-bold text-card-foreground">Ringkasan pesanan</h3>
        <div className="divide-y divide-border">
          <SummaryRow label="Layanan" value={serviceName} />
          <SummaryRow label="Frekuensi" value={freqLabel} />
          <SummaryRow label="Properti" value={v.propertyType} />
          <SummaryRow label="Durasi" value={v.duration ? `${v.duration} jam` : undefined} />
          <SummaryRow label="Jadwal" value={v.date ? `${v.date} · ${v.time ?? ""}` : undefined} />
          <SummaryRow label="Penerima" value={v.fullName} />
          <SummaryRow label="Kontak" value={v.phone} />
          <SummaryRow
            label="Alamat"
            value={[v.address, v.city, v.postalCode].filter(Boolean).join(", ")}
          />
          {v.notes ? <SummaryRow label="Catatan" value={v.notes} /> : null}
        </div>
      </div>

      <div className="rounded-2xl border border-primary/30 bg-primary-subtle/50 p-5">
        <div className="flex items-center justify-between text-sm text-foreground">
          <span>Subtotal</span>
          <span className="font-medium">{formatRupiah(price.subtotal)}</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
          <span>Biaya layanan</span>
          <span>{formatRupiah(price.fee)}</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-primary/20 pt-3">
          <span className="text-sm font-semibold text-foreground">Estimasi total</span>
          <span className="text-xl font-extrabold text-primary">{formatRupiah(price.total)}</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          *Estimasi. Harga final dikonfirmasi mitra setelah survei bila diperlukan.
        </p>
      </div>

      <div>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-input text-primary accent-[hsl(var(--primary))]"
            {...register("agree")}
          />
          <span className="text-sm text-foreground">
            Saya menyetujui{" "}
            <span className="font-semibold text-primary">syarat &amp; ketentuan</span> dan
            kebijakan privasi Beres.
          </span>
        </label>
        <ErrorMsg name="agree" />
      </div>
    </div>
  );
}

const STEPS = [StepService, StepDetails, StepAddress, StepConfirm];

/* -------------------------------------------------------------------------- */
/*  Progress bar                                                               */
/* -------------------------------------------------------------------------- */

function Progress({ step }: { step: number }) {
  return (
    <div>
      <div className="relative flex items-center justify-between">
        {/* track */}
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-border" />
        <motion.div
          className="absolute left-0 top-4 h-0.5 bg-primary"
          initial={false}
          animate={{ width: `${(step / (TOTAL - 1)) * 100}%` }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
        {STEP_LABELS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={label} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors",
                  done
                    ? "border-primary bg-primary text-primary-foreground"
                    : active
                      ? "border-primary bg-card text-primary"
                      : "border-border bg-card text-muted-foreground",
                ].join(" ")}
              >
                {done ? <Check size={16} strokeWidth={3} /> : i + 1}
              </div>
              <span
                className={[
                  "hidden text-xs font-medium sm:block",
                  active || done ? "text-foreground" : "text-muted-foreground",
                ].join(" ")}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Booking form                                                               */
/* -------------------------------------------------------------------------- */

export default function BookingForm() {
  // Layanan bisa diprapilih lewat query param, mis.
  // /pesan?service=servis-ac&service=cuci-sofa (dipakai tombol "Pesan Sekarang"
  // di chat). Kalau ada yang valid, layanan langsung terpilih dan alur loncat
  // ke step 2 (Detail & Jadwal).
  //
  // Catatan: form ini masih satu layanan per pesanan, jadi bila beberapa slug
  // dikirim kita memilih yang pertama valid.
  const searchParams = useSearchParams();
  const requested = searchParams.getAll("service");
  const validServices = requested.filter((s): s is BookingData["service"] =>
    (SERVICE_SLUGS as readonly string[]).includes(s),
  );
  const presetService = validServices[0];

  const methods = useForm<BookingData>({
    resolver: zodResolver(bookingSchema),
    mode: "onTouched",
    // Nilai form disimpan di sini (react-hook-form context) — tidak hilang saat mundur.
    defaultValues: {
      service: presetService,
      // Beri frekuensi default agar form tetap valid saat step 1 dilewati;
      // pengguna masih bisa mengubahnya lewat tombol "Kembali".
      frequency: presetService ? "sekali" : undefined,
      date: "",
      notes: "",
      fullName: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      addressNote: "",
      agree: false,
    },
  });

  const [step, setStep] = useState(presetService ? 1 : 0);
  const [dir, setDir] = useState(1);
  const [done, setDone] = useState(false);

  async function next() {
    const ok = await methods.trigger(stepFields[step]);
    if (!ok) return;
    setDir(1);
    setStep((s) => Math.min(s + 1, TOTAL - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  function onValid(data: BookingData) {
    if (step !== TOTAL - 1) return; // guard: hanya submit di step terakhir
    // Tidak ada backend — tampilkan konfirmasi sukses.
    console.log("Pesanan:", data);
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const Current = STEPS[step];

  return (
    <div className="min-h-screen bg-background">
      {/* Header minimal untuk alur checkout */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-extrabold text-foreground">
            Beres<span className="text-primary">.</span>
          </Link>
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Kembali ke beranda
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {done ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-16 text-center"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-success-subtle text-success">
              <CheckCircle2 size={44} />
            </span>
            <h1 className="mt-6 text-3xl font-extrabold text-foreground">Pesanan diterima!</h1>
            <p className="mt-2 max-w-md text-muted-foreground">
              Kami sedang mencocokkanmu dengan mitra terverifikasi terdekat. Detail
              pesanan sudah dikirim ke nomor HP-mu.
            </p>
            <Link
              href="/"
              className="mt-8 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
            >
              Kembali ke beranda
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="mb-1 text-sm font-semibold uppercase tracking-widest text-accent-subtle-foreground">
              Pesan Layanan
            </div>
            <h1 className="mb-8 text-2xl font-bold text-foreground sm:text-3xl">
              {STEP_LABELS[step]}
            </h1>

            <Progress step={step} />

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onValid)} className="mt-10">
                <div className="overflow-hidden">
                  <AnimatePresence mode="wait" custom={dir} initial={false}>
                    <motion.div
                      key={step}
                      custom={dir}
                      variants={{
                        enter: (d: number) => ({ x: d > 0 ? 48 : -48, opacity: 0 }),
                        center: { x: 0, opacity: 1 },
                        exit: (d: number) => ({ x: d > 0 ? -48 : 48, opacity: 0 }),
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Current />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigasi */}
                <div className="mt-10 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={back}
                    disabled={step === 0}
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-0"
                  >
                    <ArrowLeft size={18} />
                    Kembali
                  </button>

                  {step < TOTAL - 1 ? (
                    <button
                      type="button"
                      onClick={next}
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
                    >
                      Lanjut
                      <ArrowRight size={18} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover"
                    >
                      Pesan Sekarang
                      <Check size={18} strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              </form>
            </FormProvider>
          </>
        )}
      </main>
    </div>
  );
}
