"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as Lucide from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabase";
import Image from "next/image";

const fallbackItems = [
  {
    id: "1",
    icon_name: "BookOpen",
    icon_color: "red",
    title_id: "Sejarah Gempa 1933",
    title_en: "1933 Earthquake",
    content_id: "Lembah Suoh lahir dari tragedi. Pada 25 Juni 1933, gempa tektonik berkekuatan 7.5 SR mengguncang Liwa, membuka celah magma dan menciptakan letusan freatik dahsyat yang melahirkan danau-danau panas ini.",
    content_en: "Suoh Valley was born from tragedy. On June 25, 1933, a 7.5 SR earthquake struck Liwa, opening a magma vent and triggering massive phreatic eruptions that formed these thermal lakes.",
    image_url: null
  },
  {
    id: "2",
    icon_name: "Flame",
    icon_color: "amber",
    title_id: "Legenda Ular Naga",
    title_en: "The Dragon Myth",
    content_id: "Masyarakat lokal percaya bahwa letupan uap panas dan suara gemuruh dari perut bumi Suoh berasal dari pergerakan Naga raksasa penjaga mata air yang tertidur di bawah tanah.",
    content_en: "Locals believe the hissing steam and subterranean rumblings of Suoh originate from a giant sleeping dragon that guards the spring.",
    image_url: null
  },
  {
    id: "3",
    icon_name: "Leaf",
    icon_color: "emerald",
    title_id: "Ekosistem Ekstrem",
    title_en: "Extreme Ecosystem",
    content_id: "Meski memiliki tingkat keasaman (pH) dan suhu ekstrem, kawasan ini menjadi rumah bagi anggrek langka dan burung liar endemik Sumatera yang beradaptasi sempurna dengan lingkungan sulfurnya.",
    content_en: "Despite the extreme acidity (pH) and temperatures, this area is home to rare orchids and wild Sumatran birds that have perfectly adapted to the sulfurous environment.",
    image_url: null
  }
];

export default function Encyclopedia() {
  const { t, lang } = useLanguage();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from("encyclopedia_items")
          .select("*")
          .order("sort_order", { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) {
          setItems(data);
        } else {
          setItems(fallbackItems);
        }
      } catch (err) {
        console.error("Gagal memuat ensiklopedia:", err);
        setItems(fallbackItems);
      }
    };
    fetchItems();
  }, []);

  const getIcon = (name: string, color: string) => {
    const IconComponent = (Lucide as any)[name] || Lucide.BookOpen;
    
    let colorClass = "text-red-600 bg-red-100";
    if (color === "amber") colorClass = "text-amber-600 bg-amber-100";
    if (color === "emerald") colorClass = "text-emerald-600 bg-emerald-100";
    
    return (
      <div className={`w-14 h-14 ${colorClass.split(' ')[1]} ${colorClass.split(' ')[0]} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <IconComponent size={28} />
      </div>
    );
  };

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
          {items.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all group flex flex-col justify-between"
            >
              <div>
                {item.image_url ? (
                  <div className="w-full h-40 relative rounded-2xl overflow-hidden mb-6 group-hover:scale-[1.02] transition-transform">
                    <Image 
                      src={item.image_url} 
                      alt={lang === "ID" ? item.title_id : item.title_en}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  getIcon(item.icon_name, item.icon_color)
                )}
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  {lang === "ID" ? item.title_id : item.title_en}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {lang === "ID" ? item.content_id : item.content_en}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
