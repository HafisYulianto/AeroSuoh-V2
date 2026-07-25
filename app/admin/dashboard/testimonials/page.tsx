"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import { MessageSquare, Check, X, Trash2, Star, CheckCircle, Loader2 } from "lucide-react";

export default function TestimonialsModeration() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

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

  const handleApprove = async (id: string) => {
    setActingId(id);
    try {
      const { error } = await supabase
        .from("testimonials")
        .update({ approved: true })
        .eq("id", id);
      if (error) throw error;
      loadReviews();
    } catch (err) {
      console.error("Gagal menyetujui ulasan:", err);
      alert("Gagal menyetujui ulasan.");
      setActingId(null);
    }
  };

  const handleUnapprove = async (id: string) => {
    setActingId(id);
    try {
      const { error } = await supabase
        .from("testimonials")
        .update({ approved: false })
        .eq("id", id);
      if (error) throw error;
      loadReviews();
    } catch (err) {
      console.error("Gagal menolak ulasan:", err);
      alert("Gagal memperbarui status.");
      setActingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus ulasan ini secara permanen?")) return;
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
      alert("Gagal menghapus ulasan.");
      setActingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const pendingReviews = reviews.filter(r => !r.approved);
  const approvedReviews = reviews.filter(r => r.approved);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
          <MessageSquare size={28} className="text-slate-600" />
          Moderasi Ulasan Pengunjung
        </h2>
        <p className="text-sm text-slate-500 mt-1">Setujui ulasan baru yang dikirim oleh publik agar tampil di landing page utama.</p>
      </div>

      {/* PENDING TESTIMONIALS */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
          <span>Menunggu Persetujuan</span>
          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-black">{pendingReviews.length}</span>
        </h3>

        {pendingReviews.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-sm font-semibold text-slate-400">
            Tidak ada ulasan baru yang menunggu persetujuan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingReviews.map((review) => (
              <div key={review.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full -z-10"></div>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <img src={review.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg"} alt={review.name} className="w-10 h-10 rounded-full border border-slate-100 shadow-sm" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{review.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{review.origin}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-0.5 text-amber-400 mb-3">
                    {Array.from({ length: review.rating }).map((_, star) => (
                      <Star key={star} size={14} fill="currentColor" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed italic mb-6">"{review.text}"</p>
                </div>

                <div className="flex gap-2 justify-end border-t border-slate-50 pt-4">
                  <button
                    onClick={() => handleApprove(review.id)}
                    disabled={actingId === review.id}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer disabled:bg-emerald-400"
                  >
                    <Check size={12} />
                    Approve
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={actingId === review.id}
                    className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
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

      {/* APPROVED TESTIMONIALS */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
          <span>Ulasan Aktif (Tampil di Web)</span>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black">{approvedReviews.length}</span>
        </h3>

        {approvedReviews.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-sm font-semibold text-slate-400">
            Belum ada ulasan aktif yang dipublikasikan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {approvedReviews.map((review) => (
              <div key={review.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -z-10"></div>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <img src={review.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg"} alt={review.name} className="w-10 h-10 rounded-full border border-slate-100 shadow-sm" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{review.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{review.origin}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-0.5 text-amber-400 mb-3">
                    {Array.from({ length: review.rating }).map((_, star) => (
                      <Star key={star} size={14} fill="currentColor" />
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed italic mb-6">"{review.text}"</p>
                </div>

                <div className="flex gap-2 justify-end border-t border-slate-50 pt-4">
                  <button
                    onClick={() => handleUnapprove(review.id)}
                    disabled={actingId === review.id}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-bold border border-amber-200 transition-colors cursor-pointer"
                  >
                    <X size={12} />
                    Sembunyikan
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={actingId === review.id}
                    className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
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

    </div>
  );
}
