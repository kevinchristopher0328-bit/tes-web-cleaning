# CLAUDE.md

Panduan singkat untuk proyek ini.

## Apa ini

Design system untuk **marketplace jasa rumah tangga Indonesia** ("Beres").
Stack: **Next.js 14 (App Router) + TypeScript + Tailwind CSS v3**.

## Prinsip design token

- **Sumber tunggal**: semua token didefinisikan sebagai CSS variable di
  `app/globals.css`. `tailwind.config.ts` hanya menjembatani token itu ke
  utilitas Tailwind — jangan hardcode nilai hex/px di komponen.
- **Warna** disimpan sebagai channel HSL tanpa `hsl()` supaya modifier
  opacity Tailwind (mis. `bg-primary/50`) tetap berfungsi.
- **Arah warna**: blue + white. Primer = `blue-500` (biru cerah & ramah, tetap
  lolos kontras teks putih), neutral di-tint hangat, aksen amber untuk
  highlight.
- **Pakai token semantik** (`primary`, `muted`, `card`, `success`, …) di
  produk, bukan skala mentah (`blue-600`). Skala mentah hanya untuk kasus
  khusus / styleguide.

## Struktur

- `app/globals.css` — definisi semua token (warna, tipografi, radius, shadow,
  spacing) + base styles + dark mode.
- `tailwind.config.ts` — pemetaan token → utilitas + safelist skala warna.
- `app/layout.tsx` — memuat font (Plus Jakarta Sans + Inter) via `next/font`.
- `app/styleguide/page.tsx` — preview semua token (`/styleguide`).

## Perintah

```bash
npm install
npm run dev     # http://localhost:3000  (styleguide: /styleguide)
npm run build
```

## Menambah token

1. Tambah CSS variable di `:root` (dan padanan `.dark` bila perlu) di
   `app/globals.css`.
2. Petakan di `tailwind.config.ts`.
3. Tampilkan di `app/styleguide/page.tsx`.
