"use client";

// === TAMBAHAN: Import useRef dan useEffect untuk autoscroll chat ===
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Bot, Ticket, Calendar, Users, Home, ArrowRight, CheckCircle2, Send, QrCode } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function SmartAssistant() {
  const { lang, t } = useLanguage();
  const [activeModal, setActiveModal] = useState<"chat" | "booking" | null>(null);

  // === EVENT LISTENER UNTUK BOOKING DARI NAVBAR ===
  useEffect(() => {
    const handleOpenBooking = () => setActiveModal("booking");
    window.addEventListener('open-booking-modal', handleOpenBooking);
    return () => window.removeEventListener('open-booking-modal', handleOpenBooking);
  }, []);

  // === STATE UNTUK FORM BOOKING ===
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({ date: "", guests: 1, type: "", homestay: "" });
  const [bookingErrors, setBookingErrors] = useState<{date?: string; guests?: string}>({});

  // === STATE UNTUK AEROBOT (CHATBOT) ===
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { 
      sender: "bot", 
      text: lang === "ID" 
        ? "Halo! Saya AeroBot 🤖. Asisten virtual pintar Anda untuk kawasan Suoh. Ada yang bisa saya bantu? (Coba ketik: tiket, cuaca, homestay, atau jam buka)" 
        : "Hello! I'm AeroBot 🤖. Your smart virtual assistant for the Suoh region. How can I help you today? (Try typing: ticket, weather, homestay, or open hours)" 
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat ke bawah saat ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // === LOGIKA OTAK AEROBOT ===
  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    // 1. Tampilkan pesan user di layar
    const userMsg = chatInput.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    // 2. Simulasi bot sedang "Mikir" selama 1 detik
    setTimeout(() => {
      let botReply = "";
      const inputLower = userMsg.toLowerCase();

      // ==========================================
      // Deteksi Kata Kunci (Bahasa Indonesia)
      // ==========================================
      if (lang === "ID") {
        if (inputLower.includes("halo") || inputLower.includes("hai") || inputLower.includes("pagi") || inputLower.includes("siang") || inputLower.includes("sore") || inputLower.includes("malam") || inputLower.includes("assalamualaikum")) {
          botReply = "Halo! Saya AeroBot. Ada yang bisa saya bantu terkait informasi wisata, tiket, atau kondisi kawasan Suoh hari ini? 👋";
        } 
        else if (inputLower.includes("tiket") || inputLower.includes("harga") || inputLower.includes("bayar") || inputLower.includes("biaya") || inputLower.includes("tarif") || inputLower.includes("masuk") || inputLower.includes("karcis")) {
          botReply = "Harga tiket Day Trip Pass adalah Rp 25.000/orang. Untuk paket menginap Eco-Staycation mulai Rp 175.000/malam. Pesan langsung lewat menu 'Pesan Tiket & Homestay' ya! 🎫";
        } 
        else if (inputLower.includes("homestay") || inputLower.includes("nginap") || inputLower.includes("menginap") || inputLower.includes("hotel") || inputLower.includes("penginapan") || inputLower.includes("tidur") || inputLower.includes("villa") || inputLower.includes("kamar")) {
          botReply = "Kami menyediakan Homestay milik warga lokal yang terintegrasi di sistem Smart Booking. Tersedia Homestay Danau Asam dan Geothermal Cabin. Pesan sekarang melalui menu akomodasi kami! 🏡";
        } 
        else if (inputLower.includes("aman") || inputLower.includes("bahaya") || inputLower.includes("gas") || inputLower.includes("meletus") || inputLower.includes("belerang") || inputLower.includes("beracun") || inputLower.includes("takut") || inputLower.includes("resiko")) {
          botReply = "Kawasan Geotermal Suoh dipantau ketat secara real-time oleh dasbor kami. Selama Anda berada di Zona Hijau, mengikuti arahan guide, dan memakai masker yang disediakan, kunjungan dijamin aman! 🛡️";
        } 
        else if (inputLower.includes("lokasi") || inputLower.includes("dimana") || inputLower.includes("rute") || inputLower.includes("jalan") || inputLower.includes("akses") || inputLower.includes("alamat") || inputLower.includes("maps")) {
          botReply = "Suoh terletak di Kab. Lampung Barat. Ada 2 rute utama: via Liwa (utara) dan via Tanggamus/BNS (selatan). Cek bagian Rute di halaman utama atau Peta Interaktif kami untuk koordinat presisi! 🗺️";
        } 
        else if (inputLower.includes("jam") || inputLower.includes("buka") || inputLower.includes("tutup") || inputLower.includes("operasional") || inputLower.includes("kapan") || inputLower.includes("waktu")) {
          botReply = "Kawasan wisata Suoh buka setiap hari mulai pukul 07.00 hingga 17.00 WIB. Waktu terbaik berkunjung adalah pagi hari (07.00 - 09.00) saat kabut masih menyelimuti danau! 🌅";
        } 
        else if (inputLower.includes("danau") || inputLower.includes("kawah") || inputLower.includes("wisata") || inputLower.includes("tempat") || inputLower.includes("destinasi") || inputLower.includes("spot") || inputLower.includes("bagus")) {
          botReply = "AeroSuoh memiliki 6 spot memukau: Danau Asam, Danau Lebar, Danau Minyak, Pasir Kuning, Kawah Nirwana, dan Kawah Keramikan. Wajib datangi Semuanya! 🌋";
        } 
        else if (inputLower.includes("cuaca") || inputLower.includes("suhu") || inputLower.includes("hujan") || inputLower.includes("pantau") || inputLower.includes("sensor") || inputLower.includes("panas") || inputLower.includes("dingin")) {
          botReply = "Suhu udara di Suoh berkisar 20-25°C. Namun suhu permukaan kawah bisa sangat panas! Cek data live cuaca, suhu air, dan kadar gas H2S di menu Dasbor Sensor (Eco-Monitor) kami! 🌤️";
        } 
        else if (inputLower.includes("sejarah") || inputLower.includes("mitos") || inputLower.includes("cerita") || inputLower.includes("asal usul") || inputLower.includes("gempa") || inputLower.includes("legenda")) {
          botReply = "Kawasan unik ini terbentuk pasca letusan dahsyat gempa Liwa tahun 1933. Banyak cerita mistis soal naga bawah tanah dan air awet muda. Temukan lengkapnya di menu Pesona Suoh! 📜";
        } 
        else if (inputLower.includes("ngapain") || inputLower.includes("aktivitas") || inputLower.includes("foto") || inputLower.includes("camping") || inputLower.includes("kemah") || inputLower.includes("mancing") || inputLower.includes("drone")) {
          botReply = "Aktivitas favorit pengunjung: Fotografi lanskap, menerbangkan drone di Keramikan, memancing di Danau Lebar, dan camping di pinggir danau. Sangat cocok untuk healing! ⛺📸";
        } 
        else if (inputLower.includes("kendaraan") || inputLower.includes("mobil") || inputLower.includes("motor") || inputLower.includes("transportasi") || inputLower.includes("ojek") || inputLower.includes("parkir")) {
          botReply = "Bisa bawa mobil atau motor ke basecamp (area parkir luas & aman). Untuk masuk spot kawah, disarankan menyewa ojek motor trail lokal seharga ~Rp 50.000 agar pengalaman makin seru! 🚙🏍️";
        } 
        else if (inputLower.includes("makan") || inputLower.includes("minum") || inputLower.includes("kuliner") || inputLower.includes("warung") || inputLower.includes("restoran") || inputLower.includes("lapar") || inputLower.includes("kopi")) {
          botReply = "Di sekitar basecamp Danau Lebar terdapat warung-warung warga yang menjual makanan hangat, mi instan, dan Kopi Robusta khas Lampung Barat yang wajib Anda coba! ☕🍜";
        }
        else if (inputLower.includes("sinyal") || inputLower.includes("internet") || inputLower.includes("wifi") || inputLower.includes("telkomsel") || inputLower.includes("jaringan")) {
          botReply = "Sinyal seluler (terutama Telkomsel) sudah cukup stabil di area basecamp dan homestay. Namun di area kawah mungkin sedikit blank-spot. Cocok untuk digital detox! 📱🚫";
        }
        else if (inputLower.includes("baju") || inputLower.includes("pakaian") || inputLower.includes("outfit") || inputLower.includes("pakai") || inputLower.includes("sandal") || inputLower.includes("sepatu")) {
          botReply = "WAJIB gunakan sepatu tertutup (sneakers/trekking), dilarang pakai sandal karena tanah bisa sangat panas. Gunakan pakaian yang nyaman menyerap keringat dan bawa jaket jika menginap! 👟🧥";
        }
        else if (inputLower.includes("anak") || inputLower.includes("keluarga") || inputLower.includes("bayi") || inputLower.includes("balita") || inputLower.includes("orang tua")) {
          botReply = "Untuk area Danau (Asam, Lebar) sangat aman untuk anak & lansia. Namun untuk turun langsung ke Kawah Keramikan/Nirwana, anak-anak dan lansia disarankan hanya memantau dari zona pandang yang disediakan demi keamanan. 👨‍👩‍👧‍👦";
        }
        else if (inputLower.includes("pembuat") || inputLower.includes("developer") || inputLower.includes("hafis") || inputLower.includes("resiana") || inputLower.includes("pahleppi") || inputLower.includes("siapa yang buat") || inputLower.includes("teknokrat")) {
          botReply = "Platform canggih AeroSuoh ini dikembangkan oleh Hafis Yulianto & Resiana Pahleppi, mahasiswa Universitas Teknokrat Indonesia, sebagai dedikasi untuk memajukan pariwisata Lampung Barat! 💻🚀";
        } 
        else if (inputLower.includes("vtol") || inputLower.includes("pesawat") || inputLower.includes("kamera udara")) {
          botReply = "AeroSuoh mensimulasikan pemantauan udara menggunakan drone VTOL-X1 untuk memetakan kawasan geotermal dengan aman. Anda bisa melacaknya di menu Aerial Explorer! 🚁";
        } 
        else if (inputLower.includes("bantuan") || inputLower.includes("admin") || inputLower.includes("tolong") || inputLower.includes("hubungi") || inputLower.includes("kontak") || inputLower.includes("nomor") || inputLower.includes("wa") || inputLower.includes("whatsapp")) {
          botReply = "Butuh bantuan lebih lanjut? Anda bisa menghubungi Admin/Tour Guide lokal kami via WhatsApp melalui tombol kontak di bagian bawah website ini. 📞";
        } 
        else if (inputLower.includes("terima kasih") || inputLower.includes("makasih") || inputLower.includes("thanks") || inputLower.includes("ok") || inputLower.includes("oke") || inputLower.includes("baik")) {
          botReply = "Sama-sama! Senang bisa membantu. Jangan ragu untuk bertanya lagi jika ada yang kurang jelas. Selamat merencanakan liburan ke Suoh! ✨";
        }
        else {
          botReply = "Maaf, AeroBot masih terus belajar mengenali konteks tersebut. 🙏 Silakan coba kata kunci seperti 'Harga', 'Lokasi', 'Homestay', 'Keamanan', 'Makanan', atau 'Outfit'.";
        }
      } 
      
      // ==========================================
      // Deteksi Kata Kunci (Bahasa Inggris)
      // ==========================================
      else {
        if (inputLower.includes("hello") || inputLower.includes("hi") || inputLower.includes("morning") || inputLower.includes("afternoon") || inputLower.includes("evening")) {
          botReply = "Hello! I am AeroBot. How can I assist you today regarding Suoh's tourism, tickets, or conditions? 👋";
        } 
        else if (inputLower.includes("ticket") || inputLower.includes("price") || inputLower.includes("cost") || inputLower.includes("pay") || inputLower.includes("fee")) {
          botReply = "The Day Trip Pass is Rp 25.000/person. Eco-Staycation packages start at Rp 175.000/night. You can book directly using the 'Book Ticket' menu! 🎫";
        } 
        else if (inputLower.includes("homestay") || inputLower.includes("stay") || inputLower.includes("sleep") || inputLower.includes("hotel") || inputLower.includes("accommodation") || inputLower.includes("room")) {
          botReply = "We offer local homestays integrated into our Smart Booking system. Available options include Lake Asam Homestay and Geothermal Cabin. Book now via the menu! 🏡";
        } 
        else if (inputLower.includes("safe") || inputLower.includes("danger") || inputLower.includes("gas") || inputLower.includes("toxic") || inputLower.includes("erupt") || inputLower.includes("risk")) {
          botReply = "The Suoh Geothermal area is strictly monitored in real-time. As long as you stay in the Green Zone, follow guide instructions, and wear the provided mask, it is completely safe! 🛡️";
        } 
        else if (inputLower.includes("location") || inputLower.includes("where") || inputLower.includes("route") || inputLower.includes("road") || inputLower.includes("access") || inputLower.includes("maps")) {
          botReply = "Suoh is located in West Lampung. There are 2 main routes: via Liwa (North) and Tanggamus (South). Check our Route Section or Interactive Map for precise coordinates! 🗺️";
        } 
        else if (inputLower.includes("hour") || inputLower.includes("open") || inputLower.includes("close") || inputLower.includes("time") || inputLower.includes("when")) {
          botReply = "The Suoh tourism area is open daily from 07:00 AM to 05:00 PM (WIB). Morning (07.00 - 09.00) is the best time to visit when the mist still covers the lakes! 🌅";
        } 
        else if (inputLower.includes("lake") || inputLower.includes("crater") || inputLower.includes("destination") || inputLower.includes("place") || inputLower.includes("spot") || inputLower.includes("best")) {
          botReply = "AeroSuoh features 6 main destinations: Lake Asam, Lake Lebar, Lake Minyak, Pasir Kuning, Nirvana Crater, and Keramikan Crater. You must see them all! 🌋";
        } 
        else if (inputLower.includes("weather") || inputLower.includes("temperature") || inputLower.includes("rain") || inputLower.includes("monitor") || inputLower.includes("sensor") || inputLower.includes("hot") || inputLower.includes("cold")) {
          botReply = "Air temp is around 20-25°C. But crater surfaces are extremely hot! Check live weather, water pH, and H2S gas levels directly on our Eco-Monitor Dashboard! 🌤️";
        } 
        else if (inputLower.includes("history") || inputLower.includes("myth") || inputLower.includes("story") || inputLower.includes("origin") || inputLower.includes("legend") || inputLower.includes("earthquake")) {
          botReply = "This area was formed by the massive 1933 Liwa earthquake. Discover complete geological stories and local myths about dragons in our Suoh Charm menu! 📜";
        } 
        else if (inputLower.includes("activity") || inputLower.includes("photo") || inputLower.includes("camping") || inputLower.includes("camp") || inputLower.includes("what to do") || inputLower.includes("fishing") || inputLower.includes("drone")) {
          botReply = "Top activities: Landscape photography, flying drones over Keramikan, fishing at Lebar Lake, and safe-zone camping. It's a perfect healing spot! ⛺📸";
        } 
        else if (inputLower.includes("transport") || inputLower.includes("car") || inputLower.includes("motorcycle") || inputLower.includes("vehicle") || inputLower.includes("taxi") || inputLower.includes("parking")) {
          botReply = "You can drive your car/motorcycle to the basecamp (safe parking). To enter crater spots, we recommend renting a local dirt bike taxi (~Rp 50.000) for a fun ride! 🚙🏍️";
        }
        else if (inputLower.includes("food") || inputLower.includes("drink") || inputLower.includes("eat") || inputLower.includes("restaurant") || inputLower.includes("cafe") || inputLower.includes("hungry") || inputLower.includes("coffee")) {
          botReply = "Around the Lebar Lake basecamp, there are local food stalls selling warm meals, instant noodles, and the famous West Lampung Robusta Coffee. You must try it! ☕🍜";
        }
        else if (inputLower.includes("signal") || inputLower.includes("internet") || inputLower.includes("wifi") || inputLower.includes("connection") || inputLower.includes("network")) {
          botReply = "Cellular signal (mainly Telkomsel) is quite stable at the basecamp. However, crater areas might have blank spots. Perfect for a digital detox! 📱🚫";
        }
        else if (inputLower.includes("clothes") || inputLower.includes("wear") || inputLower.includes("outfit") || inputLower.includes("shoes") || inputLower.includes("sandal") || inputLower.includes("jacket")) {
          botReply = "MANDATORY: wear closed shoes (sneakers/trekking). Sandals are prohibited as the ground can be boiling hot. Wear comfortable clothes and bring a jacket if staying overnight! 👟🧥";
        }
        else if (inputLower.includes("kid") || inputLower.includes("family") || inputLower.includes("baby") || inputLower.includes("child") || inputLower.includes("parent") || inputLower.includes("old")) {
          botReply = "The Lake areas are very safe for kids and seniors. However, for active craters (Keramikan/Nirvana), kids and seniors are advised to view only from the designated safe observation zones. 👨‍👩‍👧‍👦";
        }
        else if (inputLower.includes("developer") || inputLower.includes("creator") || inputLower.includes("hafis") || inputLower.includes("resiana") || inputLower.includes("pahleppi") || inputLower.includes("who made") || inputLower.includes("teknokrat")) {
          botReply = "This advanced AeroSuoh platform was developed by Hafis Yulianto & Resiana Pahleppi, students at Universitas Teknokrat Indonesia, dedicated to advancing West Lampung's tourism! 💻🚀";
        } 
        else if (inputLower.includes("vtol") || inputLower.includes("plane") || inputLower.includes("camera")) {
          botReply = "AeroSuoh simulates aerial monitoring using a VTOL-X1 drone to map the geothermal area safely. You can track it in our Aerial Explorer menu! 🚁";
        } 
        else if (inputLower.includes("help") || inputLower.includes("admin") || inputLower.includes("support") || inputLower.includes("contact") || inputLower.includes("call") || inputLower.includes("whatsapp")) {
          botReply = "Need more help? You can contact our Admin/Local Tour Guide via WhatsApp using the contact button at the bottom of the page. 📞";
        } 
        else if (inputLower.includes("thank") || inputLower.includes("thanks") || inputLower.includes("ok") || inputLower.includes("okay") || inputLower.includes("good")) {
          botReply = "You're welcome! Glad I could help. Feel free to ask more questions if needed. Enjoy your trip to Suoh! ✨";
        }
        else {
          botReply = "Sorry, AeroBot is still learning to recognize that word. 🙏 Please try using keywords like 'Price', 'Location', 'Homestay', 'Safety', 'Food', or 'Outfit'.";
        }
      }

      // 3. Tampilkan balasan bot
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    }, 1000); // delay 1 detik
  };

  // === FUNGSI GENERATOR WHATSAPP LINK (Booking) ===
  const handleCheckout = () => {
    const adminPhone = "6282279485813"; // Ganti dengan nomor WhatsApp admin yang asli
    let waMessage = "";
    if (lang === "ID") {
      waMessage = `Halo Admin AeroSuoh, saya ingin konfirmasi pesanan tiket:\n\n*Paket:* ${bookingData.type === "homestay" ? "Eco-Staycation" : "Day Trip Pass"}\n${bookingData.homestay ? `*Homestay:* ${bookingData.homestay}\n` : ""}*Tanggal:* ${bookingData.date || "Belum dipilih"}\n*Jumlah Orang:* ${bookingData.guests} Orang\n\nMohon info selanjutnya untuk pembayaran. Terima kasih.`;
    } else {
      waMessage = `Hello AeroSuoh Admin, I would like to confirm my booking:\n\n*Package:* ${bookingData.type === "homestay" ? "Eco-Staycation" : "Day Trip Pass"}\n${bookingData.homestay ? `*Homestay:* ${bookingData.homestay}\n` : ""}*Date:* ${bookingData.date || "Not selected"}\n*Guests:* ${bookingData.guests} Pax\n\nPlease provide further instructions for payment. Thank you.`;
    }
    const encodedMessage = encodeURIComponent(waMessage);
    const waUrl = `https://wa.me/${adminPhone}?text=${encodedMessage}`;
    window.open(waUrl, "_blank");
    setActiveModal(null);
    setBookingStep(1);
    setBookingErrors({});
  };

  // === VALIDASI FORM BOOKING STEP 1 ===
  const validateStep1 = (): boolean => {
    const errors: {date?: string; guests?: string} = {};
    
    if (!bookingData.date) {
      errors.date = lang === "ID" ? "Tanggal kunjungan wajib diisi" : "Visit date is required";
    } else {
      const selectedDate = new Date(bookingData.date + "T00:00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.date = lang === "ID" ? "Tanggal tidak boleh di masa lalu" : "Date cannot be in the past";
      }
    }
    
    if (!bookingData.guests || bookingData.guests < 1 || isNaN(bookingData.guests)) {
      errors.guests = lang === "ID" ? "Minimal 1 pengunjung" : "At least 1 guest required";
    } else if (bookingData.guests > 100) {
      errors.guests = lang === "ID" ? "Maksimal 100 pengunjung per pesanan" : "Max 100 guests per booking";
    }
    
    setBookingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // === MODAL 1: SMART BOOKING ===
  const renderBooking = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 print:hidden">
      <div className={`bg-white rounded-2xl w-full ${bookingStep === 4 ? 'max-w-2xl' : 'max-w-lg'} overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 transition-all`}>
        
        {/* Header Modal Booking */}
        <div className="bg-emerald-900 p-5 flex justify-between items-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <h3 className="font-bold flex items-center gap-2 relative z-10 text-lg">
            <Ticket size={22} className="text-amber-400" /> 
            {lang === "ID" ? "Smart Booking AeroSuoh" : "AeroSuoh Smart Booking"}
          </h3>
          <button onClick={() => {setActiveModal(null); setBookingStep(1);}} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors relative z-10">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {/* Progress Bar (Indikator Langkah) */}
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-10"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 -z-10 transition-all duration-500" style={{ width: `${(bookingStep - 1) * 33.33}%` }}></div>
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${bookingStep >= step ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/30" : "bg-white border-slate-300 text-slate-400"}`}>
                {step}
              </div>
            ))}
          </div>

          {/* STEP 1: Tanggal & Jumlah Tamu */}
          {bookingStep === 1 && (
            <div className="space-y-5 animate-in slide-in-from-right-4">
              <h4 className="font-bold text-slate-800 text-lg">{lang === "ID" ? "Kapan Anda berkunjung?" : "When are you visiting?"}</h4>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">{lang === "ID" ? "Tanggal Kunjungan" : "Visit Date"}</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" />
                  <input 
                    type="date" 
                    value={bookingData.date}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 transition-all font-medium text-slate-700 ${
                      bookingErrors.date 
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" 
                        : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                    }`} 
                    onChange={(e) => { setBookingData({...bookingData, date: e.target.value}); setBookingErrors({...bookingErrors, date: undefined}); }} 
                  />
                </div>
                {bookingErrors.date && (
                  <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span> {bookingErrors.date}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">{lang === "ID" ? "Jumlah Pengunjung" : "Number of Guests"}</label>
                <div className="relative">
                  <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" />
                  <input 
                    type="number" 
                    min="1" 
                    max="100"
                    value={bookingData.guests}
                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl outline-none focus:ring-2 transition-all font-medium text-slate-700 ${
                      bookingErrors.guests 
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" 
                        : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                    }`} 
                    onChange={(e) => { setBookingData({...bookingData, guests: parseInt(e.target.value) || 0}); setBookingErrors({...bookingErrors, guests: undefined}); }} 
                  />
                </div>
                {bookingErrors.guests && (
                  <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span> {bookingErrors.guests}
                  </p>
                )}
              </div>
              <button onClick={() => { if (validateStep1()) setBookingStep(2); }} className="w-full py-3 mt-6 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all hover:shadow-lg flex justify-center items-center gap-2">
                {lang === "ID" ? "Lanjutkan" : "Next"} <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 2: Pilih Paket (Mix Tiket & Homestay) */}
          {bookingStep === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <h4 className="font-bold text-slate-800 text-lg mb-4">{lang === "ID" ? "Pilih Pengalaman Anda" : "Choose Your Experience"}</h4>
              
              <div onClick={() => setBookingData({...bookingData, type: "ticket", homestay: ""})} className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${bookingData.type === "ticket" ? "border-emerald-500 bg-emerald-50 shadow-md" : "border-slate-200 hover:border-emerald-300"}`}>
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-bold text-emerald-900 flex items-center gap-2"><Ticket size={18} className="text-emerald-600" /> Day Trip Pass</h5>
                  <span className="text-sm font-bold text-emerald-600">Rp 25.000<span className="text-[10px] font-normal text-slate-500">/org</span></span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{lang === "ID" ? "Akses 1 hari penuh ke Danau Asam dan titik pantau Kawah Geotermal." : "Full 1-day access to Lake Asam and Geothermal viewpoints."}</p>
              </div>

              <div onClick={() => setBookingData({...bookingData, type: "homestay"})} className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${bookingData.type === "homestay" ? "border-emerald-500 bg-emerald-50 shadow-md" : "border-slate-200 hover:border-emerald-300"}`}>
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-bold text-emerald-900 flex items-center gap-2"><Home size={18} className="text-emerald-600" /> Eco-Staycation</h5>
                  <span className="text-sm font-bold text-emerald-600">Rp 175.000<span className="text-[10px] font-normal text-slate-500">/malam</span></span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{lang === "ID" ? "Termasuk Day Trip Pass + Menginap 1 malam di Homestay warga lokal." : "Includes Day Trip Pass + 1 Night local Homestay."}</p>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setBookingStep(1)} className="w-1/3 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">{lang === "ID" ? "Kembali" : "Back"}</button>
                <button disabled={!bookingData.type} onClick={() => setBookingStep(bookingData.type === "homestay" ? 3 : 4)} className="w-2/3 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-all shadow-md">
                  {lang === "ID" ? "Lanjutkan" : "Next"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Katalog Homestay (Muncul Jika Pilih Eco-Staycation) */}
          {bookingStep === 3 && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <h4 className="font-bold text-slate-800 text-lg mb-4">{lang === "ID" ? "Katalog Homestay Lokal" : "Local Homestay Catalog"}</h4>
              
              <div onClick={() => setBookingData({...bookingData, homestay: "Homestay Danau Asam"})} className={`p-3 border-2 rounded-xl cursor-pointer flex gap-4 items-center transition-all ${bookingData.homestay === "Homestay Danau Asam" ? "border-emerald-500 bg-emerald-50 shadow-md" : "border-slate-200 hover:border-emerald-200"}`}>
                <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 shrink-0"><Home size={24} /></div>
                <div>
                  <h5 className="font-bold text-sm text-slate-800">Homestay Danau Asam</h5>
                  <p className="text-xs text-slate-500 mt-1">{lang === "ID" ? "View langsung ke danau, fasilitas air hangat alami." : "Direct lake view, natural hot spring facility."}</p>
                </div>
              </div>

              <div onClick={() => setBookingData({...bookingData, homestay: "Geothermal Cabin"})} className={`p-3 border-2 rounded-xl cursor-pointer flex gap-4 items-center transition-all ${bookingData.homestay === "Geothermal Cabin" ? "border-emerald-500 bg-emerald-50 shadow-md" : "border-slate-200 hover:border-emerald-200"}`}>
                <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 shrink-0"><Home size={24} /></div>
                <div>
                  <h5 className="font-bold text-sm text-slate-800">Geothermal Cabin</h5>
                  <p className="text-xs text-slate-500 mt-1">{lang === "ID" ? "Dekat area kawah, nuansa pedesaan yang asri." : "Near crater area, beautiful rustic vibes."}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setBookingStep(2)} className="w-1/3 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">{lang === "ID" ? "Kembali" : "Back"}</button>
                <button disabled={!bookingData.homestay} onClick={() => setBookingStep(4)} className="w-2/3 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:bg-slate-300 transition-all shadow-md">
                  {lang === "ID" ? "Lanjutkan" : "Next"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Checkout & Ringkasan */}
          {bookingStep === 4 && (
            <div className="animate-in slide-in-from-right-4 py-2">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="font-bold text-xl text-slate-800">{t("qris_title" as any)}</h4>
                <p className="text-sm text-slate-500 px-4">
                  {t("qris_instruction" as any)}
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 mb-6 items-center md:items-stretch">
                {/* === REAL QRIS IMAGE === */}
                <div className="bg-white p-2 rounded-xl border-2 border-dashed border-emerald-300 w-[200px] h-[260px] flex flex-col items-center justify-center shadow-sm relative overflow-hidden group shrink-0">
                  <div className="absolute top-0 w-full h-1 bg-emerald-500 shadow-[0_0_15px_#10b981] animate-[scan_2s_ease-in-out_infinite] z-20"></div>
                  <img src="/payment/QRIS.png" alt="QRIS Payment" className="w-full h-full object-contain relative z-10 rounded-lg" />
                </div>
                <style jsx>{`
                  @keyframes scan {
                    0%, 100% { top: 0; }
                    50% { top: 100%; }
                  }
                `}</style>
                
                {/* Box Ringkasan */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 shadow-inner flex-1 w-full flex flex-col justify-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">{lang === "ID" ? "Ringkasan Pesanan & Tagihan" : "Order & Bill Summary"}</p>
                  
                  <div className="space-y-3 flex-1">
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-slate-600">{lang === "ID" ? "Paket" : "Package"}</span>
                      <span className="text-sm font-bold text-slate-800 text-right">{bookingData.type === "homestay" ? "Eco-Staycation" : "Day Trip Pass"}</span>
                    </div>
                    
                    {bookingData.homestay && (
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-slate-600">Homestay</span>
                        <span className="text-sm font-bold text-emerald-700 text-right">{bookingData.homestay}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-slate-600">{lang === "ID" ? "Tanggal" : "Date"}</span>
                      <span className="text-sm font-bold text-slate-800 text-right">{bookingData.date || "-"}</span>
                    </div>
                    
                    <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                      <span className="text-sm text-slate-600">{lang === "ID" ? "Pengunjung" : "Guests"}</span>
                      <span className="text-sm font-bold text-slate-800 text-right">{bookingData.guests} {lang === "ID" ? "Orang" : "Pax"}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-lg border border-emerald-100 mt-4">
                    <span className="text-sm font-bold text-emerald-900">{lang === "ID" ? "Total Tagihan" : "Total Bill"}</span>
                    <span className="text-lg font-black text-emerald-600">
                      Rp {(bookingData.type === "homestay" ? 175000 * bookingData.guests : 25000 * bookingData.guests).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    const total = bookingData.type === "homestay" ? 175000 * bookingData.guests : 25000 * bookingData.guests;
                    const packageStr = bookingData.type === "homestay" ? "Eco-Staycation" : "Day Trip Pass";
                    const homeStr = bookingData.homestay ? `%0AHomestay: ${bookingData.homestay}` : "";
                    const waText = `Halo Admin AeroSuoh, saya ingin konfirmasi pembayaran untuk pesanan:%0A%0APaket: ${packageStr}${homeStr}%0ATanggal: ${bookingData.date}%0AJumlah: ${bookingData.guests} Orang%0A*Total Tagihan: Rp ${total.toLocaleString("id-ID")}*%0A%0A(Bukti transfer QRIS akan saya kirimkan setelah pesan ini).`;
                    window.open(`https://wa.me/6282279485813?text=${waText}`, "_blank");
                    handleCheckout();
                  }} 
                  className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  <Ticket size={18} /> {lang === "ID" ? "Konfirmasi Pembayaran via WA" : "Confirm Payment via WA"}
                </button>
                <button onClick={() => setBookingStep(bookingData.type === "homestay" ? 3 : 2)} className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                  {lang === "ID" ? "Edit Pesanan" : "Edit Booking"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );

  // === MODAL 2: AEROBOT (DIREVISI TOTAL) ===
  const renderChatbot = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 print:hidden">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col h-[500px]">
        
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 p-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-full"><Bot size={24} /></div>
            <div>
              <h3 className="font-bold">AeroBot</h3>
              <p className="text-xs text-emerald-200">{lang === "ID" ? "Asisten Virtual Suoh" : "Suoh Virtual Assistant"}</p>
            </div>
          </div>
          <button onClick={() => setActiveModal(null)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
        </div>
        
        {/* Chat Body (Tempat Balasan Muncul) */}
        <div className="flex-1 bg-slate-50 p-4 overflow-y-auto flex flex-col gap-3 scroll-smooth">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm animate-in fade-in slide-in-from-bottom-2 ${
                msg.sender === "bot" 
                  ? "bg-white border border-slate-200 text-slate-700 rounded-tl-none self-start" 
                  : "bg-emerald-600 text-white rounded-tr-none self-end"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {/* Elemen kosong untuk target auto-scroll */}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Field */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={lang === "ID" ? "Ketik pesan..." : "Type a message..."}
            className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-slate-700"
          />
          <button 
            type="submit" 
            disabled={!chatInput.trim()} 
            className="p-2.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500 transition-colors shadow-md"
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
          className="p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center text-white bg-gradient-to-r from-emerald-500 to-emerald-700 hover:scale-110 hover:shadow-emerald-500/50 animate-pulse"
        >
          <MessageCircle size={28} />
        </button>
      </div>
    </>
  );
}