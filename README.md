# 🌋 AeroSuoh — Geothermal Eco-Monitor & Smart Tourism

![AeroSuoh Hero Banner](public/images/bannerRm.png)

> **Platform Pariwisata Pintar & Dasbor Pemantauan Geotermal Real-Time untuk Kawasan Suoh, Lampung Barat.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-aerosuoh.vercel.app-059669?style=for-the-badge)](https://aerosuoh.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.7-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-All_Rights_Reserved-red?style=flat-square)]()

**AeroSuoh** mengangkat "Surga Tersembunyi" kawasan Suoh ke kancah global melalui tiga pilar utama: **Pariwisata Pintar**, **Keselamatan Masyarakat**, dan **Pemantauan Lingkungan Geotermal**. Proyek ini merupakan implementasi subtema **Human-Centered Technology** — solusi teknologi yang berdampak langsung bagi masyarakat.

Dibuat untuk **Kompetisi Web Development HMJTI POLINELA 2026**.

---

## ✨ Fitur Utama

### 🗺️ Eksplorasi & Wisata
- **3D Aerial Explorer (Mapbox GL JS)** — Pemetaan 3D interaktif kawasan Suoh dengan visualisasi lokasi danau dan kawah, fitur kamera termal, kompas interaktif, dan penanda koordinat presisi.
- **Cinematic Video Showcase** — Rekaman sinematik udara kawasan Suoh dan Danau Asam dari sudut pandang drone.
- **Galeri Foto Interaktif (Photo Slider)** — Slider foto HD dengan detail sejarah dan mitos lokal untuk 6 lokasi utama.
- **Ensiklopedia Geotermal** — Edukasi interaktif: Gempa Suoh 1933, Legenda Ular Naga, dan ekosistem ekstrem.
- **Perencana Itinerari Wisata** — Rencana perjalanan otomatis (½ hari, 1 hari, 2H1M) dengan estimasi biaya.
- **Rute Akses & Navigasi** — Panduan jalur Liwa (Utara) dan Tanggamus (Selatan) dengan tips kendaraan.

### 📊 Pemantauan & Keselamatan
- **Real-Time Geothermal Dashboard** — Dasbor sensor interaktif (Recharts) memantau suhu, pH, H₂S, SO₂, kelembaban, dan kecepatan angin dengan indikator keselamatan (*Safe / Caution / Danger*).
- **Safety Alert Real-Time** — Pop-up peringatan otomatis berbasis data sensor H₂S/SO₂ yang auto-dismiss saat pengguna berinteraksi.
- **Panduan Keselamatan** — Protokol lengkap: masker gas, sepatu trekking, pendampingan pemandu, dan zona aman.
- **Unduh Laporan PDF** — Ekspor data sensor sebagai laporan PDF untuk keperluan dokumentasi.

### 🤖 Interaksi Cerdas
- **AeroBot Smart Assistant** — Chatbot AI interaktif untuk reservasi tiket, rute, cuaca, outfit, dan protokol keselamatan.
- **Sistem Pemesanan Tiket Digital** — Formulir booking multi-step (Day Trip Pass & Eco-Staycation) dengan validasi, katalog homestay, QRIS, dan konfirmasi via WhatsApp.
- **Testimoni Pengunjung** — Sistem ulasan dengan rating bintang dan moderasi admin.

### 🌐 Platform & Aksesibilitas
- **Bilingual Seamless (ID / EN)** — Dukungan penuh Bahasa Indonesia dan Bahasa Inggris secara instan tanpa reload (174 kunci terjemahan tersinkronisasi).
- **Admin Panel (CMS)** — Panel administrasi lengkap untuk mengelola galeri, data sensor, pemesanan, testimoni, ensiklopedia, rute akses, pengaturan situs, dan manajemen pengguna — tanpa perlu coding.
- **Responsive & Premium Design** — Glassmorphism, partikel uap geotermal animasi, scroll reveal (Framer Motion), dan error boundary global.
- **SEO Terintegrasi** — OpenGraph, Twitter Card, `sitemap.xml`, `robots.txt`, Google Search Console verification, dan custom 404 page.

---

## 🛠️ Teknologi yang Digunakan

### Core & Framework
| Teknologi | Versi | Fungsi |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16.1.7 | Framework React full-stack (App Router, SSR/SSG) |
| [React](https://react.dev/) | 19.2.3 | Library UI berbasis komponen |
| [TypeScript](https://www.typescriptlang.org/) | ^5.0 | Superset JavaScript dengan tipe statis |

### Styling & Animasi
| Teknologi | Versi | Fungsi |
|---|---|---|
| [Tailwind CSS](https://tailwindcss.com/) | v4 | Utility-first CSS framework |
| [Framer Motion](https://www.framer.com/motion/) | 12.38.0 | Animasi deklaratif & scroll reveal |
| [Lucide React](https://lucide.dev/) | 0.577.0 | Ikon SVG modern |

### Data, Pemetaan & Visualisasi
| Teknologi | Versi | Fungsi |
|---|---|---|
| [Mapbox GL JS](https://www.mapbox.com/) | 3.20.0 | Peta interaktif 3D |
| [Recharts](https://recharts.org/) | 3.8.0 | Grafik interaktif data sensor |
| [Supabase](https://supabase.com/) | 2.110.8 | BaaS — PostgreSQL, Auth, RLS |

### Build, Deploy & Optimasi
| Teknologi | Fungsi |
|---|---|
| [Vercel](https://vercel.com/) | Hosting & CI/CD otomatis dari GitHub |
| [Sharp](https://sharp.pixelplumbing.com/) | Pipeline kompresi gambar (`compress-images.mjs`) |
| [ESLint](https://eslint.org/) v9 | Linter kode (`eslint-config-next`) |
| [Google Search Console](https://search.google.com/search-console) | SEO & pengindeksan |

---

## 📁 Struktur Direktori Proyek

```text
AeroSuoh-V2/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root Layout & LanguageProvider
│   ├── page.tsx                  # Halaman Utama (Landing Page)
│   ├── error.tsx                 # Error Boundary
│   ├── global-error.tsx          # Global Error Boundary
│   ├── not-found.tsx             # Custom 404 Page
│   ├── globals.css               # Tailwind CSS v4 Config
│   ├── robots.ts                 # Dynamic Robots.txt Generator
│   ├── sitemap.ts                # Dynamic Sitemap.xml Generator
│   ├── admin/                    # Admin Panel (CMS)
│   │   ├── page.tsx              # Login Admin
│   │   └── dashboard/            # Dashboard Admin
│   │       ├── page.tsx          # Overview & Statistik
│   │       ├── layout.tsx        # Layout Sidebar Admin
│   │       ├── bookings/         # Manajemen Pemesanan Tiket
│   │       ├── encyclopedia/     # Manajemen Ensiklopedia
│   │       ├── gallery/          # Manajemen Galeri Foto
│   │       ├── routes/           # Manajemen Rute Akses
│   │       ├── safety/           # Manajemen Panduan Keselamatan
│   │       ├── sensor/           # Manajemen Data Sensor
│   │       ├── site-settings/    # Pengaturan Website
│   │       ├── testimonials/     # Moderasi Testimoni
│   │       └── users/            # Manajemen Pengguna
│   └── api/admin/                # API Routes (Server-side)
├── components/                   # 17 Komponen UI Interaktif
│   ├── About.tsx                 # Tentang & SDGs
│   ├── AerialExplorer.tsx        # Peta 3D Mapbox GL
│   ├── BackToTop.tsx             # Scroll to Top
│   ├── Dashboard.tsx             # Dasbor Sensor Real-Time
│   ├── Encyclopedia.tsx          # Ensiklopedia Geotermal
│   ├── Footer.tsx                # Footer Navigasi
│   ├── GeothermalParticles.tsx   # Efek Partikel Uap
│   ├── ItineraryPlanner.tsx      # Perencana Itinerari
│   ├── LogoPhilosophy.tsx        # Filosofi Logo
│   ├── Navbar.tsx                # Navigasi Responsif & Switcher Bahasa
│   ├── PhotoSlider.tsx           # Galeri Foto HD
│   ├── RouteAccess.tsx           # Rute Transportasi
│   ├── SafetyAlert.tsx           # Banner Peringatan Dini
│   ├── SafetyGuide.tsx           # Panduan Keselamatan
│   ├── SmartAssistant.tsx        # AeroBot AI & Booking System
│   ├── Testimonials.tsx          # Ulasan Pengunjung
│   ├── VirtualTour.tsx           # Video Showcase
│   └── admin/                    # Komponen Admin Panel
├── context/
│   └── LanguageContext.tsx        # Global State & Kamus Terjemahan (174 key × 2 bahasa)
├── lib/
│   ├── supabase.ts               # Supabase Client
│   └── types.ts                  # TypeScript Type Definitions
├── public/                       # Asset Statis
│   ├── images/                   # Foto HD Kawasan Wisata
│   └── google*.html              # Google Search Console Verification
├── compress-images.mjs           # Script Kompresi Gambar (Sharp)
├── supabase-schema.sql           # Skema Database PostgreSQL
├── next.config.ts                # Konfigurasi Next.js
└── package.json                  # Dependensi & Scripts
```

---

## 📦 Panduan Instalasi & Pengoperasian

### Prasyarat
- **Node.js** ≥ 18.0.0 (disarankan LTS)
- **npm** / **pnpm** / **yarn** / **bun**

### Langkah-Langkah

1. **Clone Repositori**
   ```bash
   git clone https://github.com/HafisYulianto/AeroSuoh-V2.git
   cd AeroSuoh-V2
   ```

2. **Instal Dependensi**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables**
   Buat file `.env.local` berdasarkan `.env.example`:
   ```env
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_mapbox_public_token_here
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

4. **Setup Database (Opsional)**
   Import skema database ke Supabase:
   ```bash
   # Upload file supabase-schema.sql ke Supabase SQL Editor
   ```

5. **Jalankan Mode Development**
   ```bash
   npm run dev
   ```
   Buka browser di [http://localhost:3000](http://localhost:3000).

6. **Kompresi Gambar (Opsional)**
   ```bash
   node compress-images.mjs
   ```

7. **Build Produksi**
   ```bash
   npm run build
   npm run start
   ```

---

## 🌐 Dukungan Bilingual (ID / EN)

AeroSuoh mendukung **174 kunci terjemahan** yang tersinkronisasi sempurna antara Bahasa Indonesia dan Bahasa Inggris. Sistem terjemahan dikelola melalui:

- **`context/LanguageContext.tsx`** — Global state management dengan React Context API
- **Zero Reload** — Pergantian bahasa instan tanpa memuat ulang halaman
- **Fallback Hierarchy** — Database (Supabase `site_settings`) → Local Dictionary → Key Name
- **Cakupan penuh** — Seluruh teks UI (navigasi, hero, galeri, dasbor, form, error page, footer, dll.) sudah diterjemahkan

---

## 🌍 Kontribusi Terhadap SDGs

AeroSuoh mendukung Tujuan Pembangunan Berkelanjutan (SDGs) PBB:

- 📈 **SDG 8: Pekerjaan Layak & Pertumbuhan Ekonomi** — Menggerakkan ekonomi lokal masyarakat Suoh melalui pariwisata ekologis yang terstruktur.
- 🏙️ **SDG 11: Kota & Komunitas Berkelanjutan** — Membangun kawasan wisata yang tangguh bencana dan aman bagi pengunjung serta warga.
- 🌍 **SDG 13: Penanganan Perubahan Iklim** — Pemantauan emisi gas geotermal dan suhu permukaan untuk mendukung peringatan dini.
- 🌿 **SDG 15: Ekosistem Daratan** — Mengedukasi pengunjung untuk menjaga kelestarian ekosistem danau dan kawah alami.

---

## 👨‍💻 Tim Pengembang

- **[Hafis Yulianto](https://github.com/HafisYulianto)**
- **[Resiana Pahleppi](https://github.com/ResianaPahleppi)**

---

*© 2026 AeroSuoh — Tim HMJTI POLINELA. All Rights Reserved.*