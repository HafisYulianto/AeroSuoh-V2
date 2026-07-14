"use client";

import { Target, Leaf, Users, Globe2, Info } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200 print:hidden relative overflow-hidden" id="about">
      {/* Dekorasi Latar */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-bl-full -z-10 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-100/50 rounded-tr-full -z-10 blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          
          {/* Bagian Kiri: Narasi Latar Belakang (Ide Anda) */}
          <div className="lg:w-1/2 space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold tracking-widest uppercase border border-emerald-200 shadow-sm">
              <Target size={16} /> {t("about_badge")}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {t("about_title")}
            </h2>
            <div className="space-y-4 text-slate-600 text-lg leading-relaxed text-justify relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-amber-400 rounded-full"></div>
              <p>{t("about_desc_1")}</p>
              <p>{t("about_desc_2")}</p>
            </div>

            <div className="pt-2">
              <a 
                href="#logo-philosophy" 
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold transition-all duration-300 group/btn"
              >
                <span>{t("about_btn_logo" as any)}</span>
                <span className="transition-transform duration-300 group-hover/btn:translate-x-1.5">→</span>
              </a>
            </div>
          </div>

          {/* Bagian Kanan: Kartu SDGs */}
          <div className="lg:w-1/2 w-full">
            <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl border border-slate-100 relative group transition-all duration-500 hover:shadow-emerald-900/10 hover:border-emerald-100">
              
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                <div className="p-3 bg-emerald-950 rounded-xl text-emerald-400 shadow-inner">
                  <Globe2 size={28} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
                  {t("sdg_title")}
                </h3>
              </div>

              <div className="space-y-8">
                {/* SDG 8 & 11 */}
                <div className="flex gap-5 items-start">
                  <div className="p-4 bg-linear-to-br from-blue-50 to-blue-100 text-blue-600 rounded-2xl shadow-sm border border-blue-200/50 shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Users size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{t("sdg1_title")}</h4>
                    <p className="text-slate-600 leading-relaxed">
                      {t("sdg1_desc")}
                    </p>
                  </div>
                </div>

                {/* SDG 13 & 15 */}
                <div className="flex gap-5 items-start">
                  <div className="p-4 bg-linear-to-br from-emerald-50 to-emerald-100 text-emerald-600 rounded-2xl shadow-sm border border-emerald-200/50 shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Leaf size={28} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{t("sdg2_title")}</h4>
                    <p className="text-slate-600 leading-relaxed">
                      {t("sdg2_desc")}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}