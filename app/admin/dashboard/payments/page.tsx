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
    <div className="space-y-8 max-w-5xl pb-12">
      {/* Header Page */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <CreditCard size={20} />
            <span className="text-xs font-bold uppercase tracking-wider">Manajemen Keuangan & Transaksi</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Metode Pembayaran & QRIS</h1>
          <p className="text-xs text-slate-500 mt-1">
            Atur foto barcode QRIS dan rincian rekening bank/e-wallet untuk pembayaran tiket pengunjung.
          </p>
        </div>

        <button
          onClick={loadSettings}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all w-fit cursor-pointer"
        >
          <RefreshCw size={14} />
          <span>Muat Ulang Data</span>
        </button>
      </div>

      {/* Success / Error Notification */}
      {status === "success" && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 font-semibold text-sm animate-in fade-in">
          <CheckCircle size={20} className="text-emerald-600 shrink-0" />
          <span>Metode pembayaran berhasil disimpan! Perubahan sudah aktif di halaman pemesanan tiket pengunjung.</span>
        </div>
      )}

      {status === "error" && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl font-semibold text-sm">
          Gagal menyimpan perubahan metode pembayaran. Silakan coba lagi.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* GRID 2-KOLOM PENGATURAN & PREVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* FORM PENGATURAN (8 KOLOM) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
            
            {/* OPSI 1: KODE QRIS */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-base border-b border-slate-100 pb-2">
                <QrCode size={18} className="text-emerald-600" />
                <h3>1. Foto Barcode QRIS</h3>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="relative w-36 h-48 rounded-xl overflow-hidden bg-white border border-slate-300 shadow-sm shrink-0 flex items-center justify-center p-2">
                  <Image 
                    src={settings.qris_image_url || "/payment/QRIS.png"}
                    alt="Barcode QRIS"
                    fill
                    className="object-contain p-1"
                  />
                </div>

                <div className="space-y-3 flex-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Unggah Foto QRIS Baru</label>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Unggah foto barcode QRIS resmi dari M-Banking/E-Wallet Anda (Format JPG/PNG).
                  </p>

                  <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md shadow-emerald-600/20">
                    <Upload size={14} />
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
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-base border-b border-slate-100 pb-2">
                <Building2 size={18} className="text-emerald-600" />
                <h3>2. Opsi Transfer Bank / E-Wallet</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nama Bank / Provider E-Wallet</label>
                  <input 
                    type="text" 
                    value={settings.bank_name || ""}
                    onChange={(e) => handleChange("bank_name", e.target.value)}
                    placeholder="Contoh: Bank BRI / Mandiri / Dana / OVO"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nomor Rekening / No. HP E-Wallet</label>
                  <input 
                    type="text" 
                    value={settings.bank_account_number || ""}
                    onChange={(e) => handleChange("bank_account_number", e.target.value)}
                    placeholder="Contoh: 1234-01-005678-53-9 atau 081234567890"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-mono tracking-wider transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Atas Nama (Nama Pemilik Rekening)</label>
                  <input 
                    type="text" 
                    value={settings.bank_account_holder || ""}
                    onChange={(e) => handleChange("bank_account_holder", e.target.value)}
                    placeholder="Contoh: AeroSuoh Tourism Management / Hafis Yulianto"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium transition-all"
                  />
                </div>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="border-t border-slate-100 pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer disabled:bg-emerald-400 text-sm"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Simpan Metode Pembayaran</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* SIMULASI LIVE PREVIEW SISI PENGUNJUNG (5 KOLOM) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-lg space-y-4 border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Simulasi Tampilan Pengunjung</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">Live Sync</span>
              </div>

              {/* Preview QRIS */}
              <div className="bg-white rounded-2xl p-4 text-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Preview QRIS Pembayaran:</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">Scan Barcode</span>
                </div>
                <div className="relative w-full h-48 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center p-2">
                  <Image 
                    src={settings.qris_image_url || "/payment/QRIS.png"}
                    alt="Preview QRIS Modal"
                    fill
                    className="object-contain p-1"
                  />
                </div>
              </div>

              {/* Preview Bank */}
              <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 text-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Preview Transfer Bank:</span>
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
                  <span className="text-slate-300">{settings.bank_account_holder || "AeroSuoh Tourism Management"}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed italic">
                *Setiap kali Anda menekan tombol "Simpan Metode Pembayaran", data di atas langsung diperbarui di modal pemesanan tiket pengunjung.
              </p>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
}
