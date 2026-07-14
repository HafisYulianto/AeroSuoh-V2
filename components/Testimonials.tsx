"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Testimonials() {
  const { t } = useLanguage();

  const reviews = [
    {
      name: t("testi_1_name" as any),
      role: t("testi_1_role" as any),
      text: t("testi_1_text" as any),
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi&backgroundColor=059669",
    },
    {
      name: t("testi_2_name" as any),
      role: t("testi_2_role" as any),
      text: t("testi_2_text" as any),
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=0284c7",
    },
    {
      name: t("testi_3_name" as any),
      role: t("testi_3_role" as any),
      text: t("testi_3_text" as any),
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rio&backgroundColor=ea580c",
    },
  ];

  return (
    <section className="py-24 px-4 bg-slate-50 relative overflow-hidden print:hidden" id="testimonials">
      {/* Decorative bg */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-50/50 to-transparent -z-10"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-800 text-sm font-bold tracking-widest uppercase rounded-full mb-4 shadow-sm"
          >
            {t("testi_badge" as any)}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight"
          >
            {t("testi_title" as any)}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            {t("testi_desc" as any)}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 relative group hover:-translate-y-2 transition-all duration-300"
            >
              <div className="absolute -top-5 -right-5 opacity-5 text-emerald-600 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500">
                <Quote size={120} />
              </div>
              
              <div className="flex gap-1 text-amber-400 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={18} fill="currentColor" />
                ))}
              </div>
              
              <p className="text-slate-700 leading-relaxed mb-8 relative z-10 italic">
                "{review.text}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <img 
                  src={review.avatar} 
                  alt={review.name} 
                  className="w-12 h-12 rounded-full border-2 border-emerald-100 shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-slate-900">{review.name}</h4>
                  <p className="text-xs text-emerald-600 font-medium">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
