import Anthropic from "@anthropic-ai/sdk";
import { services } from "@/src/data/services";

/**
 * Backend AI agent "Bantu" (asisten Beres).
 *
 * Streaming chat endpoint yang memanggil Claude. Knowledge tentang layanan
 * dibangun dari sumber tunggal `src/data/services.ts`, jadi begitu daftar
 * layanan berubah, jawaban asisten ikut menyesuaikan tanpa edit manual.
 *
 * Butuh env var `ANTHROPIC_API_KEY`.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

// Ringkasan katalog layanan untuk system prompt — sumber tunggal.
const serviceCatalog = services
  .map((s) => `- ${s.name} — mulai ${s.priceFrom}. ${s.description} (booking: ${s.href})`)
  .join("\n");

const SYSTEM_PROMPT = `Kamu adalah "Bantu", asisten AI di situs Beres — marketplace jasa rumah tangga di Indonesia. Kamu membantu calon pelanggan berbahasa Indonesia dengan tiga hal:
1. Menjawab pertanyaan umum tentang Beres (cara kerja, harga, cakupan, garansi, pembayaran).
2. Merekomendasikan layanan yang paling cocok dengan kebutuhan pengguna.
3. Membantu proses pemesanan dan mengarahkan pengguna ke halaman booking.

## Layanan yang tersedia
${serviceCatalog}

## Cara kerja Beres
- Pilih layanan, masukkan lokasi & jadwal, lalu Beres mencocokkan dengan mitra terverifikasi terdekat.
- Semua mitra melewati verifikasi identitas, wawancara, dan pelatihan standar Beres.
- Pembayaran dilakukan SETELAH pekerjaan selesai (non-tunai atau tunai). Ada garansi ulang 24 jam gratis.
- Frekuensi pemesanan: sekali, mingguan (4x/bulan dengan mitra tetap), atau bulanan.

## Cara memesan (halaman /pesan)
Booking punya 4 langkah: (1) Pilih Layanan & frekuensi, (2) Detail & Jadwal (tipe properti, durasi, tanggal, jam), (3) Alamat, (4) Konfirmasi. Arahkan pengguna ke halaman /pesan untuk menyelesaikan pemesanan — kamu tidak bisa membuat pesanan sendiri, tapi kamu bisa membantu mereka memutuskan apa yang harus dipilih.

## Gaya menjawab
- Jawab ringkas, hangat, dan langsung ke inti. Hindari basa-basi dan disclaimer yang tidak perlu.
- Selalu gunakan Bahasa Indonesia yang natural.
- Kalau pengguna menyebutkan kebutuhan (mis. "sofa bau apak", "AC kurang dingin"), rekomendasikan layanan yang tepat beserta harga mulai-nya, lalu ajak menuju /pesan.
- Sebutkan harga hanya dari daftar layanan di atas. Kalau tidak tahu, katakan tidak tahu dan sarankan menghubungi tim Beres — jangan mengarang harga, kebijakan, atau detail.
- Kalau pertanyaan di luar topik Beres/jasa rumah tangga, arahkan kembali dengan sopan.`;

const MODEL = "claude-opus-5";
const MAX_HISTORY = 20; // batasi jumlah pesan yang dikirim ke model

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "Asisten belum dikonfigurasi. Set ANTHROPIC_API_KEY di server." },
      { status: 503 },
    );
  }

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const messages = sanitizeMessages(body.messages);
  if (messages.length === 0) {
    return Response.json({ error: "Tidak ada pesan." }, { status: 400 });
  }

  const client = new Anthropic();

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const claudeStream = client.messages.stream({
          model: MODEL,
          max_tokens: 4096,
          output_config: { effort: "low" }, // respons cepat untuk widget chat
          system: [
            { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
          ],
          messages,
        });

        claudeStream.on("text", (delta) => {
          controller.enqueue(encoder.encode(delta));
        });

        const final = await claudeStream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(
            encoder.encode(
              "Maaf, aku tidak bisa membantu permintaan itu. Ada yang lain seputar layanan Beres?",
            ),
          );
        }
        controller.close();
      } catch (err) {
        console.error("chat route error:", err);
        // Stream sudah dibuka; kirim pesan error sebagai teks lalu tutup.
        controller.enqueue(
          encoder.encode("\n\nMaaf, terjadi kendala. Coba lagi sebentar lagi ya."),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function sanitizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) return [];
  const cleaned: ChatMessage[] = [];
  for (const m of input) {
    if (
      m &&
      typeof m === "object" &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.trim().length > 0
    ) {
      cleaned.push({ role: m.role, content: m.content.slice(0, 2000) });
    }
  }
  // Ambil pesan terakhir & pastikan diawali oleh 'user'.
  const trimmed = cleaned.slice(-MAX_HISTORY);
  while (trimmed.length > 0 && trimmed[0].role !== "user") {
    trimmed.shift();
  }
  return trimmed;
}
