import { services } from "@/src/data/services";
import {
  estimatePrice,
  FREQUENCIES,
  SERVICE_SLUGS,
  type BookingData,
} from "@/components/pesan/schema";

/**
 * Simpan pesanan booking ke Notion database "Beres Orders".
 *
 * Menerima BookingData sebagai JSON dari form pemesanan, lalu membuat satu
 * halaman baru di database via Notion REST API. Total dihitung ulang di server
 * (otoritatif) dan slug layanan dipetakan ke nama tampilan.
 *
 * Butuh env var `NOTION_API_KEY` (internal integration token yang sudah
 * di-share ke database Beres Orders).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NOTION_DATABASE_ID = "e52127872a9b48228314f8943f4719bf";
const NOTION_VERSION = "2022-06-28";

type SlugTuple = typeof SERVICE_SLUGS;

const richText = (content: string) => ({
  rich_text: [{ text: { content } }],
});

export async function POST(req: Request) {
  const token = process.env.NOTION_API_KEY;
  if (!token) {
    return Response.json(
      { error: "Pemesanan belum dikonfigurasi. Set NOTION_API_KEY di server." },
      { status: 503 },
    );
  }

  let data: Partial<BookingData>;
  try {
    data = await req.json();
  } catch {
    return Response.json({ error: "Body tidak valid." }, { status: 400 });
  }

  // Normalisasi & validasi ringan.
  const validSlugs = (Array.isArray(data.services) ? data.services : []).filter(
    (s): s is SlugTuple[number] => (SERVICE_SLUGS as readonly string[]).includes(s),
  );
  if (validSlugs.length === 0) {
    return Response.json({ error: "Tidak ada layanan yang dipilih." }, { status: 400 });
  }

  const serviceNames = validSlugs
    .map((slug) => services.find((s) => s.slug === slug)?.name ?? slug)
    .join(", ");
  const freqLabel = FREQUENCIES.find((f) => f.value === data.frequency)?.label;
  const total = estimatePrice({ ...data, services: validSlugs }).total;

  // Susun properties sesuai skema database (nama & tipe persis).
  const properties: Record<string, unknown> = {
    "Nama Pemesan": { title: [{ text: { content: data.fullName ?? "" } }] },
    Layanan: richText(serviceNames),
    Status: { select: { name: "Belum Bayar" } },
    Total: { number: total },
  };
  if (freqLabel) properties.Frekuensi = { select: { name: freqLabel } };
  if (data.propertyType) properties.Properti = { select: { name: data.propertyType } };
  if (data.duration) properties.Durasi = richText(`${data.duration} jam`);
  if (data.date) properties.Tanggal = { date: { start: data.date } };
  if (data.time) properties.Jam = richText(data.time);
  if (data.phone) properties.Kontak = { phone_number: data.phone };
  if (data.address) properties.Alamat = richText(data.address);
  if (data.city) properties.Kota = richText(data.city);
  if (data.postalCode) properties["Kode Pos"] = richText(data.postalCode);
  if (data.notes) properties.Catatan = richText(data.notes);

  try {
    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DATABASE_ID },
        properties,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Notion API error:", res.status, detail);
      return Response.json(
        { error: "Gagal menyimpan pesanan ke Notion." },
        { status: 502 },
      );
    }

    const page = (await res.json()) as { id?: string };
    return Response.json({ ok: true, id: page.id });
  } catch (err) {
    console.error("orders route error:", err);
    return Response.json(
      { error: "Gagal menyimpan pesanan. Coba lagi sebentar lagi." },
      { status: 502 },
    );
  }
}
