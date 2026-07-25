"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import { Map, Save, CheckCircle, Loader2 } from "lucide-react";
import * as Lucide from "lucide-react";

export default function RoutesAdmin() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ id: string; type: "success" | "error" } | null>(null);

  const loadRoutes = async () => {
    try {
      const { data, error } = await supabase
        .from("routes")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      if (data) setRoutes(data);
    } catch (err) {
      console.error("Gagal memuat rute:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const handleChange = (id: string, field: string, value: any) => {
    setRoutes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = async (id: string) => {
    setSavingId(id);
    setStatus(null);
    const route = routes.find((r) => r.id === id);
    if (!route) return;

    try {
      const { error } = await supabase
        .from("routes")
        .update({
          title_id: route.title_id,
          title_en: route.title_en,
          desc_id: route.desc_id,
          desc_en: route.desc_en,
          icon_name: route.icon_name,
          icon_color: route.icon_color
        })
        .eq("id", id);

      if (error) throw error;

      setStatus({ id, type: "success" });
      setTimeout(() => setStatus(null), 4000);
    } catch (err) {
      console.error("Gagal menyimpan rute:", err);
      setStatus({ id, type: "error" });
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const availableIcons = ["Map", "Navigation", "Compass", "Car", "Activity"];
  const availableColors = ["emerald", "amber", "blue"];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
          <Map size={28} className="text-slate-600" />
          Kelola Rute & Jalur Basecamp
        </h2>
        <p className="text-sm text-slate-500 mt-1">Ubah penjelasan rute akses Utara (Liwa) dan rute Selatan (Tanggamus).</p>
      </div>

      <div className="space-y-8">
        {routes.map((route) => (
          <div key={route.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
            
            {status?.id === route.id && (
              <div className={`p-4 rounded-xl flex items-center gap-2 font-semibold text-sm ${
                status?.type === "success" ? "bg-emerald-50 border border-emerald-100 text-emerald-800" : "bg-rose-50 border border-rose-100 text-rose-800"
              }`}>
                {status?.type === "success" ? <CheckCircle size={16} /> : null}
                <span>{status?.type === "success" ? "Rute berhasil disimpan!" : "Gagal menyimpan rute."}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              
              {/* Left Settings */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pengaturan Ikon</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ikon</label>
                    <select
                      value={route.icon_name}
                      onChange={(e) => handleChange(route.id, "icon_name", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
                    >
                      {availableIcons.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Skema Warna</label>
                    <select
                      value={route.icon_color}
                      onChange={(e) => handleChange(route.id, "icon_color", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none"
                    >
                      {availableColors.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Text Fields */}
              <div className="md:col-span-2 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Teks Rute Jalur</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Nama Rute (ID)</label>
                    <input
                      type="text"
                      value={route.title_id}
                      onChange={(e) => handleChange(route.id, "title_id", e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Route Title (EN)</label>
                    <input
                      type="text"
                      value={route.title_en}
                      onChange={(e) => handleChange(route.id, "title_en", e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm font-semibold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Deskripsi Detail Jalur (ID)</label>
                    <textarea
                      rows={3}
                      value={route.desc_id}
                      onChange={(e) => handleChange(route.id, "desc_id", e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm leading-relaxed resize-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Detail Route Description (EN)</label>
                    <textarea
                      rows={3}
                      value={route.desc_en}
                      onChange={(e) => handleChange(route.id, "desc_en", e.target.value)}
                      required
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl text-sm leading-relaxed resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleSave(route.id)}
                    disabled={savingId === route.id}
                    className="flex items-center gap-1.5 px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:bg-slate-700"
                  >
                    {savingId === route.id ? (
                      <>
                        <Loader2 className="animate-spin" size={12} />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save size={12} />
                        <span>Simpan Rute</span>
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
