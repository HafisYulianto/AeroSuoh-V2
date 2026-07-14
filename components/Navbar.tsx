"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Map, Activity, Home, Camera, Globe, Info, Menu, X, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const { lang, toggleLang, t } = useLanguage();
  
  // === STATE BARU: Mengontrol menu HP terbuka atau tertutup ===
  const [isOpen, setIsOpen] = useState(false);

  // === STATE & LOGIKA AUDIO ===
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // === Volume diatur 40% agar elegan, tidak menutupi suara presentasi ===
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
    }
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#013220] shadow-lg print:hidden">
      
      {/* === FILE AUDIO TERSEMBUNYI === */}
      {/* Pastikan nama file audio Anda sesuai (contoh: ambient.mp3 atau bgm.mp3) */}
      <audio ref={audioRef} src="/suoh-ambient.mp3" loop />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center">
            <Image 
              src="/logo-aerosuoh2.png" 
              alt="Logo AeroSuoh" 
              width={132}
              height={132}
              className="h-[8.25rem] w-auto object-contain cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            />
          </div>
          
          {/* Menu Navigasi & Tombol Bahasa (DESKTOP) */}
          <div className="hidden lg:flex items-center gap-6 md:gap-8">
            <div className="flex space-x-8">
              <a href="#home" className="flex items-center gap-2 text-emerald-100 hover:text-white hover:scale-105 transition-all font-medium">
                <Home size={20} /> <span>{t("nav_home")}</span>
              </a>
              <a href="#about" className="flex items-center gap-2 text-emerald-100 hover:text-white hover:scale-105 transition-all font-medium">
                <Info size={20} /> <span>{t("nav_about")}</span>
              </a>
              <a href="#gallery" className="flex items-center gap-2 text-emerald-100 hover:text-white hover:scale-105 transition-all font-medium">
                <Camera size={20} /> <span>{t("nav_gallery")}</span>
              </a>
              <a href="#explorer" className="flex items-center gap-2 text-emerald-100 hover:text-white hover:scale-105 transition-all font-medium">
                <Map size={20} /> <span>{t("nav_map")}</span>
              </a>
              <a href="#dashboard" className="flex items-center gap-2 text-emerald-100 hover:text-white hover:scale-105 transition-all font-medium">
                <Activity size={20} /> <span>{t("nav_dash")}</span>
              </a>
            </div>

            <div className="h-8 w-px bg-emerald-800"></div>

            {/* === GRUP TOMBOL PENGATURAN KANAN (DESKTOP) === */}
            <div className="flex items-center gap-3">
              
              {/* === REVISI: TOGGLE SWITCH AUDIO VERTIKAL (Teks di bawah, tinggi sama dengan ID) === */}
              <div className="flex flex-col items-center justify-center bg-emerald-900/80 border border-emerald-700/50 px-3 py-2 rounded-2xl shadow-sm h-10 w-[70px]">
                <div className="flex items-center gap-1.5 cursor-pointer" onClick={toggleAudio}>
                  {isPlaying ? <Volume2 size={14} className="text-emerald-400" /> : <VolumeX size={14} className="text-slate-400" />}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleAudio(); }}
                    className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                      isPlaying ? 'bg-emerald-500' : 'bg-slate-600/50'
                    }`}
                  >
                    <span
                      className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform duration-300 ease-in-out shadow-sm`}
                      style={{ transform: isPlaying ? 'translateX(16px)' : 'translateX(2px)' }}
                    />
                  </button>
                </div>
                <span className="text-[9px] text-emerald-100 font-bold uppercase tracking-widest mt-0.5 cursor-pointer" onClick={toggleAudio}>Audio</span>
              </div>
              {/* ========================================= */}

              {/* Tombol Bahasa */}
              <button 
                onClick={toggleLang}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-emerald-900/80 border border-emerald-700/50 text-emerald-100 hover:text-white hover:bg-emerald-700 hover:border-emerald-500 hover:shadow-lg transition-all font-bold text-sm shadow-sm active:scale-95 h-10"
                title="Change Language"
              >
                <Globe size={18} className={lang === "EN" ? "text-amber-400" : "text-emerald-400"} />
                {lang}
              </button>
            </div>

          </div>

          {/* === TOMBOL HAMBURGER & PENGATURAN (KHUSUS MOBILE) === */}
          <div className="flex lg:hidden items-center gap-2">
            
            {/* === TOGGLE SWITCH AUDIO MOBILE === */}
            <div className="flex items-center gap-1.5 bg-emerald-900/80 border border-emerald-700/50 px-2.5 py-1 rounded-full">
              <span className="text-emerald-100 cursor-pointer" onClick={toggleAudio}>
                {isPlaying ? <Volume2 size={14} className="text-emerald-400" /> : <VolumeX size={14} className="text-slate-400" />}
              </span>
              <button
                onClick={toggleAudio}
                className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                  isPlaying ? 'bg-emerald-500' : 'bg-slate-600/50'
                }`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ease-in-out shadow-sm`}
                  style={{ transform: isPlaying ? 'translateX(14px)' : 'translateX(2px)' }}
                />
              </button>
            </div>

            {/* Tombol ganti bahasa (Mobile) */}
            <button 
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-700/50 text-emerald-100 hover:text-white font-bold text-xs"
            >
              <Globe size={14} className={lang === "EN" ? "text-amber-400" : "text-emerald-400"} />
              {lang}
            </button>

            {/* Hamburger Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-emerald-100 hover:text-white focus:outline-none p-1.5 ml-1"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

        </div>
      </div>

      {/* === PANEL MENU DROPDOWN (KHUSUS MOBILE) === */}
      {isOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-[#013220]/95 backdrop-blur-md border-t border-emerald-800 shadow-2xl">
          <div className="flex flex-col px-4 py-6 space-y-4">
            <a href="#home" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 text-emerald-100 hover:text-white hover:bg-emerald-800/50 rounded-xl transition-all font-medium">
              <Home size={20} /> <span>{t("nav_home")}</span>
            </a>
            <a href="#about" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 text-emerald-100 hover:text-white hover:bg-emerald-800/50 rounded-xl transition-all font-medium">
              <Info size={20} /> <span>{t("nav_about")}</span>
            </a>
            <a href="#gallery" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 text-emerald-100 hover:text-white hover:bg-emerald-800/50 rounded-xl transition-all font-medium">
              <Camera size={20} /> <span>{t("nav_gallery")}</span>
            </a>
            <a href="#explorer" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 text-emerald-100 hover:text-white hover:bg-emerald-800/50 rounded-xl transition-all font-medium">
              <Map size={20} /> <span>{t("nav_map")}</span>
            </a>
            <a href="#dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 text-emerald-100 hover:text-white hover:bg-emerald-800/50 rounded-xl transition-all font-medium">
              <Activity size={20} /> <span>{t("nav_dash")}</span>
            </a>
          </div>
        </div>
      )}

    </nav>
  );
}