"use client";

import { useState, useEffect } from "react";
import { Thermometer, Wind, AlertTriangle, Activity, Droplets, Printer, CloudSun } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from "../context/LanguageContext";

const chartData = [
  { time: '00:00', h2s: 15, gempa: 2 },
  { time: '04:00', h2s: 18, gempa: 1 },
  { time: '08:00', h2s: 25, gempa: 4 },
  { time: '12:00', h2s: 45, gempa: 8 }, 
  { time: '16:00', h2s: 30, gempa: 5 },
  { time: '20:00', h2s: 20, gempa: 2 },
  { time: '24:00', h2s: 16, gempa: 1 },
];

export default function Dashboard() {
  const { t, lang } = useLanguage();

  const [realTemp, setRealTemp] = useState<number | string>("...");
  const [realWind, setRealWind] = useState<number | string>("...");
  const [weatherCode, setWeatherCode] = useState<number | null>(null);
  
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-5.25&longitude=104.27&current=temperature_2m,wind_speed_10m,weathercode&timezone=Asia%2FJakarta");
        const data = await res.json();
        
        setRealTemp(data.current.temperature_2m);
        setRealWind(data.current.wind_speed_10m);
        setWeatherCode(data.current.weathercode); 
      } catch (error) {
        console.error("Gagal mengambil data satelit", error);
        setRealTemp(28.5); 
        setRealWind(12);
        setWeatherCode(999); 
      }
    };

    fetchRealData();
    const intervalData = setInterval(fetchRealData, 300000); 
    return () => clearInterval(intervalData);
  }, []); 

  useEffect(() => {
    setCurrentTime(new Date()); 
    const timer = setInterval(() => setCurrentTime(new Date()), 1000); 
    return () => clearInterval(timer);
  }, []);

  let syncBadgeText = t("dash_loading");
  let panelDate = "";
  let panelTime = "";

  if (currentTime) {
    const locale = lang === "ID" ? "id-ID" : "en-US";
    const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Jakarta' };
    const dateStr = new Intl.DateTimeFormat(locale, dateOptions).format(currentTime);
    
    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' };
    let timeStrRaw = new Intl.DateTimeFormat(locale, timeOptions).format(currentTime);
    timeStrRaw = timeStrRaw.replace('.', ':'); 
    
    const timeStr = `${timeStrRaw} WIB`;

    syncBadgeText = lang === "ID" ? `${dateStr} pukul ${timeStr}` : `${dateStr} at ${timeStr}`;
    panelDate = dateStr;
    panelTime = timeStr;
  }

  const getWeatherText = () => {
    if (weatherCode === null) return t("dash_loading");
    
    if (lang === "ID") {
      if (weatherCode === 0) return "Cerah Sepenuhnya";
      if (weatherCode >= 1 && weatherCode <= 3) return "Cerah Berawan";
      if (weatherCode >= 45 && weatherCode <= 48) return "Berkabut Tebal";
      if (weatherCode >= 51 && weatherCode <= 67) return "Hujan Ringan/Sedang";
      if (weatherCode >= 71 && weatherCode <= 77) return "Hujan Salju";
      if (weatherCode >= 80 && weatherCode <= 82) return "Hujan Lebat";
      if (weatherCode >= 95 && weatherCode <= 99) return "Badai Petir";
      return "Berawan (Fallback)";
    } else {
      if (weatherCode === 0) return "Clear Sky";
      if (weatherCode >= 1 && weatherCode <= 3) return "Partly Cloudy";
      if (weatherCode >= 45 && weatherCode <= 48) return "Thick Fog";
      if (weatherCode >= 51 && weatherCode <= 67) return "Light/Moderate Rain";
      if (weatherCode >= 71 && weatherCode <= 77) return "Snow (Unlikely)";
      if (weatherCode >= 80 && weatherCode <= 82) return "Heavy Rain";
      if (weatherCode >= 95 && weatherCode <= 99) return "Thunderstorm";
      return "Cloudy (Fallback)";
    }
  };

  return (
    // === REVISI: Menambahkan 'print:break-inside-avoid' ke container utama ===
    <section className="py-20 px-4 max-w-7xl mx-auto print:py-0 print:px-0 print:max-w-none print:break-inside-avoid print:w-full" id="dashboard">
      
      {/* === REVISI CSS CETAK: Memaksa skala, menghapus margin yang tidak perlu, & mengamankan layout === */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: landscape; margin: 10mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          
          /* Memaksa elemen ini tidak terbelah */
          #dashboard { 
            page-break-inside: avoid !important;
            break-inside: avoid !important; 
            display: block !important;
            width: 100% !important;
          }
        }
      `}} />
      
      <div className="mb-12 flex flex-col items-center justify-center text-center relative print:mb-4">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 print:mb-1 print:text-2xl">{t("dash_title")}</h2>
        <p className="text-slate-600 max-w-2xl print:text-xs print:mb-2">{t("dash_desc")}</p>
        
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 print:mt-1">
          <p className="text-xs text-emerald-600 font-mono bg-emerald-50 inline-block px-3 py-2 rounded-full border border-emerald-100 print:px-2 print:py-1 shadow-inner group">
            <span className="animate-pulse inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 group-hover:scale-125 transition-transform"></span>
            {t("dash_sync")} <span className="text-slate-800 font-bold">{syncBadgeText}</span>
          </p>
          
          <button 
            onClick={() => window.print()} 
            className="print:hidden flex items-center gap-2 px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-800 hover:scale-105 transition-all shadow-lg shadow-slate-900/20"
          >
            <Printer size={16} /> {t("dash_pdf")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:grid print:grid-cols-3 print:gap-4 print:w-full print:items-start">
        
        {/* Kolom Kiri */}
        <div className="lg:col-span-1 space-y-4 print:col-span-1 print:space-y-3">
          
          {/* === SKELETON LOADER: Tampil saat data API belum dimuat === */}
          {realTemp === "..." ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 animate-pulse">
                  <div className="w-14 h-14 bg-slate-200 rounded-xl"></div>
                  <div className="flex-1 space-y-3 pt-1">
                    <div className="h-3 bg-slate-200 rounded-full w-2/3"></div>
                    <div className="h-7 bg-slate-200 rounded-full w-1/2"></div>
                    <div className="h-2.5 bg-slate-100 rounded-full w-3/4"></div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-all print:p-3 print:shadow-none print:border-slate-300">
            <div className="p-3 bg-rose-50 rounded-xl text-rose-500 print:p-2">
              <Thermometer size={28} className="print:w-5 print:h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 print:text-[10px]">{t("dash_temp_title")}</p>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold text-slate-800 print:text-xl">{realTemp}</h3>
                <span className="text-lg font-bold text-slate-400 mb-1 print:text-xs">°C</span>
              </div>
              <p className="text-xs text-emerald-600 mt-1 font-medium bg-emerald-50 inline-block px-2 py-0.5 rounded print:text-[9px] print:mt-0">{t("dash_temp_src")}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-all print:p-3 print:shadow-none print:border-slate-300">
            <div className="p-3 bg-sky-50 rounded-xl text-sky-500 print:p-2">
              <Wind size={28} className="print:w-5 print:h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 print:text-[10px]">{t("dash_wind_title")}</p>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold text-slate-800 print:text-xl">{realWind}</h3>
                <span className="text-sm font-bold text-slate-400 mb-1.5 print:text-[10px]">km/h</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 print:text-[9px] print:mt-0">{t("dash_wind_desc")}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm flex items-start gap-4 relative overflow-hidden print:p-3 print:shadow-none print:border-amber-400 print:bg-amber-50/30">
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-100 rounded-bl-full -z-10 opacity-50 print:hidden"></div>
            <div className="p-3 bg-amber-100 rounded-xl text-amber-600 print:p-2">
              <AlertTriangle size={28} className="print:w-5 print:h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 print:text-[10px]">{t("dash_h2s_title")}</p>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold text-slate-800 print:text-xl">45</h3>
                <span className="text-sm font-bold text-slate-400 mb-1.5 print:text-[10px]">ppm</span>
              </div>
              <p className="text-xs text-amber-600 mt-1 font-bold print:text-[9px] print:mt-0">{t("dash_h2s_desc")}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 print:p-3 print:shadow-none print:border-slate-300">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500 print:p-2">
              <Droplets size={28} className="print:w-5 print:h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 print:text-[10px]">{t("dash_ph_title")}</p>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold text-slate-800 print:text-xl">2.1</h3>
                <span className="text-sm font-bold text-slate-400 mb-1.5 print:text-[10px]">pH</span>
              </div>
              <p className="text-xs text-emerald-600 mt-1 font-bold print:text-[9px] print:mt-0">{t("dash_ph_desc")}</p>
            </div>
          </div>
            </>
          )}

        </div>

        {/* Kolom Kanan */}
        <div className="lg:col-span-2 flex flex-col gap-4 print:col-span-2 print:gap-3">
          
          {/* Panel Grafik */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col grow print:p-4 print:shadow-none print:border-slate-300">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4 print:mb-2 print:pb-2">
              <Activity className="text-emerald-500 print:w-5 print:h-5" size={24} />
              <h3 className="text-xl font-bold text-slate-800 print:text-sm">{t("dash_chart_title")}</h3>
            </div>
            
            {/* === REVISI: Mengurangi tinggi grafik saat dicetak (print:h-48) === */}
            <div className="grow w-full h-64 min-h-[250px] print:h-48 print:min-h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorH2S" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorGempa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dy={5} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
                  />
                  <Area type="monotone" name="Gas H2S (ppm)" dataKey="h2s" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorH2S)" />
                  <Area type="monotone" name="Gempa" dataKey="gempa" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorGempa)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs font-medium text-slate-500 print:mt-1 print:text-[9px]">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500 print:w-2 print:h-2"></span> {t("dash_legend_h2s")}</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500 print:w-2 print:h-2"></span> {t("dash_legend_gempa")}</div>
            </div>
          </div>

          {/* Panel Info Cuaca */}
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-6 rounded-2xl shadow-md flex items-center justify-between text-white print:p-3 print:border print:border-slate-300 print:from-white print:to-white print:text-slate-800 print:shadow-none">
            <div className="flex items-center gap-4 print:gap-2">
              <div className="p-3 bg-white/20 rounded-full print:p-2 print:bg-slate-100 print:text-emerald-600">
                <CloudSun size={32} className="print:w-5 print:h-5" />
              </div>
              <div>
                <p className="text-emerald-100 text-sm font-medium print:text-[10px] print:text-slate-500">{t("dash_weather_title")}</p>
                {weatherCode === null ? (
                  <div className="h-6 bg-white/20 rounded-full w-28 animate-pulse mt-1"></div>
                ) : (
                  <h4 className="text-2xl font-bold tracking-tight print:text-sm">{getWeatherText()}</h4>
                )}
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-emerald-100 text-xs opacity-80 print:text-[9px] print:text-slate-500">{t("dash_weather_loc")}</p>
              <p className="text-sm font-semibold font-mono mb-1 print:text-[10px]">Suoh (-5.25°, 104.27°)</p>
              
              <div className="flex flex-col items-end">
                {currentTime === null ? (
                  <div className="space-y-1.5 flex flex-col items-end mt-1 animate-pulse">
                    <div className="h-3 bg-white/20 rounded-full w-24"></div>
                    <div className="h-4 bg-white/20 rounded-full w-16"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-emerald-200 font-medium print:text-[9px] print:text-slate-500">{panelDate}</p>
                    <p className="text-sm font-bold text-white tracking-wide print:text-[10px] print:text-slate-800">{panelTime}</p>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}