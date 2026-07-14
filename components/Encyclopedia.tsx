"use client";

import { motion } from "framer-motion";
import { BookOpen, Leaf, Flame } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Encyclopedia() {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-4 bg-slate-50 relative print:hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 text-sm font-bold tracking-widest uppercase rounded-full mb-4 shadow-sm"
          >
            {t("encyclopedia_badge" as any)}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight"
          >
            {t("encyclopedia_title" as any)}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            {t("encyclopedia_desc" as any)}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: History */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all group"
          >
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">{t("encyclopedia_tab_history" as any)}</h3>
            <p className="text-slate-600 leading-relaxed">
              {t("encyclopedia_history_content" as any)}
            </p>
          </motion.div>

          {/* Card 2: Myth */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all group"
          >
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Flame size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">{t("encyclopedia_tab_myth" as any)}</h3>
            <p className="text-slate-600 leading-relaxed">
              {t("encyclopedia_myth_content" as any)}
            </p>
          </motion.div>

          {/* Card 3: Biology */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all group"
          >
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Leaf size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">{t("encyclopedia_tab_bio" as any)}</h3>
            <p className="text-slate-600 leading-relaxed">
              {t("encyclopedia_bio_content" as any)}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
