"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 p-10 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-red-900/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-700/50">
            <AlertTriangle size={40} className="text-red-400" />
          </div>

          <h2 className="text-2xl font-extrabold text-white mb-3">
            Kesalahan Sistem Kritis
          </h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Terjadi kesalahan yang tidak terduga pada sistem AeroSuoh. 
            Silakan muat ulang halaman.
          </p>

          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all mx-auto shadow-lg"
          >
            <RefreshCw size={18} /> Muat Ulang
          </button>
        </div>
      </body>
    </html>
  );
}
