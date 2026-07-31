"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import { Image as ImageIcon, Plus, Edit2, Trash2, Save, X, Upload, MapPin, Loader2 } from "lucide-react";
import AdminModal, { ModalState } from "../../../../components/admin/AdminModal";
import Image from "next/image";

export default function GalleryAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Custom Modal State
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: "",
    description: "",
  });

  const closeModal = () => setModal((prev) => ({ ...prev, isOpen: false }));

  // Form states
  const [titleId, setTitleId] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [typeId, setTypeId] = useState("");
  const [typeEn, setTypeEn] = useState("");
  const [descId, setDescId] = useState("");
  const [descEn, setDescEn] = useState("");
  const [histId, setHistId] = useState("");
  const [histEn, setHistEn] = useState("");
  const [mitosId, setMitosId] = useState("");
  const [mitosEn, setMitosEn] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [sortOrder, setSortOrder] = useState(0);

  const loadGallery = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      if (data) setItems(data);
    } catch (err) {
      console.error("Gagal memuat galeri:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleEditClick = (item: any) => {
    setEditingItem(item);
    setTitleId(item.title_id);
    setTitleEn(item.title_en);
    setTypeId(item.type_id);
    setTypeEn(item.type_en);
    setDescId(item.desc_id);
    setDescEn(item.desc_en);
    setHistId(item.history_id);
    setHistEn(item.history_en);
    setMitosId(item.mitos_id);
    setMitosEn(item.mitos_en);
    setImageUrl(item.image_url);
    setLat(item.lat);
    setLng(item.lng);
    setSortOrder(item.sort_order);
    setShowForm(true);
  };

  const handleAddClick = () => {
    setEditingItem(null);
    setTitleId("");
    setTitleEn("");
    setTypeId("Danau Vulkanik");
    setTypeEn("Volcanic Lake");
    setDescId("");
    setDescEn("");
    setHistId("");
    setHistEn("");
    setMitosId("");
    setMitosEn("");
    setImageUrl("");
    setLat(-5.238);
    setLng(104.278);
    setSortOrder(items.length + 1);
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `gallery_${Date.now()}.${fileExt}`;
      
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
      type_id: typeId,
      type_en: typeEn,
      desc_id: descId,
      desc_en: descEn,
      history_id: histId,
      history_en: histEn,
      mitos_id: mitosId,
      mitos_en: mitosEn,
      image_url: imageUrl,
      lat: Number(lat),
      lng: Number(lng),
      sort_order: Number(sortOrder)
    };

    try {
      if (editingItem) {
        // Update
        const { error } = await supabase
          .from("gallery_items")
          .update(payload)
          .eq("id", editingItem.id);
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from("gallery_items")
          .insert([payload]);
        if (error) throw error;
      }

      setShowForm(false);
      loadGallery();
    } catch (err) {
      console.error("Gagal menyimpan galeri:", err);
      setModal({
        isOpen: true,
        type: "danger",
        title: "Gagal Menyimpan Data",
        description: "Terjadi kesalahan saat menyimpan spot wisata ke database. Silakan periksa kembali formulir Anda.",
        isConfirmOnly: true,
        confirmText: "Tutup",
        onConfirm: closeModal,
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: string, title: string) => {
    setModal({
      isOpen: true,
      type: "danger",
      title: "Hapus Spot Galeri?",
      description: `Apakah Anda yakin ingin menghapus spot galeri "${title}"? Tindakan ini akan menghapus data beserta lokasi 3D explorer secara permanen.`,
      confirmText: "Ya, Hapus Spot",
      cancelText: "Batal",
      onCancel: closeModal,
      onConfirm: () => executeDelete(id),
    });
  };

  const executeDelete = async (id: string) => {
    closeModal();
    try {
      const { error } = await supabase
        .from("gallery_items")
        .delete()
        .eq("id", id);
      if (error) throw error;
      loadGallery();
    } catch (err) {
      console.error("Gagal menghapus galeri:", err);
      setModal({
        isOpen: true,
        type: "danger",
        title: "Gagal Menghapus Spot",
        description: "Tidak dapat menghapus spot ini dari database. Silakan coba lagi.",
        isConfirmOnly: true,
        confirmText: "Tutup",
        onConfirm: closeModal,
      });
    }
  };


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
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Kelola Galeri & Pesona Suoh</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola spot wisata, foto, deskripsi, sejarah lengkap, dan mitos lokal.</p>
        </div>
        {!showForm && (
          <button
            onClick={handleAddClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/10 cursor-pointer"
          >
            <Plus size={18} />
            Tambah Spot Baru
          </button>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-800">
              {editingItem ? `Edit Spot: ${editingItem.title_id}` : "Tambah Spot Wisata Baru"}
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"
            >
              <X size={20} />
            </button>
          </div>

          {/* Upload Image */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Foto Spot Wisata</label>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {imageUrl && (
                <div className="relative w-48 h-32 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                  <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                </div>
              )}
              <div className="space-y-2">
                <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold tracking-wider cursor-pointer">
                  <Upload size={14} />
                  {uploading ? "Mengunggah..." : "Unggah Foto"}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <p className="text-[10px] text-slate-400">Pilih gambar dengan resolusi baik berformat JPG/PNG.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title ID & EN */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nama Spot (Bahasa Indonesia)</label>
              <input
                type="text"
                value={titleId}
                onChange={(e) => setTitleId(e.target.value)}
                required
                placeholder="e.g. Danau Asam"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nama Spot (Bahasa Inggris)</label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                required
                placeholder="e.g. Acid Lake"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium"
              />
            </div>

            {/* Type ID & EN */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Tipe Wisata (ID)</label>
              <input
                type="text"
                value={typeId}
                onChange={(e) => setTypeId(e.target.value)}
                required
                placeholder="e.g. Danau Vulkanik"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Tipe Wisata (Bahasa Inggris)</label>
              <input
                type="text"
                value={typeEn}
                onChange={(e) => setTypeEn(e.target.value)}
                required
                placeholder="e.g. Volcanic Lake"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium"
              />
            </div>

            {/* Brief Description */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Deskripsi Singkat (ID)</label>
              <textarea
                rows={3}
                value={descId}
                onChange={(e) => setDescId(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Deskripsi Singkat (Bahasa Inggris)</label>
              <textarea
                rows={3}
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium resize-none"
              />
            </div>

            {/* History */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Sejarah Lengkap (ID)</label>
              <textarea
                rows={4}
                value={histId}
                onChange={(e) => setHistId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Sejarah Lengkap (Bahasa Inggris)</label>
              <textarea
                rows={4}
                value={histEn}
                onChange={(e) => setHistEn(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium resize-none"
              />
            </div>

            {/* Local Myth */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Mitos Lokal (ID)</label>
              <textarea
                rows={4}
                value={mitosId}
                onChange={(e) => setMitosId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Mitos Lokal (Bahasa Inggris)</label>
              <textarea
                rows={4}
                value={mitosEn}
                onChange={(e) => setMitosEn(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium resize-none"
              />
            </div>

            {/* Coordinates Lat / Lng */}
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Garis Lintang (Latitude)</label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(Number(e.target.value))}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Garis Bujur (Longitude)</label>
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(Number(e.target.value))}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium"
              />
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
                  <span>Simpan Spot</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Grid List Spot */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/10] w-full bg-slate-100">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.title_id} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-semibold text-xs">Belum Ada Foto</div>
                  )}
                  <span className="absolute top-4 left-4 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-600/90 backdrop-blur-md text-white rounded-full">
                    {item.type_id}
                  </span>
                </div>
                
                <div className="p-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-lg">{item.title_id}</h3>
                    <span className="text-xs font-mono font-bold text-slate-400">Urutan: {item.sort_order}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.desc_id}</p>
                  <p className="text-[10px] text-slate-400 font-mono">Koordinat: {item.lat}, {item.lng}</p>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
                <button
                  onClick={() => handleEditClick(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-300 hover:text-emerald-600 text-slate-600 rounded-lg text-xs font-bold tracking-wide transition-all shadow-xs cursor-pointer"
                >
                  <Edit2 size={12} />
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(item.id, item.title_id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-rose-300 hover:text-rose-600 text-slate-600 rounded-lg text-xs font-bold tracking-wide transition-all shadow-xs cursor-pointer"
                >
                  <Trash2 size={12} />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Modal Dialog */}
      <AdminModal {...modal} />
    </div>
  );
}

