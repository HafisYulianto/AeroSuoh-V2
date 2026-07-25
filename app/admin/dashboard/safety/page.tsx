"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import { Plus, Edit2, Trash2, Save, Upload, X, Loader2 } from "lucide-react";
import * as Lucide from "lucide-react";
import Image from "next/image";

export default function SafetyRulesAdmin() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingRule, setEditingRule] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [titleId, setTitleId] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descId, setDescId] = useState("");
  const [descEn, setDescEn] = useState("");
  const [iconName, setIconName] = useState("ShieldAlert");
  const [imageUrl, setImageUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  const loadRules = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("safety_rules")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      if (data) setRules(data);
    } catch (err) {
      console.error("Gagal memuat safety rules:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  const handleEditClick = (rule: any) => {
    setEditingRule(rule);
    setTitleId(rule.title_id);
    setTitleEn(rule.title_en);
    setDescId(rule.desc_id);
    setDescEn(rule.desc_en);
    setIconName(rule.icon_name);
    setImageUrl(rule.image_url || "");
    setSortOrder(rule.sort_order);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingRule(null);
    setTitleId("");
    setTitleEn("");
    setDescId("");
    setDescEn("");
    setIconName("ShieldAlert");
    setImageUrl("");
    setSortOrder(rules.length + 1);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `safety_${Date.now()}.${fileExt}`;
      
      const { error: uploadErr } = await supabase.storage
        .from("media")
        .upload(fileName, file);

      if (uploadErr) throw uploadErr;

      const { data } = supabase.storage.from("media").getPublicUrl(fileName);
      setImageUrl(data.publicUrl);
    } catch (err) {
      console.error("Gagal upload gambar:", err);
      alert("Gagal mengupload gambar.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title_id: titleId,
      title_en: titleEn,
      desc_id: descId,
      desc_en: descEn,
      icon_name: iconName,
      image_url: imageUrl || null,
      sort_order: Number(sortOrder)
    };

    try {
      if (editingRule) {
        const { error } = await supabase
          .from("safety_rules")
          .update(payload)
          .eq("id", editingRule.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("safety_rules")
          .insert([payload]);
        if (error) throw error;
      }

      setShowForm(false);
      loadRules();
    } catch (err) {
      console.error("Gagal menyimpan aturan:", err);
      alert("Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus aturan keselamatan ini?")) return;

    try {
      const { error } = await supabase
        .from("safety_rules")
        .delete()
        .eq("id", id);
      if (error) throw error;
      loadRules();
    } catch (err) {
      console.error("Gagal menghapus aturan:", err);
      alert("Gagal menghapus data.");
    }
  };

  const getIconElement = (name: string) => {
    const IconComponent = (Lucide as any)[name] || Lucide.ShieldAlert;
    return <IconComponent size={24} className="text-amber-500" />;
  };

  const availableIcons = ["ShieldAlert", "Footprints", "Wind", "Users", "AlertTriangle", "Eye", "Compass", "HeartHandshake"];

  if (loading && !showForm) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Kelola Panduan Keselamatan</h2>
          <p className="text-sm text-slate-500 mt-1">Ubah atau tambahkan instruksi keselamatan untuk pengunjung wisata Suoh.</p>
        </div>
        {!showForm && (
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/10 cursor-pointer"
          >
            <Plus size={18} />
            Tambah Aturan Baru
          </button>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-800">
              {editingRule ? `Edit Aturan: ${editingRule.title_id}` : "Tambah Aturan Baru"}
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"
            >
              <X size={20} />
            </button>
          </div>

          {/* Upload Image / Photo */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Foto / Ilustrasi Kustom (Opsional)</label>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {imageUrl && (
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                </div>
              )}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold tracking-wider cursor-pointer">
                    <Upload size={14} />
                    {uploading ? "Uploading..." : "Upload Foto"}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold"
                    >
                      Hapus Foto
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-slate-400">Jika foto di-upload, ikon di sebelah kiri aturan akan digantikan oleh foto ini.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title ID & EN */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nama Aturan (Bahasa Indonesia)</label>
              <input
                type="text"
                value={titleId}
                onChange={(e) => setTitleId(e.target.value)}
                required
                placeholder="e.g. Wajib Masker Gas"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Rule Name (English)</label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                required
                placeholder="e.g. Gas Mask Required"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium"
              />
            </div>

            {/* Description ID & EN */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Deskripsi Aturan (ID)</label>
              <textarea
                rows={3}
                value={descId}
                onChange={(e) => setDescId(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Rule Description (EN)</label>
              <textarea
                rows={3}
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium resize-none"
              />
            </div>

            {/* Icon Name selection */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Ikon Terkait</label>
              <select
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium"
              >
                {availableIcons.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Urutan Tampil (Sort Order)</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition-all disabled:bg-emerald-400 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Simpan Aturan</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* List Rules Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rules.map((rule) => (
            <div key={rule.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-slate-50 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mb-5 relative overflow-hidden">
                  {rule.image_url ? (
                    <Image src={rule.image_url} alt={rule.title_id} fill className="object-cover" />
                  ) : (
                    getIconElement(rule.icon_name)
                  )}
                </div>
                
                <h3 className="text-base font-bold text-slate-800 mb-2">{rule.title_id}</h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-4">{rule.desc_id}</p>
              </div>

              <div className="border-t border-slate-100 mt-6 pt-4 flex gap-2 justify-end">
                <button
                  onClick={() => handleEditClick(rule)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 text-slate-600 hover:text-emerald-600 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  <Edit2 size={12} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(rule.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-rose-50 border border-slate-100 hover:border-rose-200 text-slate-600 hover:text-rose-600 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  <Trash2 size={12} />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
