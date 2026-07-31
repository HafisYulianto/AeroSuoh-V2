"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  sender: "bot" | "user";
  text: string;
}

export default function AdminAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Halo Admin! 👋 Saya **PanduBot**, asisten panduan Admin Panel AeroSuoh. Ada yang bisa saya bantu? Pilih topik di bawah atau ketik pertanyaan Anda!",
    },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickChips = [
    { label: "📊 Ringkasan Dasbor", query: "ringkasan dasbor" },
    { label: "⚙️ Pengaturan Situs", query: "pengaturan situs" },
    { label: "🖼️ Kelola Galeri", query: "galeri" },
    { label: "🛡️ Panduan Keselamatan", query: "keselamatan" },
    { label: "📚 Ensiklopedia", query: "ensiklopedia" },
    { label: "🗺️ Rute Akses", query: "rute" },
    { label: "📡 Dasbor Sensor", query: "sensor" },
    { label: "💬 Ulasan Pengunjung", query: "ulasan" },
    { label: "🎫 Reservasi Tiket", query: "reservasi" },
    { label: "👥 Manajemen Admin", query: "manajemen admin" },
    { label: "🔑 Login & Logout", query: "login" },
    { label: "❓ Fitur Apa Saja?", query: "fitur" },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const processBotReply = (userInput: string): string => {
    const q = userInput.toLowerCase();

    // === FITUR / OVERVIEW ===
    if (q.includes("fitur") || q.includes("apa saja") || q.includes("menu") || q.includes("bisa apa") || q.includes("fungsi") || q.includes("kegunaan")) {
      return "Admin Panel AeroSuoh memiliki **10 fitur utama**:\n\n" +
        "1️⃣ **Ringkasan Dasbor** — Lihat statistik reservasi, ulasan, dan data sensor\n" +
        "2️⃣ **Pengaturan Situs** — Ubah teks hero, logo, gambar background\n" +
        "3️⃣ **Pesona Suoh (Galeri)** — Kelola spot wisata, foto, deskripsi, sejarah\n" +
        "4️⃣ **Panduan Keselamatan** — Kelola aturan keselamatan pengunjung\n" +
        "5️⃣ **Kisah & Pengetahuan** — Kelola konten ensiklopedia edukatif\n" +
        "6️⃣ **Rute Akses** — Kelola informasi rute perjalanan ke Suoh\n" +
        "7️⃣ **Dasbor Sensor** — Input & pantau data sensor (H₂S, pH, suhu)\n" +
        "8️⃣ **Ulasan Pengunjung** — Moderasi ulasan dari wisatawan\n" +
        "9️⃣ **Reservasi Tiket** — Kelola pemesanan tiket & homestay\n" +
        "🔟 **Manajemen Admin** — Buat akun admin baru (khusus Super Admin)\n\n" +
        "Ketik nama fitur atau klik tombol topik untuk panduan lebih detail! 🚀";
    }

    // === RINGKASAN DASBOR ===
    if (q.includes("ringkasan") || q.includes("dasbor") || q.includes("dashboard") || q.includes("overview") || q.includes("statistik") || q.includes("beranda admin")) {
      return "📊 **Ringkasan Dasbor**\n\n" +
        "Halaman utama setelah login. Di sini Anda dapat melihat:\n\n" +
        "• **Total Reservasi Tiket** — Jumlah pemesanan masuk + yang menunggu konfirmasi\n" +
        "• **Ulasan Pengunjung** — Total ulasan + yang perlu dimoderasi\n" +
        "• **Gas Belerang (H₂S)** — Kadar gas terkini dalam satuan ppm\n" +
        "• **Keasaman Air (pH)** — Tingkat pH Danau Asam Suoh\n\n" +
        "📌 **Cara Pakai:**\n" +
        "1. Buka sidebar → klik **Ringkasan Dasbor**\n" +
        "2. Lihat 4 kartu statistik di bagian atas\n" +
        "3. Di bawahnya ada tabel **Reservasi Terbaru** (5 pemesanan terakhir)\n" +
        "4. Di samping kanan ada **Aksi Cepat** untuk langsung ke halaman tertentu\n\n" +
        "💡 *Tip: Klik \"Kelola\" di setiap kartu statistik untuk langsung menuju halaman pengelolaan terkait!*";
    }

    // === PENGATURAN SITUS ===
    if (q.includes("pengaturan") || q.includes("situs") || q.includes("setting") || q.includes("hero") || q.includes("logo") || q.includes("background") || q.includes("judul")) {
      return "⚙️ **Pengaturan Situs (Halaman Utama)**\n\n" +
        "Mengontrol tampilan landing page yang dilihat pengunjung.\n\n" +
        "📌 **Yang bisa diubah:**\n" +
        "• **Gambar Background Hero** — Foto besar di halaman utama\n" +
        "• **Logo Navbar** — Logo AeroSuoh di pojok kiri atas\n" +
        "• **Judul Hero Baris 1 & 2** — Teks besar di halaman utama (ID & EN)\n" +
        "• **Deskripsi Hero** — Paragraf penjelasan di bawah judul (ID & EN)\n" +
        "• **Label Tombol Hero** — Teks pada 2 tombol aksi utama (ID & EN)\n\n" +
        "📌 **Cara Pakai:**\n" +
        "1. Buka sidebar → klik **Pengaturan Situs**\n" +
        "2. Untuk upload gambar: klik tombol **Unggah Foto Baru** atau **Unggah Logo Baru**\n" +
        "3. Edit teks di kolom yang tersedia\n" +
        "4. Klik **Simpan Pengaturan** di bagian bawah\n\n" +
        "⚠️ *Tip: Ukuran gambar hero yang ideal adalah 1920x1080 pixel (landscape, di bawah 1MB)!*";
    }

    // === GALERI ===
    if (q.includes("galeri") || q.includes("gallery") || q.includes("spot") || q.includes("pesona") || q.includes("foto wisata") || q.includes("gambar wisata")) {
      return "🖼️ **Kelola Galeri & Pesona Suoh**\n\n" +
        "Mengelola database spot wisata yang tampil di halaman Pesona Suoh.\n\n" +
        "📌 **Yang bisa dilakukan:**\n" +
        "• **Tambah Spot Baru** — Klik tombol hijau \"Tambah Spot Baru\"\n" +
        "• **Edit Spot** — Klik tombol \"Edit\" di kartu spot yang ingin diubah\n" +
        "• **Hapus Spot** — Klik tombol \"Hapus\" (akan muncul konfirmasi)\n\n" +
        "📌 **Data yang perlu diisi:**\n" +
        "• Foto spot wisata (format JPG/PNG)\n" +
        "• Nama spot (Bahasa Indonesia & Inggris)\n" +
        "• Tipe wisata (contoh: Danau Vulkanik, Sumber Air Panas)\n" +
        "• Deskripsi singkat (ID & EN)\n" +
        "• Sejarah lengkap (ID & EN) — opsional\n" +
        "• Mitos lokal (ID & EN) — opsional\n" +
        "• Koordinat GPS (Latitude & Longitude)\n" +
        "• Urutan tampil (Sort Order)\n\n" +
        "💡 *Tip: Gunakan Google Maps untuk mendapatkan koordinat GPS yang akurat!*";
    }

    // === KESELAMATAN ===
    if (q.includes("keselamatan") || q.includes("safety") || q.includes("aturan") || q.includes("panduan") || q.includes("bahaya") || q.includes("masker")) {
      return "🛡️ **Panduan Keselamatan**\n\n" +
        "Mengelola daftar aturan keselamatan yang ditampilkan ke pengunjung.\n\n" +
        "📌 **Cara Pakai:**\n" +
        "1. Buka sidebar → klik **Panduan Keselamatan**\n" +
        "2. Klik **Tambah Aturan Baru** untuk membuat aturan baru\n" +
        "3. Isi formulir:\n" +
        "   • Unggah foto ilustrasi (opsional)\n" +
        "   • Nama aturan (ID & EN)\n" +
        "   • Deskripsi aturan (ID & EN)\n" +
        "   • Pilih ikon yang sesuai\n" +
        "   • Tentukan urutan tampil\n" +
        "4. Klik **Simpan Aturan**\n\n" +
        "📌 **Untuk edit/hapus:** Klik tombol di setiap kartu aturan.\n\n" +
        "💡 *Tip: Pastikan aturan paling penting memiliki urutan tampil paling kecil (1, 2, 3) agar muncul pertama!*";
    }

    // === ENSIKLOPEDIA ===
    if (q.includes("ensiklopedia") || q.includes("kisah") || q.includes("pengetahuan") || q.includes("encyclopedia") || q.includes("edukatif") || q.includes("konten")) {
      return "📚 **Kisah & Pengetahuan (Ensiklopedia)**\n\n" +
        "Mengelola konten edukatif tentang Suoh yang muncul di halaman pengunjung.\n\n" +
        "📌 **Cara Pakai:**\n" +
        "1. Buka sidebar → klik **Kisah & Pengetahuan**\n" +
        "2. Anda akan melihat daftar artikel yang sudah ada\n" +
        "3. Untuk setiap artikel, Anda bisa:\n" +
        "   • Mengubah **Foto Sampul** (klik Unggah Foto Sampul)\n" +
        "   • Mengedit **Judul** (ID & EN)\n" +
        "   • Mengedit **Konten/Isi** (ID & EN)\n" +
        "4. Perubahan tersimpan otomatis saat Anda klik **Simpan**\n\n" +
        "💡 *Tip: Tulis konten yang informatif dan menarik agar pengunjung tertarik membaca tentang keunikan Suoh!*";
    }

    // === RUTE ===
    if (q.includes("rute") || q.includes("akses") || q.includes("route") || q.includes("jalan") || q.includes("maps") || q.includes("perjalanan")) {
      return "🗺️ **Rute Akses**\n\n" +
        "Mengelola informasi rute perjalanan menuju kawasan Suoh.\n\n" +
        "📌 **Cara Pakai:**\n" +
        "1. Buka sidebar → klik **Rute Akses**\n" +
        "2. Anda dapat menambah, mengedit, atau menghapus rute\n" +
        "3. Setiap rute berisi informasi:\n" +
        "   • Nama/judul rute\n" +
        "   • Deskripsi rute (jarak, waktu tempuh, kondisi jalan)\n" +
        "   • Koordinat titik-titik waypoint\n\n" +
        "💡 *Tip: Perbarui informasi kondisi jalan secara berkala, terutama saat musim hujan!*";
    }

    // === SENSOR ===
    if (q.includes("sensor") || q.includes("h2s") || q.includes("ph") || q.includes("suhu") || q.includes("temperatur") || q.includes("gas") || q.includes("belerang") || q.includes("keasaman")) {
      return "📡 **Dasbor Sensor**\n\n" +
        "Mengelola data pembacaan sensor lingkungan kawasan Suoh.\n\n" +
        "📌 **Data yang diinput:**\n" +
        "• **Kadar H₂S (ppm)** — Gas belerang (normal < 30 ppm)\n" +
        "• **Status Gas (ID & EN)** — Keterangan kondisi gas\n" +
        "• **Tingkat pH** — Keasaman air (1-14, asam-basa)\n" +
        "• **Status Keasaman (ID & EN)** — Keterangan kondisi air\n" +
        "• **Suhu Air (°C)** — Temperatur air\n" +
        "• **Waktu Pembacaan** — Timestamp pengukuran\n\n" +
        "📌 **Cara Input Data Sensor:**\n" +
        "1. Buka sidebar → klik **Dasbor Sensor**\n" +
        "2. Isi semua kolom data sensor\n" +
        "3. Klik **Simpan Data Sensor**\n\n" +
        "📌 **Grafik Historis:**\n" +
        "• Di bawah formulir, ada bagian untuk menambah data grafik historis\n" +
        "• Isi Label, Nilai H₂S, dan Nilai pH, lalu klik **Tambah**\n\n" +
        "⚠️ *Penting: Jika kadar H₂S > 30 ppm, pastikan ubah status menjadi \"Waspada\" atau \"Berbahaya\"!*";
    }

    // === ULASAN ===
    if (q.includes("ulasan") || q.includes("review") || q.includes("testimonial") || q.includes("komentar") || q.includes("moderasi") || q.includes("approve")) {
      return "💬 **Ulasan Pengunjung**\n\n" +
        "Memoderasi ulasan/testimoni yang dikirim pengunjung.\n\n" +
        "📌 **Cara Kerja:**\n" +
        "Ulasan dari pengunjung masuk dengan status **\"Menunggu Moderasi\"**. Anda harus menyetujui sebelum ulasan tampil di halaman utama.\n\n" +
        "📌 **Cara Pakai:**\n" +
        "1. Buka sidebar → klik **Ulasan Pengunjung**\n" +
        "2. Anda akan melihat 2 bagian:\n" +
        "   • **Ulasan Menunggu Moderasi** — Ulasan baru yang belum disetujui\n" +
        "   • **Ulasan yang Sudah Disetujui** — Ulasan yang sudah tampil\n" +
        "3. Untuk setiap ulasan, Anda bisa:\n" +
        "   • ✅ **Setujui** — Klik tombol centang hijau\n" +
        "   • 🗑️ **Hapus** — Klik tombol hapus merah (permanen)\n\n" +
        "💡 *Tip: Baca ulasan dengan teliti sebelum menyetujui. Hapus ulasan yang mengandung konten tidak pantas!*";
    }

    // === RESERVASI ===
    if (q.includes("reservasi") || q.includes("tiket") || q.includes("booking") || q.includes("pemesanan") || q.includes("homestay") || q.includes("day trip")) {
      return "🎫 **Reservasi Tiket & Homestay**\n\n" +
        "Mengelola pemesanan tiket dari wisatawan.\n\n" +
        "📌 **Jenis Paket:**\n" +
        "• **Day Trip Pass** — Kunjungan harian tanpa menginap\n" +
        "• **Eco-Staycation** — Paket menginap di homestay\n\n" +
        "📌 **Cara Pakai:**\n" +
        "1. Buka sidebar → klik **Reservasi Tiket**\n" +
        "2. Gunakan kolom **pencarian** untuk mencari berdasarkan nama, no HP, atau homestay\n" +
        "3. Gunakan **filter status** (Semua, Pending, Approved, Rejected)\n" +
        "4. Untuk setiap pemesanan bertatus **\"pending\"**, Anda bisa:\n" +
        "   • ✅ **Setujui** — Klik tombol centang hijau\n" +
        "   • ❌ **Tolak** — Klik tombol silang merah\n" +
        "5. Tombol **🗑️ Hapus** tersedia untuk menghapus data permanen\n\n" +
        "💡 *Tip: Hubungi pengunjung via WhatsApp sebelum menyetujui untuk mengonfirmasi ketersediaan!*";
    }

    // === MANAJEMEN ADMIN ===
    if (q.includes("manajemen admin") || q.includes("buat admin") || q.includes("tambah admin") || q.includes("akun admin") || q.includes("super admin") || q.includes("kelola user") || q.includes("daftar admin")) {
      return "👥 **Manajemen Admin**\n\n" +
        "Membuat dan mengelola akun administrator. **Hanya tersedia untuk Super Admin!**\n\n" +
        "📌 **Jenis Peran:**\n" +
        "• **Admin Standar** — Bisa mengelola konten & monitoring\n" +
        "• **Super Admin** — Bisa mengelola konten, monitoring, DAN membuat/menghapus akun admin lain\n\n" +
        "📌 **Cara Membuat Admin Baru:**\n" +
        "1. Buka sidebar → klik **Manajemen Admin**\n" +
        "2. Klik **Daftarkan Admin Baru**\n" +
        "3. Isi formulir:\n" +
        "   • Nama Lengkap\n" +
        "   • Alamat Email\n" +
        "   • Kata Sandi (min. 6 karakter)\n" +
        "   • Pilih Peran (Admin Standar / Super Admin)\n" +
        "4. Klik **Simpan & Daftarkan Admin**\n\n" +
        "📌 **Menghapus Admin:**\n" +
        "Klik ikon hapus (🗑️) di baris admin yang ingin dihapus. Akan muncul dialog konfirmasi.\n\n" +
        "⚠️ *Peringatan: Menghapus admin bersifat permanen dan tidak bisa dibatalkan!*";
    }

    // === LOGIN / LOGOUT ===
    if (q.includes("login") || q.includes("logout") || q.includes("masuk") || q.includes("keluar") || q.includes("sesi") || q.includes("kata sandi") || q.includes("password") || q.includes("lupa")) {
      return "🔑 **Login & Logout**\n\n" +
        "📌 **Cara Login:**\n" +
        "1. Buka halaman `/admin`\n" +
        "2. Masukkan **Alamat Email** dan **Kata Sandi** Anda\n" +
        "3. Klik **Masuk Sistem**\n" +
        "4. Jika berhasil, Anda akan diarahkan ke Ringkasan Dasbor\n\n" +
        "📌 **Cara Logout:**\n" +
        "1. Klik tombol **Keluar Akun** di bagian bawah sidebar\n" +
        "2. Akan muncul dialog konfirmasi\n" +
        "3. Klik **Ya, Keluar**\n\n" +
        "⚠️ *Jika Anda lupa kata sandi, hubungi Super Admin untuk mereset akun Anda!*";
    }

    // === SALAM ===
    if (q.includes("halo") || q.includes("hai") || q.includes("hi") || q.includes("pagi") || q.includes("siang") || q.includes("sore") || q.includes("malam") || q.includes("assalamualaikum")) {
      return "Halo Admin! 👋 Selamat datang di PanduBot! Saya siap membantu Anda mengoperasikan Admin Panel AeroSuoh. Silakan pilih topik atau ketik pertanyaan Anda! 😊";
    }

    // === TERIMA KASIH ===
    if (q.includes("terima kasih") || q.includes("makasih") || q.includes("thanks") || q.includes("ok") || q.includes("oke") || q.includes("mantap") || q.includes("sip") || q.includes("baik")) {
      return "Sama-sama, Admin! 🙏 Senang bisa membantu. Jika ada pertanyaan lain tentang cara menggunakan Admin Panel, jangan ragu untuk bertanya lagi! 💪";
    }

    // === DEFAULT / TIDAK DIKENALI ===
    return "Maaf, saya belum memahami pertanyaan tersebut. 🤔\n\nCoba tanyakan tentang salah satu fitur berikut:\n" +
      "• Ringkasan Dasbor\n• Pengaturan Situs\n• Galeri\n• Panduan Keselamatan\n• Ensiklopedia\n• Rute Akses\n• Dasbor Sensor\n• Ulasan Pengunjung\n• Reservasi Tiket\n• Manajemen Admin\n\nAtau klik salah satu tombol topik di atas! 👆";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { sender: "user", text: input.trim() };
    const botReply: Message = { sender: "bot", text: processBotReply(input.trim()) };
    setMessages((prev) => [...prev, userMsg, botReply]);
    setInput("");
  };

  const handleChip = (query: string) => {
    const userMsg: Message = { sender: "user", text: query };
    const botReply: Message = { sender: "bot", text: processBotReply(query) };
    setMessages((prev) => [...prev, userMsg, botReply]);
  };

  // Simple markdown-like bold rendering
  const renderText = (text: string) => {
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={j} className="font-extrabold">{part.slice(2, -2)}</strong>
          ) : (
            <span key={j}>{part}</span>
          )
        )}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 cursor-pointer ${
          open
            ? "bg-slate-700 hover:bg-slate-600 rotate-90"
            : "bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 animate-bounce"
        }`}
        title="PanduBot — Asisten Panduan Admin"
      >
        {open ? <X size={24} className="text-white" /> : <Bot size={24} className="text-white" />}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[560px] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-4 flex items-center gap-3 shrink-0">
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <Sparkles size={20} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-white font-extrabold text-sm tracking-wide">PanduBot</h3>
              <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Asisten Panduan Admin</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 custom-scrollbar bg-slate-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={14} className="text-emerald-700" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-xs leading-relaxed font-medium ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white rounded-br-sm"
                      : "bg-white text-slate-700 border border-slate-200 shadow-sm rounded-bl-sm"
                  }`}
                >
                  {renderText(msg.text)}
                </div>
                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-1">
                    <User size={14} className="text-slate-600" />
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Chips */}
          <div className="px-4 py-2 border-t border-slate-100 bg-white overflow-x-auto shrink-0">
            <div className="flex gap-1.5 flex-wrap max-h-[72px] overflow-y-auto custom-scrollbar">
              {quickChips.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleChip(chip.query)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer border border-slate-200 hover:border-emerald-300"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-slate-200 bg-white shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Tanya PanduBot..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white rounded-xl outline-none text-xs font-semibold text-slate-700 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all disabled:bg-slate-300 cursor-pointer shadow-md shadow-emerald-600/20"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
