"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { 
  LayoutDashboard, 
  Settings, 
  Image, 
  ShieldAlert, 
  BookOpen, 
  Map, 
  Activity, 
  MessageSquare, 
  Ticket, 
  Users, 
  LogOut, 
  Menu, 
  X,
  Loader2,
  CreditCard
} from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";
import AdminModal, { ModalState } from "../../../components/admin/AdminModal";
import AdminAssistant from "../../../components/admin/AdminAssistant";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Custom Modal State for Logout Confirmation
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    title: "",
    description: "",
  });

  const closeModal = () => setModal((prev) => ({ ...prev, isOpen: false }));

  const confirmLogout = () => {
    setModal({
      isOpen: true,
      type: "warning",
      title: "Keluar dari Sistem Admin?",
      description: "Sesi Anda akan diakhiri dan Anda harus masuk kembali untuk mengelola portal AeroSuoh.",
      confirmText: "Ya, Keluar",
      cancelText: "Batal",
      onCancel: closeModal,
      onConfirm: executeLogout,
    });
  };

  const executeLogout = async () => {
    closeModal();
    await supabase.auth.signOut();
    router.push("/admin");
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin");
        return;
      }

      // Fetch profile
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error || !data || (data.role !== "admin" && data.role !== "super_admin")) {
          await supabase.auth.signOut();
          router.push("/admin");
          return;
        }

        setProfile(data);
      } catch (err) {
        console.error("Gagal memuat profil admin:", err);
        router.push("/admin");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-emerald-500" size={40} />
          <p className="text-sm font-semibold tracking-wider text-slate-400">MEMUAT DASBOR...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: "Ringkasan Dasbor", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Metode Pembayaran", path: "/admin/dashboard/payments", icon: CreditCard },
    { name: "Pengaturan Situs", path: "/admin/dashboard/site-settings", icon: Settings },
    { name: "Pesona Suoh (Galeri)", path: "/admin/dashboard/gallery", icon: Image },
    { name: "Panduan Keselamatan", path: "/admin/dashboard/safety", icon: ShieldAlert },
    { name: "Kisah & Pengetahuan", path: "/admin/dashboard/encyclopedia", icon: BookOpen },
    { name: "Rute Akses", path: "/admin/dashboard/routes", icon: Map },
    { name: "Dasbor Sensor", path: "/admin/dashboard/sensor", icon: Activity },
    { name: "Ulasan Pengunjung", path: "/admin/dashboard/testimonials", icon: MessageSquare },
    { name: "Reservasi Tiket", path: "/admin/dashboard/bookings", icon: Ticket },
    // Hanya tampil untuk super_admin
    ...(profile?.role === "super_admin" 
      ? [{ name: "Manajemen Admin", path: "/admin/dashboard/users", icon: Users }] 
      : []
    ),
  ];

  return (
    <div className="h-screen bg-slate-100 flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between z-50 sticky top-0 shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <NextImage src="/logo-aerosuoh2.png" alt="Logo" width={40} height={40} className="w-10 h-auto object-contain" />
          <span className="font-extrabold text-base tracking-wide text-emerald-400">AeroSuoh Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-300">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar (Desktop and Mobile drawer) */}
      <aside 
        className={`bg-slate-900 text-slate-300 w-64 shrink-0 flex flex-col justify-between fixed md:sticky top-0 h-screen z-40 transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Header logo */}
          <div className="p-5 border-b border-slate-800 hidden md:flex items-center gap-4">
            <NextImage src="/logo-aerosuoh2.png" alt="Logo" width={44} height={44} className="w-10 h-auto object-contain" />
            <div>
              <h1 className="font-black text-white text-base leading-tight tracking-wide">AeroSuoh</h1>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Admin Panel</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] custom-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2 rounded-xl font-semibold text-xs transition-all ${
                    active 
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-700/30" 
                      : "hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-3 mb-2.5 px-1">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white font-extrabold text-xs shadow-inner uppercase shrink-0">
              {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || "A"}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-bold text-xs text-white truncate">{profile?.full_name || "Admin"}</h4>
              <p className="text-[9px] text-emerald-400 font-bold tracking-wider uppercase truncate">{profile?.role}</p>
            </div>
          </div>

          <button 
            onClick={confirmLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-bold text-xs bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 hover:border-rose-600 transition-all cursor-pointer"
          >
            <LogOut size={13} />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* Dim overlay for mobile drawer */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        ></div>
      )}

      {/* Main Content Area (Compact 1-Screen Height Bounded Area) */}
      <main className="flex-1 p-4 md:p-6 max-w-full overflow-y-auto h-full custom-scrollbar">
        {children}
      </main>

      {/* Modern Modal Dialog for Admin Actions */}
      <AdminModal {...modal} />

      {/* Chatbot Khusus Admin Panel (PanduBot) */}
      <AdminAssistant />
    </div>
  );
}

