"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { 
  Ticket, 
  MessageSquare, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Settings
} from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalReviews: 0,
    pendingReviews: 0,
    h2s: 0,
    ph: 0,
  });
  const [latestBookings, setLatestBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        // Fetch bookings count
        const { count: totalBookings } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true });

        const { count: pendingBookings } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");

        // Fetch testimonials count
        const { count: totalReviews } = await supabase
          .from("testimonials")
          .select("*", { count: "exact", head: true });

        const { count: pendingReviews } = await supabase
          .from("testimonials")
          .select("*", { count: "exact", head: true })
          .eq("approved", false);

        // Fetch latest sensor reading
        const { data: sensor } = await supabase
          .from("sensor_readings")
          .select("*")
          .order("recorded_at", { ascending: false })
          .limit(1)
          .single();

        // Fetch latest bookings
        const { data: bookings } = await supabase
          .from("bookings")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);

        setStats({
          totalBookings: totalBookings || 0,
          pendingBookings: pendingBookings || 0,
          totalReviews: totalReviews || 0,
          pendingReviews: pendingReviews || 0,
          h2s: sensor?.h2s_ppm || 0,
          ph: sensor?.ph_level || 0,
        });

        if (bookings) setLatestBookings(bookings);
      } catch (err) {
        console.error("Gagal memuat overview stats:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOverviewData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Reservasi Tiket",
      value: stats.totalBookings,
      subtitle: `${stats.pendingBookings} Menunggu Konfirmasi`,
      icon: Ticket,
      color: "bg-emerald-500",
      link: "/admin/dashboard/bookings"
    },
    {
      title: "Ulasan Pengunjung",
      value: stats.totalReviews,
      subtitle: `${stats.pendingReviews} Perlu Moderasi`,
      icon: MessageSquare,
      color: "bg-amber-500",
      link: "/admin/dashboard/testimonials"
    },
    {
      title: "Gas Belerang (H2S)",
      value: `${stats.h2s} ppm`,
      subtitle: stats.h2s > 30 ? "Status: Waspada" : "Status: Normal / Aman",
      icon: AlertTriangle,
      color: stats.h2s > 30 ? "bg-rose-500" : "bg-emerald-600",
      link: "/admin/dashboard/sensor"
    },
    {
      title: "Keasaman Air (pH)",
      value: `${stats.ph} pH`,
      subtitle: "Danau Asam Suoh",
      icon: Activity,
      color: "bg-sky-500",
      link: "/admin/dashboard/sensor"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Title */}
      <div>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Overview Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">Status dan ringkasan aktivitas sistem pariwisata AeroSuoh.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.title}</p>
                  <h3 className="text-3xl font-black text-slate-800 mt-2">{card.value}</h3>
                </div>
                <div className={`p-3 rounded-2xl ${card.color} text-white shrink-0 shadow-md shadow-slate-200`}>
                  <Icon size={22} />
                </div>
              </div>
              
              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{card.subtitle}</span>
                <Link href={card.link} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5">
                  Kelola <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Bookings List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><Ticket size={18} className="text-emerald-600" /> Reservasi Terbaru</h3>
            <Link href="/admin/dashboard/bookings" className="text-xs font-bold text-emerald-600 hover:underline">Lihat Semua</Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Nama</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Tanggal</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Paket</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Tamu</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {latestBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-sm text-slate-400">Belum ada pemesanan tiket.</td>
                  </tr>
                ) : (
                  latestBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/55 transition-colors">
                      <td className="py-3 text-sm font-bold text-slate-800">{b.name}</td>
                      <td className="py-3 text-sm text-slate-500">{b.visit_date}</td>
                      <td className="py-3 text-sm font-medium text-slate-700">
                        {b.ticket_type === "homestay" ? `Staycation (${b.homestay})` : "Day Trip Pass"}
                      </td>
                      <td className="py-3 text-sm text-slate-600 font-mono">{b.guests} Org</td>
                      <td className="py-3 text-right">
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Tools Panel */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <TrendingUp size={18} className="text-emerald-600" />
              <h3 className="font-bold text-slate-800">Aksi Cepat</h3>
            </div>
            
            <div className="space-y-3">
              <Link 
                href="/admin/dashboard/site-settings"
                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl text-slate-400 group-hover:text-emerald-600 shadow-sm">
                    <Settings size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-900">Ubah Teks Hero</span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-emerald-600" />
              </Link>

              <Link 
                href="/admin/dashboard/gallery"
                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl text-slate-400 group-hover:text-emerald-600 shadow-sm">
                    <MessageSquare size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-900">Tambah Spot Galeri</span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-emerald-600" />
              </Link>

              <Link 
                href="/admin/dashboard/sensor"
                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl text-slate-400 group-hover:text-emerald-600 shadow-sm">
                    <Activity size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-900">Input Data Sensor Baru</span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-emerald-600" />
              </Link>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 mt-6 flex gap-3 items-center">
            <CheckCircle2 className="text-emerald-600 shrink-0" size={24} />
            <div>
              <h5 className="text-xs font-black text-emerald-900 uppercase tracking-wide">Sistem Aktif</h5>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Semua parameter operasional berjalan normal.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
