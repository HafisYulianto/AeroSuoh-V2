"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import { Ticket, Check, X, Trash2, Calendar, Users, Home, Loader2, Search } from "lucide-react";
import AdminModal, { ModalState } from "../../../../components/admin/AdminModal";

export default function BookingsAdmin() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  // Custom Modal State
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: "",
    description: "",
  });

  const closeModal = () => setModal((prev) => ({ ...prev, isOpen: false }));

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (data) {
        setBookings(data);
        setFilteredBookings(data);
      }
    } catch (err) {
      console.error("Gagal memuat reservasi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    let result = bookings;

    if (statusFilter !== "all") {
      result = result.filter(b => b.status === statusFilter);
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.name.toLowerCase().includes(query) || 
        (b.phone && b.phone.includes(query)) ||
        (b.homestay && b.homestay.toLowerCase().includes(query))
      );
    }

    setFilteredBookings(result);
  }, [statusFilter, searchQuery, bookings]);

  const handleUpdateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    setActingId(id);
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
      loadBookings();
    } catch (err) {
      console.error("Gagal update status booking:", err);
      setModal({
        isOpen: true,
        type: "danger",
        title: "Gagal Mengubah Status",
        description: "Terjadi kesalahan saat memperbarui status reservasi. Silakan periksa jaringan Anda.",
        isConfirmOnly: true,
        confirmText: "Tutup",
        onConfirm: closeModal,
      });
    } finally {
      setActingId(null);
    }
  };

  const confirmDelete = (id: string, name: string) => {
    setModal({
      isOpen: true,
      type: "danger",
      title: "Hapus Reservasi Tiket?",
      description: `Apakah Anda yakin ingin menghapus data pemesanan atas nama "${name}"? Data pemesanan ini akan terhapus secara permanen.`,
      confirmText: "Ya, Hapus Reservasi",
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
        .from("bookings")
        .delete()
        .eq("id", id);
      if (error) throw error;
      loadBookings();
    } catch (err) {
      console.error("Gagal menghapus booking:", err);
      setModal({
        isOpen: true,
        type: "danger",
        title: "Gagal Menghapus Reservasi",
        description: "Gagal menghapus data reservasi dari database. Silakan coba lagi nanti.",
        isConfirmOnly: true,
        confirmText: "Tutup",
        onConfirm: closeModal,
      });
    } finally {
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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
          <Ticket size={28} className="text-slate-600" />
          Kelola Reservasi Tiket & Homestay
        </h2>
        <p className="text-sm text-slate-500 mt-1">Daftar lengkap pemesanan tiket Day Trip dan Eco-Staycation oleh wisatawan.</p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Cari nama, no HP, homestay..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-xs font-semibold text-slate-700 transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                statusFilter === status
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {status === "all" ? "Semua Status" : status}
            </button>
          ))}
        </div>

      </div>

      {/* Bookings Table List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-6">Nama Pengunjung</th>
                <th className="p-6">No. WhatsApp</th>
                <th className="p-6">Tanggal Rencana</th>
                <th className="p-6">Paket Pilihan</th>
                <th className="p-6">Jumlah Tamu</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Aksi Kelola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center font-semibold text-slate-400">Tidak ada data pemesanan yang cocok.</td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/30 transition-colors">
                    {/* Name */}
                    <td className="p-6 font-bold text-slate-800">{b.name}</td>
                    
                    {/* Phone */}
                    <td className="p-6 text-slate-600 font-mono">{b.phone || "-"}</td>
                    
                    {/* Visit Date */}
                    <td className="p-6 text-slate-600">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{b.visit_date}</span>
                      </div>
                    </td>

                    {/* Ticket Type */}
                    <td className="p-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-semibold text-slate-700">
                          {b.ticket_type === "homestay" ? "Eco-Staycation" : "Day Trip Pass"}
                        </span>
                        {b.homestay && (
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 uppercase tracking-wide">
                            <Home size={10} /> {b.homestay}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Guests count */}
                    <td className="p-6 font-bold font-mono text-slate-700">{b.guests} Pax</td>

                    {/* Status Badge */}
                    <td className="p-6">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        b.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : b.status === "rejected"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {b.status}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="p-6 text-right">
                      <div className="flex gap-2 justify-end">
                        {b.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(b.id, "approved")}
                              disabled={actingId === b.id}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-100 hover:border-emerald-600 rounded-lg transition-all cursor-pointer"
                              title="Setujui Pemesanan"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(b.id, "rejected")}
                              disabled={actingId === b.id}
                              className="p-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-100 hover:border-rose-600 rounded-lg transition-all cursor-pointer"
                              title="Tolak Pemesanan"
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => confirmDelete(b.id, b.name)}
                          disabled={actingId === b.id}
                          className="p-1.5 bg-slate-50 hover:bg-slate-200 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg transition-all cursor-pointer"
                          title="Hapus Permanen"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modern Modal Dialog */}
      <AdminModal {...modal} />
    </div>
  );
}
