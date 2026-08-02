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
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
          <Settings size={28} className="text-slate-600" />
          Pengaturan Halaman Utama
        </h2>
        <p className="text-sm text-slate-500 mt-1">Ubah judul hero, deskripsi, tombol, dan gambar background di landing page.</p>
      </div>

      {/* QUICK SHORTCUT CARD TO PAYMENTS PAGE */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 p-6 rounded-3xl text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-emerald-900/40">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30 shrink-0">
            <CreditCard size={28} />
          </div>
          <div>
            <h4 className="font-extrabold text-base text-white">Kelola Foto QRIS & Rekening Bank</h4>
            <p className="text-xs text-slate-300 mt-0.5">Ingin mengganti foto barcode QRIS atau nomor rekening transfer pengunjung? Gunakan menu khusus Metode Pembayaran.</p>
          </div>
        </div>
        <Link
          href="/admin/dashboard/payments"
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-lg shadow-emerald-600/30"
        >
          <span>Ke Metode Pembayaran</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {status === "success" && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 font-semibold text-sm">
          <CheckCircle className="text-emerald-600 shrink-0" />
          <span>Pengaturan berhasil disimpan dan di-update!</span>
        </div>
      )}

      {status === "error" && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl font-semibold text-sm">
          Gagal menyimpan pengaturan. Silakan coba lagi.
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-8">
        
        {/* HERO IMAGE SECTION */}
        <div>
          <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Gambar Background Hero</h3>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative w-full sm:w-64 h-36 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
              <Image 
                src={settings.hero_image_url || "/hero-suoh2.png"}
                alt="Preview Hero"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                Rekomendasi ukuran: 1920x1080 pixel (Landscape). Resolusi HD dengan ukuran di bawah 1MB untuk performa terbaik.
              </p>
              
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold tracking-wider cursor-pointer shadow-md shadow-slate-900/10">
                  <Upload size={14} />
                  {uploading ? "Mengunggah..." : "Unggah Foto Baru"}
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
        </div>

        {/* NAVBAR LOGO SECTION */}
        <div>
          <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Logo Navbar (Pesona Suoh)</h3>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative w-36 h-36 rounded-2xl overflow-hidden bg-emerald-950 border border-slate-200 shadow-inner flex items-center justify-center p-2">
              <Image 
                src={settings.navbar_logo_url || "/logo-aerosuoh2.png"}
                alt="Preview Logo"
                fill
                className="object-contain p-2"
              />
            </div>
            
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                Rekomendasi format: PNG transparan (tanpa background putih). Desain logo memanjang/kotak.
              </p>
              
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold tracking-wider cursor-pointer shadow-md shadow-slate-900/10">
                  <Upload size={14} />
                  {uploading ? "Mengunggah..." : "Unggah Logo Baru"}
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
        <div className="space-y-6">
          <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">Judul Hero (Teks Baris 1 & 2)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Baris 1 (Bahasa Indonesia)</label>
              <input 
                type="text" 
                value={settings.hero_title_1_id || ""}
                onChange={(e) => handleChange("hero_title_1_id", e.target.value)}
                placeholder="Menjaga Harta Karun"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Baris 1 (Bahasa Inggris)</label>
              <input 
                type="text" 
                value={settings.hero_title_1_en || ""}
                onChange={(e) => handleChange("hero_title_1_en", e.target.value)}
                placeholder="Preserving the Treasures of"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Baris 2 (Bahasa Indonesia - Gradasi)</label>
              <input 
                type="text" 
                value={settings.hero_title_2_id || ""}
                onChange={(e) => handleChange("hero_title_2_id", e.target.value)}
                placeholder="Lampung Barat"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Baris 2 (Bahasa Inggris - Gradasi)</label>
              <input 
                type="text" 
                value={settings.hero_title_2_en || ""}
                onChange={(e) => handleChange("hero_title_2_en", e.target.value)}
                placeholder="West Lampung"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium transition-all"
              />
            </div>
          </div>
        </div>

        {/* HERO DESCRIPTION */}
        <div className="space-y-6">
          <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">Deskripsi Hero</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Deskripsi (Bahasa Indonesia)</label>
              <textarea 
                rows={3}
                value={settings.hero_desc_id || ""}
                onChange={(e) => handleChange("hero_desc_id", e.target.value)}
                placeholder="Platform pariwisata pintar dan dasbor pemantauan geotermal..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Deskripsi (Bahasa Inggris)</label>
              <textarea 
                rows={3}
                value={settings.hero_desc_en || ""}
                onChange={(e) => handleChange("hero_desc_en", e.target.value)}
                placeholder="Smart tourism platform and geothermal monitoring dashboard..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* BUTTON TEXTS */}
        <div className="space-y-6">
          <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">Label Tombol Hero</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Tombol 1 (Bahasa Indonesia)</label>
              <input 
                type="text" 
                value={settings.hero_btn_1_id || ""}
                onChange={(e) => handleChange("hero_btn_1_id", e.target.value)}
                placeholder="Mulai Eksplorasi"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Tombol 1 (Bahasa Inggris)</label>
              <input 
                type="text" 
                value={settings.hero_btn_1_en || ""}
                onChange={(e) => handleChange("hero_btn_1_en", e.target.value)}
                placeholder="Start Exploring"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Tombol 2 (Bahasa Indonesia)</label>
              <input 
                type="text" 
                value={settings.hero_btn_2_id || ""}
                onChange={(e) => handleChange("hero_btn_2_id", e.target.value)}
                placeholder="Lihat Dasbor"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Tombol 2 (Bahasa Inggris)</label>
              <input 
                type="text" 
                value={settings.hero_btn_2_en || ""}
                onChange={(e) => handleChange("hero_btn_2_en", e.target.value)}
                placeholder="View Dashboard"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium transition-all"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="border-t border-slate-100 pt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer disabled:bg-emerald-400"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Simpan Pengaturan</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
