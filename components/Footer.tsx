import Image from "next/image";
import { MapPin, Mail, Phone, Home, Map, Activity, Camera, ShieldAlert, Info, Instagram, Youtube, Linkedin, Github, Award } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  // === Panggil kekuatan Global State ===
  const { t } = useLanguage();

  return (
    <footer className="bg-[#013220] text-emerald-100 py-12 border-t border-emerald-900 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          
          {/* Kolom Kiri: Brand, Deskripsi, & Sosial Media */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              {/* flex items-center dibiarkan, tapi ditambahkan -ml-2 di gambar agar rata kiri dengan teks bawahnya */}
            <div className="flex items-center">
              {/* h-10 diubah menjadi h-20 agar lebih besar dan proporsional */}
              <Image src="/logo-aerosuoh2.png" alt="Logo AeroSuoh" width={140} height={140} className="h-[8.75rem] w-auto object-contain -ml-2" />  
            </div>
            <p className="text-emerald-100/70 text-sm leading-relaxed max-w-sm">
              {t("hero_desc")}
            </p>
          </div>

            {/* === Deretan Ikon Sosial Media === */}
            <div className="flex items-center gap-3 mt-1">
              <a href="https://www.instagram.com/explore/tags/suoh/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-emerald-900/50 rounded-full text-emerald-400 hover:bg-emerald-500 hover:text-white hover:-translate-y-1 transition-all shadow-sm" title="Suoh di Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://www.youtube.com/results?search_query=wisata+suoh+lampung+barat+geotermal" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-emerald-900/50 rounded-full text-emerald-400 hover:bg-emerald-500 hover:text-white hover:-translate-y-1 transition-all shadow-sm" title="Suoh di YouTube">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Kolom Tengah: Navigasi Sistem */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t("foot_nav_title")}</h3>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="flex items-center gap-2 text-sm hover:text-white hover:translate-x-1 transition-transform">
                  <Home size={16} className="text-emerald-500" /> {t("nav_home")}
                </a>
              </li>
              <li>
                <a href="#about" className="flex items-center gap-2 text-sm hover:text-white hover:translate-x-1 transition-transform">
                  <Info size={16} className="text-emerald-500" /> {t("nav_about")}
                </a>
              </li>
              <li>
                <a href="#logo-philosophy" className="flex items-center gap-2 text-sm hover:text-white hover:translate-x-1 transition-transform">
                  <Award size={16} className="text-emerald-500" /> {t("foot_nav_logo" as any)}
                </a>
              </li>
              <li>
                <a href="#gallery" className="flex items-center gap-2 text-sm hover:text-white hover:translate-x-1 transition-transform">
                  <Camera size={16} className="text-emerald-500" /> {t("nav_gallery")}
                </a>
              </li>
              <li>
                <a href="#explorer" className="flex items-center gap-2 text-sm hover:text-white hover:translate-x-1 transition-transform">
                  <Map size={16} className="text-emerald-500" /> {t("nav_map")}
                </a>
              </li>
              <li>
                <a href="#dashboard" className="flex items-center gap-2 text-sm hover:text-white hover:translate-x-1 transition-transform">
                  <Activity size={16} className="text-emerald-500" /> {t("nav_dash")}
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom Kanan: Pusat Kendali & Kontak Lengkap */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t("foot_loc_title")}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{t("foot_loc_1")}<br />{t("foot_loc_2")}</span>
              </li>
              
              {/* === BARU: Kontak Tambahan === */}
              <li className="flex items-center gap-3 text-sm">
                <Phone size={18} className="text-emerald-500 shrink-0" />
                <span className="leading-relaxed">+62 822-7948-5813</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail size={18} className="text-emerald-500 shrink-0" />
                <span className="leading-relaxed">aerosuoh@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Garis Bawah, Copyright, & Developer Credit */}
        <div className="mt-12 pt-6 border-t border-emerald-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-emerald-100/60 text-center md:text-left">
            {t("foot_copy")}
          </p>
          
          {/* === BARU: Developer Credit & Portfolio Links === */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-emerald-100/60">
              Developed by <span className="font-bold text-emerald-400">Hafis Yulianto</span>
            </span>
            <div className="h-4 w-px bg-emerald-800/80 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <a 
                href="https://www.linkedin.com/in/hafisyulianto/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-1.5 rounded-md text-emerald-500/70 hover:text-emerald-300 hover:bg-emerald-900/50 transition-colors"
                title="Connect on LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a 
                href="https://github.com/HafisYulianto" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-1.5 rounded-md text-emerald-500/70 hover:text-emerald-300 hover:bg-emerald-900/50 transition-colors"
                title="View GitHub Profile"
              >
                <Github size={16} />
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}