import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY belum diatur di .env.local");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// 1. GET: Ambil daftar seluruh user admin beserta metadata password (raw_password)
export async function GET() {
  try {
    const adminSupabase = getAdminClient();

    // Ambil daftar user dari Supabase Auth
    const { data: authUsers, error: authErr } = await adminSupabase.auth.admin.listUsers();
    if (authErr) throw authErr;

    // Ambil data profil dari database
    const { data: profiles, error: profileErr } = await adminSupabase
      .from("profiles")
      .select("*");
    if (profileErr) throw profileErr;

    const profileMap = new Map(profiles ? profiles.map((p) => [p.id, p]) : []);

    // Gabungkan data auth & profiles
    const usersList = authUsers.users.map((u) => {
      const p = profileMap.get(u.id);
      return {
        id: u.id,
        email: u.email || p?.email || "",
        full_name: p?.full_name || u.user_metadata?.full_name || "Admin",
        role: p?.role || u.user_metadata?.role || "admin",
        raw_password: u.user_metadata?.raw_password || "(Belum disetel)",
        created_at: u.created_at || p?.created_at || new Date().toISOString(),
      };
    });

    // Urutkan terbaru dulu
    usersList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ users: usersList });
  } catch (err: any) {
    console.error("Gagal mengambil data user admin:", err);
    return NextResponse.json(
      { error: err.message || "Gagal mengambil data admin." },
      { status: 500 }
    );
  }
}

// 2. POST: Membuat user admin baru
export async function POST(request: Request) {
  try {
    const { email, password, fullName, role } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Semua field wajib diisi." },
        { status: 400 }
      );
    }

    const adminSupabase = getAdminClient();

    // 1. Buat user di Supabase Auth dengan metadata raw_password
    const { data: authData, error: authErr } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: role || "admin",
        raw_password: password,
      },
    });

    if (authErr) throw authErr;

    // 2. Simpan/Update data ke tabel profiles
    if (authData?.user) {
      const { error: profileErr } = await adminSupabase
        .from("profiles")
        .upsert({
          id: authData.user.id,
          email,
          full_name: fullName,
          role: role || "admin",
        });

      if (profileErr) {
        console.warn("Peringatan upsert profile:", profileErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Gagal membuat admin baru:", err);
    return NextResponse.json(
      { error: err.message || "Gagal membuat admin baru." },
      { status: 500 }
    );
  }
}

// 3. PUT: Mengedit user admin existing (Nama, Email, Role, Password)
export async function PUT(request: Request) {
  try {
    const { id, email, password, fullName, role } = await request.json();

    if (!id || !email || !fullName) {
      return NextResponse.json(
        { error: "ID, Email, dan Nama Lengkap wajib diisi." },
        { status: 400 }
      );
    }

    const adminSupabase = getAdminClient();

    // Ambil data user yang ada sekarang untuk mempertahankan user_metadata
    const { data: userData, error: getUserErr } = await adminSupabase.auth.admin.getUserById(id);
    if (getUserErr) throw getUserErr;

    const existingMeta = userData.user.user_metadata || {};

    // Prepare Auth update payload
    const updatePayload: any = {
      email,
      user_metadata: {
        ...existingMeta,
        full_name: fullName,
        role: role || "admin",
      },
    };

    if (password && password.trim() !== "") {
      updatePayload.password = password;
      updatePayload.user_metadata.raw_password = password;
    }

    // 1. Update Supabase Auth user
    const { error: authErr } = await adminSupabase.auth.admin.updateUserById(id, updatePayload);
    if (authErr) throw authErr;

    // 2. Update tabel profiles
    const { error: profileErr } = await adminSupabase
      .from("profiles")
      .update({
        email,
        full_name: fullName,
        role: role || "admin",
      })
      .eq("id", id);

    if (profileErr) throw profileErr;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Gagal memperbarui admin:", err);
    return NextResponse.json(
      { error: err.message || "Gagal memperbarui admin." },
      { status: 500 }
    );
  }
}

// 4. DELETE: Menghapus user admin dari Auth dan Profiles
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID user wajib disertakan." },
        { status: 400 }
      );
    }

    const adminSupabase = getAdminClient();

    // 1. Hapus dari Supabase Auth
    const { error: authErr } = await adminSupabase.auth.admin.deleteUser(id);
    if (authErr) {
      console.warn("Gagal hapus dari auth (mungkin sudah terhapus):", authErr);
    }

    // 2. Hapus dari tabel profiles
    const { error: profileErr } = await adminSupabase
      .from("profiles")
      .delete()
      .eq("id", id);

    if (profileErr) throw profileErr;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Gagal menghapus admin:", err);
    return NextResponse.json(
      { error: err.message || "Gagal menghapus admin." },
      { status: 500 }
    );
  }
}
