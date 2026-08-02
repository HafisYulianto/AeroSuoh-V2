"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import { MessageSquare, Eye, EyeOff, Trash2, Star, CheckCircle, Loader2, Calendar } from "lucide-react";
import AdminModal, { ModalState } from "../../../../components/admin/AdminModal";

export default function TestimonialsModeration() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  
  // Custom Modal State
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: "",
    description: "",
  });

  const closeModal = () => setModal((prev) => ({ ...prev, isOpen: false }));

  const loadReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (data) setReviews(data);
    } catch (err) {
      console.error("Gagal memuat ulasan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleToggleApproved = async (id: string, currentStatus: boolean) => {
    setActingId(id);
    try {
      const { error } = await supabase
        .from("testimonials")
        .update({ approved: !currentStatus })
        .eq("id", id);
      if (error) throw error;
      loadReviews();
    } catch (err) {
      console.error("Gagal memperbarui status ulasan:", err);
      setModal({
        isOpen: true,
        type: "danger",
        title: "Gagal Memperbarui Status",
        description: "Status visibilitas ulasan tidak dapat diubah. Silakan coba beberapa saat lagi.",
        isConfirmOnly: true,
        confirmText: "Mengerti",
        onConfirm: closeModal,
      });
      setActingId(null);
    }
  };

  const confirmDelete = (id: string, name: string) => {
    setModal({
      isOpen: true,
      type: "danger",
      title: "Hapus Ulasan Pengunjung?",
      description: `Apakah Anda yakin ingin menghapus ulasan dari "${name}" secara permanen? Ulasan yang dihapus akan hilang secara langsung dari database dan website publik.`,
      confirmText: "Ya, Hapus Permanen",
      cancelText: "Batal",
      onCancel: closeModal,
      onConfirm: () => executeDelete(id),
    });
  };

  const executeDelete = async (id: string) => {
    closeModal();
    setActingId(id);
    try {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", id);
      if (error) throw error;
      loadReviews();
    } catch (err) {
      console.error("Gagal menghapus ulasan:", err);
      setModal({
        isOpen: true,
        type: "danger",
        title: "Gagal Menghapus Data",
        description: "Gagal menghapus ulasan dari database. Silakan coba beberapa saat lagi.",
        isConfirmOnly: true,
        confirmText: "Tutup",
        onConfirm: closeModal,
      });
      setActingId(null);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat Ulasan Pengunjung...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl pb-12">
      <div>
        <div className="flex items-center gap-2 text-emerald-600 mb-1">
          <MessageSquare size={20} />
          <span className="text-xs font-bold uppercase tracking-wider">Manajemen Ulasan & Testimoni</span>
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Ulasan Pengunjung Publik</h1>
        <p className="text-xs text-slate-500 mt-1">
          Ulasan pengunjung secara otomatis terpublikasi langsung ke situs web. Sebagai Admin, Anda dapat menghapus ulasan yang tidak layak atau menyembunyikannya kapan saja.
        </p>
      </div>

      {/* STATS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Seluruh Ulasan</span>
            <span className="text-2xl font-black text-slate-800 mt-1 block">{reviews.length}</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <MessageSquare size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Status Publikasi</span>
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full inline-block mt-1">
              ⚡ Otomatis Terpublikasi (Auto-Publish)
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle size={24} />
          </div>
        </div>
      </div>

      {/* REVIEWS GRID */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span>Daftar Ulasan Pengunjung</span>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black">{reviews.length}</span>
          </h3>
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-sm font-semibold text-slate-400">
            Belum ada ulasan dari pengunjung. Ulasan baru yang dikirim publik akan otomatis tampil di sini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img src={review.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg"} alt={review.name} className="w-10 h-10 rounded-full border border-slate-100 shadow-sm shrink-0" />
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">{review.name}</h4>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">{review.origin}</p>
                      </div>
                    </div>

                    <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                      <Calendar size={10} />
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                  
                  <div className="flex gap-0.5 text-amber-400 mb-3">
                    {Array.from({ length: review.rating || 5 }).map((_, star) => (
                      <Star key={star} size={14} fill="currentColor" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed italic mb-6">"{review.text}"</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                    review.approved 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {review.approved ? "Tampil di Web" : "Disembunyikan"}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleApproved(review.id, review.approved)}
                      disabled={actingId === review.id}
                      title={review.approved ? "Sembunyikan dari Web" : "Tampilkan ke Web"}
                      className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
                    >
                      {review.approved ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      onClick={() => confirmDelete(review.id, review.name)}
                      disabled={actingId === review.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modern Modal Dialog */}
      <AdminModal {...modal} />

    </div>
  );
}

