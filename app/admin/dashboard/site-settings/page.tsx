"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import { Settings, Save, Upload, CheckCircle, Loader2, CreditCard, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SiteSettingsAdmin() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase.from("site_settings").select("key, value");
      if (error) throw error;
      if (data) {
        const settingsMap: Record<string, string> = {};
        data.forEach((item) => {
          settingsMap[item.key] = item.value;
        });
        setSettings(settingsMap);
      }
    } catch (err) {
      console.error("Gagal memuat pengaturan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");

    try {
      // Perbarui/Upsert setiap key secara paralel
      const promises = Object.entries(settings).map(async ([key, value]) => {
        return supabase
          .from("site_settings")
          .upsert({ key, value });
      });

      await Promise.all(promises);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      console.error("Gagal menyimpan pengaturan:", err);
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const prefix = key === "hero_image_url" ? "hero" : "logo";
      const fileName = `${prefix}_${Date.now()}.${fileExt}`;
      
      const { error: uploadErr } = await supabase.storage
        .from("media")
        .upload(fileName, file);

      if (uploadErr) throw uploadErr;

      const { data } = supabase.storage.from("media").getPublicUrl(fileName);
      const publicUrl = data.publicUrl;

      // Update local state
      handleChange(key, publicUrl);

      // Save immediately to DB
      const { error: dbErr } = await supabase
        .from("site_settings")
        .update({ value: publicUrl })
        .eq("key", key);

      if (dbErr) throw dbErr;

      setStatus("success");
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      console.error(`Gagal upload ${key}:`, err);
      alert("Gagal mengupload gambar.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-4 pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Settings size={22} className="text-emerald-600" />
            Pengaturan Halaman Utama
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Ubah judul hero, deskripsi, tombol, dan gambar background di landing page.</p>
        </div>

        <Link
          href="/admin/dashboard/payments"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all w-fit cursor-pointer shadow-sm"
        >
          <CreditCard size={14} className="text-emerald-400" />
          <span>Ke Metode Pembayaran</span>
          <ArrowRight size={12} />
        </Link>
      </div>

      {status === "success" && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 font-semibold text-xs animate-in fade-in">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          <span>Pengaturan berhasil disimpan dan di-update!</span>
        </div>
      )}

      {status === "error" && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-semibold text-xs">
          Gagal menyimpan pengaturan. Silakan coba lagi.
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-5">
        
        {/* GRID 2-KOLOM: HERO IMAGE & NAVBAR LOGO SIDE-BY-SIDE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-b border-slate-100 pb-5">
          {/* HERO IMAGE SECTION */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Gambar Background Hero</h3>
            <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="relative w-36 h-20 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-inner shrink-0">
                <Image 
                  src={settings.hero_image_url || "/hero-suoh2.png"}
                  alt="Preview Hero"
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="space-y-2 flex-1">
                <p className="text-[10px] text-slate-500 leading-tight">
                  Format Landscape (1920x1080). Maksimal 1MB.
                </p>
                
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-all shadow-sm">
                  <Upload size={12} />
                  <span>{uploading ? "Mengunggah..." : "Unggah Foto Hero"}</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleImageUpload("hero_image_url", e)}
                    disabled={uploading}
                    className="hidden" 
                  />
                </label>
              </div>
            </div>
          </div>

          {/* NAVBAR LOGO SECTION */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Logo Navbar (Pesona Suoh)</h3>
            <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-emerald-950 border border-slate-200 shadow-inner shrink-0 flex items-center justify-center p-1">
                <Image 
                  src={settings.navbar_logo_url || "/logo-aerosuoh2.png"}
                  alt="Preview Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              
              <div className="space-y-2 flex-1">
                <p className="text-[10px] text-slate-500 leading-tight">
                  Format PNG Transparan (tanpa background).
                </p>
                
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-all shadow-sm">
                  <Upload size={12} />
                  <span>{uploading ? "Mengunggah..." : "Unggah Logo Baru"}</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => handleImageUpload("navbar_logo_url", e)}
                    disabled={uploading}
                    className="hidden" 
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* HERO TITLES */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Judul Hero (Teks Baris 1 & 2)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Baris 1 (Bahasa Indonesia)</label>
              <input 
                type="text" 
                value={settings.hero_title_1_id || ""}
                onChange={(e) => handleChange("hero_title_1_id", e.target.value)}
                placeholder="Menjaga Harta Karun"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-lg outline-none text-xs text-slate-800 font-medium transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Baris 1 (Bahasa Inggris)</label>
              <input 
                type="text" 
                value={settings.hero_title_1_en || ""}
                onChange={(e) => handleChange("hero_title_1_en", e.target.value)}
                placeholder="Preserving the Treasures of"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-lg outline-none text-xs text-slate-800 font-medium transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Baris 2 (Bahasa Indonesia - Gradasi)</label>
              <input 
                type="text" 
                value={settings.hero_title_2_id || ""}
                onChange={(e) => handleChange("hero_title_2_id", e.target.value)}
                placeholder="Lampung Barat"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-lg outline-none text-xs text-slate-800 font-medium transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Baris 2 (Bahasa Inggris - Gradasi)</label>
              <input 
                type="text" 
                value={settings.hero_title_2_en || ""}
                onChange={(e) => handleChange("hero_title_2_en", e.target.value)}
                placeholder="West Lampung"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-lg outline-none text-xs text-slate-800 font-medium transition-all"
              />
            </div>
          </div>
        </div>

        {/* HERO DESCRIPTION */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Deskripsi Hero</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Deskripsi (Bahasa Indonesia)</label>
              <textarea 
                rows={2}
                value={settings.hero_desc_id || ""}
                onChange={(e) => handleChange("hero_desc_id", e.target.value)}
                placeholder="Platform pariwisata pintar dan dasbor pemantauan geotermal..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-lg outline-none text-xs text-slate-800 font-medium transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Deskripsi (Bahasa Inggris)</label>
              <textarea 
                rows={2}
                value={settings.hero_desc_en || ""}
                onChange={(e) => handleChange("hero_desc_en", e.target.value)}
                placeholder="Smart tourism platform and geothermal monitoring dashboard..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-lg outline-none text-xs text-slate-800 font-medium transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* BUTTON TEXTS */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Label Tombol Hero</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Tombol 1 (Bahasa Indonesia / Inggris)</label>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  value={settings.hero_btn_1_id || ""}
                  onChange={(e) => handleChange("hero_btn_1_id", e.target.value)}
                  placeholder="Mulai Eksplorasi (ID)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-lg outline-none text-xs text-slate-800 font-medium transition-all"
                />
                <input 
                  type="text" 
                  value={settings.hero_btn_1_en || ""}
                  onChange={(e) => handleChange("hero_btn_1_en", e.target.value)}
                  placeholder="Start Exploring (EN)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-lg outline-none text-xs text-slate-800 font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Tombol 2 (Bahasa Indonesia / Inggris)</label>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  value={settings.hero_btn_2_id || ""}
                  onChange={(e) => handleChange("hero_btn_2_id", e.target.value)}
                  placeholder="Lihat Dasbor (ID)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-lg outline-none text-xs text-slate-800 font-medium transition-all"
                />
                <input 
                  type="text" 
                  value={settings.hero_btn_2_en || ""}
                  onChange={(e) => handleChange("hero_btn_2_en", e.target.value)}
                  placeholder="View Dashboard (EN)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-lg outline-none text-xs text-slate-800 font-medium transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="border-t border-slate-100 pt-3 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:bg-emerald-400 text-xs"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={14} />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Simpan Pengaturan</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
