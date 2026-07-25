"use client";

import { useState, useEffect } from "react";
import * as Lucide from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabase";
import Image from "next/image";

const fallbackRules = [
  { 
    id: "1", 
    icon_name: "Wind", 
    title_id: "Wajib Masker Gas", 
    title_en: "Gas Mask Required", 
    desc_id: "Beberapa area kawah menghasilkan gas sulfur pekat. Gunakan masker respirator khusus untuk pernapasan.",
    desc_en: "Some crater areas produce concentrated sulfur gas. Use a specialized respirator mask for breathing.",
    image_url: null
  },
  { 
    id: "2", 
    icon_name: "Footprints", 
    title_id: "Sepatu Trekking Tertutup", 
    title_en: "Closed Trekking Shoes", 
    desc_id: "Suhu permukaan tanah (seperti di Keramikan) bisa sangat panas. Dilarang keras memakai sandal.",
    desc_en: "Ground surface temperatures (like in Keramikan) can be extremely hot. Wearing sandals is strictly prohibited.",
    image_url: null
  },
  { 
    id: "3", 
    icon_name: "Users", 
    title_id: "Didampingi Pemandu", 
    title_en: "Accompanied by a Guide", 
    desc_id: "Jalur dan geotermal rawan ambles jika tidak hafal medan. Selalu patuhi arahan pemandu lokal.",
    desc_en: "Ecological and geothermal paths are prone to caving in if you don't know the terrain. Always follow local guide instructions.",
    image_url: null
  },
  { 
    id: "4", 
    icon_name: "ShieldAlert", 
    title_id: "Patuhi Zona Aman", 
    title_en: "Obey Safe Zones", 
    desc_id: "Jangan pernah melewati batas rambu peringatan zona merah atau mendekati pusat letupan lumpur.",
    desc_en: "Never cross the red zone warning signs or approach the center of mud eruptions.",
    image_url: null
  },
];

export default function SafetyGuide() {
  const { t, lang } = useLanguage();
  const [rules, setRules] = useState<any[]>([]);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const { data, error } = await supabase
          .from("safety_rules")
          .select("*")
          .order("sort_order", { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) {
          setRules(data);
        } else {
          setRules(fallbackRules);
        }
      } catch (err) {
        console.error("Gagal memuat safety rules:", err);
        setRules(fallbackRules);
      }
    };
    fetchRules();
  }, []);

  const getIcon = (name: string) => {
    const IconComponent = (Lucide as any)[name] || Lucide.ShieldAlert;
    return <IconComponent size={28} className="text-amber-500" />;
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200 print:hidden" id="safety">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-bold tracking-wide uppercase mb-4 border border-amber-200 animate-pulse">
            <Lucide.ShieldAlert size={16} /> {t("safe_badge")}
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t("safe_title")}
          </h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            {t("safe_desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rules.map((rule) => (
            <div 
              key={rule.id} 
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-amber-300 hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform relative overflow-hidden">
                  {rule.image_url ? (
                    <div className="relative w-full h-full">
                      <Image 
                        src={rule.image_url} 
                        alt={lang === "ID" ? rule.title_id : rule.title_en} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    getIcon(rule.icon_name)
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {lang === "ID" ? rule.title_id : rule.title_en}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {lang === "ID" ? rule.desc_id : rule.desc_en}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}