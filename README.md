# Beres — Design System

Design system untuk marketplace jasa rumah tangga Indonesia. Dibangun dengan
**Next.js + TypeScript + Tailwind CSS**.

## Arah desain

- **Warna: blue + white.** Biru kustom yang sengaja lebih dalam & tenang dari
  palet default Tailwind agar terasa **terpercaya**, dipadu **putih hangat**
  (neutral di-tint hangat) supaya tetap ramah, plus **aksen amber** untuk CTA.
- **Tipografi:** `Plus Jakarta Sans` (display, didesain di Jakarta) + `Inter`
  (body). Skala modular ±1.2.
- **Radius / shadow / spacing:** skala konsisten, shadow di-tint navy.

Semua nilai adalah **CSS variable** di `app/globals.css`, dipetakan ke Tailwind
lewat `tailwind.config.ts`.

## Menjalankan

```bash
npm install
npm run dev
```

- Beranda: `http://localhost:3000`
- Styleguide (preview semua token): `http://localhost:3000/styleguide`

## Token utama

| Kategori   | Contoh token                                              |
| ---------- | --------------------------------------------------------- |
| Warna      | `--primary`, `--accent`, `--muted`, `--success`, …        |
| Tipografi  | `--font-display`, `--font-body`, `--text-xs … --text-6xl` |
| Radius     | `--radius-xs … --radius-2xl`, `--radius` (14px)           |
| Shadow     | `--shadow-xs … --shadow-xl`, `--shadow-focus`             |
| Spacing    | `--space-1 … --space-24` (basis 4px)                      |

Dark mode aktif via kelas `.dark` (toggle tersedia di `/styleguide`).
