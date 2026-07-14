"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Camera, MapPin, X, BookOpen, ScrollText, Sparkles, Info as InfoIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const photosData = [
  { 
    id: 1, 
    src: "/images/danau-asam-hd.png", 
    titleKey: "loc1_title", 
    typeKey: "loc1_type",
    descKey: "loc1_desc",
    historyKey: "loc1_hist",
    mitosKey: "loc1_mitos", // Tambahan kunci untuk tab mitos
    lng: 104.27882688457521, lat: -5.238698319624318 
  },
  { 
    id: 2, 
    src: "/images/danau-lebar-hd.png", 
    titleKey: "loc2_title", 
    typeKey: "loc2_type",
    descKey: "loc2_desc",
    historyKey: "loc2_hist",
    mitosKey: "loc2_mitos",
    lng: 104.274690, lat: -5.251999 
  },
  { 
    id: 3, 
    src: "/images/danau-minyak-hd.png", 
    titleKey: "loc3_title", 
    typeKey: "loc3_type",
    descKey: "loc3_desc",
    historyKey: "loc3_hist",
    mitosKey: "loc3_mitos",
    lng: 104.266782, lat: -5.246098 
  },
  { 
    id: 4, 
    src: "/images/pasir-kuning-hd.png", 
    titleKey: "loc4_title", 
    typeKey: "loc4_type",
    descKey: "loc4_desc",
    historyKey: "loc4_hist",
    mitosKey: "loc4_mitos",
    lng: 104.26727197333017, lat: -5.236056616428336 
  },
  { 
    id: 5, 
    src: "/images/kawah-nirwana-hd.png", 
    titleKey: "loc5_title", 
    typeKey: "loc5_type",
    descKey: "loc5_desc",
    historyKey: "loc5_hist",
    mitosKey: "loc5_mitos",
    lng: 104.25928872886739, lat: -5.237142698064301 
  },
  { 
    id: 6, 
    src: "/images/kawah-keramikan-hd.png", 
    titleKey: "loc6_title", 
    typeKey: "loc6_type",
    descKey: "loc6_desc",
    historyKey: "loc6_hist",
    mitosKey: "loc6_mitos",
    lng: 104.2635823976347, lat: -5.239053909820962 
  },
];

