"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Download } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function LogoPhilosophy() {
  const { t } = useLanguage();

  return (
    <section id="logo-philosophy" className="py-16 bg-[#013220] border-b border-emerald-950 print:hidden relative overflow-hidden flex flex-col items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
        {/* Container dengan Rasio 16:9 (Landscape) setara 1920x1080 pada layar lebar */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-[1920px] aspect-video bg-white rounded-3xl shadow-xl border border-slate-200 mx-auto overflow-hidden relative group cursor-pointer"
        >
          {/* Menampilkan foto filosofi logo dengan hover zoom effect */}
          <Image 
            src="/images/filosofi-logo.png"
            alt="Filosofi Logo AeroSuoh"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </motion.div>

        {/* Tombol Unduh Logo Resmi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <a 
            href="/logo-aerosuoh2.png" 
            download="AeroSuoh-Official-Logo.png"
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full transition-all duration-300 shadow-lg shadow-emerald-950/80 active:scale-95 group/dl border border-emerald-500/50"
          >
            <Download size={18} className="group-hover/dl:animate-bounce" />
            <span>{t("logo_btn_download" as any)}</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
