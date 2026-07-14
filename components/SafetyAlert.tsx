"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function SafetyAlert() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulasi kemunculan banner setelah beberapa detik untuk efek "real-time"
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-4 md:left-6 z-[100] bg-amber-500 text-amber-950 px-4 py-4 rounded-2xl shadow-2xl max-w-sm border-2 border-amber-400 animate-in slide-in-from-bottom-5 fade-in duration-500 print:hidden">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-amber-600/20 rounded-xl shrink-0 animate-pulse">
          <AlertTriangle size={24} className="text-amber-900" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-sm mb-1 uppercase tracking-wider text-amber-900">Safety Alert</h4>
          <p className="text-sm font-medium leading-snug">
            {t("alert_warning" as any)}
          </p>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="p-1.5 bg-amber-600/10 hover:bg-amber-600/30 rounded-lg transition-colors shrink-0"
          aria-label="Tutup Peringatan"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
