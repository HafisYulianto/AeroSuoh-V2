"use client";

import { motion } from "framer-motion";
import { Map, Car, Navigation, ShieldAlert } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function RouteAccess() {
  const { t } = useLanguage();

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
          {/* Route 1: Liwa */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-slate-50 border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:border-emerald-200 transition-all group"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Map size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">{t("route_1_title" as any)}</h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-lg">
              {t("route_1_desc" as any)}
            </p>
          </motion.div>

          {/* Route 2: Tanggamus */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-slate-50 border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:border-amber-200 transition-all group"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Navigation size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">{t("route_2_title" as any)}</h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-lg">
              {t("route_2_desc" as any)}
            </p>
          </motion.div>
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
            <Car size={24} />
          </div>
          <p className="text-sm md:text-base font-medium">
            <span className="text-emerald-300 font-bold block sm:inline mb-1 sm:mb-0 mr-2">Tips Kendaraan:</span>
            {t("route_note" as any)}
          </p>
        </motion.div>

      </div>
    </section>
  );
}
