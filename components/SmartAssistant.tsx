"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Bot, Ticket, Calendar, Users, Home, ArrowRight, CheckCircle2, Send, QrCode, Globe, Sparkles, Copy, Check, Building2, CreditCard } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabase";

export default function SmartAssistant() {
  const { lang, toggleLang, t, getSetting } = useLanguage();
  const [activeModal, setActiveModal] = useState<"chat" | "booking" | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "transfer">("qris");
  const [copiedBank, setCopiedBank] = useState(false);

  useEffect(() => {
    const handleOpenBooking = () => setActiveModal("booking");
    window.addEventListener('open-booking-modal', handleOpenBooking);
    return () => window.removeEventListener('open-booking-modal', handleOpenBooking);
  }, []);

  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({ name: "", phone: "", date: "", guests: 1, type: "", homestay: "" });
  const [bookingErrors, setBookingErrors] = useState<{name?: string; phone?: string; date?: string; guests?: string}>({});

  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: "bot", 
      text: lang === "ID" 
        ? "Halo! Saya AeroBot 🤖. Asisten virtual pintar Anda untuk kawasan Suoh. Ada yang bisa saya bantu?\n\n💡 *Pilih topik pertanyaan cepat di bawah ini atau ketik pesan Anda!*" 
        : "Hello! I'm AeroBot 🤖. Your smart virtual assistant for the Suoh region. How can I help you today?\n\n💡 *Choose a quick topic below or type your message!*" 
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1) {
        return [{
          sender: "bot",
          text: lang === "ID"
            ? "Halo! Saya AeroBot 🤖. Asisten virtual pintar Anda untuk kawasan Suoh. Ada yang bisa saya bantu?\n\n💡 *Pilih topik pertanyaan cepat di bawah ini atau ketik pesan Anda!*"
            : "Hello! I'm AeroBot 🤖. Your smart virtual assistant for the Suoh region. How can I help you today?\n\n💡 *Choose a quick topic below or type your message!*"
        }];
      }
      return prev;
    });
  }, [lang]);

  const quickChips = lang === "ID" ? [
    { label: "🎫 Tiket & Biaya", query: "tiket" },
    { label: "🌤️ Cuaca & Suhu", query: "cuaca" },
    { label: "🏡 Homestay & Cabin", query: "homestay" },
    { label: "📍 Rute & Jalan", query: "rute" },
    { label: "🛡️ Keamanan Gas", query: "keamanan" },
    { label: "🌋 6 Spot Wisata", query: "danau" },
    { label: "☕ Kuliner & Kopi", query: "kuliner" },
    { label: "🎒 Pakaian & Sepatu", query: "pakaian" },
    { label: "⛺ Camping & Foto", query: "aktivitas" },
    { label: "🚙 Ojek & Parkir", query: "kendaraan" },
    { label: "📱 Sinyal Internet", query: "sinyal" },
    { label: "📜 Sejarah & Mitos", query: "sejarah" },
    { label: "🕌 Toilet & Musholla", query: "toilet" },
    { label: "📸 Drone & Cas Listrik", query: "drone" },
    { label: "🌿 Flora & Anggrek", query: "flora" },
    { label: "🛍️ Oleh-oleh & Souvenir", query: "souvenir" },
    { label: "🩺 P3K & Kesehatan", query: "kesehatan" },
    { label: "👥 Bus & Rombongan", query: "rombongan" },
    { label: "📞 Kontak Admin", query: "kontak" },
  ] : [
    { label: "🎫 Tickets & Fees", query: "ticket" },
    { label: "🌤️ Weather & Temp", query: "weather" },
    { label: "🏡 Homestays & Cabins", query: "homestay" },
    { label: "📍 Routes & Maps", query: "route" },
    { label: "🛡️ Safety & Gas", query: "safe" },
    { label: "🌋 6 Attractions", query: "lake" },
    { label: "☕ Food & Coffee", query: "food" },
    { label: "🎒 Outfit & Shoes", query: "clothes" },
    { label: "⛺ Camping & Activities", query: "activity" },
    { label: "🚙 Bikes & Parking", query: "transport" },
    { label: "📱 Signal & Wifi", query: "signal" },
    { label: "📜 History & Lore", query: "history" },
    { label: "🕌 Toilets & Prayer", query: "toilet" },
    { label: "📸 Drones & Charging", query: "drone" },
    { label: "🌿 Flora & Orchids", query: "flora" },
    { label: "🛍️ Souvenirs & Gifts", query: "souvenir" },
    { label: "🩺 First Aid & Medical", query: "health" },
    { label: "👥 Buses & Groups", query: "bus" },
    { label: "📞 Admin Contact", query: "contact" },
  ];

  const processBotReply = (userQuery: string) => {
    setIsTyping(true);

    setTimeout(() => {
      let botReply = "";
      const inputLower = userQuery.toLowerCase();

      if (lang === "ID") {
        if (inputLower.includes("halo") || inputLower.includes("hai") || inputLower.includes("pagi") || inputLower.includes("siang") || inputLower.includes("sore") || inputLower.includes("malam") || inputLower.includes("assalamualaikum") || inputLower.includes("salam")) {
          botReply = "Halo! Saya AeroBot 🤖. Ada yang bisa saya bantu terkait informasi wisata, tiket, rute, atau kondisi geotermal Suoh hari ini? 👋";
        } 
        else if (inputLower.includes("tiket") || inputLower.includes("harga") || inputLower.includes("bayar") || inputLower.includes("biaya") || inputLower.includes("tarif") || inputLower.includes("masuk") || inputLower.includes("karcis") || inputLower.includes("qris") || inputLower.includes("promo") || inputLower.includes("diskon")) {
          botReply = "🎫 **Informasi Tiket & Biaya Suoh:**\n\n• **Day Trip Pass:** Rp 25.000 / orang (Akses kawasan danau & titik kawah)\n• **Eco-Staycation:** Mulai Rp 175.000 / malam (Tiket + Homestay warga lokal)\n• **Retribusi Parkir:** Motor Rp 5.000 | Mobil Rp 10.000\n\nPembayaran mendukung Cash, QRIS, & M-Banking. Klik tombol *Pesan Tiket & Homestay* untuk pemesanan langsung! 🎟️";
        } 
        else if (inputLower.includes("homestay") || inputLower.includes("nginap") || inputLower.includes("menginap") || inputLower.includes("hotel") || inputLower.includes("penginapan") || inputLower.includes("tidur") || inputLower.includes("villa") || inputLower.includes("kamar") || inputLower.includes("cabin")) {
          botReply = "🏡 **Akomodasi & Homestay Lokal:**\n\nKami bekerjasama dengan warga lokal Suoh menyediakan:\n1. **Homestay Danau Asam** (View danau, fasilitas air hangat alami) - Rp 175.000/malam\n2. **Geothermal Cabin** (Suasana pedesaan asri dekat area kawah) - Rp 250.000/malam\n\nFasilitas mencakup kasur nyaman, kamar mandi bersih, & sarapan khas lokal!";
        } 
        else if (inputLower.includes("aman") || inputLower.includes("bahaya") || inputLower.includes("gas") || inputLower.includes("meletus") || inputLower.includes("belerang") || inputLower.includes("beracun") || inputLower.includes("takut") || inputLower.includes("resiko") || inputLower.includes("erupsi") || inputLower.includes("sirine") || inputLower.includes("masker")) {
          botReply = "🛡️ **Protokol Keamanan Geotermal Suoh:**\n\nKawasan Suoh dipantau ketat 24/7 oleh sensor real-time AeroSuoh (H₂S & SO₂).\n• Selalu berada di **Zona Hijau** & patuhi papan petunjuk keselamatan.\n• Wajib memakai masker respirator (disediakan di basecamp).\n• Dilarang keras menyentuh lumpur mendidih!\n\nJika sensor mendeteksi batas gas meningkat, sirine peringatan dini akan berbunyi otomatis. Selama patuhi arahan, kunjungan 100% aman! 🟢";
        } 
        else if (inputLower.includes("lokasi") || inputLower.includes("dimana") || inputLower.includes("rute") || inputLower.includes("jalan") || inputLower.includes("akses") || inputLower.includes("alamat") || inputLower.includes("maps") || inputLower.includes("jarak") || inputLower.includes("arah")) {
          botReply = "🗺️ **Rute & Akses Lokasi:**\n\nSuoh berada di Kab. Lampung Barat. Tersedia 2 rute utama:\n1. **Via Liwa (Utara):** ±45 km (1.5 - 2 jam), jalan beraspal mulus melintasi bukit kopi.\n2. **Via Tanggamus / Wonosobo (Selatan):** ±80 km (2.5 - 3 jam), disarankan motor trail / mobil 4x4.\n\nCek visualisasi peta satelit 3D interaktif di menu *Pemetaan Udara*!";
        } 
        else if (inputLower.includes("jam") || inputLower.includes("buka") || inputLower.includes("tutup") || inputLower.includes("operasional") || inputLower.includes("kapan") || inputLower.includes("waktu") || inputLower.includes("jadwal")) {
          botReply = "🌅 **Jam Operasional & Waktu Terbaik:**\n\n• **Buka Setiap Hari:** 07.00 - 17.00 WIB.\n• **Waktu Terbaik Pagi:** 07.00 - 09.00 WIB (kabut tebal danau & udara segar pegunungan).\n• **Waktu Terbaik Sore:** 15.30 - 17.00 WIB (sunset estetik di Danau Lebar).";
        } 
        else if (inputLower.includes("danau") || inputLower.includes("kawah") || inputLower.includes("wisata") || inputLower.includes("tempat") || inputLower.includes("destinasi") || inputLower.includes("spot") || inputLower.includes("bagus") || inputLower.includes("obyek")) {
          botReply = "🌋 **6 Spot Utama Geotermal Suoh:**\n\n1. **Danau Asam** - Danau vulkanik eksotis bersuhu hangat & asam.\n2. **Danau Lebar** - Danau air tawar terluas, pusat perahu & mancing.\n3. **Danau Minyak** - Air berkilau unik seperti lapisan minyak.\n4. **Pasir Kuning** - Padang endapan belerang mengkristal.\n5. **Kawah Nirwana** - Letupan lumpur panas mendidih hingga 100°C.\n6. **Kawah Keramikan** - Kerak silika mengeras mirip lantai keramik pecah.";
        } 
        else if (inputLower.includes("cuaca") || inputLower.includes("suhu") || inputLower.includes("hujan") || inputLower.includes("pantau") || inputLower.includes("sensor") || inputLower.includes("panas") || inputLower.includes("dingin") || inputLower.includes("iklim") || inputLower.includes("musim")) {
          botReply = "🌤️ **Kondisi Cuaca & Musim:**\n\n• Suhu Udara Rata-rata: 20°C - 26°C (sejuk pegunungan).\n• Suhu Air Danau Asam: ~35°C - 45°C.\n• Suhu Permukaan Kawah: >90°C!\n• **Musim Terbaik:** Mei - Oktober (Kemarau) untuk jalanan paling mulus & langit cerah.\n\nCek data grafik live cuaca & sensor di menu *Dasbor Sensor* (Eco-Monitor) kami! 📊";
        } 
        else if (inputLower.includes("sejarah") || inputLower.includes("mitos") || inputLower.includes("cerita") || inputLower.includes("asal usul") || inputLower.includes("gempa") || inputLower.includes("legenda") || inputLower.includes("naga")) {
          botReply = "📜 **Sejarah & Legenda Mistik Suoh:**\n\n• **Sejarah:** Kaldera Suoh terbentuk akibat gempa freatik dahsyat 7.5 SR pada 25 Juni 1933.\n• **Mitos Lokal:** Gemuruh kawah diyakini warga lokal sebagai dorongan napas Naga Penjaga Danau yang tertidur di bawah bumi. Dilarang melempar batu atau berkata kotor di area kawah!";
        } 
        else if (inputLower.includes("ngapain") || inputLower.includes("aktivitas") || inputLower.includes("foto") || inputLower.includes("camping") || inputLower.includes("kemah") || inputLower.includes("mancing") || inputLower.includes("kegiatan") || inputLower.includes("healing")) {
          botReply = "⛺ **Aktivitas Favorit Pengunjung:**\n\n1. **Camping di Danau Lebar** (spot sunrise & api unggun malam hari).\n2. **Fotografi & Drone** di Kawah Keramikan (lanskap ala planet Mars).\n3. **Keliling Danau Lebar** naik perahu dayung warga.\n4. **Memancing ikan endemik** & terapi santai air hangat alami.";
        } 
        else if (inputLower.includes("kendaraan") || inputLower.includes("mobil") || inputLower.includes("motor") || inputLower.includes("transportasi") || inputLower.includes("ojek") || inputLower.includes("parkir") || inputLower.includes("trail")) {
          botReply = "🚙 **Transportasi & Kendaraan:**\n\n• Mobil/Motor dapat parkir aman di Basecamp Utama.\n• Untuk menuju titik kawah Keramikan, sangat disarankan menyewa **Ojek Motor Trail Lokal** (~Rp 50.000 PP) yang mahir menembus rute tanah belerang!";
        } 
        else if (inputLower.includes("makan") || inputLower.includes("minum") || inputLower.includes("kuliner") || inputLower.includes("warung") || inputLower.includes("restoran") || inputLower.includes("lapar") || inputLower.includes("kopi")) {
          botReply = "☕ **Kuliner & Kopi Khas Suoh:**\n\nNikmati santapan hangat di warung basecamp:\n• **Kopi Robusta Asli Lampung Barat** (aroma vulkanik khas petik merah).\n• Nasi Goreng Kampung, Mie Rebus Panas, & Ikan Bakar Danau Lebar.\n• Warung buka dari pagi hingga malam hari!";
        }
        else if (inputLower.includes("souvenir") || inputLower.includes("oleh-oleh") || inputLower.includes("kaos") || inputLower.includes("gantungan") || inputLower.includes("kerajinan") || inputLower.includes("cenderamata") || inputLower.includes("gift")) {
          botReply = "🛍️ **Oleh-Oleh & Cenderamata Suoh:**\n\nAnda dapat membeli kenang-kenangan khas Suoh di Basecamp:\n1. **Biji Kopi Robusta Petik Merah** (Sangrai Asli Petani Suoh)\n2. **Kaos Wisata AeroSuoh** & Gantungan Kunci Kayu Ukir\n3. **Batu Belerang Hias & Anggrek Lokal** dalam pot ramah lingkungan.";
        }
        else if (inputLower.includes("toilet") || inputLower.includes("wc") || inputLower.includes("musholla") || inputLower.includes("masjid") || inputLower.includes("sholat") || inputLower.includes("wudhu") || inputLower.includes("kamar mandi") || inputLower.includes("fasilitas")) {
          botReply = "🕌 **Fasilitas Umum (Toilet & Musholla):**\n\n• **Musholla Bersih:** Tersedia di Basecamp Danau Lebar lengkap dengan sarana wudhu & sajadah.\n• **Toilet & Kamar Mandi:** Tersedia di area parkir utama & homestay warga dengan pasokan air bersih pegunungan.";
        }
        else if (inputLower.includes("drone") || inputLower.includes("kamera") || inputLower.includes("permit") || inputLower.includes("izin") || inputLower.includes("cas") || inputLower.includes("listrik") || inputLower.includes("colokan") || inputLower.includes("stopkontak")) {
          botReply = "📸 **Fotografi, Drone & Charging Listrik:**\n\n• **Izin Drone:** Menerbangkan drone di area Keramikan & Danau **GRATIS** dan sangat diperbolehkan!\n• **Pengisian Daya (Charging):** Colokan listrik gratis tersedia di Warung Basecamp & Homestay.";
        }
        else if (inputLower.includes("flora") || inputLower.includes("fauna") || inputLower.includes("anggrek") || inputLower.includes("bunga") || inputLower.includes("tanaman") || inputLower.includes("hewan") || inputLower.includes("burung") || inputLower.includes("satwa")) {
          botReply = "🌿 **Flora & Fauna Endemik Suoh:**\n\n• **Anggrek Vulkanik:** Anggrek alam langka yang mampu tumbuh di tanah bersulfur.\n• **Satwa:** Burung liar endemik Sumatera & kawanan ikan air tawar di Danau Lebar. Sangat asri & terjaga!";
        }
        else if (inputLower.includes("renang") || inputLower.includes("berenang") || inputLower.includes("tenggelam") || inputLower.includes("mandi danau") || inputLower.includes("kecelup") || inputLower.includes("racun")) {
          botReply = "⚠️ **Peringatan Berenang:**\n\n• **DILARANG KERAS BERENANG** di Danau Asam & Danau Minyak karena air mengandung asam sulfat pekat & kedalaman ekstrem.\n• Untuk terapi air hangat alami, gunakan fasilitas kolam rendam khusus di area Homestay!";
        }
        else if (inputLower.includes("kesehatan") || inputLower.includes("sakit") || inputLower.includes("obat") || inputLower.includes("p3k") || inputLower.includes("puskesmas") || inputLower.includes("klinik") || inputLower.includes("pusing") || inputLower.includes("mual") || inputLower.includes("medis")) {
          botReply = "🩺 **Fasilitas Kesehatan & P3K:**\n\n• Kotak P3K standar tersedia di Basecamp Utama & Posko Pemandu.\n• Jika merasa pusing akibat bau belerang, segera menjauh ke area terbuka berangin & gunakan masker respirator.\n• Puskesmas Kecamatan Suoh berjarak hanya ±10 menit dari lokasi wisata.";
        }
        else if (inputLower.includes("rombongan") || inputLower.includes("bus") || inputLower.includes("pariwisata") || inputLower.includes("sekolah") || inputLower.includes("study tour") || inputLower.includes("grup")) {
          botReply = "👥 **Kunjungan Rombongan & Bus Besar:**\n\n• Bus Pariwisata sedang/besar dapat parkir di Lapangan Basecamp Utama.\n• Untuk rombongan sekolah / instansi (>20 orang), harap hubungi Admin via WhatsApp untuk koordinasi pemandu tambahan & diskon khusus paket!";
        }
        else if (inputLower.includes("terapi") || inputLower.includes("gatal") || inputLower.includes("kulit") || inputLower.includes("pegal") || inputLower.includes("rematik") || inputLower.includes("mandi hangat")) {
          botReply = "♨️ **Terapi Air Hangat Belerang:**\n\nKandungan sulfur alami di aliran hangat Suoh dipercaya secara turun-temurun membantu meredakan pegal Linu, terapi rematik, serta menyegarkan kulit. Cobalah fasilitas kolam rendam di Homestay lokal!";
        }
        else if (inputLower.includes("sdgs") || inputLower.includes("konservasi") || inputLower.includes("ekowisata") || inputLower.includes("kompetisi") || inputLower.includes("lomba") || inputLower.includes("lingkungan") || inputLower.includes("hijau")) {
          botReply = "🌱 **Komitmen Ekoturisme & SDGs AeroSuoh:**\n\nAeroSuoh mendukung penuh SDGs PBB No. 8 (Ekonomi Berkelanjutan), No. 11 (Komunitas Tangguh), No. 13 (Aksi Iklim), & No. 15 (Ekosistem Darat) dengan teknologi pemantauan sensor transparan!";
        }
        else if (inputLower.includes("sinyal") || inputLower.includes("internet") || inputLower.includes("wifi") || inputLower.includes("telkomsel") || inputLower.includes("jaringan") || inputLower.includes("blank")) {
          botReply = "📱 **Informasi Jaringan & Sinyal:**\n\n• Sinyal **Telkomsel** cukup stabil di area Basecamp & Homestay.\n• Di area kawah tengah terdapat titik *blank-spot* (sangat cocok untuk digital detox!).\n• Disarankan membawa Powerbank & mengunduh peta rute sebelum berangkat.";
        }
        else if (inputLower.includes("baju") || inputLower.includes("pakaian") || inputLower.includes("outfit") || inputLower.includes("pakai") || inputLower.includes("sandal") || inputLower.includes("sepatu") || inputLower.includes("jaket")) {
          botReply = "👟 **Rekomendasi Pakaian & Outfit:**\n\n• **WAJIB:** Sepatu kets / trekking tertutup. (*Dilarang keras memakai sandal karena tanah kawah sangat panas!*)\n• Gunakan pakaian berbahan nyaman & menyerap keringat.\n• Bawa jaket hangat jika berencana menginap atau camping.";
        }
        else if (inputLower.includes("anak") || inputLower.includes("keluarga") || inputLower.includes("bayi") || inputLower.includes("balita") || inputLower.includes("orang tua") || inputLower.includes("lansia") || inputLower.includes("disabilitas")) {
          botReply = "👨‍👩‍👧‍👦 **Aksesibilitas Keluarga:**\n\n• Area Danau Asam & Danau Lebar sangat aman untuk anak-anak dan lansia.\n• Untuk Kawah Keramikan & Nirwana, anak-anak & lansia disarankan memantau dari **Zona Pandang Aman** (Zona Hijau) & wajib didampingi.";
        }
        else if (inputLower.includes("pembuat") || inputLower.includes("developer") || inputLower.includes("hafis") || inputLower.includes("resiana") || inputLower.includes("pahleppi") || inputLower.includes("siapa yang buat") || inputLower.includes("teknokrat") || inputLower.includes("polinela")) {
          botReply = "💻 **Tentang Pengembang AeroSuoh:**\n\nPlatform canggih AeroSuoh ini dikembangkan oleh **Hafis Yulianto & Resiana Pahleppi** (Mahasiswa Universitas Teknokrat Indonesia) khusus untuk **Kompetisi Web Development HMJTI POLINELA 2026**!";
        } 
        else if (inputLower.includes("vtol") || inputLower.includes("pesawat") || inputLower.includes("kamera udara") || inputLower.includes("explorer")) {
          botReply = "🚁 **Teknologi Pemetaan AeroSuoh:**\n\nAeroSuoh mensimulasikan pemantauan udara menggunakan drone VTOL-X1 untuk memetakan titik geotermal & danau secara presisi. Anda dapat melacaknya di menu *Pemetaan Udara*!";
        } 
        else if (inputLower.includes("bantuan") || inputLower.includes("admin") || inputLower.includes("tolong") || inputLower.includes("hubungi") || inputLower.includes("kontak") || inputLower.includes("nomor") || inputLower.includes("wa") || inputLower.includes("whatsapp") || inputLower.includes("darurat")) {
          botReply = "📞 **Pusat Bantuan & Kontak Admin:**\n\nButuh bantuan khusus, booking rombongan, atau petunjuk jalan?\n• **WhatsApp Admin:** +62 822-7948-5813\n• **Email:** aerosuoh@gmail.com\n\nAtau klik tombol *Pesan Tiket & Homestay* di bagian atas!";
        } 
        else if (inputLower.includes("terima kasih") || inputLower.includes("makasih") || inputLower.includes("thanks") || inputLower.includes("ok") || inputLower.includes("oke") || inputLower.includes("baik") || inputLower.includes("mantap") || inputLower.includes("sip")) {
          botReply = "Sama-sama! 🙏 Senang bisa membantu Anda. Selamat merencanakan petualangan ke Suoh! Jangan lupa selalu utamakan keselamatan ya. ✨";
        }
        else {
          botReply = "Maaf, AeroBot belum mengenali pertanyaan tersebut. 🙏 Silakan coba tombol pilihan topik cepat di atas atau gunakan kata kunci seperti 'Tiket', 'Homestay', 'Rute', 'Keamanan', 'Cuaca', 'Pakaian', 'Toilet', 'Drone', atau 'Kuliner'.";
        }
      } 
      
      // ==========================================
      // Deteksi Kata Kunci (BAHASA INGGRIS - EXPANDED)
      // ==========================================
      else {
        if (inputLower.includes("hello") || inputLower.includes("hi") || inputLower.includes("morning") || inputLower.includes("afternoon") || inputLower.includes("evening") || inputLower.includes("greetings")) {
          botReply = "Hello! I am AeroBot 🤖. How can I assist you today regarding Suoh's tourism, tickets, routes, or geothermal conditions? 👋";
        } 
        else if (inputLower.includes("ticket") || inputLower.includes("price") || inputLower.includes("cost") || inputLower.includes("pay") || inputLower.includes("fee") || inputLower.includes("pass") || inputLower.includes("qris") || inputLower.includes("promo") || inputLower.includes("discount")) {
          botReply = "🎫 **Suoh Ticket & Fee Information:**\n\n• **Day Trip Pass:** Rp 25,000 / person (Access to lakes & geothermal viewpoints)\n• **Eco-Staycation:** Starting at Rp 175,000 / night (Ticket + Local Homestay)\n• **Parking Retribution:** Motorbike Rp 5,000 | Car Rp 10,000\n\nPayment supports Cash, QRIS, & M-Banking. Click 'Book Ticket' for direct reservation! 🎟️";
        } 
        else if (inputLower.includes("homestay") || inputLower.includes("stay") || inputLower.includes("sleep") || inputLower.includes("hotel") || inputLower.includes("accommodation") || inputLower.includes("room") || inputLower.includes("cabin") || inputLower.includes("villa")) {
          botReply = "🏡 **Local Accommodations & Homestays:**\n\nWe partner with local Suoh residents to provide:\n1. **Lake Asam Homestay** (Lake view, natural hot spring amenities) - Rp 175,000/night\n2. **Geothermal Cabin** (Rustic scenery near crater area) - Rp 250,000/night\n\nIncludes comfortable bedding, clean bathroom, & authentic local breakfast!";
        } 
        else if (inputLower.includes("safe") || inputLower.includes("danger") || inputLower.includes("gas") || inputLower.includes("toxic") || inputLower.includes("erupt") || inputLower.includes("risk") || inputLower.includes("mask") || inputLower.includes("emergency") || inputLower.includes("sulfur")) {
          botReply = "🛡️ **Suoh Geothermal Safety Protocols:**\n\nThe Suoh geothermal area is strictly monitored 24/7 by AeroSuoh real-time sensors (H₂S & SO₂).\n• Stay within the **Green Zone** & obey safety warning signs.\n• Wear a respirator mask (provided at the basecamp).\n• Strictly NO touching boiling mud!\n\nIf sensors detect elevated gas levels, an early warning siren sounds automatically. Follow guide directions and your visit is 100% safe! 🟢";
        } 
        else if (inputLower.includes("location") || inputLower.includes("where") || inputLower.includes("route") || inputLower.includes("road") || inputLower.includes("access") || inputLower.includes("map") || inputLower.includes("way") || inputLower.includes("distance")) {
          botReply = "🗺️ **Location & Routes:**\n\nSuoh is located in West Lampung Regency. 2 main routes:\n1. **Via Liwa (North):** ±45 km (1.5 - 2 hrs), smooth paved road across coffee hills.\n2. **Via Tanggamus (South):** ±80 km (2.5 - 3 hrs), recommended for off-road bikes / 4x4 vehicles.\n\nExplore our 3D interactive satellite map in the *Aerial Map* menu!";
        } 
        else if (inputLower.includes("hour") || inputLower.includes("open") || inputLower.includes("close") || inputLower.includes("time") || inputLower.includes("when") || inputLower.includes("schedule") || inputLower.includes("best time")) {
          botReply = "🌅 **Operating Hours & Best Time to Visit:**\n\n• **Open Daily:** 07:00 AM - 05:00 PM (WIB).\n• **Best Morning Time:** 07:00 - 09:00 AM (thick lake mist & fresh mountain air).\n• **Best Evening Time:** 03:30 - 05:00 PM (aesthetic sunset over Lake Lebar).";
        } 
        else if (inputLower.includes("lake") || inputLower.includes("crater") || inputLower.includes("destination") || inputLower.includes("place") || inputLower.includes("spot") || inputLower.includes("best") || inputLower.includes("attraction")) {
          botReply = "🌋 **6 Main Suoh Attractions:**\n\n1. **Lake Asam** - Exotic acidic volcanic lake.\n2. **Lake Lebar** - Largest freshwater lake, boating & fishing hub.\n3. **Lake Minyak** - Unique oil-like glossy water surface.\n4. **Yellow Sand** - Crystallized sulfur fields.\n5. **Nirvana Crater** - Bubbling mud eruptions up to 100°C.\n6. **Keramikan Crater** - Hardened silica crust resembling broken ceramic tiles.";
        } 
        else if (inputLower.includes("weather") || inputLower.includes("temperature") || inputLower.includes("temp") || inputLower.includes("rain") || inputLower.includes("monitor") || inputLower.includes("sensor") || inputLower.includes("hot") || inputLower.includes("cold") || inputLower.includes("climate") || inputLower.includes("season")) {
          botReply = "🌤️ **Weather & Season:**\n\n• Average Air Temp: 20°C - 26°C (cool mountain climate).\n• Lake Asam Water Temp: ~35°C - 45°C.\n• Crater Crust Surface Temp: >90°C!\n• **Best Season:** May - October (Dry season) for smooth roads & clear skies.\n\nInspect live weather graphics & sensor data in our *Sensor Dash* (Eco-Monitor) menu! 📊";
        } 
        else if (inputLower.includes("history") || inputLower.includes("myth") || inputLower.includes("story") || inputLower.includes("origin") || inputLower.includes("legend") || inputLower.includes("earthquake") || inputLower.includes("dragon")) {
          botReply = "📜 **History & Mystical Lore of Suoh:**\n\n• **History:** Suoh caldera was formed during a violent 7.5 SR phreatic earthquake on June 25, 1933.\n• **Local Lore:** Crater rumbles are believed by locals to be the breathing of the Lake Guardian Dragon sleeping under the earth. Avoid throwing stones or shouting around crater spots!";
        } 
        else if (inputLower.includes("activity") || inputLower.includes("photo") || inputLower.includes("camping") || inputLower.includes("camp") || inputLower.includes("what to do") || inputLower.includes("fishing") || inputLower.includes("boat")) {
          botReply = "⛺ **Top Visitor Activities:**\n\n1. **Camping at Lake Lebar** (sunrise viewpoints & campfire nights).\n2. **Landscape & Drone Photography** at Keramikan Crater (Mars-like scenery).\n3. **Lake Lebar Boat Tour** with local boatmen.\n4. **Endemic Fish Fishing** & relaxing in natural hot springs.";
        } 
        else if (inputLower.includes("transport") || inputLower.includes("car") || inputLower.includes("motorcycle") || inputLower.includes("vehicle") || inputLower.includes("taxi") || inputLower.includes("parking") || inputLower.includes("bike")) {
          botReply = "🚙 **Transportation & Parking:**\n\n• Cars/Motorcycles can park safely at the Main Basecamp.\n• To enter Keramikan crater spots, we highly recommend hiring a **Local Dirt Bike Taxi** (~Rp 50,000 roundtrip) experienced in sulfur terrain!";
        }
        else if (inputLower.includes("food") || inputLower.includes("drink") || inputLower.includes("eat") || inputLower.includes("restaurant") || inputLower.includes("cafe") || inputLower.includes("hungry") || inputLower.includes("coffee")) {
          botReply = "☕ **Local Food & Coffee Specialties:**\n\nEnjoy warm food at basecamp stalls:\n• **Authentic West Lampung Robusta Coffee** (rich volcanic soil aroma).\n• Local Fried Rice, Hot Noodle Soup, & Grilled Lake Fish.\n• Food stalls are open from early morning till night!";
        }
        else if (inputLower.includes("souvenir") || inputLower.includes("gift") || inputLower.includes("shirt") || inputLower.includes("craft") || inputLower.includes("merchandise")) {
          botReply = "🛍️ **Souvenirs & Local Gifts:**\n\nYou can purchase authentic Suoh souvenirs at the Basecamp:\n1. **Red-Cherry Robusta Coffee Beans** (Roast from Suoh farmers)\n2. **AeroSuoh Tour T-Shirts** & Carved Wooden Keychains\n3. **Decorative Sulfur Rocks & Local Orchids** in eco-pots.";
        }
        else if (inputLower.includes("toilet") || inputLower.includes("restroom") || inputLower.includes("bathroom") || inputLower.includes("prayer") || inputLower.includes("mosque") || inputLower.includes("facility") || inputLower.includes("wash")) {
          botReply = "🕌 **Public Facilities (Toilets & Prayer Room):**\n\n• **Clean Musalla:** Available at Lake Lebar Basecamp complete with wudhu facilities.\n• **Toilets & Bathrooms:** Available at main parking & local homestays with fresh mountain water supply.";
        }
        else if (inputLower.includes("camera") || inputLower.includes("drone") || inputLower.includes("permit") || inputLower.includes("charge") || inputLower.includes("charging") || inputLower.includes("electricity") || inputLower.includes("plug")) {
          botReply = "📸 **Photography, Drones & Charging:**\n\n• **Drone Permits:** Flying drones over Keramikan & Lakes is **FREE** and welcomed!\n• **Charging Plugs:** Free power outlets are available at Basecamp stalls & Homestays.";
        }
        else if (inputLower.includes("flora") || inputLower.includes("fauna") || inputLower.includes("orchid") || inputLower.includes("flower") || inputLower.includes("plant") || inputLower.includes("animal") || inputLower.includes("bird") || inputLower.includes("wildlife")) {
          botReply = "🌿 **Endemic Flora & Fauna:**\n\n• **Volcanic Orchids:** Rare wild orchids that grow on sulfurous ground.\n• **Wildlife:** Sumatran wild birds & endemic freshwater fish in Lake Lebar. Very serene!";
        }
        else if (inputLower.includes("swim") || inputLower.includes("swimming") || inputLower.includes("dip") || inputLower.includes("drown") || inputLower.includes("acidic")) {
          botReply = "⚠️ **Swimming Warning:**\n\n• **STRICTLY NO SWIMMING** in Lake Asam & Lake Minyak due to high sulfuric acidity & extreme depth.\n• For natural hot spring therapy, use designated soaking pools at local Homestays!";
        }
        else if (inputLower.includes("health") || inputLower.includes("sick") || inputLower.includes("first aid") || inputLower.includes("medicine") || inputLower.includes("clinic") || inputLower.includes("dizzy") || inputLower.includes("medical")) {
          botReply = "🩺 **First Aid & Medical Facilities:**\n\n• Standard First Aid kits are available at the Main Basecamp & Guide Post.\n• If feeling dizzy from sulfur smell, move to an open windy area and wear a respirator mask.\n• Suoh District Health Center (Puskesmas) is just ±10 minutes away.";
        }
        else if (inputLower.includes("bus") || inputLower.includes("group") || inputLower.includes("school") || inputLower.includes("study tour")) {
          botReply = "👥 **Group Tours & Large Buses:**\n\n• Medium/Large Tour Buses can park at the Main Basecamp Field.\n• For school / institutional groups (>20 pax), please contact Admin via WhatsApp for guide coordination & group package discounts!";
        }
        else if (inputLower.includes("therapy") || inputLower.includes("skin") || inputLower.includes("itch") || inputLower.includes("rheumatism") || inputLower.includes("hot spring")) {
          botReply = "♨️ **Hot Sulfur Water Therapy:**\n\nNatural sulfur in Suoh's warm streams is traditionally believed to soothe aches, relieve rheumatism, & refresh the skin. Try the hot spring soak pools at local Homestays!";
        }
        else if (inputLower.includes("sdg") || inputLower.includes("conservation") || inputLower.includes("ecotourism") || inputLower.includes("competition") || inputLower.includes("green")) {
          botReply = "🌱 **AeroSuoh Ecotourism & SDGs Commitment:**\n\nAeroSuoh supports UN SDGs No. 8 (Sustainable Economy), No. 11 (Resilient Communities), No. 13 (Climate Action), & No. 15 (Life on Land) through transparent sensor monitoring!";
        }
        else if (inputLower.includes("signal") || inputLower.includes("internet") || inputLower.includes("wifi") || inputLower.includes("connection") || inputLower.includes("network") || inputLower.includes("telkomsel")) {
          botReply = "📱 **Network & Signal Info:**\n\n• **Telkomsel** signal is reliable at the Basecamp & Homestays.\n• Central crater areas have some blank spots (perfect for a digital detox!).\n• We recommend carrying a Powerbank & downloading offline maps beforehand.";
        }
        else if (inputLower.includes("clothes") || inputLower.includes("wear") || inputLower.includes("outfit") || inputLower.includes("shoes") || inputLower.includes("sandal") || inputLower.includes("jacket")) {
          botReply = "👟 **Outfit & Shoes Advice:**\n\n• **MANDATORY:** Closed sneakers or trekking shoes. (*Sandals are strictly forbidden as crater ground is boiling hot!*)\n• Wear comfortable, breathable clothes.\n• Bring a warm jacket if planning to stay overnight or camp.";
        }
        else if (inputLower.includes("kid") || inputLower.includes("family") || inputLower.includes("baby") || inputLower.includes("child") || inputLower.includes("parent") || inputLower.includes("old") || inputLower.includes("senior")) {
          botReply = "👨‍👩‍👧‍👦 **Family Accessibility:**\n\n• Lake Asam & Lake Lebar areas are very safe for children and seniors.\n• For Keramikan & Nirvana Craters, children & seniors are advised to view from the **Safe Observation Zone** (Green Zone) under supervision.";
        }
        else if (inputLower.includes("developer") || inputLower.includes("creator") || inputLower.includes("hafis") || inputLower.includes("resiana") || inputLower.includes("pahleppi") || inputLower.includes("who made") || inputLower.includes("teknokrat") || inputLower.includes("polinela")) {
          botReply = "💻 **About AeroSuoh Developers:**\n\nThis platform was built by **Hafis Yulianto & Resiana Pahleppi** (Students at Universitas Teknokrat Indonesia) for the **HMJTI POLINELA 2026 Web Development Competition**!";
        } 
        else if (inputLower.includes("vtol") || inputLower.includes("plane") || inputLower.includes("camera") || inputLower.includes("explorer")) {
          botReply = "🚁 **AeroSuoh Mapping Technology:**\n\nAeroSuoh simulates aerial monitoring using a VTOL-X1 drone to map geothermal points & lakes with precision. Track it in our *Aerial Map* menu!";
        } 
        else if (inputLower.includes("help") || inputLower.includes("admin") || inputLower.includes("support") || inputLower.includes("contact") || inputLower.includes("call") || inputLower.includes("whatsapp") || inputLower.includes("emergency")) {
          botReply = "📞 **Help Center & Admin Contact:**\n\nNeed a tour guide, group reservation, or directions?\n• **WhatsApp Admin:** +62 822-7948-5813\n• **Email:** aerosuoh@gmail.com\n\nOr click the *Book Ticket* button at the top!";
        } 
        else if (inputLower.includes("thank") || inputLower.includes("thanks") || inputLower.includes("ok") || inputLower.includes("okay") || inputLower.includes("good") || inputLower.includes("great") || inputLower.includes("awesome")) {
          botReply = "You're very welcome! 🙏 Glad I could help. Enjoy your trip to Suoh! Always stay safe and have a wonderful time. ✨";
        }
        else {
          botReply = "Sorry, AeroBot hasn't learned that context yet. 🙏 Try clicking one of the quick topic chips above or use keywords like 'Ticket', 'Homestay', 'Route', 'Safety', 'Weather', 'Outfit', 'Toilets', 'Drone', or 'Food'.";
        }
      }

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
      setIsTyping(false);
    }, 800);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userMsg = chatInput.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    processBotReply(userMsg);
  };

  const handleChipClick = (queryKey: string, chipLabel: string) => {
    if (isTyping) return;
    setMessages((prev) => [...prev, { sender: "user", text: chipLabel }]);
    processBotReply(queryKey);
  };

  const handleCheckout = async () => {
    const adminPhone = "6282279485813";

    try {
      const { error } = await supabase
        .from("bookings")
        .insert([
          {
            name: bookingData.name,
            phone: bookingData.phone,
            visit_date: bookingData.date,
            guests: bookingData.guests,
            ticket_type: bookingData.type,
            homestay: bookingData.homestay || null,
            status: "pending"
          }
        ]);
      if (error) throw error;
    } catch (err) {
      console.error("Gagal menyimpan booking:", err);
    }

    const total = (bookingData.type === "homestay" ? 175000 : 25000) * bookingData.guests;
    let waMessage = lang === "ID" 
      ? `Halo Admin AeroSuoh, saya ingin konfirmasi pembayaran untuk pesanan:\n\n*Nama:* ${bookingData.name}\n*Paket:* ${bookingData.type}\n*Total:* Rp ${total.toLocaleString("id-ID")}`
      : `Hello Admin AeroSuoh, I would like to confirm payment for my booking:\n\n*Name:* ${bookingData.name}\n*Package:* ${bookingData.type}\n*Total:* Rp ${total.toLocaleString("id-ID")}`;
    
    window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(waMessage)}`, "_blank");
    setActiveModal(null);
    setBookingStep(1);
    setBookingErrors({});
    setBookingData({ name: "", phone: "", date: "", guests: 1, type: "", homestay: "" });
  };

  const validateStep1 = () => {
    const errors: {name?: string; phone?: string; date?: string; guests?: string} = {};
    if (!bookingData.name.trim()) errors.name = lang === "ID" ? "Nama wajib diisi" : "Name is required";
    if (!bookingData.phone.trim()) errors.phone = lang === "ID" ? "Nomor telepon/WA wajib diisi" : "Phone/WA is required";
    if (!bookingData.date) errors.date = lang === "ID" ? "Tanggal wajib diisi" : "Visit date is required";
    if (!bookingData.guests || bookingData.guests < 1) errors.guests = lang === "ID" ? "Minimal 1" : "Min 1 guest";
    setBookingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // === MODAL 1: ALUR BOOKING TIKET & HOMESTAY ===
  const renderBooking = () => {
    const qrisImage = getSetting("qris_image_url", "/payment/QRIS.png");
    const bankName = getSetting("bank_name", "Bank BRI");
    const bankAccNum = getSetting("bank_account_number", "1234-01-005678-53-9");
    const bankAccHolder = getSetting("bank_account_holder", "AeroSuoh Tourism Management");

    const handleCopyAccount = () => {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(bankAccNum);
        setCopiedBank(true);
        setTimeout(() => setCopiedBank(false), 2500);
      }
    };

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 print:hidden overflow-y-auto">
        <div className="bg-white rounded-3xl w-full max-w-2xl h-[620px] max-h-[90vh] flex flex-col justify-between overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
          
          {/* Header Booking (Fixed Height) */}
          <div className="bg-emerald-800 px-6 py-4 text-white flex justify-between items-center relative shrink-0 h-[58px]">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-emerald-300" />
              <h3 className="text-base font-extrabold tracking-wide">
                {lang === "ID" ? "Smart Booking AeroSuoh" : "AeroSuoh Smart Booking"}
              </h3>
            </div>
            <button onClick={() => setActiveModal(null)} className="p-1.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer text-white">
              <X size={20} />
            </button>
          </div>

          {/* Step Indicator Circles (Fixed Height) */}
          <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex justify-center items-center gap-6 sm:gap-10 shrink-0 h-[54px]">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs transition-all ${
                  bookingStep === step
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30 ring-4 ring-emerald-100"
                    : bookingStep > step
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {bookingStep > step ? "✓" : step}
              </div>
            ))}
          </div>

          {/* Body Booking (Strict Fixed Height & Layout Across Steps 1 - 4) */}
          <div className="p-6 flex-1 flex flex-col justify-between overflow-hidden">
            
            {/* STEP 1: DATA DIRI */}
            {bookingStep === 1 && (
              <div className="h-full flex flex-col justify-between">
                <div className="space-y-4 overflow-y-auto pr-1">
                  <h4 className="font-bold text-slate-800 text-base">{lang === "ID" ? "Lengkapi Data Diri & Rencana Kunjungan" : "Complete Personal Data & Visit Plan"}</h4>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">{lang === "ID" ? "Nama Lengkap" : "Full Name"}</label>
                    <input 
                      type="text" 
                      value={bookingData.name} 
                      onChange={(e) => {
                        setBookingData({...bookingData, name: e.target.value});
                        if (bookingErrors.name) setBookingErrors({...bookingErrors, name: undefined});
                      }} 
                      placeholder="Contoh: Budi Santoso" 
                      className={`w-full p-3 bg-slate-50 border ${bookingErrors.name ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200'} rounded-xl text-slate-800 text-sm outline-none focus:border-emerald-500 transition-colors`} 
                    />
                    {bookingErrors.name && <p className="text-xs text-rose-500 mt-1 font-semibold">{bookingErrors.name}</p>}
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">{lang === "ID" ? "Nomor WhatsApp" : "WhatsApp Number"}</label>
                    <input 
                      type="tel" 
                      value={bookingData.phone} 
                      onChange={(e) => {
                        setBookingData({...bookingData, phone: e.target.value});
                        if (bookingErrors.phone) setBookingErrors({...bookingErrors, phone: undefined});
                      }} 
                      placeholder="081234567890" 
                      className={`w-full p-3 bg-slate-50 border ${bookingErrors.phone ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200'} rounded-xl text-slate-800 text-sm outline-none focus:border-emerald-500 transition-colors`} 
                    />
                    {bookingErrors.phone && <p className="text-xs text-rose-500 mt-1 font-semibold">{bookingErrors.phone}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">{lang === "ID" ? "Tanggal Kunjungan" : "Visit Date"}</label>
                      <input 
                        type="date" 
                        value={bookingData.date} 
                        onChange={(e) => {
                          setBookingData({...bookingData, date: e.target.value});
                          if (bookingErrors.date) setBookingErrors({...bookingErrors, date: undefined});
                        }} 
                        className={`w-full p-3 bg-slate-50 border ${bookingErrors.date ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200'} rounded-xl text-slate-800 text-sm outline-none focus:border-emerald-500 transition-colors`} 
                      />
                      {bookingErrors.date && <p className="text-xs text-rose-500 mt-1 font-semibold">{bookingErrors.date}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">{lang === "ID" ? "Jumlah Orang" : "Guests Count"}</label>
                      <input 
                        type="number" 
                        min="1" 
                        value={bookingData.guests} 
                        onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value) || 1})} 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm outline-none focus:border-emerald-500 transition-colors" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 shrink-0">
                  <button 
                    onClick={() => {
                      if (validateStep1()) setBookingStep(2);
                    }} 
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {lang === "ID" ? "Lanjutkan Pilih Paket" : "Continue to Select Package"} <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PILIH PAKET */}
            {bookingStep === 2 && (
              <div className="h-full flex flex-col justify-between">
                <div className="space-y-4 overflow-y-auto pr-1">
                  <h4 className="font-bold text-slate-800 text-base">{lang === "ID" ? "Pilih Jenis Paket Kunjungan" : "Select Visit Package Type"}</h4>
                  
                  <div 
                    onClick={() => setBookingData({...bookingData, type: "daytrip", homestay: ""})}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      bookingData.type === "daytrip" ? "border-emerald-500 bg-emerald-50/40 shadow-sm" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-slate-800 text-base">Day Trip Pass</h5>
                        <p className="text-xs text-slate-500 mt-1">{lang === "ID" ? "Akses tiket masuk seluruh spot kawah & danau Suoh untuk 1 hari." : "Single-day pass access to all Suoh lakes and geothermal craters."}</p>
                      </div>
                      <span className="font-extrabold text-emerald-600 text-base">Rp 25.000 <span className="text-xs font-normal text-slate-400">/ pax</span></span>
                    </div>
                  </div>

                  <div 
                    onClick={() => setBookingData({...bookingData, type: "homestay"})}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      bookingData.type === "homestay" ? "border-emerald-500 bg-emerald-50/40 shadow-sm" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-slate-800 text-base">Eco-Staycation</h5>
                        <p className="text-xs text-slate-500 mt-1">{lang === "ID" ? "Paket tiket + menginap di cabin / homestay ramah lingkungan warga lokal." : "Package includes ticket + eco-friendly homestay or cabin stay."}</p>
                      </div>
                      <span className="font-extrabold text-emerald-600 text-base">Rp 175.000 <span className="text-xs font-normal text-slate-400">/ pax</span></span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 shrink-0">
                  <button onClick={() => setBookingStep(1)} className="px-5 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-sm">
                    {lang === "ID" ? "Kembali" : "Back"}
                  </button>
                  <button 
                    disabled={!bookingData.type}
                    onClick={() => setBookingStep(bookingData.type === "homestay" ? 3 : 4)} 
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all disabled:bg-slate-300 disabled:shadow-none cursor-pointer text-sm"
                  >
                    {lang === "ID" ? "Lanjutkan" : "Next"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PILIH HOMESTAY (JIKA STAYCATION) */}
            {bookingStep === 3 && (
              <div className="h-full flex flex-col justify-between">
                <div className="space-y-3 overflow-y-auto pr-1">
                  <h4 className="font-bold text-slate-800 text-base">{lang === "ID" ? "Pilih Homestay Penginapan" : "Select Accommodation Homestay"}</h4>
                  
                  {[
                    { name: "Geothermal Cabin", desc: "View langsung Danau Asam, fasiltas kamar mandi dalam & teh hangat geotermal.", icon: Home },
                    { name: "Rumah Warga Suoh Eco-Stay", desc: "Pengalaman autentik tinggal bersama warga lokal Suoh, ramah keluarga.", icon: Home },
                    { name: "Danau Minyak Rest House", desc: "Suasana tenang di tepi Danau Minyak, cocok untuk rombongan & fotografi.", icon: Home }
                  ].map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setBookingData({...bookingData, homestay: item.name})}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        bookingData.homestay === item.name ? "border-emerald-500 bg-emerald-50/40 shadow-sm" : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl h-fit shrink-0"><item.icon size={18} /></div>
                        <div>
                          <h5 className="font-bold text-slate-800 text-sm">{item.name}</h5>
                          <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 pt-4 shrink-0">
                  <button onClick={() => setBookingStep(2)} className="px-5 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-sm">
                    {lang === "ID" ? "Kembali" : "Back"}
                  </button>
                  <button 
                    disabled={!bookingData.homestay}
                    onClick={() => setBookingStep(4)} 
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all disabled:bg-slate-300 disabled:shadow-none cursor-pointer text-sm"
                  >
                    {lang === "ID" ? "Lanjutkan" : "Next"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: PEMBAYARAN & WHATSAPP CHECKOUT (QRIS & TRANSFER BANK DINAMIS) */}
            {bookingStep === 4 && (
              <div className="h-full flex flex-col justify-between">
                <div className="space-y-3 overflow-y-auto pr-1">
                  
                  {/* Header Selesaikan Pembayaran */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-1 shadow-inner">
                      <CheckCircle2 size={20} />
                    </div>
                    <h3 className="text-base font-extrabold text-slate-800">
                      {t("qris_title")}
                    </h3>
                    <p className="text-[11px] text-slate-500 max-w-md mt-0.5 leading-relaxed">
                      {t("qris_instruction")}
                    </p>
                  </div>

                  {/* Tab Switcher: QRIS vs Transfer Bank */}
                  <div className="flex justify-center border-b border-slate-200 pb-1">
                    <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("qris")}
                        className={`flex items-center gap-1.5 px-4 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          paymentMethod === "qris"
                            ? "bg-white text-emerald-700 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        <QrCode size={14} />
                        <span>Kode QRIS</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("transfer")}
                        className={`flex items-center gap-1.5 px-4 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          paymentMethod === "transfer"
                            ? "bg-white text-emerald-700 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        <Building2 size={14} />
                        <span>Transfer Bank / E-Wallet</span>
                      </button>
                    </div>
                  </div>

                  {/* Grid 2-Kolom Presisi Sesuai Foto 2 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                    
                    {/* Kolom Kiri: QRIS atau Transfer Bank Detail */}
                    {paymentMethod === "qris" ? (
                      <div className="relative border-2 border-dashed border-emerald-400/80 rounded-2xl p-2.5 bg-white flex items-center justify-center shadow-xs overflow-hidden h-[190px]">
                        {/* Garis Laser Hijau Animasi */}
                        <div className="absolute left-1 right-1 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_14px_#10b981] animate-scan-line z-10 pointer-events-none"></div>
                        
                        {/* Gambar QRIS Dinamis */}
                        <img 
                          src={qrisImage} 
                          alt="QRIS AeroSuoh" 
                          className="w-full h-auto max-h-44 object-contain rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50 flex flex-col justify-between space-y-2 h-[190px]">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs border-b border-slate-200 pb-1.5">
                            <Building2 size={15} className="text-emerald-600" />
                            <span>{bankName}</span>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Nomor Rekening</span>
                            <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
                              <span className="font-mono text-xs font-bold text-slate-800 tracking-wider">{bankAccNum}</span>
                              <button
                                type="button"
                                onClick={handleCopyAccount}
                                className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md transition-all cursor-pointer"
                              >
                                {copiedBank ? <Check size={11} /> : <Copy size={11} />}
                                <span>{copiedBank ? "Tersalin!" : "Salin"}</span>
                              </button>
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Atas Nama</span>
                            <span className="text-xs font-bold text-slate-700 block truncate">{bankAccHolder}</span>
                          </div>
                        </div>

                        <p className="text-[9px] text-slate-400 italic">
                          *Kirim bukti transfer ke WA Admin setelah bayar.
                        </p>
                      </div>
                    )}

                    {/* Kolom Kanan: Ringkasan Pesanan & Tagihan */}
                    <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-2 h-[190px]">
                      <div>
                        <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-200/80 pb-1 mb-2">
                          {lang === "ID" ? "RINGKASAN PESANAN & TAGIHAN" : "ORDER & BILL SUMMARY"}
                        </p>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">{lang === "ID" ? "Paket" : "Package"}</span>
                            <span className="font-bold text-slate-800">
                              {bookingData.type === "homestay" ? "Eco-Staycation" : "Day Trip Pass"}
                            </span>
                          </div>
                          {bookingData.homestay && (
                            <div className="flex justify-between items-center">
                              <span className="text-slate-500 font-medium">Homestay</span>
                              <span className="font-bold text-emerald-600 truncate max-w-[110px] text-right">{bookingData.homestay}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">{lang === "ID" ? "Tanggal" : "Date"}</span>
                            <span className="font-bold text-slate-800">{bookingData.date || "-"}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">{lang === "ID" ? "Pengunjung" : "Guests"}</span>
                            <span className="font-bold text-slate-800">{bookingData.guests} {lang === "ID" ? "Orang" : "Pax"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Kotak Total Tagihan Hijau */}
                      <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl flex justify-between items-center mt-auto">
                        <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide">
                          {lang === "ID" ? "Total Tagihan" : "Total Bill"}
                        </span>
                        <span className="text-sm font-black text-emerald-600">
                          Rp {((bookingData.type === "homestay" ? 175000 : 25000) * bookingData.guests).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Tombol Konfirmasi WA & Edit Pesanan */}
                <div className="space-y-1 pt-2 shrink-0">
                  <button 
                    onClick={handleCheckout}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <Ticket size={18} /> {lang === "ID" ? "Konfirmasi Pembayaran via WA" : "Confirm Payment via WA"}
                  </button>
                  <button 
                    onClick={() => setBookingStep(1)} 
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors py-0.5 block w-full text-center cursor-pointer"
                  >
                    {lang === "ID" ? "Edit Pesanan" : "Edit Booking"}
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    );
  };

  // === MODAL 2: AEROBOT CHATBOT ===
  const renderChatbot = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 print:hidden">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col h-[560px]">
        
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-4 flex justify-between items-center text-white shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-full border border-emerald-400/30">
              <Bot size={22} className="text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base tracking-tight">AeroBot</h3>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">{lang === "ID" ? "Asisten Virtual Suoh" : "Suoh Virtual Assistant"}</p>
            </div>
          </div>
          
          {/* Close Button */}
          <button 
            onClick={() => setActiveModal(null)} 
            className="hover:bg-white/20 p-1.5 rounded-lg transition-colors text-emerald-100 hover:text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Chat Body (Messages) */}
        <div className="flex-1 bg-slate-50 p-4 overflow-y-auto flex flex-col gap-3 scroll-smooth">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`max-w-[88%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-line animate-in fade-in slide-in-from-bottom-2 ${
                msg.sender === "bot" 
                  ? "bg-white border border-slate-200/80 text-slate-700 rounded-tl-xs self-start" 
                  : "bg-emerald-600 text-white rounded-tr-xs self-end font-medium"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {/* Bot Typing Indicator */}
          {isTyping && (
            <div className="bg-white border border-slate-200/80 text-slate-500 rounded-2xl rounded-tl-xs p-3.5 self-start flex items-center gap-2 text-xs shadow-sm">
              <Sparkles size={14} className="text-emerald-500 animate-spin" />
              <span>{lang === "ID" ? "AeroBot sedang mengetik..." : "AeroBot is typing..."}</span>
            </div>
          )}

          {/* Scroll Target */}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips (Horizontally Scrollable) */}
        <div className="px-3 py-2 bg-slate-100/80 border-t border-slate-200/60 overflow-x-auto flex items-center gap-1.5 no-scrollbar shrink-0">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Sparkles size={10} className="text-amber-500" />
            {lang === "ID" ? "Topik:" : "Topics:"}
          </span>
          {quickChips.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleChipClick(chip.query, chip.label)}
              disabled={isTyping}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-slate-700 hover:text-emerald-700 text-xs font-semibold rounded-full whitespace-nowrap transition-all shrink-0 shadow-2xs hover:scale-105 disabled:opacity-50 cursor-pointer"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Chat Input Field */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={isTyping}
            placeholder={lang === "ID" ? "Ketik pertanyaan Anda (misal: tiket, rute, cuaca)..." : "Type your question (e.g. tickets, route, weather)..."}
            className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-slate-700 placeholder:text-slate-400"
          />
          <button 
            type="submit" 
            disabled={!chatInput.trim() || isTyping} 
            className="p-2.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500 transition-colors shadow-md flex items-center justify-center shrink-0 cursor-pointer"
          >
            <Send size={18} />
          </button>
        </form>

      </div>
    </div>
  );

  return (
    <>
      {activeModal === "booking" && renderBooking()}
      {activeModal === "chat" && renderChatbot()}

      {/* === FLOATING ACTION BUTTON (FAB) KANAN BAWAH === */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 print:hidden">
        
        {/* Tombol Utama Melayang */}
        <button 
          onClick={() => setActiveModal("chat")}
          className="p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center text-white bg-gradient-to-r from-emerald-500 to-emerald-700 hover:scale-110 hover:shadow-emerald-500/50 animate-pulse cursor-pointer"
          title="AeroBot Smart Assistant"
        >
          <MessageCircle size={28} />
        </button>
      </div>
    </>
  );
}