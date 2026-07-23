import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*  Opsi                                                                       */
/* -------------------------------------------------------------------------- */

export const SERVICE_SLUGS = [
  "bersih-rumah",
  "setrika",
  "cuci-sofa",
  "dapur-kamar-mandi",
  "servis-ac",
  "taman-kebun",
] as const;

export const FREQUENCIES = [
  { value: "sekali", label: "Sekali", desc: "Satu kali kunjungan", factor: 1 },
  { value: "mingguan", label: "Mingguan", desc: "4x / bulan, mitra tetap", factor: 3.6 },
  { value: "bulanan", label: "Bulanan", desc: "Rutin 1x / bulan", factor: 1 },
] as const;

export const PROPERTY_TYPES = ["Rumah", "Apartemen", "Kos", "Kantor"] as const;

export const DURATIONS = [
  { value: "2", label: "2 jam", desc: "Studio / 1 kamar" },
  { value: "3", label: "3 jam", desc: "2–3 kamar" },
  { value: "4", label: "4 jam", desc: "Rumah besar" },
] as const;

export const TIME_SLOTS = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "13:00 - 15:00",
  "15:00 - 17:00",
] as const;

/* -------------------------------------------------------------------------- */
/*  Schema + pesan error (Bahasa Indonesia)                                    */
/* -------------------------------------------------------------------------- */

function notInPast(dateStr: string) {
  if (!dateStr) return false;
  const d = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d.getTime() >= today.getTime();
}

export const bookingSchema = z.object({
  // Step 1 — Pilih Layanan
  service: z.enum(SERVICE_SLUGS, { error: "Pilih salah satu layanan" }),
  frequency: z.enum(["sekali", "mingguan", "bulanan"], {
    error: "Pilih frekuensi pemesanan",
  }),

  // Step 2 — Detail & Jadwal
  propertyType: z.enum(PROPERTY_TYPES, { error: "Pilih tipe properti" }),
  duration: z.enum(["2", "3", "4"], { error: "Pilih perkiraan durasi" }),
  date: z
    .string()
    .min(1, "Tanggal wajib diisi")
    .refine(notInPast, "Tanggal tidak boleh di masa lalu"),
  time: z.enum(TIME_SLOTS, { error: "Pilih slot waktu kedatangan" }),
  notes: z.string().max(300, "Catatan maksimal 300 karakter").optional(),

  // Step 3 — Alamat
  fullName: z.string().min(3, "Nama minimal 3 karakter"),
  phone: z
    .string()
    .regex(/^(?:\+62|62|0)8\d{8,12}$/, "Nomor HP tidak valid (contoh: 08123456789)"),
  address: z.string().min(10, "Alamat minimal 10 karakter"),
  city: z.string().min(2, "Kota/kabupaten wajib diisi"),
  postalCode: z.string().regex(/^\d{5}$/, "Kode pos harus 5 digit angka"),
  addressNote: z.string().max(200, "Patokan maksimal 200 karakter").optional(),

  // Step 4 — Konfirmasi
  agree: z.boolean().refine((v) => v === true, "Kamu harus menyetujui syarat & ketentuan"),
});

export type BookingData = z.infer<typeof bookingSchema>;

/** Field yang divalidasi di tiap step (untuk trigger per-step). */
export const stepFields: (keyof BookingData)[][] = [
  ["service", "frequency"],
  ["propertyType", "duration", "date", "time", "notes"],
  ["fullName", "phone", "address", "city", "postalCode", "addressNote"],
  ["agree"],
];

export const STEP_LABELS = [
  "Pilih Layanan",
  "Detail & Jadwal",
  "Alamat",
  "Konfirmasi",
] as const;

/* -------------------------------------------------------------------------- */
/*  Estimasi harga                                                             */
/* -------------------------------------------------------------------------- */

const BASE_PRICE: Record<(typeof SERVICE_SLUGS)[number], number> = {
  "bersih-rumah": 90000,
  setrika: 60000,
  "cuci-sofa": 150000,
  "dapur-kamar-mandi": 120000,
  "servis-ac": 75000,
  "taman-kebun": 100000,
};

const SERVICE_FEE = 5000;

export function estimatePrice(data: Partial<BookingData>) {
  const base = data.service ? BASE_PRICE[data.service] : 0;
  const durationFactor = data.duration ? Number(data.duration) / 2 : 1; // 2 jam = 1x
  const freqFactor =
    FREQUENCIES.find((f) => f.value === data.frequency)?.factor ?? 1;

  const subtotal = Math.round(base * durationFactor * freqFactor);
  const fee = subtotal > 0 ? SERVICE_FEE : 0;
  return { subtotal, fee, total: subtotal + fee };
}

export function formatRupiah(n: number) {
  return `Rp ${new Intl.NumberFormat("id-ID").format(n)}`;
}
