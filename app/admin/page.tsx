"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Cek jika sudah login
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/admin/dashboard");
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        // Verifikasi role di profiles
        const { data: profile, error: profileErr } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        if (profileErr || !profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
          // Logout jika bukan admin
          await supabase.auth.signOut();
          throw new Error("Akses ditolak: Anda bukan administrator.");
        }

        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Email atau password salah.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-950 via-slate-900 to-emerald-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10 animate-pulse"></div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] shadow-2xl p-8 relative overflow-hidden">
        {/* Top Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-24 h-24 mb-4">
            <Image
              src="/logo-aerosuoh2.png"
              alt="AeroSuoh Logo"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl font-black text-white tracking-wide">AeroSuoh Admin</h2>
          <p className="text-xs text-emerald-300 font-bold uppercase tracking-widest mt-1">
            Sign in to manage portal
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs font-semibold rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@aerosuoh.com"
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 focus:border-emerald-500 focus:bg-white/10 rounded-xl text-white outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 focus:border-emerald-500 focus:bg-white/10 rounded-xl text-white outline-none transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-emerald-700"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Login System</span>
            )}
          </button>
        </form>
      </div>

      <p className="text-slate-500 text-xs mt-8">
        © 2026 AeroSuoh. Protected Area.
      </p>
    </div>
  );
}
