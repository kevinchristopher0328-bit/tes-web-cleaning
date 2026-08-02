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

/* -------------------------------------------------------------------------- */
/*  GET — ambil pesanan milik user (difilter berdasarkan nomor HP/Kontak).    */
/* -------------------------------------------------------------------------- */

type NotionProp = {
  title?: { plain_text: string }[];
  rich_text?: { plain_text: string }[];
  date?: { start: string | null } | null;
  number?: number | null;
  select?: { name: string } | null;
  created_time?: string;
};
type NotionPage = {
  id: string;
  created_time?: string;
  properties?: Record<string, NotionProp>;
};

export type OrderSummary = {
  id: string;
  nama: string;
  layanan: string;
  tanggal: string | null;
  jam: string;
  total: number;
  status: string;
  createdAt: string | null;
};

function mapOrder(page: NotionPage): OrderSummary {
  const p = page.properties ?? {};
  return {
    id: page.id,
    nama: p["Nama Pemesan"]?.title?.[0]?.plain_text ?? "",
    layanan: p["Layanan"]?.rich_text?.[0]?.plain_text ?? "",
    tanggal: p["Tanggal"]?.date?.start ?? null,
    jam: p["Jam"]?.rich_text?.[0]?.plain_text ?? "",
    total: p["Total"]?.number ?? 0,
    status: p["Status"]?.select?.name ?? "",
    createdAt: p["Waktu Pesan"]?.created_time ?? page.created_time ?? null,
  };
}

export async function GET(req: Request) {
  const token = process.env.NOTION_API_KEY;
  if (!token) {
    return Response.json(
      { error: "Pemesanan belum dikonfigurasi. Set NOTION_API_KEY di server." },
      { status: 503 },
    );
  }

  const phone = new URL(req.url).searchParams.get("phone")?.trim();
  if (!phone) {
    return Response.json({ orders: [] });
  }

  try {
    const res = await fetch(
      `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Notion-Version": NOTION_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filter: { property: "Kontak", phone_number: { equals: phone } },
          sorts: [{ property: "Waktu Pesan", direction: "descending" }],
          page_size: 50,
        }),
      },
    );

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Notion query error:", res.status, detail);
      return Response.json({ error: "Gagal memuat pesanan." }, { status: 502 });
    }

    const json = (await res.json()) as { results?: NotionPage[] };
    const orders = (json.results ?? []).map(mapOrder);
    return Response.json({ orders });
  } catch (err) {
    console.error("orders GET error:", err);
    return Response.json({ error: "Gagal memuat pesanan." }, { status: 502 });
  }
}
