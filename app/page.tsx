"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import About from "../components/About";
import LogoPhilosophy from "../components/LogoPhilosophy";
import Dashboard from "../components/Dashboard";
import AerialExplorer from "../components/AerialExplorer"; 
import Footer from "../components/Footer"; 
import PhotoSlider from "../components/PhotoSlider";
import SafetyGuide from "../components/SafetyGuide";
import VirtualTour from "../components/VirtualTour";
import ItineraryPlanner from "../components/ItineraryPlanner";
import Encyclopedia from "../components/Encyclopedia";
import Testimonials from "../components/Testimonials";
import RouteAccess from "../components/RouteAccess";
import GeothermalParticles from "../components/GeothermalParticles";
import SmartAssistant from "../components/SmartAssistant";

// === TAMBAHAN: Import context bahasa global kita ===
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  // === Panggil kekuatan Global State dan kamus terjemahan (fungsi 't') ===
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 relative overflow-x-hidden print:bg-white">
      
      {/* Hero Section */}
      <div 
        id="home" 
        className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center pt-16 print:hidden overflow-hidden isolate"
      >
        {/* Hero Background Image (Optimized by Next.js) — Layer 0 */}
        <Image 
          src="/hero-suoh2.png" 
          alt="Kawasan Geotermal Suoh" 
          fill 
          priority 
          sizes="100vw"
          className="object-cover object-center z-0" 
        />
        
        {/* Overlay Gelap — Layer 1 */}
        <div className="absolute inset-0 bg-slate-900/70 z-[1]"></div>
        
        {/* === EFEK UAP PANAS BUMI — Layer 2 === */}
        <div className="absolute inset-0 z-[2]"> 
          <GeothermalParticles />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10" 
        >
          {/* === TEKS DINAMIS MENGGUNAKAN KAMUS TERJEMAHAN === */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-white drop-shadow-md">
            {t("hero_title_1")} <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-amber-400">
              {t("hero_title_2")}
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="relative z-10" 
        >
          {/* === TEKS DINAMIS MENGGUNAKAN KAMUS TERJEMAHAN === */}
          <p className="max-w-2xl text-lg md:text-xl text-slate-200 mb-10 drop-shadow">
            {t("hero_desc")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="relative z-10 flex flex-wrap justify-center gap-4" 
        >
          {/* === TEKS DINAMIS MENGGUNAKAN KAMUS TERJEMAHAN === */}
          <a href="#explorer" className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full shadow-lg shadow-emerald-900/50 transition-all border border-emerald-500">
            {t("hero_btn_1")}
          </a>
          <a href="#dashboard" className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold rounded-full shadow-sm transition-all cursor-pointer">
            {t("hero_btn_2")}
          </a>
        </motion.div>
      </div>

      {/* === KOMPONEN BARU: TENTANG KAMI & SDGs === */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 print:hidden"
      >
        <About />
      </motion.div>

      {/* === TAMPILAN FILOSOFI LOGO (16:9 Landscape) === */}
      <LogoPhilosophy />

      {/* Animasi Scroll Reveal untuk Slider Foto */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 print:hidden"
      >
        <PhotoSlider />
      </motion.div>

      {/* Animasi Scroll Reveal untuk Panduan Keselamatan */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 print:hidden"
      >
        <SafetyGuide />
      </motion.div>

      {/* Animasi Scroll Reveal untuk Peta Interaktif */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 bg-slate-100 border-b border-slate-200 shadow-inner print:hidden"
      >
        <AerialExplorer />
      </motion.div>

      {/* === FASE 2: VIRTUAL TOUR & ENSIKLOPEDIA & ITINERARY === */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 bg-slate-900"
      >
        <VirtualTour />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 bg-white"
      >
        <ItineraryPlanner />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 bg-slate-50"
      >
        <Encyclopedia />
      </motion.div>

      {/* Animasi Scroll Reveal untuk Dasbor Sensor */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 bg-slate-50 print:bg-white print:m-0 print:p-0"
      >
        <Dashboard />
      </motion.div>

      {/* Rute Akses */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 bg-white"
      >
        <RouteAccess />
      </motion.div>

      {/* Testimoni Pengunjung */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 bg-slate-50"
      >
        <Testimonials />
      </motion.div>

      <Footer />

      {/* === SENJATA RAHASIA #2: SMART ASSISTANT (TICKET & CHATBOT) === */}
      <SmartAssistant />

    </main>
  );
}