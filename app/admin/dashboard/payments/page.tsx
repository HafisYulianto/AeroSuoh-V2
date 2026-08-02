"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import { CreditCard, QrCode, Upload, Save, CheckCircle, Loader2, Building2, RefreshCw } from "lucide-react";
import Image from "next/image";

export default function PaymentsAdminPage() {
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
      console.error("Gagal memuat pengaturan pembayaran:", err);
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

  const handleImageUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `payment_${Date.now()}.${fileExt}`;
      const filePath = `payment/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      setSettings((prev) => ({ ...prev, [key]: publicUrl }));
      
      // Auto save QRIS url immediately
      await supabase.from("site_settings").upsert({ key, value: publicUrl });

      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      console.error("Gagal mengunggah gambar QRIS:", err);
      alert(`Gagal mengunggah gambar QRIS: ${err.message || "Terjadi kesalahan"}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");

    try {
      const paymentKeys = ["qris_image_url", "bank_name", "bank_account_number", "bank_account_holder"];
      const promises = paymentKeys.map(async (key) => {
        const value = settings[key] || "";
        return supabase.from("site_settings").upsert({ key, value });
      });

      await Promise.all(promises);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      console.error("Gagal menyimpan metode pembayaran:", err);
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat Metode Pembayaran...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-6xl pb-4">
      {/* Header Page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-600 mb-0.5">
            <CreditCard size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Manajemen Keuangan & Transaksi</span>
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Metode Pembayaran & QRIS</h1>
        </div>

        <button
          onClick={loadSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all w-fit cursor-pointer"
        >
          <RefreshCw size={13} />
          <span>Muat Ulang Data</span>
        </button>
      </div>

      {/* Success / Error Notification */}
      {status === "success" && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 font-semibold text-xs animate-in fade-in">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          <span>Metode pembayaran berhasil disimpan! Perubahan langsung aktif di halaman pemesanan tiket pengunjung.</span>
        </div>
      )}

      {status === "error" && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-semibold text-xs">
          Gagal menyimpan perubahan metode pembayaran. Silakan coba lagi.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        
        {/* GRID 2-KOLOM PENGATURAN & PREVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* FORM PENGATURAN (7 KOLOM) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            
            {/* OPSI 1: KODE QRIS */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider border-b border-slate-100 pb-1.5">
                <QrCode size={16} className="text-emerald-600" />
                <h3>1. Foto Barcode QRIS</h3>
              </div>

              <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="relative w-24 h-28 rounded-lg overflow-hidden bg-white border border-slate-300 shadow-sm shrink-0 flex items-center justify-center p-1">
                  <Image 
                    src={settings.qris_image_url || "/payment/QRIS.png"}
                    alt="Barcode QRIS"
                    fill
                    className="object-contain p-1"
                  />
                </div>

                <div className="space-y-2 flex-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Unggah Foto QRIS Baru</label>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Unggah foto barcode QRIS resmi (Format JPG/PNG).
                  </p>

                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-all shadow-sm">
                    <Upload size={13} />
                    <span>{uploading ? "Mengunggah..." : "Pilih File QRIS"}</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload("qris_image_url", e)}
                      disabled={uploading}
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* OPSI 2: TRANSFER BANK / E-WALLET */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider border-b border-slate-100 pb-1.5">
                <Building2 size={16} className="text-emerald-600" />
                <h3>2. Opsi Transfer Bank / E-Wallet</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Bank / Provider</label>
                  <input 
                    type="text" 
                    value={settings.bank_name || ""}
                    onChange={(e) => handleChange("bank_name", e.target.value)}
                    placeholder="e.g. Bank BRI / Mandiri"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-lg outline-none text-xs text-slate-800 font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Nomor Rekening / No. HP</label>
                  <input 
                    type="text" 
                    value={settings.bank_account_number || ""}
                    onChange={(e) => handleChange("bank_account_number", e.target.value)}
                    placeholder="e.g. 1234-01-005678-53-9"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-lg outline-none text-xs text-slate-800 font-mono tracking-wider transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Atas Nama Pemilik</label>
                  <input 
                    type="text" 
                    value={settings.bank_account_holder || ""}
                    onChange={(e) => handleChange("bank_account_holder", e.target.value)}
                    placeholder="e.g. AeroSuoh Tourism"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-lg outline-none text-xs text-slate-800 font-medium transition-all"
                  />
                </div>
              </div>
            </div>

            {/* ACTION BUTTON */}
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
                    <span>Simpan Metode Pembayaran</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* SIMULASI LIVE PREVIEW SISI PENGUNJUNG (5 KOLOM) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md space-y-3 border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-widest">Simulasi Tampilan Modal Pembayaran</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">Live Sync</span>
              </div>

              {/* Preview QRIS */}
              <div className="bg-white rounded-xl p-3 text-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Scan Barcode QRIS:</span>
                  <span className="text-[9px] bg-slate-100 text-slate-600 font-semibold px-1.5 py-0.5 rounded">QRIS Standar</span>
                </div>
                <div className="relative w-full h-32 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center p-1">
                  <Image 
                    src={settings.qris_image_url || "/payment/QRIS.png"}
                    alt="Preview QRIS Modal"
                    fill
                    className="object-contain p-1"
                  />
                </div>
              </div>

              {/* Preview Bank */}
              <div className="bg-slate-800 rounded-xl p-3 border border-slate-700 text-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Option: Transfer Bank / E-Wallet</span>
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-400">Bank:</span>
                  <span className="text-white font-bold">{settings.bank_name || "Bank BRI"}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-400">No. Rekening:</span>
                  <span className="text-emerald-400 font-mono font-bold">{settings.bank_account_number || "1234-01-005678-53-9"}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-400">Atas Nama:</span>
                  <span className="text-slate-300 truncate max-w-[150px]">{settings.bank_account_holder || "AeroSuoh Tourism Management"}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
}
