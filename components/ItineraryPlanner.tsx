"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Coffee, Camera, Tent, CarFront } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

type Duration = "half" | "one" | "two";

export default function ItineraryPlanner() {
  const { t } = useLanguage();
  const [duration, setDuration] = useState<Duration>("half");
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = () => {
    setIsGenerated(false);
    setTimeout(() => setIsGenerated(true), 300); // Simulate loading
  };

  return (
    <section className="py-24 px-4 bg-white relative print:hidden">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-800 text-sm font-bold tracking-widest uppercase rounded-full mb-4 shadow-sm"
          >
            {t("itinerary_badge" as any)}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight"
          >
            {t("itinerary_title" as any)}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            {t("itinerary_desc" as any)}
          </motion.p>
        </div>

        {/* Selection Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-slate-50 p-4 md:p-6 rounded-3xl border border-slate-200 shadow-md flex flex-col md:flex-row gap-4 items-center justify-center mb-12"
        >
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <button 
              onClick={() => setDuration("half")}
              className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${duration === "half" ? "bg-emerald-600 text-white shadow-lg" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"}`}
            >
              {t("itinerary_half_day" as any)}
            </button>
            <button 
              onClick={() => setDuration("one")}
              className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${duration === "one" ? "bg-emerald-600 text-white shadow-lg" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"}`}
            >
              {t("itinerary_one_day" as any)}
            </button>
            <button 
              onClick={() => setDuration("two")}
              className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${duration === "two" ? "bg-emerald-600 text-white shadow-lg" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"}`}
            >
              {t("itinerary_two_days" as any)}
            </button>
          </div>
          <button 
            onClick={handleGenerate}
            className="w-full md:w-auto px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors shadow-lg"
          >
            {t("itinerary_btn" as any)}
          </button>
        </motion.div>

        {/* Timeline Result */}
        <AnimatePresence mode="wait">
          {isGenerated && (
            <motion.div 
              key={duration}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative pl-4 md:pl-8 border-l-4 border-emerald-100 space-y-8"
            >
              {/* Timeline Item 1 */}
              <div className="relative">
                <div className="absolute -left-[27px] md:-left-[43px] top-1 w-10 h-10 bg-white rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-600 z-10">
                  <Camera size={18} />
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm ml-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold mb-2">
                    <Clock size={16} /> <span>07:00 - 09:00</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">{t("itinerary_timeline_0700" as any)}</h4>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative">
                <div className="absolute -left-[27px] md:-left-[43px] top-1 w-10 h-10 bg-white rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-600 z-10">
                  <MapPin size={18} />
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm ml-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold mb-2">
                    <Clock size={16} /> <span>09:00 - 11:00</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">{t("itinerary_timeline_0900" as any)}</h4>
                </div>
              </div>

              {/* Timeline Item 3 (Only 1 Day or 2 Days) */}
              {(duration === "one" || duration === "two") && (
                <div className="relative">
                  <div className="absolute -left-[27px] md:-left-[43px] top-1 w-10 h-10 bg-white rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-600 z-10">
                    <CarFront size={18} />
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm ml-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold mb-2">
                      <Clock size={16} /> <span>11:00 - 13:00</span>
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">{t("itinerary_timeline_1100" as any)}</h4>
                  </div>
                </div>
              )}

              {/* Timeline Item 4 (All) */}
              <div className="relative">
                <div className="absolute -left-[27px] md:-left-[43px] top-1 w-10 h-10 bg-white rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-600 z-10">
                  <Coffee size={18} />
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm ml-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold mb-2">
                    <Clock size={16} /> <span>13:00 - 15:00</span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">{t("itinerary_timeline_1300" as any)}</h4>
                </div>
              </div>

              {/* End of Half Day */}
              {duration === "half" && (
                <div className="relative">
                  <div className="absolute -left-[27px] md:-left-[43px] top-1 w-10 h-10 bg-slate-100 rounded-full border-4 border-slate-300 flex items-center justify-center text-slate-500 z-10">
                    <CarFront size={18} />
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 ml-4">
                    <h4 className="text-lg font-bold text-slate-600 mb-2">{t("itinerary_timeline_1500" as any)}</h4>
                  </div>
                </div>
              )}

              {/* Timeline Item 5 (1 Day or 2 Days) */}
              {(duration === "one" || duration === "two") && (
                <div className="relative">
                  <div className="absolute -left-[27px] md:-left-[43px] top-1 w-10 h-10 bg-white rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-600 z-10">
                    <Camera size={18} />
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm ml-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold mb-2">
                      <Clock size={16} /> <span>15:00 - 16:00</span>
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">{t("itinerary_timeline_1500" as any)}</h4>
                  </div>
                </div>
              )}

              {/* End of 1 Day & Continuation of 2 Days */}
              {duration === "two" && (
                <>
                  <div className="relative">
                    <div className="absolute -left-[27px] md:-left-[43px] top-1 w-10 h-10 bg-white rounded-full border-4 border-amber-500 flex items-center justify-center text-amber-600 z-10">
                      <Tent size={18} />
                    </div>
                    <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm ml-4">
                      <div className="flex items-center gap-2 text-amber-600 font-bold mb-2">
                        <Clock size={16} /> <span>16:00 - Malam</span>
                      </div>
                      <h4 className="text-xl font-bold text-amber-900 mb-2">{t("itinerary_timeline_1600" as any)}</h4>
                      <p className="text-amber-800">{t("itinerary_timeline_1900" as any)}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[27px] md:-left-[43px] top-1 w-10 h-10 bg-emerald-100 rounded-full border-4 border-emerald-300 flex items-center justify-center text-emerald-600 z-10">
                      <MapPin size={18} />
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm ml-4">
                      <div className="flex items-center gap-2 text-emerald-700 font-bold mb-2">
                        <span>{t("itinerary_day2_label" as any)}</span>
                      </div>
                      <h4 className="text-xl font-bold text-emerald-900 mb-2">{t("itinerary_timeline_day2" as any)}</h4>
                    </div>
                  </div>
                </>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
