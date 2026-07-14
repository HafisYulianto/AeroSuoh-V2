"use client";

import { createContext, useState, useContext, ReactNode } from "react";

type Language = "ID" | "EN";

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: keyof typeof translations.ID) => string;
}

// === BRANKAS KAMUS TERJEMAHAN (UPDATE SEJARAH LENGKAP & MITOS LOKAL) ===
const translations = {
  ID: {
    // Navbar & Hero
    nav_home: "Beranda",
    nav_about: "Tentang",
    nav_gallery: "Pesona Suoh",
    nav_map: "Pemetaan Udara",
    nav_dash: "Dasbor Sensor",
    hero_title_1: "Menjaga Harta Karun",
    hero_title_2: "Lampung Barat",
    hero_desc: "Platform pariwisata pintar dan dasbor pemantauan geotermal masa depan untuk kawasan Suoh.",
    hero_btn_1: "Mulai Eksplorasi",
    hero_btn_2: "Lihat Dasbor",
    
    // Tentang & SDGS
    about_badge: "Latar Belakang & Misi",
    about_title: "Mengangkat Surga Tersembunyi Suoh ke Kancah Global",
    about_desc_1: "Kawasan Suoh menyimpan pesona alam yang luar biasa—mulai dari danau vulkanik yang asri hingga fenomena geotermal yang eksotis. Sayangnya, keindahan alami yang masih sangat terjaga ini belum sepenuhnya terekspos ke dunia luar.",
    about_desc_2: "AeroSuoh hadir untuk menjembatani kesenjangan tersebut. Kami memadukan promosi keajaiban alam ini dengan teknologi pemantauan masa depan. Harapan kami, pariwisata Suoh tidak hanya semakin dikenal di tingkat nasional, tetapi juga mampu bersinar di kancah internasional secara aman dan terkendali.",
    about_btn_logo: "Pelajari Filosofi Logo Kami",
    foot_nav_logo: "Filosofi Logo",
    logo_btn_download: "Unduh Logo Resmi (PNG)",
    sdg_title: "Mendukung Tujuan Pembangunan Berkelanjutan (SDGs)",
    sdg1_title: "SDG 8 & 11: Ekonomi & Komunitas Berkelanjutan",
    sdg1_desc: "Memberdayakan ekonomi masyarakat lokal melalui sektor pariwisata yang aman, inklusif, dan berkelanjutan.",
    sdg2_title: "SDG 13 & 15: Konservasi & Mitigasi Iklim",
    sdg2_desc: "Mengedukasi pengunjung tentang aktivitas geotermal serta pelestarian ekosistem daratan dan danau vulkanik.",

    // Dasbor
    dash_title: "Real-Time Eco-Monitor",
    dash_desc: "Pemantauan data satelit dan sensor geotermal kawasan Kecamatan Suoh, Lampung Barat.",
    dash_sync: "Sinkronisasi API:",
    dash_pdf: "Unduh Laporan PDF",
    dash_temp_title: "Suhu Permukaan (Live)",
    dash_temp_src: "Satelit: Open-Meteo",
    dash_wind_title: "Kecepatan Angin (Live)",
    dash_wind_desc: "Mempengaruhi sebaran gas kawah.",
    dash_h2s_title: "Gas Belerang (H2S)",
    dash_h2s_desc: "Waspada: Kawah Nirwana",
    dash_ph_title: "Keasaman Air (pH)",
    dash_ph_desc: "Danau Asam (Tinggi)",
    dash_chart_title: "Tren Aktivitas Geotermal & Emisi Gas",
    dash_legend_h2s: "Gas Belerang (Kawah Nirwana)",
    dash_legend_gempa: "Getaran Gempa Mikro (Seismik)",
    dash_weather_title: "Status Cuaca Udara Saat Ini",
    dash_weather_loc: "Lokasi Satelit:",
    dash_loading: "Memuat...",

    // === GALERI, SEJARAH, & MITOS (UPDATE SUPER LENGKAP) ===
    gal_title: "Pesona Suoh",
    gal_subtitle: "Jelajahi keindahan 6 titik utama di kawasan Suoh, Lampung Barat",
    gal_click_hint: "Lihat Detail",
    gal_open_map: "Buka Google Maps",
    gal_history_title: "Sejarah",
    
    // Lokasi 1: Danau Asam
    loc1_title: "Danau Asam",
    loc1_type: "Danau Vulkanik",
    loc1_desc: "Danau dengan tingkat keasaman tinggi. Mengandung belerang, sering digunakan sebagai indikator aktivitas vulkanik pasif di wilayah Suoh.",
    loc1_hist: "Danau ini terbentuk secara dramatis akibat letusan freatik (letusan uap panas bumi) yang maha dahsyat pada tahun 1933. Letusan tersebut dipicu oleh gempa tektonik berskala besar yang mengguncang kawasan Liwa-Suoh. Air danau ini memiliki kadar pH yang sangat rendah (asam) karena tingginya kandungan asam sulfat dari aktivitas vulkanik bawah tanah. Meski sangat asam, ekosistem di sekitar danau ini tetap hidup dengan vegetasi khas yang mampu beradaptasi dengan kondisi tanah bersulfur. Keberadaan danau ini menjadi laboratorium alam yang sangat berharga bagi para ahli vulkanologi dan geologi.",
    loc1_mitos: "Masyarakat setempat percaya bahwa warna air Danau Asam bisa menjadi 'alarm' alam. Jika airnya yang biasa berwarna kehijauan tiba-tiba berubah menjadi kuning pekat atau bahkan memerah, hal itu dipercaya sebagai pertanda akan datangnya gempa bumi atau aktivitas kawah yang meningkat. Selain itu, ada pantangan untuk berteriak atau berkata kotor di sekitar danau agar tidak mengganggu 'penunggu' tak kasat mata di kawasan tersebut.",
    
    // Lokasi 2: Danau Lebar
    loc2_title: "Danau Lebar",
    loc2_type: "Ekowisata",
    loc2_desc: "Kawasan danau air tawar terluas di Suoh. Menjadi pusat aktivitas ekonomi lokal dan penyewaan perahu wisata untuk memancing dan berkeliling.",
    loc2_hist: "Lahir dari rahim bencana yang sama dengan Danau Asam, yakni gempa bumi Suoh tahun 1933. Benturan lempeng tektonik menyebabkan cekungan raksasa yang kemudian terisi oleh air hujan dan mata air tanah selama bertahun-tahun. Berbeda dengan Danau Asam yang beracun, Danau Lebar memiliki ekosistem air tawar yang subur. Ratusan spesies ikan endemik hidup di dalamnya, menjadikannya urat nadi kehidupan ekonomi masyarakat sekitar, terutama nelayan lokal. Luasnya yang mencapai puluhan hektar membuat danau ini seolah menyerupai lautan tenang di tengah lembah barisan.",
    loc2_mitos: "Konon, di dasar Danau Lebar terdapat pusaran air misterius yang menghubungkan danau ini langsung dengan samudra di selatan. Nelayan lokal percaya bahwa di bulan-bulan tertentu, ikan-ikan raksasa akan muncul ke permukaan, yang dipercaya sebagai perwujudan roh leluhur yang menjaga keseimbangan ekosistem danau. Turis yang datang dilarang membuang sampah atau mencemari air jika ingin perjalanan mereka selamat.",
    
    // Lokasi 3: Danau Minyak
    loc3_title: "Danau Minyak",
    loc3_type: "Danau Vulkanik",
    loc3_desc: "Permukaan airnya terlihat seperti dilapisi minyak mengkilap. Memiliki aroma khas dan menjadi salah satu daya tarik visual yang unik.",
    loc3_hist: "Danau ini adalah salah satu fenomena langka di Indonesia. Permukaan airnya selalu terlihat berkilau seperti tertutup lapisan minyak tebal, namun saat disentuh, airnya tidak berminyak. Efek visual optik ini terjadi akibat reaksi kimia kompleks antara gas hidrokarbon, hidrogen sulfida, dan mikroorganisme purba (archaea) yang hidup bebas di dasar danau. Terbentuk pasca letusan 1933, danau ini menjadi bukti betapa kayanya kandungan mineral yang tersembunyi di bawah perut bumi Suoh.",
    loc3_mitos: "Nama 'Minyak' melahirkan cerita rakyat yang unik. Dahulu, dipercaya bahwa seorang raja sakti pernah menumpahkan cawan pusaka berisi minyak kehidupan di tempat ini saat terjadi peperangan gaib. Siapapun yang mencuci muka dengan air danau ini di malam purnama dipercaya akan awet muda, meskipun bau belerangnya cukup menyengat. Tentu saja, hal ini dilarang karena alasan kesehatan kulit.",
    
    // Lokasi 4: Pasir Kuning
    loc4_title: "Pasir Kuning",
    loc4_type: "Area Geotermal",
    loc4_desc: "Hamparan padang luas berwarna kuning terang akibat endapan sulfur. Spot foto favorit pengunjung namun perlu kehati-hatian tinggi.",
    loc4_hist: "Pasir Kuning bukanlah pasir silika seperti di pantai, melainkan hamparan kristal sulfur (belerang) padat yang telah mengendap selama ratusan tahun. Area ini merupakan zona pelepasan gas fumarol yang mengering. Endapan sulfur yang terbawa oleh uap panas perlahan-lahan menumpuk dan menutupi tanah, membunuh vegetasi di sekitarnya dan menciptakan lanskap tandus mirip permukaan planet Mars. Keindahan visualnya sangat kontras dengan hijaunya hutan tropis di sekelilingnya.",
    loc4_mitos: "Masyarakat percaya bahwa hamparan kuning ini adalah sisa emas batangan milik kerajaan tak kasat mata yang dikutuk menjadi pasir karena keserakahan manusia di masa lalu. Berjalan di atas pasir ini diyakini membutuhkan hati yang bersih. Jika seseorang memiliki niat buruk, pasir yang diinjaknya akan terasa membakar kaki (secara logis, ini karena panas bumi yang keluar dari rongga-rongga tanah sulfur).",
    
    // Lokasi 5: Kawah Nirwana
    loc5_title: "Kawah Nirwana",
    loc5_type: "Geotermal Aktif",
    loc5_desc: "Area manifestasi panas bumi sangat aktif dengan letupan lumpur panas. Suhu permukaan sangat tinggi, memerlukan pemantauan ketat.",
    loc5_hist: "Jangan tertipu oleh namanya yang indah. Kawah Nirwana adalah titik geotermal paling agresif dan mematikan di Suoh. Suhu letupan lumpur di sini bisa menembus 100 derajat Celcius, cukup untuk merebus apapun yang jatuh ke dalamnya. Kawah ini terus mengalami perubahan bentuk dan memperluas diameternya seiring waktu. Pada Mei 2024, kawah ini sempat mengalami erupsi freatik kecil yang menyemburkan material vulkanik belasan meter ke udara, membuktikan bahwa 'jantung' Suoh masih berdetak kencang.",
    loc5_mitos: "Dinamakan 'Nirwana' karena uap putih pekat yang selalu menyelimuti kawah ini menyerupai awan kahyangan. Namun, legenda lokal menyebutnya sebagai 'Gerbang Bawah Dunia'. Dipercayai bahwa letupan-letupan keras yang terdengar dari dalam kawah adalah suara napas naga raksasa yang tertidur di perut bumi. Pengunjung sangat diwajibkan didampingi kuncen atau pemandu lokal agar terhindar dari 'napas beracun' sang naga (gas H2S).",
    
    // Lokasi 6: Kawah Keramikan
    loc6_title: "Kawah Keramikan",
    loc6_type: "Geotermal Aktif",
    loc6_desc: "Dataran luas endapan kawah yang mengeras, retak, dan menyerupai lantai keramik kekuningan. Mengeluarkan asap belerang tebal dari celah retakan.",
    loc6_hist: "Kawah Keramikan adalah mahakarya geologi yang menakjubkan. Lapisannya terbentuk dari endapan silika dan kalsium karbonat yang terbawa oleh mata air panas vulkanik. Saat air tersebut menguap dan mengering selama puluhan tahun, mineral-mineral itu mengeras membentuk lapisan tebal yang retak-retak geometris, persis seperti lantai keramik rumah yang pecah. Ketebalan lapisan ini bervariasi, dan di beberapa titik, kerak 'keramik' ini sangat tipis sehingga bisa langsung amblas ke dalam lumpur mendidih jika diinjak.",
    loc6_mitos: "Lantai keramik alami ini diyakini oleh tetua adat sebagai puing-puing pelataran istana jin yang hancur saat gempa besar tahun 1933. Retakan-retakannya dipercaya sebagai jalur labirin mistis. Ada pantangan keras bagi siapa saja untuk melompat-lompat atau menghentakkan kaki dengan sombong di atas Keramikan, karena diyakini dapat memicu kemarahan penghuni bawah tanah yang akan langsung membuka rekahan tanah.",

    // Panduan Keselamatan
    safe_badge: "Perhatian Pengunjung",
    safe_title: "Panduan Keselamatan Jelajah",
    safe_desc: "Kawasan Suoh adalah alam liar yang memukau sekaligus menyimpan potensi bahaya panas bumi. Demi keselamatan dan kenyamanan bersama, mohon patuhi protokol berikut.",
    safe_rule1_title: "Wajib Masker Gas",
    safe_rule1_desc: "Beberapa area kawah menghasilkan gas sulfur pekat. Gunakan masker respirator khusus untuk pernapasan.",
    safe_rule2_title: "Sepatu Trekking Tertutup",
    safe_rule2_desc: "Suhu permukaan tanah (seperti di Keramikan) bisa sangat panas. Dilarang keras memakai sandal.",
    safe_rule3_title: "Didampingi Pemandu",
    safe_rule3_desc: "Jalur dan geotermal rawan ambles jika tidak hafal medan. Selalu patuhi arahan pemandu lokal.",
    safe_rule4_title: "Patuhi Zona Aman",
    safe_rule4_desc: "Jangan pernah melewati batas rambu peringatan zona merah atau mendekati pusat letupan lumpur.",

    // Peta Udara
    map_title: "Penjelajah Udara 3D Live",
    map_desc: "Pemetaan satelit 3D interaktif kawasan Kecamatan Suoh, Lampung Barat. Tahan klik kanan (Right-Click) untuk memutar.",
    map_auto_on: "AUTOPILOT: AKTIF",
    map_auto_off: "KENDALI MANUAL",
    map_auto_warn: "Auto-rotate dimatikan. Refresh halaman untuk mereset.",
    map_therm_on: "THERMAL NYALA",
    map_therm_off: "REKAM / THERMAL",
    map_therm_btn_on: "MATIKAN THERMAL",
    map_therm_btn_off: "AKTIFKAN THERMAL",
    map_ctrl: "Drag: Geser | Scroll: Zoom | Klik Kanan: Putar 3D",
    map_temp: "SUHU",
    map_ph: "pH AIR",
    map_gas: "H2S (GAS)",
    stat_normal: "Normal",
    stat_safe1: "Aman Dikunjungi",
    stat_safe2: "Aman (Patuhi Jalur)",
    stat_warn1: "Waspada (Zona Merah)",
    stat_warn2: "Waspada (Zona Kuning)",

    // Testimoni
    testi_badge: "Ulasan Pengunjung",
    testi_title: "Kesan Mereka Tentang Suoh",
    testi_desc: "Cerita dan pengalaman langsung dari para penjelajah yang telah membuktikan pesona alam Suoh.",
    testi_1_name: "Budi Santoso",
    testi_1_role: "Fotografer Alam",
    testi_1_text: "Lanskap Keramikan sangat surealis. Seperti memotret di planet lain! Kabut belerangnya memberikan efek sinematik alami yang luar biasa.",
    testi_2_name: "Sarah Wijaya",
    testi_2_role: "Peneliti Geologi",
    testi_2_text: "Aksesnya cukup menantang, tapi terbayar lunas saat melihat Danau Asam. Manifestasi geotermalnya sangat aktif dan menakjubkan.",
    testi_3_name: "Rio Pratama",
    testi_3_role: "Travel Vlogger",
    testi_3_text: "Gila sih Suoh! Wajib bawa drone kalau ke sini. Danau Lebarnya luas banget, dan warga lokalnya sangat ramah menyambut tamu.",

    // Rute
    route_title: "Jalur Menuju Basecamp Suoh",
    route_desc: "Kawasan Suoh dapat diakses dari dua titik utama. Pastikan kendaraan dalam kondisi prima mengingat medan pegunungan.",
    route_1_title: "Jalur Liwa (Utara)",
    route_1_desc: "Via Sekincau - Batu Brak. Jarak ±45 km (1.5 - 2 jam). Jalur ini sudah beraspal cukup mulus namun berkelok tajam melintasi perbukitan kopi.",
    route_2_title: "Jalur Tanggamus (Selatan)",
    route_2_desc: "Via Wonosobo - Bandar Negeri Suoh (BNS). Jarak ±80 km (2.5 - 3 jam). Lebih direkomendasikan untuk kendaraan roda dua atau mobil gardan ganda (4x4).",
    route_note: "Disarankan menggunakan motor atau menyewa ojek trail lokal dari basecamp menuju titik kawah untuk pengalaman maksimal dan aman.",

    // Phase 2: Safety Alert
    alert_warning: "PERINGATAN: Deteksi H2S Sedang Tinggi di Kawah Keramikan. Ikuti arahan pemandu wisata dan tetap di Zona Hijau.",
    
    // Phase 2: Encyclopedia
    encyclopedia_badge: "Kisah & Pengetahuan",
    encyclopedia_title: "Pesona Tersembunyi Suoh",
    encyclopedia_desc: "Jelajahi sejarah terbentuknya kaldera, mitos naga yang melegenda, hingga flora endemik yang mampu bertahan di tanah mendidih.",
    encyclopedia_tab_history: "Sejarah Gempa 1933",
    encyclopedia_history_content: "Lembah Suoh lahir dari tragedi. Pada 25 Juni 1933, gempa tektonik berkekuatan 7.5 SR mengguncang Liwa, membuka celah magma dan menciptakan letusan freatik dahsyat yang melahirkan danau-danau panas ini.",
    encyclopedia_tab_myth: "Legenda Ular Naga",
    encyclopedia_myth_content: "Masyarakat lokal percaya bahwa letupan uap panas dan suara gemuruh dari perut bumi Suoh berasal dari pergerakan Naga raksasa penjaga mata air yang tertidur di bawah tanah.",
    encyclopedia_tab_bio: "Ekosistem Ekstrem",
    encyclopedia_bio_content: "Meski memiliki tingkat keasaman (pH) dan suhu ekstrem, kawasan ini menjadi rumah bagi anggrek langka dan burung liar endemik Sumatera yang beradaptasi sempurna dengan lingkungan sulfurnya.",

    // Phase 2: Itinerary Planner
    itinerary_badge: "Rencana Perjalanan",
    itinerary_title: "Pilih Petualangan Anda",
    itinerary_desc: "Berapa lama Anda berencana mengunjungi Suoh? Pilih durasi dan biarkan sistem merancang jadwal terbaik untuk Anda.",
    itinerary_half_day: "Setengah Hari",
    itinerary_one_day: "1 Hari Penuh",
    itinerary_two_days: "2 Hari 1 Malam",
    itinerary_btn: "Buat Itinerary",
    itinerary_timeline_0700: "Menyaksikan kabut pagi di Danau Asam.",
    itinerary_timeline_0900: "Trekking santai menuju Danau Lebar & Pasir Kuning.",
    itinerary_timeline_1100: "Menjelajahi keajaiban Kawah Keramikan & Kawah Nirwana bersama guide.",
    itinerary_timeline_1300: "Makan siang kuliner khas lokal di Basecamp.",
    itinerary_timeline_1500: "Sesi foto estetik di savana dan perjalanan pulang.",
    itinerary_timeline_1600: "Mendirikan tenda di Danau Lebar atau check-in Homestay.",
    itinerary_timeline_1900: "Makan malam api unggun dan istirahat.",
    itinerary_timeline_day2: "Eksplorasi spot tersembunyi, mandi air hangat alami, dan beli oleh-oleh kopi Robusta.",

    // Phase 2: Virtual Tour -> Video Showcase
    virtual_badge: "Cinematic Showcase",
    virtual_title: "Suoh Dari Udara",
    virtual_desc: "Saksikan keindahan alam Suoh dan Danau Asam dari sudut pandang udara. Sebuah karya sinematik yang menangkap keajaiban ekosistem geotermal Lampung Barat.",
    virtual_instruction: "Sumber Video: Dian SaeK",

    // Phase 2: QRIS
    qris_title: "Selesaikan Pembayaran",
    qris_instruction: "Pindai kode QRIS di bawah ini menggunakan aplikasi M-Banking atau e-Wallet Anda.",

    // Route Access
    route_vehicle_tip: "Tips Kendaraan:",

    // Itinerary
    itinerary_day2_label: "Hari 2",

    // Error Pages
    error_title: "Terjadi Kesalahan",
    error_desc: "Sistem mendeteksi gangguan teknis. Ini bisa disebabkan oleh koneksi internet atau masalah sementara. Silakan coba lagi.",
    error_detail_label: "Detail Error",
    error_retry: "Coba Lagi",
    error_home: "Kembali ke Beranda",
    error_critical_title: "Kesalahan Sistem Kritis",
    error_critical_desc: "Terjadi kesalahan yang tidak terduga pada sistem AeroSuoh. Silakan muat ulang halaman.",
    error_reload: "Muat Ulang",

    // 404 Page
    notfound_title: "Tersesat di Hutan Suoh?",
    notfound_desc: "Halaman yang Anda cari tidak dapat ditemukan. Mungkin jalurnya sudah tertutup semak belukar, atau Anda salah kordinat.",
    notfound_home: "Kembali ke Basecamp",
    notfound_back: "Kembali Mundur",

    // Footer
    foot_nav_title: "Navigasi Sistem",
    foot_nav_safety: "Panduan Keselamatan",
    foot_loc_title: "Lokasi",
    foot_loc_1: "Kecamatan Suoh, Kabupaten Lampung Barat,",
    foot_loc_2: "Lampung, Indonesia",
    foot_copy: "© 2026 AeroSuoh Eco-Monitor. Hak Cipta Dilindungi.",
  },
  EN: {
    // Navbar & Hero
    nav_home: "Home",
    nav_about: "About",
    nav_gallery: "Suoh Charm",
    nav_map: "Aerial Map",
    nav_dash: "Sensor Dash",
    hero_title_1: "Guarding the Treasure of",
    hero_title_2: "West Lampung",
    hero_desc: "Smart ecological tourism platform and future real-time geothermal monitoring dashboard for the Suoh region.",
    hero_btn_1: "Start Exploring",
    hero_btn_2: "View Dashboard",
    
    // Tentang & SDGS
    about_badge: "Background & Mission",
    about_title: "Elevating Suoh's Hidden Paradise to the Global Stage",
    about_desc_1: "The Suoh region harbors extraordinary natural charm—from pristine volcanic lakes to exotic geothermal phenomena. Unfortunately, this beautifully preserved 'hidden paradise' remains underexposed to the outside world.",
    about_desc_2: "AeroSuoh was created to bridge this gap. We combine the promotion of these pristine natural wonders with futuristic monitoring technology. Our hope is that Suoh's tourism will not only be recognized nationally but will shine internationally in a safe and sustainable manner.",
    about_btn_logo: "Learn Our Logo Philosophy",
    foot_nav_logo: "Logo Philosophy",
    logo_btn_download: "Download Official Logo (PNG)",
    sdg_title: "Supporting Sustainable Development Goals (SDGs)",
    sdg1_title: "SDG 8 & 11: Sustainable Economy & Communities",
    sdg1_desc: "Empowering the local community's economy through safe, inclusive, and sustainable tourism.",
    sdg2_title: "SDG 13 & 15: Climate Mitigation & Conservation",
    sdg2_desc: "Educating visitors on climate mitigation, geothermal activity, and the conservation of terrestrial and volcanic lake ecosystems.",

    // Dasbor
    dash_title: "Real-Time Eco-Monitor",
    dash_desc: "Satellite data and geothermal sensor monitoring for Suoh District, West Lampung.",
    dash_sync: "Last API Sync:",
    dash_pdf: "Download PDF Report",
    dash_temp_title: "Surface Temp (Live)",
    dash_temp_src: "Satellite: Open-Meteo",
    dash_wind_title: "Wind Speed (Live)",
    dash_wind_desc: "Affects crater gas dispersion.",
    dash_h2s_title: "Sulfur Gas (H2S)",
    dash_h2s_desc: "Alert: Nirwana Crater",
    dash_ph_title: "Water Acidity (pH)",
    dash_ph_desc: "Acid Lake (High)",
    dash_chart_title: "Geothermal Activity & Gas Emission Trends",
    dash_legend_h2s: "Sulfur Gas (Nirwana Crater)",
    dash_legend_gempa: "Micro-Seismic Vibrations",
    dash_weather_title: "Current Weather Status",
    dash_weather_loc: "Satellite Location:",
    dash_loading: "Loading...",

    // === GALERI, SEJARAH, & MITOS (ENGLISH UPDATE) ===
    gal_title: "Suoh Charm",
    gal_subtitle: "Explore the beauty of 6 main spots in the West Lampung region",
    gal_click_hint: "View Details",
    gal_open_map: "Open Google Maps",
    gal_history_title: "History",
    
    // Loc 1: Asam Lake
    loc1_title: "Asam Lake",
    loc1_type: "Volcanic Lake",
    loc1_desc: "A lake with a very high acidity level. Contains sulfur and is often used as an indicator of passive volcanic activity in the Suoh area.",
    loc1_hist: "This lake was formed dramatically due to a massive phreatic (steam) eruption in 1933. The eruption was triggered by a large-scale tectonic earthquake that shook the Liwa-Suoh region. The water in this lake has a very low (acidic) pH level due to the high content of sulfuric acid from underground volcanic activity. Despite being highly acidic, the ecosystem around the lake continues to thrive with unique vegetation capable of adapting to sulfurous soil. The existence of this lake serves as an invaluable natural laboratory for volcanologists and geologists.",
    loc1_mitos: "Local people believe that the watercolor of Lake Asam can act as a natural 'alarm'. If the normally greenish water suddenly turns thick yellow or even red, it is believed to be a sign of an impending earthquake or increased crater activity. In addition, there is a taboo against shouting or using foul language around the lake so as not to disturb the unseen 'guardians' of the area.",
    
    // Loc 2: Lebar Lake
    loc2_title: "Lebar Lake",
    loc2_type: "Ecotourism",
    loc2_desc: "The largest freshwater lake in Suoh. Serves as the center for local economic activities and tourist boat rentals for fishing and sightseeing.",
    loc2_hist: "Born from the womb of the same disaster as Lake Asam, namely the 1933 Suoh earthquake. The collision of tectonic plates caused a giant basin which then filled with rainwater and groundwater springs over the years. Unlike the toxic Lake Asam, Lake Lebar has a fertile freshwater ecosystem. Hundreds of endemic fish species live in it, making it the lifeblood of the local community's economy, especially local fishermen. Its vastness, reaching dozens of hectares, makes this lake look like a calm ocean in the middle of a mountain valley.",
    loc2_mitos: "It is said that at the bottom of Lake Lebar there is a mysterious whirlpool that connects this lake directly to the southern ocean. Local fishermen believe that in certain months, giant fish will rise to the surface, which is believed to be the embodiment of ancestral spirits guarding the lake's ecosystem. Tourists visiting are forbidden from littering or polluting the water if they want their journey to be safe.",
    
    // Loc 3: Minyak Lake
    loc3_title: "Minyak Lake",
    loc3_type: "Volcanic Lake",
    loc3_desc: "The surface of the water looks as if it is coated with shiny oil. It has a distinct aroma and is one of the unique visual attractions.",
    loc3_hist: "This lake is one of the rare phenomena in Indonesia. The surface of the water always looks shiny as if covered by a thick layer of oil, but when touched, the water is not oily. This optical visual effect occurs due to a complex chemical reaction between hydrocarbon gases, hydrogen sulfide, and ancient microorganisms (archaea) living freely at the bottom of the lake. Formed after the 1933 eruption, this lake is proof of how rich the mineral content is hidden beneath the belly of the Suoh earth.",
    loc3_mitos: "The name 'Minyak' (Oil) birthed a unique folklore. In the past, it was believed that a powerful king once spilled a sacred chalice filled with the oil of life in this place during a supernatural war. Anyone who washes their face with the water of this lake on a full moon night is believed to stay young forever, even though the smell of sulfur is quite pungent. Of course, this is prohibited for skin health reasons.",
    
    // Loc 4: Yellow Sand
    loc4_title: "Yellow Sand",
    loc4_type: "Geothermal Area",
    loc4_desc: "A vast expanse of bright yellow field caused by sulfur deposits. A favorite photo spot for visitors, but extreme caution is required.",
    loc4_hist: "Yellow Sand is not silica sand like on the beach, but an expanse of solid sulfur crystals that have settled for hundreds of years. This area is a dried-up fumarole gas release zone. Sulfur deposits carried by hot steam slowly accumulate and cover the ground, killing the surrounding vegetation and creating a barren landscape resembling the surface of the planet Mars. Its visual beauty contrasts sharply with the green tropical rainforest surrounding it.",
    loc4_mitos: "The community believes that this yellow expanse is the remnants of gold bullion belonging to an unseen kingdom that was cursed into sand due to human greed in the past. Walking on this sand is believed to require a pure heart. If someone has bad intentions, the sand they step on will feel like it's burning their feet (logically, this is due to the geothermal heat escaping from the sulfur soil cavities).",
    
    // Loc 5: Nirwana Crater
    loc5_title: "Nirwana Crater",
    loc5_type: "Active Geothermal",
    loc5_desc: "A highly active geothermal manifestation area with bubbling hot mud. Extremely high surface temperatures, requiring strict monitoring.",
    loc5_hist: "Don't be fooled by its beautiful name. Nirwana Crater is the most aggressive and deadly geothermal point in Suoh. The temperature of the mud eruptions here can exceed 100 degrees Celsius, enough to boil anything that falls into it. This crater continues to change shape and expand its diameter over time. In May 2024, this crater experienced a small phreatic eruption that spewed volcanic material dozens of meters into the air, proving that the 'heart' of Suoh is still beating fast.",
    loc5_mitos: "Named 'Nirwana' (Nirvana/Heaven) because the thick white steam that always envelops this crater resembles heavenly clouds. However, local legends call it the 'Gate of the Underworld'. It is believed that the loud popping sounds heard from inside the crater are the breathing sounds of a giant dragon sleeping in the belly of the earth. Visitors are highly required to be accompanied by a caretaker or local guide to avoid the dragon's 'poisonous breath' (H2S gas).",
    
    // Loc 6: Keramikan Crater
    loc6_title: "Keramikan Crater",
    loc6_type: "Active Geothermal",
    loc6_desc: "A vast plain of hardened, cracked crater deposits resembling yellowish ceramic floors. Emits thick sulfur smoke from the cracks.",
    loc6_hist: "Keramikan Crater is a stunning geological masterpiece. Its layers are formed from silica and calcium carbonate deposits carried by volcanic hot springs. When the water evaporates and dries over decades, those minerals harden to form a thick layer with geometric cracks, exactly like a broken house ceramic floor. The thickness of this layer varies, and at some points, this 'ceramic' crust is so thin that it can immediately collapse into boiling mud if stepped on.",
    loc6_mitos: "This natural ceramic floor is believed by traditional elders to be the ruins of the courtyard of a jinn palace that was destroyed during the great earthquake of 1933. The cracks are believed to be mystical labyrinth paths. There is a strict taboo for anyone to jump around or stomp their feet arrogantly on the Keramikan, as it is believed it can trigger the anger of the underground dwellers who will immediately open the ground fissures.",

    // Panduan Keselamatan
    safe_badge: "Important Notice",
    safe_title: "Exploration Safety Guide",
    safe_desc: "The Suoh area is a stunning wilderness that also holds geothermal hazards. For our mutual safety and comfort, please obey the following protocols.",
    safe_rule1_title: "Gas Mask Required",
    safe_rule1_desc: "Some crater areas produce concentrated sulfur gas. Use a specialized respirator mask for breathing.",
    safe_rule2_title: "Closed Trekking Shoes",
    safe_rule2_desc: "Ground surface temperatures (like in Keramikan) can be extremely hot. Wearing sandals is strictly prohibited.",
    safe_rule3_title: "Accompanied by a Guide",
    safe_rule3_desc: "Ecological and geothermal paths are prone to caving in if you don't know the terrain. Always follow local guide instructions.",
    safe_rule4_title: "Obey Safe Zones",
    safe_rule4_desc: "Never cross the red zone warning signs or approach the center of mud eruptions.",

    // Peta Udara
    map_title: "Live 3D Aerial Explorer",
    map_desc: "Interactive 3D satellite mapping of Suoh District, West Lampung. Hold Right-Click to rotate.",
    map_auto_on: "AUTOPILOT: ACTIVE",
    map_auto_off: "MANUAL OVERRIDE",
    map_auto_warn: "Auto-rotate disabled. Refresh page to reset.",
    map_therm_on: "THERMAL ON",
    map_therm_off: "REC / THERMAL",
    map_therm_btn_on: "DISABLE THERMAL",
    map_therm_btn_off: "ENABLE THERMAL",
    map_ctrl: "Drag: Pan | Scroll: Zoom | Right-Click: Rotate 3D",
    map_temp: "TEMP",
    map_ph: "WATER pH",
    map_gas: "H2S (GAS)",
    stat_normal: "Normal",
    stat_safe1: "Safe to Visit",
    stat_safe2: "Safe (Stay on Path)",
    stat_warn1: "Alert (Red Zone)",
    stat_warn2: "Alert (Yellow Zone)",

    // Testimoni
    testi_badge: "Visitor Reviews",
    testi_title: "What They Say About Suoh",
    testi_desc: "Stories and firsthand experiences from explorers who have witnessed the natural charm of Suoh.",
    testi_1_name: "Budi Santoso",
    testi_1_role: "Nature Photographer",
    testi_1_text: "The Keramikan landscape is surreal. It's like photographing on another planet! The sulfur mist provides an incredible natural cinematic effect.",
    testi_2_name: "Sarah Wijaya",
    testi_2_role: "Geological Researcher",
    testi_2_text: "The access is quite challenging, but it pays off completely upon seeing Asam Lake. The geothermal manifestations are very active and amazing.",
    testi_3_name: "Rio Pratama",
    testi_3_role: "Travel Vlogger",
    testi_3_text: "Suoh is insane! Bringing a drone is a must here. Lebar Lake is extremely vast, and the locals are very welcoming to guests.",

    // Rute
    route_title: "Route to Suoh Basecamp",
    route_desc: "The Suoh area can be accessed from two main points. Ensure your vehicle is in prime condition considering the mountainous terrain.",
    route_1_title: "Liwa Route (North)",
    route_1_desc: "Via Sekincau - Batu Brak. ±45 km (1.5 - 2 hours). The road is smoothly paved but has sharp bends across coffee hills.",
    route_2_title: "Tanggamus Route (South)",
    route_2_desc: "Via Wonosobo - Bandar Negeri Suoh. ±80 km (2.5 - 3 hours). Highly recommended to use off-road motorcycles or 4x4 vehicles.",
    route_note: "It is advised to ride a motorcycle or rent a local dirt bike taxi from the basecamp to the crater points for the best and safest experience.",

    // Phase 2: Safety Alert
    alert_warning: "WARNING: Moderate H2S detected at Keramikan Crater. Please follow your guide and stay in the Green Zone.",
    
    // Phase 2: Encyclopedia
    encyclopedia_badge: "Lore & Knowledge",
    encyclopedia_title: "The Hidden Charms of Suoh",
    encyclopedia_desc: "Explore the caldera's history, the legendary dragon myth, and the endemic flora surviving in boiling grounds.",
    encyclopedia_tab_history: "1933 Earthquake",
    encyclopedia_history_content: "Suoh Valley was born from tragedy. On June 25, 1933, a 7.5 SR earthquake struck Liwa, opening a magma vent and triggering massive phreatic eruptions that formed these thermal lakes.",
    encyclopedia_tab_myth: "The Dragon Myth",
    encyclopedia_myth_content: "Locals believe the hissing steam and subterranean rumblings of Suoh originate from a giant sleeping dragon that guards the spring.",
    encyclopedia_tab_bio: "Extreme Ecosystem",
    encyclopedia_bio_content: "Despite the extreme acidity (pH) and temperatures, this area is home to rare orchids and wild Sumatran birds that have perfectly adapted to the sulfurous environment.",

    // Phase 2: Itinerary Planner
    itinerary_badge: "Trip Planner",
    itinerary_title: "Choose Your Adventure",
    itinerary_desc: "How long are you staying in Suoh? Select a duration and let our system craft the perfect itinerary for you.",
    itinerary_half_day: "Half Day",
    itinerary_one_day: "Full Day",
    itinerary_two_days: "2 Days 1 Night",
    itinerary_btn: "Generate Itinerary",
    itinerary_timeline_0700: "Watch the morning mist at Lake Asam.",
    itinerary_timeline_0900: "Leisurely trek to Lake Lebar & Pasir Kuning.",
    itinerary_timeline_1100: "Explore the wonders of Keramikan & Nirwana Craters with a guide.",
    itinerary_timeline_1300: "Lunch with local delicacies at the Basecamp.",
    itinerary_timeline_1500: "Aesthetic photo sessions at the savanna and heading back.",
    itinerary_timeline_1600: "Set up camp at Lake Lebar or check-in to a Homestay.",
    itinerary_timeline_1900: "Campfire dinner and resting under the stars.",
    itinerary_timeline_day2: "Explore hidden spots, enjoy natural hot springs, and buy local Robusta coffee souvenirs.",

    // Phase 2: Virtual Tour -> Video Showcase
    virtual_badge: "Cinematic Showcase",
    virtual_title: "Suoh from Above",
    virtual_desc: "Witness the natural beauty of Suoh and Lake Asam from a bird's-eye view. A cinematic masterpiece capturing the wonders of West Lampung's geothermal ecosystem.",
    virtual_instruction: "Video Source: YouTube / DRONE VIEW SUOH",

    // Phase 2: QRIS
    qris_title: "Complete Payment",
    qris_instruction: "Scan the QRIS code below using your M-Banking or e-Wallet app.",

    // Route Access
    route_vehicle_tip: "Vehicle Tips:",

    // Itinerary
    itinerary_day2_label: "Day 2",

    // Error Pages
    error_title: "Something Went Wrong",
    error_desc: "A technical issue was detected. This may be caused by your internet connection or a temporary problem. Please try again.",
    error_detail_label: "Error Detail",
    error_retry: "Try Again",
    error_home: "Back to Home",
    error_critical_title: "Critical System Error",
    error_critical_desc: "An unexpected error occurred in the AeroSuoh system. Please reload the page.",
    error_reload: "Reload",

    // 404 Page
    notfound_title: "Lost in the Suoh Jungle?",
    notfound_desc: "The page you are looking for cannot be found. Perhaps the trail is overgrown, or you have the wrong coordinates.",
    notfound_home: "Back to Basecamp",
    notfound_back: "Go Back",

    // Footer
    foot_nav_title: "System Navigation",
    foot_nav_safety: "Safety Guide",
    foot_loc_title: "Location",
    foot_loc_1: "Suoh District, West Lampung Regency,",
    foot_loc_2: "Lampung, Indonesia",
    foot_copy: "© 2026 AeroSuoh Eco-Monitor. All Rights Reserved.",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("ID");

  const toggleLang = () => {
    setLang((prev) => (prev === "ID" ? "EN" : "ID"));
  };

  const t = (key: keyof typeof translations.ID) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage harus digunakan di dalam LanguageProvider");
  }
  return context;
}