export default function PhotoSlider() {
  const { t, lang } = useLanguage();
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<typeof photosData[0] | null>(null);
  
  // === STATE BARU: Mengontrol Tab Aktif (info | sejarah | mitos) ===
  const [activeTab, setActiveTab] = useState<"info" | "sejarah" | "mitos">("info");

  // Reset tab ke "info" setiap kali buka foto baru
  useEffect(() => {
    if (selectedPhoto) {
      document.body.style.overflow = "hidden";
      setActiveTab("info"); 
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedPhoto]);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 bg-[#012518] print:hidden" id="gallery"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Judul Bagian */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-900 rounded-lg text-emerald-400 border border-emerald-800 shadow-inner">
              <Camera size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">{t("gal_title")}</h2>
              <p className="text-emerald-100/70 mt-1 font-medium">{t("gal_subtitle")}</p>
            </div>
          </div>
          
          <div className="hidden md:flex gap-2">
            <button 
              onClick={() => scroll("left")}
              aria-label={lang === "ID" ? "Geser galeri ke kiri" : "Slide gallery left"}
              className="p-3 rounded-full border border-emerald-800 bg-emerald-950 text-emerald-100 hover:text-white hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-900/50 active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scroll("right")}
              aria-label={lang === "ID" ? "Geser galeri ke kanan" : "Slide gallery right"}
              className="p-3 rounded-full border border-emerald-800 bg-emerald-950 text-emerald-100 hover:text-white hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-900/50 active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        {/* Area Slider */}
        <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
          <div 
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-12 pt-4 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {photosData.map((photo) => (
              <div 
                key={photo.id} 
                onClick={() => setSelectedPhoto(photo)}
                className="min-w-[85vw] sm:min-w-[400px] snap-center relative rounded-3xl overflow-hidden shadow-xl group/card border border-emerald-900/50 bg-slate-900 cursor-pointer transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-emerald-500/20 hover:border-emerald-500/50"
              >
                <div className="aspect-[4/3] w-full bg-slate-800 overflow-hidden relative">
                  <Image 
                    src={photo.src} 
                    alt={t(photo.titleKey as any)} 
                    fill
                    sizes="(max-width: 640px) 85vw, 400px"
                    className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-110" 
                    onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent opacity-90 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                  <div className="transform translate-y-6 group-hover/card:translate-y-0 transition-transform duration-500 ease-out">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold bg-emerald-500/80 backdrop-blur-md text-white rounded-full shadow-sm">
                        {t(photo.typeKey as any)}
                      </span>
                    </div>
                    <h3 className="text-white text-2xl font-bold mb-2 flex items-center gap-2 drop-shadow-lg">
                      {t(photo.titleKey as any)}
                    </h3>
                    <p className="text-slate-300 text-sm line-clamp-2 leading-relaxed opacity-80 group-hover/card:opacity-100 transition-opacity duration-500 mb-5">
                      {t(photo.descKey as any)}
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold opacity-0 group-hover/card:opacity-100 transform translate-y-4 group-hover/card:translate-y-0 transition-all duration-500 shadow-lg">
                      <BookOpen size={14} className="text-emerald-400" /> 
                      {t("gal_click_hint")} 
                      <ChevronRight size={14} className="text-emerald-400 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === MODAL POP-UP (DENGAN SISTEM MULTI-TAB) === */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setSelectedPhoto(null)} 
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-[#012518] border border-emerald-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
              onClick={(e) => e.stopPropagation()} 
            >
              <button 
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-slate-900/50 hover:bg-emerald-600 text-white rounded-full transition-colors backdrop-blur-md shadow-lg"
              >
                <X size={20} />
              </button>

              <div className="w-full md:w-1/2 h-48 md:h-auto min-h-[200px] relative bg-slate-800">
                <Image 
                  src={selectedPhoto.src} 
                  alt={t(selectedPhoto.titleKey as any)} 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#012518] to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#012518] opacity-80 md:opacity-100"></div>
              </div>

              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto custom-scrollbar relative z-10">
                
                {/* Header Info (Judul & Tombol Maps) */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1.5 text-xs uppercase tracking-widest font-bold bg-emerald-600/90 text-white rounded-full shadow-sm">
                      {t(selectedPhoto.typeKey as any)}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4 leading-tight">
                    {t(selectedPhoto.titleKey as any)}
                  </h3>
                  <a 
                    href={`https://maps.google.com/?q=${selectedPhoto.lat},${selectedPhoto.lng}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 bg-emerald-950 border border-emerald-800/80 rounded-full px-4 py-2 hover:bg-emerald-800 transition-colors shadow-sm"
                  >
                    <MapPin size={16} className="text-emerald-400" />
                    <span className="text-emerald-100 text-xs font-bold uppercase tracking-wider">{t("gal_open_map")}</span>
                  </a>
                </div>
                
                {/* === NAVIGASI TAB === */}
                <div className="flex gap-1 mb-6 border-b border-emerald-800/50 pb-px overflow-x-auto [&::-webkit-scrollbar]:hidden">
                  <button 
                    onClick={() => setActiveTab("info")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all whitespace-nowrap ${
                      activeTab === "info" 
                      ? "bg-emerald-900/60 text-emerald-400 border-b-2 border-emerald-400" 
                      : "text-emerald-100/50 hover:text-emerald-200 hover:bg-emerald-900/30"
                    }`}
                  >
                    <InfoIcon size={16} /> {lang === "ID" ? "Info Singkat" : "Brief Info"}
                  </button>
                  <button 
                    onClick={() => setActiveTab("sejarah")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all whitespace-nowrap ${
                      activeTab === "sejarah" 
                      ? "bg-emerald-900/60 text-emerald-400 border-b-2 border-emerald-400" 
                      : "text-emerald-100/50 hover:text-emerald-200 hover:bg-emerald-900/30"
                    }`}
                  >
                    <ScrollText size={16} /> {lang === "ID" ? "Sejarah Lengkap" : "Full History"}
                  </button>
                  <button 
                    onClick={() => setActiveTab("mitos")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all whitespace-nowrap ${
                      activeTab === "mitos" 
                      ? "bg-emerald-900/60 text-emerald-400 border-b-2 border-emerald-400" 
                      : "text-emerald-100/50 hover:text-emerald-200 hover:bg-emerald-900/30"
                    }`}
                  >
                    <Sparkles size={16} /> {lang === "ID" ? "Mitos Lokal" : "Local Myth"}
                  </button>
                </div>

                {/* === KONTEN TAB (Dinamis sesuai yang diklik) === */}
                <div className="flex-1">
                  <AnimatePresence mode="wait">
                    {activeTab === "info" && (
                      <motion.div
                        key="info"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                      >
                        <p className="text-emerald-100/90 text-sm leading-relaxed text-justify font-medium">
                          {t(selectedPhoto.descKey as any)}
                        </p>
                      </motion.div>
                    )}

                    {activeTab === "sejarah" && (
                      <motion.div
                        key="sejarah"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                      >
                        <p className="text-slate-300 text-sm leading-relaxed text-justify bg-emerald-950/40 p-5 rounded-2xl border border-emerald-900/50 shadow-inner">
                          {t(selectedPhoto.historyKey as any)}
                        </p>
                      </motion.div>
                    )}

                    {activeTab === "mitos" && (
                      <motion.div
                        key="mitos"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                      >
                        {/* Jika mitosKey belum ada terjemahannya, kita tampilkan fallback */}
                        <p className="text-amber-200/90 text-sm leading-relaxed text-justify bg-amber-950/20 p-5 rounded-2xl border border-amber-900/30 shadow-inner">
                          {t(selectedPhoto.mitosKey as any) || (lang === "ID" ? "Mitos untuk lokasi ini sedang dihimpun dari tokoh masyarakat setempat." : "Myths for this location are currently being gathered from local elders.")}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}