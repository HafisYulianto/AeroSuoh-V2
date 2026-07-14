"use client";

import Link from "next/link";
import { MapPin, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      {/* Visual Glitch/404 Element */}
      <div className="relative mb-8 select-none">
        <h1 className="text-9xl md:text-[150px] font-black text-slate-200 tracking-tighter">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin size={80} className="text-emerald-500 drop-shadow-xl animate-bounce" />
        </div>
      </div>

      <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
        Tersesat di Hutan Suoh?
      </h2>
      <p className="text-slate-600 max-w-md mx-auto mb-10 text-lg leading-relaxed">
        Halaman yang Anda cari tidak dapat ditemukan. Mungkin jalurnya sudah tertutup semak belukar, atau Anda salah kordinat.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/"
          className="flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:-translate-y-1"
        >
          <Home size={20} />
          Kembali ke Basecamp
        </Link>
        <button 
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all hover:-translate-y-1"
        >
          <ArrowLeft size={20} />
          Kembali Mundur
        </button>
      </div>
    </div>
  );
}
