import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password, fullName, role } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseServiceKey) {
      return NextResponse.json(
        { error: "Konfigurasi server tidak lengkap: SUPABASE_SERVICE_ROLE_KEY belum diatur di .env.local" },
        { status: 500 }
      );
    }

    // Buat client admin dengan service role key (bisa bypass auth/RLS & create user)
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 1. Buat user di Auth Supabase
    const { data: authData, error: authErr } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: role || "admin"
      }
    });

    if (authErr) throw authErr;

    // Catatan: Trigger on_auth_user_created di database akan otomatis memasukkan data 
    // ke tabel profiles secara otomatis jika terpasang. 
    // Sebagai cadangan, kita pastikan data masuk ke profiles:
    if (authData?.user) {
      const { error: profileErr } = await adminSupabase
        .from("profiles")
        .upsert({
          id: authData.user.id,
          email,
          full_name: fullName,
          role: role || "admin"
        });

      if (profileErr) {
        console.warn("Profil gagal di-upsert secara manual, mungkin sudah ditangani oleh trigger DB:", profileErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Gagal membuat admin baru:", err);
    return NextResponse.json(
      { error: err.message || "Gagal membuat user." },
      { status: 500 }
    );
  }
}
