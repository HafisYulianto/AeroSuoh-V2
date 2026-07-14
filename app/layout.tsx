import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { LanguageProvider } from "../context/LanguageContext";
import Navbar from "../components/Navbar";
import SafetyAlert from "../components/SafetyAlert";
import BackToTop from "../components/BackToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// === REVISI: METADATA SEO TINGKAT LANJUT ===
export const metadata: Metadata = {
  // === TAMBAHAN WAJIB: Basis URL agar gambar terbaca oleh WhatsApp ===
  metadataBase: new URL("https://aerosuoh.vercel.app"), 
  
  title: "AeroSuoh | Geothermal Eco-Monitor",
  description: "Platform pariwisata pintar dan dasbor pemantauan geotermal masa depan untuk kawasan Suoh, Lampung Barat.",
  keywords: ["AeroSuoh", "Suoh", "Lampung Barat", "Geothermal", "Ecotourism", "Danau Asam", "Teknokrat"],
  authors: [{ name: "Hafis Yulianto" }],
  icons: {
    icon: "/logo-aerosuoh2.png", 
  },
  openGraph: {
    title: "AeroSuoh | Geothermal Eco-Monitor",
    description: "Platform pariwisata pintar dan dasbor pemantauan geotermal masa depan untuk kawasan Suoh, Lampung Barat.",
    url: "https://aerosuoh.vercel.app", 
    siteName: "AeroSuoh",
    images: [
      {
        url: "/hero-suoh2.png", // Next.js otomatis menjadikannya absolut berkat metadataBase di atas
        width: 1200,
        height: 630,
        alt: "AeroSuoh Dashboard Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AeroSuoh | Geothermal Eco-Monitor",
    description: "Platform pariwisata pintar dan dasbor pemantauan geotermal masa depan untuk kawasan Suoh, Lampung Barat.",
    images: ["/hero-suoh2.png"],
  },
};
// ======================================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[999] focus:bg-emerald-600 focus:text-white focus:px-6 focus:py-3 focus:rounded-xl focus:font-bold focus:shadow-2xl focus:outline-none"
          >
            Lompat ke Konten Utama / Skip to Content
          </a>
          <SafetyAlert />
          <Navbar />
          <div id="main-content">
            {children}
          </div>
          <BackToTop />
        </LanguageProvider>
      </body>
    </html>
  );
}