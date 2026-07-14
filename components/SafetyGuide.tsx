"use client";

import { ShieldAlert, Footprints, Wind, Users } from "lucide-react";
// === TAMBAHAN: Import context bahasa global ===
import { useLanguage } from "../context/LanguageContext";

// Kita ganti teks asli dengan Key (Kunci Kamus) agar bisa diterjemahkan
const rulesData = [
  { 
    id: 1, 
    icon: <Wind size={28} className="text-amber-500" />, 
    titleKey: "safe_rule1_title", 
    descKey: "safe_rule1_desc" 
  },
  { 
    id: 2, 
    icon: <Footprints size={28} className="text-amber-500" />, 
    titleKey: "safe_rule2_title", 
    descKey: "safe_rule2_desc" 
  },
  { 
    id: 3, 
    icon: <Users size={28} className="text-amber-500" />, 
    titleKey: "safe_rule3_title", 
    descKey: "safe_rule3_desc" 
  },
  { 
    id: 4, 
    icon: <ShieldAlert size={28} className="text-amber-500" />, 
    titleKey: "safe_rule4_title", 
    descKey: "safe_rule4_desc" 
  },
];

export default function SafetyGuide() {
  // === Panggil kekuatan Global State ===
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-white border-b border-slate-200 print:hidden" id="safety">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          {/* === REVISI: Menambahkan animate-pulse agar seluruh lencana berkedip redup-terang === */}
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-bold tracking-wide uppercase mb-4 border border-amber-200 animate-pulse">
            <ShieldAlert size={16} /> {t("safe_badge")}
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t("safe_title")}
          </h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            {t("safe_desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rulesData.map((rule) => (
            <div 
              key={rule.id} 
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-amber-300 hover:shadow-lg transition-all group"
            >
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                {rule.icon}
              </div>
              {/* === Teks Dinamis === */}
              <h3 className="text-lg font-bold text-slate-900 mb-2">{t(rule.titleKey as any)}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {t(rule.descKey as any)}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}