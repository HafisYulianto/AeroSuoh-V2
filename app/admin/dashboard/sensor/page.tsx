"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import { Activity, Save, Plus, Trash2, CheckCircle, Loader2 } from "lucide-react";

export default function SensorAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addingChart, setAddingChart] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  // Sensor states
  const [sensorId, setSensorId] = useState<string | null>(null);
  const [h2s, setH2s] = useState(0);
  const [ph, setPh] = useState(0);
  const [h2sStatusId, setH2sStatusId] = useState("");
  const [h2sStatusEn, setH2sStatusEn] = useState("");
  const [phStatusId, setPhStatusId] = useState("");
  const [phStatusEn, setPhStatusEn] = useState("");

  // Chart data states
  const [chartItems, setChartItems] = useState<any[]>([]);
  const [newTime, setNewTime] = useState("");
  const [newH2s, setNewH2s] = useState(0);
  const [newGempa, setNewGempa] = useState(0);

  const loadSensorData = async () => {
    try {
      // Load current sensor readings
      const { data: sensorData, error: sensorErr } = await supabase
        .from("sensor_readings")
        .select("*")
        .order("recorded_at", { ascending: false })
        .limit(1);

      if (sensorErr) throw sensorErr;
      if (sensorData && sensorData.length > 0) {
        const item = sensorData[0];
        setSensorId(item.id);
        setH2s(item.h2s_ppm);
        setPh(item.ph_level);
        setH2sStatusId(item.h2s_status_id);
        setH2sStatusEn(item.h2s_status_en);
        setPhStatusId(item.ph_status_id);
        setPhStatusEn(item.ph_status_en);
      }

      // Load chart history
      const { data: chartData, error: chartErr } = await supabase
        .from("sensor_chart_data")
        .select("*")
        .order("recorded_at", { ascending: true });

      if (chartErr) throw chartErr;
      if (chartData) setChartItems(chartData);

    } catch (err) {
      console.error("Gagal memuat data sensor:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSensorData();
  }, []);

  const handleSaveSensor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");

    const payload = {
      h2s_ppm: Number(h2s),
      ph_level: Number(ph),
      h2s_status_id: h2sStatusId,
      h2s_status_en: h2sStatusEn,
      ph_status_id: phStatusId,
      ph_status_en: phStatusEn
    };

    try {
      if (sensorId) {
        const { error } = await supabase
          .from("sensor_readings")
          .update(payload)
          .eq("id", sensorId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("sensor_readings")
          .insert([payload]);
        if (error) throw error;
      }

      setStatus("success");
      setTimeout(() => setStatus("idle"), 4000);
      loadSensorData();
    } catch (err) {
      console.error("Gagal menyimpan data sensor:", err);
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddChartItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTime) return;

    setAddingChart(true);
    try {
      const { error } = await supabase
        .from("sensor_chart_data")
        .insert([
          {
            time_label: newTime,
            h2s_value: Number(newH2s),
            gempa_value: Number(newGempa)
          }
        ]);
      if (error) throw error;

      setNewTime("");
      setNewH2s(0);
      setNewGempa(0);
      loadSensorData();
    } catch (err) {
      console.error("Gagal menyimpan item chart:", err);
      alert("Gagal menambahkan data.");
    } finally {
      setAddingChart(false);
    }
  };

  const handleDeleteChartItem = async (id: string) => {
    if (!confirm("Hapus item data grafik ini?")) return;

    try {
      const { error } = await supabase
        .from("sensor_chart_data")
        .delete()
        .eq("id", id);
      if (error) throw error;
      loadSensorData();
    } catch (err) {
      console.error("Gagal menghapus item chart:", err);
      alert("Gagal menghapus data.");
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
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
          <Activity size={28} className="text-slate-600" />
          Dasbor Sensor & Data Geotermal
        </h2>
        <p className="text-sm text-slate-500 mt-1">Ubah pembacaan sensor live kawah Suoh dan kelola data tren grafik gas/gempa seismik.</p>
      </div>

      {status === "success" && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 font-semibold text-sm">
          <CheckCircle className="text-emerald-600 shrink-0" />
          <span>Data sensor berhasil diperbarui di web utama!</span>
        </div>
      )}

      {status === "error" && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl font-semibold text-sm">
          Gagal memperbarui data sensor. Silakan coba lagi.
        </div>
      )}

      {/* Sensor Readings inputs */}
      <form onSubmit={handleSaveSensor} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
        <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">Status Sensor Live Saat Ini</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Konsentrasi Gas H2S (ppm)</label>
            <input
              type="number"
              value={h2s}
              onChange={(e) => setH2s(Number(e.target.value))}
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Tingkat Keasaman Air (pH)</label>
            <input
              type="number"
              step="any"
              value={ph}
              onChange={(e) => setPh(Number(e.target.value))}
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Status Gas (Bahasa Indonesia)</label>
            <input
              type="text"
              value={h2sStatusId}
              onChange={(e) => setH2sStatusId(e.target.value)}
              placeholder="e.g. Waspada: Kawah Nirwana"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Status Gas (Bahasa Inggris)</label>
            <input
              type="text"
              value={h2sStatusEn}
              onChange={(e) => setH2sStatusEn(e.target.value)}
              placeholder="e.g. Alert: Nirwana Crater"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Status Keasaman Air (Bahasa Indonesia)</label>
            <input
              type="text"
              value={phStatusId}
              onChange={(e) => setPhStatusId(e.target.value)}
              placeholder="e.g. Danau Asam (Tinggi)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Status Keasaman (Bahasa Inggris)</label>
            <input
              type="text"
              value={phStatusEn}
              onChange={(e) => setPhStatusEn(e.target.value)}
              placeholder="e.g. Acid Lake (High)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all disabled:bg-emerald-400 cursor-pointer"
          >
            {saving ? "Menyimpan..." : "Update Live Sensor"}
          </button>
        </div>
      </form>

      {/* Chart Trends CRUD */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
        <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2">Tren Grafik Aktivitas</h3>
        
        {/* Form add chart point */}
        <form onSubmit={handleAddChartItem} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Waktu / Jam</label>
            <input
              type="text"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              required
              placeholder="e.g. 08:00"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Kadar H2S (ppm)</label>
            <input
              type="number"
              value={newH2s}
              onChange={(e) => setNewH2s(Number(e.target.value))}
              required
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Gempa Mikro (Skala)</label>
            <input
              type="number"
              value={newGempa}
              onChange={(e) => setNewGempa(Number(e.target.value))}
              required
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={addingChart}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer disabled:bg-slate-600"
          >
            {addingChart ? "Menambah..." : "Tambah Titik Grafik"}
          </button>
        </form>

        {/* List chart points */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">Waktu</th>
                <th className="pb-3">Gas H2S</th>
                <th className="pb-3">Gempa Mikro</th>
                <th className="pb-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {chartItems.map((c) => (
                <tr key={c.id} className="text-sm font-semibold text-slate-700">
                  <td className="py-2.5 font-mono">{c.time_label}</td>
                  <td className="py-2.5 text-amber-600">{c.h2s_value} ppm</td>
                  <td className="py-2.5 text-emerald-600">{c.gempa_value} scale</td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => handleDeleteChartItem(c.id)}
                      className="p-1 hover:bg-rose-50 text-rose-600 border border-transparent hover:border-rose-100 rounded-lg transition-colors cursor-pointer"
                      title="Hapus Titik"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
