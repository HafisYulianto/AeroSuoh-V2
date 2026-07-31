"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import { BookOpen, Save, Upload, X, CheckCircle, Loader2 } from "lucide-react";
import * as Lucide from "lucide-react";
import Image from "next/image";

export default function EncyclopediaAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ id: string; type: "success" | "error" } | null>(null);

  const loadEncyclopedia = async () => {
    try {
      const { data, error } = await supabase
        .from("encyclopedia_items")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      if (data) setItems(data);
    } catch (err) {
      console.error("Gagal memuat ensiklopedia:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEncyclopedia();
  }, []);

  const handleChange = (id: string, field: string, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = async (id: string) => {
    setSavingId(id);
    setStatus(null);
    const item = items.find((i) => i.id === id);
    if (!item) return;

    try {
      const { error } = await supabase
        .from("encyclopedia_items")
        .update({
          title_id: item.title_id,
          title_en: item.title_en,
          content_id: item.content_id,
          content_en: item.content_en,
          image_url: item.image_url,
          icon_name: item.icon_name,
          icon_color: item.icon_color
        })
        .eq("id", id);

      if (error) throw error;

      setStatus({ id, type: "success" });
      setTimeout(() => setStatus(null), 4000);
    } catch (err) {
      console.error("Gagal menyimpan data:", err);
      setStatus({ id, type: "error" });
    } finally {
      setSavingId(null);
    }
  };

  const handleImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(id);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `encyclopedia_${id}_${Date.now()}.${fileExt}`;
      
      const { error: uploadErr } = await supabase.storage
        .from("media")
        .upload(fileName, file);

      if (uploadErr) throw uploadErr;

      const { data } = supabase.storage.from("media").getPublicUrl(fileName);
      handleChange(id, "image_url", data.publicUrl);
    } catch (err) {
      console.error("Gagal upload gambar:", err);
      alert("Gagal mengupload gambar.");
    } finally {
      setUploadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const availableIcons = ["BookOpen", "Flame", "Leaf", "Compass", "Sparkles", "History"];
  const availableColors = ["red", "amber", "emerald"];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
          <BookOpen size={28} className="text-slate-600" />
          Kelola Kisah & Pengetahuan Suoh
        </h2>
        <p className="text-sm text-slate-500 mt-1">Ubah kisah sejarah 1933, legenda ular naga, dan biologi ekosistem ekstrem.</p>
      </div>

      <div className="space-y-8">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6 relative">
            
            {status?.id === item.id && (
              <div className={`p-4 rounded-xl flex items-center gap-2 font-semibold text-sm ${
                status?.type === "success" ? "bg-emerald-50 border border-emerald-100 text-emerald-800" : "bg-rose-50 border border-rose-100 text-rose-800"
              }`}>
                {status?.type === "success" ? <CheckCircle size={16} /> : null}
                <span>{status?.type === "success" ? "Perubahan berhasil disimpan!" : "Gagal menyimpan perubahan."}</span>
              </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
              
              {/* Media Settings Column */}
              <div className="w-full lg:w-1/3 flex flex-col gap-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Visual & Media</h4>
                
                {item.image_url ? (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                    <Image src={item.image_url} alt="Cover" fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-full aspect-video rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-2">
                    <BookOpen size={30} />
                    <span className="text-xs font-bold font-mono">Menggunakan Ikon</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer">
                    <Upload size={14} />
                    {uploadingId === item.id ? "Mengunggah..." : "Unggah Foto Sampul"}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(item.id, e)} 
                      disabled={uploadingId === item.id}
                      className="hidden" 
                    />
                  </label>
                  {item.image_url && (
                    <button
                      onClick={() => handleChange(item.id, "image_url", null)}
                      className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold"
                    >
                      Batal Foto
                    </button>
                  )}
                </div>

                {!item.image_url && (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pilih Ikon</label>
                      <select
                        value={item.icon_name}
                        onChange={(e) => handleChange(item.id, "icon_name", e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        {availableIcons.map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Warna Ikon</label>
                      <select
                        value={item.icon_color}
                        onChange={(e) => handleChange(item.id, "icon_color", e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                      >
                        {availableColors.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Text Fields Column */}
              <div className="flex-1 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Teks Konten Card</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Judul (Bahasa Indonesia)</label>
                    <input
                      type="text"
                      value={item.title_id}
                      onChange={(e) => handleChange(item.id, "title_id", e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Judul (Bahasa Inggris)</label>
                    <input
                      type="text"
                      value={item.title_en}
                      onChange={(e) => handleChange(item.id, "title_en", e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Konten (Bahasa Indonesia)</label>
                    <textarea
                      rows={4}
                      value={item.content_id}
                      onChange={(e) => handleChange(item.id, "content_id", e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm leading-relaxed resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Konten (Bahasa Inggris)</label>
                    <textarea
                      rows={4}
                      value={item.content_en}
                      onChange={(e) => handleChange(item.id, "content_en", e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm leading-relaxed resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleSave(item.id)}
                    disabled={savingId === item.id}
                    className="flex items-center gap-1.5 px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:bg-slate-700"
                  >
                    {savingId === item.id ? (
                      <>
                        <Loader2 className="animate-spin" size={12} />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save size={12} />
                        <span>Simpan Perubahan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
