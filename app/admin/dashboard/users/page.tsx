"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../../lib/supabase";
import { 
  Users, 
  Trash2, 
  Edit2, 
  X, 
  Plus, 
  Save, 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  Loader2, 
  ShieldAlert,
  Lock
} from "lucide-react";
import AdminModal, { ModalState } from "../../../../components/admin/AdminModal";

export default function UserManagementAdmin() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Map untuk toggle password per baris (id -> boolean)
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});

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

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const result = await res.json();
      if (res.ok && result.users) {
        setUsers(result.users);
      } else {
        // Fallback: baca dari supabase profiles langsung
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        if (data) setUsers(data);
      }
    } catch (err) {
      console.error("Gagal memuat profil admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const togglePasswordVisibility = (id: string) => {
    setShowPasswordMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenAddForm = () => {
    setEditingUser(null);
    setEmail("");
    setPassword("");
    setFullName("");
    setRole("admin");
    setErrorMsg("");
    setShowForm(true);
  };

  const handleOpenEditForm = (user: any) => {
    setEditingUser(user);
    setEmail(user.email || "");
    setPassword(""); // Kosongkan agar opsional
    setFullName(user.full_name || "");
    setRole(user.role || "admin");
    setErrorMsg("");
    setShowForm(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");
    setErrorMsg("");

    try {
      const isEdit = !!editingUser;
      const url = "/api/admin/users";
      const method = isEdit ? "PUT" : "POST";
      const payload: any = {
        email,
        fullName,
        role,
      };

      if (isEdit) {
        payload.id = editingUser.id;
        if (password.trim() !== "") {
          payload.password = password;
        }
      } else {
        payload.password = password;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || `Gagal ${isEdit ? "memperbarui" : "membuat"} admin.`);
      }

      setStatus("success");
      setShowForm(false);
      loadUsers();

      setTimeout(() => setStatus("idle"), 4000);
    } catch (err: any) {
      console.error("Gagal menyimpan akun admin:", err);
      setErrorMsg(err.message || "Gagal menyimpan akun admin.");
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
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Gagal menghapus user.");
      }

      loadUsers();
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
          <p className="text-sm text-slate-500 mt-1">
            Pengelolaan penuh (CRUD) dan visibilitas password akun Admin CMS & Super Admin AeroSuoh.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={handleOpenAddForm}
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
          <span>Data administrator berhasil diperbarui/disimpan!</span>
        </div>
      )}

      {showForm ? (
        <form
          onSubmit={handleSubmitForm}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6 max-w-xl animate-in fade-in duration-200"
        >
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Key size={18} className="text-emerald-600" />
              {editingUser ? `Edit Akun: ${editingUser.full_name || editingUser.email}` : "Buat Akun Administrator Baru"}
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
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Nama Lengkap
              </label>
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
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Alamat Email
              </label>
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
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                {editingUser ? "Kata Sandi Baru (Opsional)" : "Kata Sandi Akun"}
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!editingUser}
                placeholder={editingUser ? "Kosongkan jika tidak ingin mengubah password" : "Minimal 6 karakter"}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Hak Akses (Peran)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-sm text-slate-800 font-medium"
              >
                <option value="admin">Admin CMS (Konten & Monitoring)</option>
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
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>{editingUser ? "Simpan Perubahan" : "Daftarkan Akun"}</span>
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
                  <th className="p-6">Password</th>
                  <th className="p-6">Peran</th>
                  <th className="p-6">Terdaftar Pada</th>
                  <th className="p-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center font-semibold text-slate-400">
                      Belum ada data administrator.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const isVisible = !!showPasswordMap[u.id];
                    const passText = u.raw_password || "••••••••";
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/30 transition-colors">
                        {/* Name */}
                        <td className="p-6 font-bold text-slate-800">{u.full_name || "Admin"}</td>

                        {/* Email */}
                        <td className="p-6 text-slate-600 font-mono">{u.email}</td>

                        {/* Password with Eye Toggle */}
                        <td className="p-6 font-mono">
                          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 w-fit">
                            <span className="text-xs font-bold text-slate-700 min-w-[80px]">
                              {isVisible ? passText : "••••••••"}
                            </span>
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(u.id)}
                              className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                              title={isVisible ? "Sembunyikan Password" : "Lihat Password"}
                            >
                              {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td className="p-6">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              u.role === "super_admin"
                                ? "bg-purple-100 text-purple-800 border border-purple-200"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            {u.role === "super_admin" ? "SUPER_ADMIN" : "ADMIN_CMS"}
                          </span>
                        </td>

                        {/* Created Date */}
                        <td className="p-6 text-slate-500 font-medium text-xs">
                          {new Date(u.created_at).toLocaleDateString("id-ID")}
                        </td>

                        {/* Actions: Edit & Delete */}
                        <td className="p-6 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => handleOpenEditForm(u)}
                              className="p-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 border border-slate-200 hover:border-emerald-200 rounded-lg transition-all cursor-pointer"
                              title="Edit Administrator"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => confirmDeleteUser(u.id, u.full_name || u.email)}
                              disabled={deletingId === u.id}
                              className="p-1.5 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg transition-all cursor-pointer"
                              title="Hapus Administrator"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
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
