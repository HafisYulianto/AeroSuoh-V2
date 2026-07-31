"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Bot, Ticket, Calendar, Users, Home, ArrowRight, CheckCircle2, Send, QrCode, Globe, Sparkles } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabase";

export default function SmartAssistant() {
  const { lang, toggleLang, t } = useLanguage();
  const [activeModal, setActiveModal] = useState<"chat" | "booking" | null>(null);

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
    { label: "🎫 Tiket & Harga", query: "tiket" },
    { label: "🌤️ Cuaca & Suhu", query: "cuaca" },
    { label: "🏡 Homestay", query: "homestay" },
    { label: "📍 Rute & Akses", query: "rute" },
    { label: "🛡️ Keamanan Gas", query: "keamanan" },
    { label: "🌋 Spot Wisata", query: "danau" },
    { label: "☕ Kuliner & Kopi", query: "kuliner" },
    { label: "🎒 Outfit & Sepatu", query: "pakaian" },
    { label: "⛺ Camping & Foto", query: "aktivitas" },
    { label: "🚙 Ojek & Parkir", query: "kendaraan" },
    { label: "📱 Sinyal Internet", query: "sinyal" },
    { label: "📜 Sejarah & Mitos", query: "sejarah" },
    { label: "📞 Kontak Admin", query: "kontak" },
  ] : [
    { label: "🎫 Tickets & Price", query: "ticket" },
    { label: "🌤️ Weather & Temp", query: "weather" },
    { label: "🏡 Homestays", query: "homestay" },
    { label: "📍 Routes & Maps", query: "route" },
    { label: "🛡️ Safety & Gas", query: "safe" },
    { label: "🌋 Attractions", query: "lake" },
    { label: "☕ Food & Coffee", query: "food" },
    { label: "🎒 Outfit & Shoes", query: "clothes" },
    { label: "⛺ Camping & Drones", query: "activity" },
    { label: "🚙 Bikes & Parking", query: "transport" },
    { label: "📱 Signal & Wifi", query: "signal" },
    { label: "📜 History & Myths", query: "history" },
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
        else if (inputLower.includes("cuaca") || inputLower.includes("suhu") || inputLower.includes("hujan") || inputLower.includes("pantau") || inputLower.includes("sensor") || inputLower.includes("panas") || inputLower.includes("dingin") || inputLower.includes("iklim")) {
          botReply = "🌤️ **Kondisi Cuaca & Suhu:**\n\n• Suhu Udara Rata-rata: 20°C - 26°C (sejuk pegunungan).\n• Suhu Air Danau Asam: ~35°C - 45°C.\n• Suhu Permukaan Kawah: >90°C!\n\nAnda dapat mengecek grafik live cuaca, suhu air, dan kadar gas H₂S di menu *Dasbor Sensor* (Eco-Monitor) kami! 📊";
        } 
        else if (inputLower.includes("sejarah") || inputLower.includes("mitos") || inputLower.includes("cerita") || inputLower.includes("asal usul") || inputLower.includes("gempa") || inputLower.includes("legenda") || inputLower.includes("naga")) {
          botReply = "📜 **Sejarah & Legenda Mistik Suoh:**\n\n• **Sejarah:** Kaldera Suoh terbentuk akibat gempa freatik dahsyat 7.5 SR pada 25 Juni 1933.\n• **Mitos Lokal:** Gemuruh kawah diyakini warga lokal sebagai dorongan napas Naga Penjaga Danau yang tertidur di bawah bumi. Dilarang melempar batu atau berkata kotor di area kawah!";
        } 
        else if (inputLower.includes("ngapain") || inputLower.includes("aktivitas") || inputLower.includes("foto") || inputLower.includes("camping") || inputLower.includes("kemah") || inputLower.includes("mancing") || inputLower.includes("drone") || inputLower.includes("kegiatan") || inputLower.includes("healing")) {
          botReply = "⛺ **Aktivitas Favorit Pengunjung:**\n\n1. **Camping di Danau Lebar** (spot sunrise & api unggun malam hari).\n2. **Fotografi & Drone** di Kawah Keramikan (lanskap ala planet Mars).\n3. **Keliling Danau Lebar** naik perahu dayung warga.\n4. **Memancing ikan endemik** & terapi santai air hangat alami.";
        } 
        else if (inputLower.includes("kendaraan") || inputLower.includes("mobil") || inputLower.includes("motor") || inputLower.includes("transportasi") || inputLower.includes("ojek") || inputLower.includes("parkir") || inputLower.includes("trail")) {
          botReply = "🚙 **Transportasi & Kendaraan:**\n\n• Mobil/Motor dapat parkir aman di Basecamp Utama.\n• Untuk menuju titik kawah Keramikan, sangat disarankan menyewa **Ojek Motor Trail Lokal** (~Rp 50.000 PP) yang mahir menembus rute tanah belerang!";
        } 
        else if (inputLower.includes("makan") || inputLower.includes("minum") || inputLower.includes("kuliner") || inputLower.includes("warung") || inputLower.includes("restoran") || inputLower.includes("lapar") || inputLower.includes("kopi") || inputLower.includes("oleh-oleh")) {
          botReply = "☕ **Kuliner & Kopi Khas Suoh:**\n\nNikmati santapan hangat di warung basecamp:\n• **Kopi Robusta Asli Lampung Barat** (aroma vulkanik khas petik merah).\n• Nasi Goreng Kampung, Mie Rebus Panas, & Ikan Bakar Danau Lebar.\n• Oleh-oleh bubuk kopi pilihan langsung dari petani lokal!";
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
          botReply = "Maaf, AeroBot belum mengenali pertanyaan tersebut. 🙏 Silakan coba tombol pilihan topik cepat di atas atau gunakan kata kunci seperti 'Tiket', 'Homestay', 'Rute', 'Keamanan', 'Cuaca', 'Pakaian', atau 'Kuliner'.";
        }
      } 
      
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
        else if (inputLower.includes("weather") || inputLower.includes("temperature") || inputLower.includes("temp") || inputLower.includes("rain") || inputLower.includes("monitor") || inputLower.includes("sensor") || inputLower.includes("hot") || inputLower.includes("cold") || inputLower.includes("climate")) {
          botReply = "🌤️ **Weather & Temperature:**\n\n• Average Air Temp: 20°C - 26°C (cool mountain climate).\n• Lake Asam Water Temp: ~35°C - 45°C.\n• Crater Crust Surface Temp: >90°C!\n\nYou can inspect live weather graphics, water pH, and H₂S gas levels in our *Sensor Dash* (Eco-Monitor) menu! 📊";
        } 
        else if (inputLower.includes("history") || inputLower.includes("myth") || inputLower.includes("story") || inputLower.includes("origin") || inputLower.includes("legend") || inputLower.includes("earthquake") || inputLower.includes("dragon")) {
          botReply = "📜 **History & Mystical Lore of Suoh:**\n\n• **History:** Suoh caldera was formed during a violent 7.5 SR phreatic earthquake on June 25, 1933.\n• **Local Lore:** Crater rumbles are believed by locals to be the breathing of the Lake Guardian Dragon sleeping under the earth. Avoid throwing stones or shouting around crater spots!";
        } 
        else if (inputLower.includes("activity") || inputLower.includes("photo") || inputLower.includes("camping") || inputLower.includes("camp") || inputLower.includes("what to do") || inputLower.includes("fishing") || inputLower.includes("drone") || inputLower.includes("boat")) {
          botReply = "⛺ **Top Visitor Activities:**\n\n1. **Camping at Lake Lebar** (sunrise viewpoints & campfire nights).\n2. **Landscape & Drone Photography** at Keramikan Crater (Mars-like scenery).\n3. **Lake Lebar Boat Tour** with local boatmen.\n4. **Endemic Fish Fishing** & relaxing in natural hot springs.";
        } 
        else if (inputLower.includes("transport") || inputLower.includes("car") || inputLower.includes("motorcycle") || inputLower.includes("vehicle") || inputLower.includes("taxi") || inputLower.includes("parking") || inputLower.includes("bike")) {
          botReply = "🚙 **Transportation & Parking:**\n\n• Cars/Motorcycles can park safely at the Main Basecamp.\n• To enter Keramikan crater spots, we highly recommend hiring a **Local Dirt Bike Taxi** (~Rp 50,000 roundtrip) experienced in sulfur terrain!";
        }
        else if (inputLower.includes("food") || inputLower.includes("drink") || inputLower.includes("eat") || inputLower.includes("restaurant") || inputLower.includes("cafe") || inputLower.includes("hungry") || inputLower.includes("coffee") || inputLower.includes("souvenir")) {
          botReply = "☕ **Local Food & Coffee Specialties:**\n\nEnjoy warm food at basecamp stalls:\n• **Authentic West Lampung Robusta Coffee** (rich volcanic soil aroma).\n• Local Fried Rice, Hot Noodle Soup, & Grilled Lake Fish.\n• Take-home red-cherry Robusta coffee bean pouches directly from local farmers!";
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
          botReply = "Sorry, AeroBot hasn't learned that context yet. 🙏 Try clicking one of the quick topic chips above or use keywords like 'Ticket', 'Homestay', 'Route', 'Safety', 'Weather', 'Outfit', or 'Food'.";
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
  const renderBooking = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 print:hidden overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header Booking */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 text-white flex justify-between items-center relative">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full text-emerald-100 mb-2 inline-block">
              {lang === "ID" ? "Smart Booking AeroSuoh" : "AeroSuoh Smart Booking"}
            </span>
            <h3 className="text-2xl font-black">
              {bookingStep === 1 && (lang === "ID" ? "Formulir Pemesanan Tiket" : "Ticket Booking Form")}
              {bookingStep === 2 && (lang === "ID" ? "Pilih Paket Kunjungan" : "Select Package")}
              {bookingStep === 3 && (lang === "ID" ? "Pilihan Homestay Lokal" : "Select Local Homestay")}
              {bookingStep === 4 && (lang === "ID" ? "Metode Pembayaran QRIS" : "QRIS Payment")}
            </h3>
          </div>
          <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer">
            <X size={24} />
          </button>
        </div>

        {/* Body Booking */}
        <div className="p-6">
          
          {/* STEP 1: DATA DIRI */}
          {bookingStep === 1 && (
            <div className="space-y-4">
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
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">{lang === "ID" ? "Jumlah Pengunjung" : "Number of Guests"}</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="100" 
                    value={bookingData.guests} 
                    onChange={(e) => {
                      setBookingData({...bookingData, guests: parseInt(e.target.value) || 1});
                      if (bookingErrors.guests) setBookingErrors({...bookingErrors, guests: undefined});
                    }} 
                    className={`w-full p-3 bg-slate-50 border ${bookingErrors.guests ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200'} rounded-xl text-slate-800 text-sm outline-none focus:border-emerald-500 transition-colors`} 
                  />
                  {bookingErrors.guests && <p className="text-xs text-rose-500 mt-1 font-semibold">{bookingErrors.guests}</p>}
                </div>
              </div>

              <button 
                onClick={() => {
                  if (validateStep1()) {
                    setBookingStep(2);
                  }
                }}
                className="w-full mt-4 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {lang === "ID" ? "Lanjutkan" : "Next"} <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 2: PILIH PAKET */}
          {bookingStep === 2 && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-lg mb-4">{lang === "ID" ? "Pilih Pengalaman Anda" : "Choose Your Experience"}</h4>
              <div 
                onClick={() => setBookingData({...bookingData, type: "daytrip"})}
                className={`p-4 border-2 rounded-2xl cursor-pointer transition-all ${bookingData.type === "daytrip" ? "border-emerald-600 bg-emerald-50/50 shadow-md" : "border-slate-200 hover:border-slate-300"}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800">Day Trip Pass</span>
                  <span className="font-bold text-emerald-600">Rp 25.000 / orang</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{lang === "ID" ? "Akses 1 hari penuh ke Danau Asam dan titik pantau Kawah Geotermal." : "Full 1-day access to Lake Asam and Geothermal viewpoints."}</p>
              </div>

              <div 
                onClick={() => setBookingData({...bookingData, type: "homestay"})}
                className={`p-4 border-2 rounded-2xl cursor-pointer transition-all ${bookingData.type === "homestay" ? "border-emerald-600 bg-emerald-50/50 shadow-md" : "border-slate-200 hover:border-slate-300"}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800">Eco-Staycation</span>
                  <span className="font-bold text-emerald-600">Mulai Rp 175.000 / malam</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{lang === "ID" ? "Termasuk Day Trip Pass + Menginap 1 malam di Homestay warga lokal." : "Includes Day Trip Pass + 1 Night local Homestay."}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setBookingStep(1)} className="w-1/3 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">{lang === "ID" ? "Kembali" : "Back"}</button>
                <button 
                  disabled={!bookingData.type}
                  onClick={() => {
                    if (bookingData.type === "homestay") {
                      setBookingStep(3);
                    } else {
                      setBookingStep(4);
                    }
                  }} 
                  className="w-2/3 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:bg-slate-300 transition-colors shadow-lg shadow-emerald-900/20 cursor-pointer"
                >
                  {lang === "ID" ? "Lanjutkan" : "Next"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PILIH HOMESTAY (Jika pilih staycation) */}
          {bookingStep === 3 && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-lg mb-4">{lang === "ID" ? "Katalog Homestay Lokal" : "Local Homestay Catalog"}</h4>
              <div 
                onClick={() => setBookingData({...bookingData, homestay: "Homestay Danau Asam"})}
                className={`p-4 border-2 rounded-2xl cursor-pointer transition-all ${bookingData.homestay === "Homestay Danau Asam" ? "border-emerald-600 bg-emerald-50/50 shadow-md" : "border-slate-200 hover:border-slate-300"}`}
              >
                <span className="font-bold text-slate-800 block">Homestay Danau Asam</span>
                <p className="text-xs text-slate-500 mt-1">{lang === "ID" ? "View langsung ke danau, fasilitas air hangat alami." : "Direct lake view, natural hot spring facility."}</p>
              </div>
              <div 
                onClick={() => setBookingData({...bookingData, homestay: "Geothermal Cabin"})}
                className={`p-4 border-2 rounded-2xl cursor-pointer transition-all ${bookingData.homestay === "Geothermal Cabin" ? "border-emerald-600 bg-emerald-50/50 shadow-md" : "border-slate-200 hover:border-slate-300"}`}
              >
                <span className="font-bold text-slate-800 block">Geothermal Cabin</span>
                <p className="text-xs text-slate-500 mt-1">{lang === "ID" ? "Dekat area kawah, nuansa pedesaan yang asri." : "Near crater area, beautiful rustic vibes."}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => setBookingStep(2)} className="w-1/3 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer">{lang === "ID" ? "Kembali" : "Back"}</button>
                <button 
                  disabled={!bookingData.homestay}
                  onClick={() => setBookingStep(4)} 
                  className="w-2/3 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:bg-slate-300 transition-colors shadow-lg shadow-emerald-900/20 cursor-pointer"
                >
                  {lang === "ID" ? "Lanjutkan" : "Next"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PEMBAYARAN & WHATSAPP CHECKOUT */}
          {bookingStep === 4 && (
            <div className="space-y-6 text-center">
              
              {/* Tampilan QRIS */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold text-sm">
                  <QrCode size={18} className="text-emerald-600" />
                  <span>{t("qris_title")}</span>
                </div>
                
                {/* Gambar QRIS */}
                <div className="bg-white p-3 rounded-xl border border-slate-300 shadow-md mb-3">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=AEROSUOH_GEOTHERMAL_TOURISM_PAYMENT" 
                    alt="QRIS AeroSuoh" 
                    className="w-44 h-44 object-contain"
                  />
                </div>
                <p className="text-xs text-slate-500 max-w-xs">{t("qris_instruction")}</p>
              </div>

              {/* Ringkasan Tagihan */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">{lang === "ID" ? "Ringkasan Pesanan & Tagihan" : "Order & Bill Summary"}</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">{lang === "ID" ? "Nama" : "Name"}</span>
                    <span className="text-sm font-bold text-slate-800">{bookingData.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">{lang === "ID" ? "Paket" : "Package"}</span>
                    <span className="text-sm font-bold text-slate-800">
                      {bookingData.type === "homestay" ? "Eco-Staycation" : "Day Trip Pass"}
                    </span>
                  </div>
                  {bookingData.homestay && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Homestay</span>
                      <span className="text-sm font-bold text-emerald-600">{bookingData.homestay}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">{lang === "ID" ? "Tanggal" : "Date"}</span>
                    <span className="text-sm font-bold text-slate-800">{bookingData.date || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">{lang === "ID" ? "Pengunjung" : "Guests"}</span>
                    <span className="text-sm font-bold text-slate-800 text-right">{bookingData.guests} {lang === "ID" ? "Orang" : "Pax"}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-emerald-200 pt-2 mt-2">
                    <span className="text-sm font-bold text-emerald-900">{lang === "ID" ? "Total Tagihan" : "Total Bill"}</span>
                    <span className="text-base font-black text-emerald-600">
                      Rp {((bookingData.type === "homestay" ? 175000 : 25000) * bookingData.guests).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tombol Konfirmasi WhatsApp */}
              <div className="space-y-2">
                <button 
                  onClick={handleCheckout}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
                >
                  <Ticket size={18} /> {lang === "ID" ? "Konfirmasi Pembayaran via WA" : "Confirm Payment via WA"}
                </button>
                <button 
                  onClick={() => setBookingStep(1)} 
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors py-1 block w-full text-center cursor-pointer"
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

  const renderChatbot = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 print:hidden">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col h-[560px]">
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-4 flex justify-between items-center text-white">
          <div><h3 className="font-bold">AeroBot</h3><p className="text-xs text-emerald-200">Suoh Assistant</p></div>
          <div className="flex gap-2">
            <button onClick={toggleLang} className="bg-emerald-700 px-2 py-1 rounded-full text-xs font-bold text-amber-300">{lang}</button>
            <button onClick={() => setActiveModal(null)}><X size={20} /></button>
          </div>
        </div>
        <div className="flex-1 bg-slate-50 p-4 overflow-y-auto flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div key={i} className={`p-3 rounded-2xl text-sm ${msg.sender === "bot" ? "bg-white self-start" : "bg-emerald-600 text-white self-end"}`}>{msg.text}</div>
          ))}
          {isTyping && <div className="text-xs text-slate-500 p-2 italic">AeroBot typing...</div>}
          <div ref={messagesEndRef} />
        </div>
        <div className="px-3 py-2 bg-slate-100 overflow-x-auto flex gap-1.5 no-scrollbar">
          {quickChips.map((chip, i) => (
            <button key={i} onClick={() => handleChipClick(chip.query, chip.label)} className="px-3 py-1 bg-white border text-xs font-semibold rounded-full whitespace-nowrap">{chip.label}</button>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2">
          <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm outline-none" placeholder={lang === "ID" ? "Ketik pesan..." : "Type message..."} />
          <button type="submit" className="p-2 bg-emerald-600 text-white rounded-full"><Send size={18} /></button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {activeModal === "booking" && renderBooking()}
      {activeModal === "chat" && renderChatbot()}
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={() => setActiveModal("chat")} className="p-4 rounded-full shadow-2xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-white animate-pulse" title="AeroBot">
          <MessageCircle size={28} />
        </button>
      </div>
    </>
  );
}