"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import * as Lucide from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabase";

const fallbackRoutes = [
  {
    id: "1",
    icon_name: "Map",
    icon_color: "emerald",
    title_id: "Jalur Liwa (Utara)",
    title_en: "Liwa Route (North)",
    desc_id: "Via Sekincau - Batu Brak. Jarak ±45 km (1.5 - 2 jam). Jalur ini sudah beraspal cukup mulus namun berkelok tajam melintasi perbukitan kopi.",
    desc_en: "Via Sekincau - Batu Brak. ±45 km (1.5 - 2 hours). The road is smoothly paved but has sharp bends across coffee hills."
  },
  {
    id: "2",
    icon_name: "Navigation",
    icon_color: "amber",
    title_id: "Jalur Tanggamus (Selatan)",
    title_en: "Tanggamus Route (South)",
    desc_id: "Via Wonosobo - Bandar Negeri Suoh (BNS). Jarak ±80 km (2.5 - 3 jam). Lebih direkomendasikan untuk kendaraan roda dua atau mobil gardan ganda (4x4).",
    desc_en: "Via Wonosobo - Bandar Negeri Suoh. ±80 km (2.5 - 3 hours). Highly recommended to use off-road motorcycles or 4x4 vehicles."
  }
];

export default function RouteAccess() {
  const { t, lang } = useLanguage();
  const [routes, setRoutes] = useState<any[]>([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const { data, error } = await supabase
          .from("routes")
          .select("*")
          .order("sort_order", { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) {
          setRoutes(data);
        } else {
          setRoutes(fallbackRoutes);
        }
      } catch (err) {
        console.error("Gagal memuat rute:", err);
        setRoutes(fallbackRoutes);
      }
    };
    fetchRoutes();
  }, []);

  const getIcon = (name: string, color: string) => {
    const IconComponent = (Lucide as any)[name] || Lucide.Map;
    const bgClass = color === "emerald" ? "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600" : "bg-amber-100 text-amber-600 group-hover:bg-amber-600";
    
    return (
      <div className={`w-14 h-14 ${bgClass} rounded-2xl flex items-center justify-center group-hover:text-white transition-colors`}>
        <IconComponent size={28} />
      </div>
    );
  };

  return (
    <section className="py-24 px-4 bg-white relative print:hidden" id="rute">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 text-sm font-bold tracking-widest uppercase rounded-full mb-4 shadow-sm"
          >
            {t("route_badge" as any)}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight"
          >
            {t("route_title" as any)}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            {t("route_desc" as any)}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {routes.map((route, index) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-slate-50 border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:border-emerald-200 transition-all group"
            >
              <div className="flex items-center gap-4 mb-6">
                {getIcon(route.icon_name, route.icon_color)}
                <h3 className="text-2xl font-bold text-slate-800">
                  {lang === "ID" ? route.title_id : route.title_en}
                </h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg">
                {lang === "ID" ? route.desc_id : route.desc_en}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="bg-emerald-900 text-emerald-50 rounded-2xl p-6 flex items-start sm:items-center gap-4 border border-emerald-700 shadow-lg"
        >
          <div className="p-3 bg-emerald-800/50 rounded-xl text-emerald-300 shrink-0">
            <Lucide.Car size={24} />
          </div>
          <p className="text-sm md:text-base font-medium">
            <span className="text-emerald-300 font-bold block sm:inline mb-1 sm:mb-0 mr-2">{t("route_vehicle_tip" as any)}</span>
            {t("route_note" as any)}
          </p>
        </motion.div>

      </div>
    </section>
  );
}
