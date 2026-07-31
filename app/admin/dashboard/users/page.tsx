"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import { Users, UserPlus, Shield, Trash2, Mail, Lock, User, CheckCircle, Loader2, X, Plus, Save, Key } from "lucide-react";
import AdminModal, { ModalState } from "../../../../components/admin/AdminModal";

export default function UserManagementAdmin() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Custom Modal State
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: "",
    description: "",
  });

  const closeModal = () => setModal((prev) => ({ ...prev, isOpen: false }));

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("admin");

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (data) setProfiles(data);
    } catch (err) {
      console.error("Gagal memuat profil admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, role }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal membuat user.");
      }

      setStatus("success");
      setEmail("");
      setPassword("");
      setFullName("");
      setRole("admin");
      setShowForm(false);
      loadProfiles();
      
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err: any) {
      console.error("Gagal membuat admin baru:", err);
      setErrorMsg(err.message || "Gagal membuat admin baru.");
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteUser = async (id: string, name: string) => {
    const checkSelf = await supabase.auth.getUser();
    if (checkSelf.data.user?.id === id) {
      setModal({
        isOpen: true,
        type: "warning",
        title: "Aksi Tidak Diizinkan",
        description: "Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif digunakan.",
        isConfirmOnly: true,
        confirmText: "Paham",
        onConfirm: closeModal,
      });
      return;
    }

    setModal({
      isOpen: true,
      type: "danger",
      title: "Hapus Akun Admin?",
      description: `Apakah Anda yakin ingin menghapus administrator "${name}"? Hak akses mereka ke Admin Panel akan dicabut secara permanen.`,
      confirmText: "Ya, Hapus Akses",
      cancelText: "Batal",
      onCancel: closeModal,
      onConfirm: () => executeDeleteUser(id),
    });
  };

  const executeDeleteUser = async (id: string) => {
    closeModal();
    setDeletingId(id);
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      loadProfiles();
    } catch (err) {
      console.error("Gagal menghapus administrator:", err);
      setModal({
        isOpen: true,
        type: "danger",
        title: "Gagal Menghapus Admin",
        description: "Terjadi kesalahan saat mencabut akses akun dari database.",
        isConfirmOnly: true,
        confirmText: "Tutup",
        onConfirm: closeModal,
      });
    } finally {
      setDeletingId(null);
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
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            <Users size={28} className="text-slate-600" />
            Kelola Akun Administrator
          </h2>
          <p className="text-sm text-slate-500 mt-1">Daftar pengguna yang memiliki akses untuk mengelola portal AeroSuoh.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/10 cursor-pointer"
          >
            <Plus size={18} />
            Daftarkan Admin Baru
          </button>
        )}
      </div>

      {status === "success" && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 font-semibold text-sm animate-in fade-in">
          <CheckCircle className="text-emerald-600 shrink-0" />
          <span>Akun administrator baru berhasil dibuat!</span>
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleCreateUser} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6 max-w-xl animate-in fade-in duration-200">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Key size={18} className="text-emerald-600" />
              Buat Akun Administrator Baru
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"
            >
              <X size={20} />
            </button>
          </div>

          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Nama Lengkap</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="e.g. Hafis Yulianto"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Alamat Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g. hafis@aerosuoh.com"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Kata Sandi Akun</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Minimal 6 karakter"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Hak Akses (Peran)</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium"
              >
                <option value="admin">Admin Standar (Konten & Monitoring)</option>
                <option value="super_admin">Super Admin (Konten, Monitoring & Kelola User)</option>
              </select>
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
                  <span>Mendaftarkan...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Daftarkan Akun</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Profiles list table */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-6">Administrator</th>
                  <th className="p-6">Email</th>
                  <th className="p-6">Peran</th>
                  <th className="p-6">Terdaftar Pada</th>
                  <th className="p-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {profiles.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-6 font-bold text-slate-800">{p.full_name || "Admin"}</td>
                    <td className="p-6 text-slate-600 font-mono">{p.email}</td>
                    <td className="p-6">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        p.role === "super_admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {p.role}
                      </span>
                    </td>
                    <td className="p-6 text-slate-500">{new Date(p.created_at).toLocaleDateString("id-ID")}</td>
                    <td className="p-6 text-right">
                      <button
                        onClick={() => confirmDeleteUser(p.id, p.full_name || p.email)}
                        disabled={deletingId === p.id}
                        className="p-1.5 hover:bg-rose-50 text-rose-600 border border-transparent hover:border-rose-100 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Administrator"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modern Modal Dialog */}
      <AdminModal {...modal} />
    </div>
  );
}

