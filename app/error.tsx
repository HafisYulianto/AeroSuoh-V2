"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    console.error("AeroSuoh Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-10 max-w-lg w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
          <AlertTriangle size={40} className="text-amber-600" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">
          {t("error_title" as any)}
        </h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          {t("error_desc" as any)}
        </p>

        {/* Error detail (dev only) */}
        {error.message && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              {t("error_detail_label" as any)}
            </p>
            <p className="text-xs text-slate-600 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30"
          >
            <RefreshCw size={18} /> {t("error_retry" as any)}
          </button>
          <a
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
          >
            <Home size={18} /> {t("error_home" as any)}
          </a>
        </div>
      </div>
    </div>
  );
}
