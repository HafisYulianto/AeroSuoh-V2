"use client";

import { motion } from "framer-motion";
import { Youtube } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function VirtualTour() {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-4 bg-slate-900 text-white relative overflow-hidden print:hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 50% 50%, #10b981 0%, transparent 50%)',
        backgroundSize: '100% 100%'
      }}></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-emerald-900/50 text-emerald-300 text-sm font-bold tracking-widest uppercase rounded-full mb-4 border border-emerald-700/50"
          >
            {t("virtual_badge" as any)}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight"
          >
            {t("virtual_title" as any)}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-300 max-w-2xl mx-auto"
          >
            {t("virtual_desc" as any)}
          </motion.p>
        </div>

        {/* YouTube Video Embed */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl bg-slate-800"
        >
          {/* Aspect Ratio Container (16:9) */}
          <div className="relative w-full pb-[56.25%] h-0">
            <iframe 
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/crFSZIN-FOw?autoplay=0&rel=0" 
              title="DRONE VIEW || SUOH - LAMPUNG BARAT" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>

        {/* Video Source/Credit */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-sm"
        >
          <Youtube size={18} className="text-red-500" />
          <span>{t("virtual_instruction" as any)}</span>
        </motion.div>

      </div>
    </section>
  );
}
