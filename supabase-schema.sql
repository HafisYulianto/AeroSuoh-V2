-- =====================================================
-- AeroSuoh-V2: Supabase Database Schema + Seed Data
-- Jalankan seluruh isi file ini di Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. TABEL: site_settings (Pengaturan Situs)
-- =====================================================
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO site_settings (key, value) VALUES
  ('hero_title_1_id', 'Menjaga Harta Karun'),
  ('hero_title_1_en', 'Guarding the Treasure of'),
  ('hero_title_2_id', 'Lampung Barat'),
  ('hero_title_2_en', 'West Lampung'),
  ('hero_desc_id', 'Platform pariwisata pintar dan dasbor pemantauan geotermal masa depan untuk kawasan Suoh.'),
  ('hero_desc_en', 'Smart ecological tourism platform and future real-time geothermal monitoring dashboard for the Suoh region.'),
  ('hero_btn_1_id', 'Mulai Eksplorasi'),
  ('hero_btn_1_en', 'Start Exploring'),
  ('hero_btn_2_id', 'Lihat Dasbor'),
  ('hero_btn_2_en', 'View Dashboard'),
  ('hero_image_url', '/hero-suoh2.png');

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Auth insert site_settings" ON site_settings FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update site_settings" ON site_settings FOR UPDATE USING (auth.role() = 'authenticated');

-- =====================================================
-- 2. TABEL: gallery_items (Pesona Suoh / Galeri Foto)
-- =====================================================
CREATE TABLE gallery_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sort_order INT NOT NULL DEFAULT 0,
  image_url TEXT NOT NULL DEFAULT '',
  title_id TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  type_id TEXT NOT NULL DEFAULT '',
  type_en TEXT NOT NULL DEFAULT '',
  desc_id TEXT NOT NULL DEFAULT '',
  desc_en TEXT NOT NULL DEFAULT '',
  history_id TEXT NOT NULL DEFAULT '',
  history_en TEXT NOT NULL DEFAULT '',
  mitos_id TEXT NOT NULL DEFAULT '',
  mitos_en TEXT NOT NULL DEFAULT '',
  lat DOUBLE PRECISION DEFAULT 0,
  lng DOUBLE PRECISION DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO gallery_items (sort_order, image_url, title_id, title_en, type_id, type_en, desc_id, desc_en, history_id, history_en, mitos_id, mitos_en, lat, lng) VALUES
(1, '/images/danau-asam-hd.png', 'Danau Asam', 'Asam Lake', 'Danau Vulkanik', 'Volcanic Lake',
 'Danau dengan tingkat keasaman tinggi. Mengandung belerang, sering digunakan sebagai indikator aktivitas vulkanik pasif di wilayah Suoh.',
 'A lake with a very high acidity level. Contains sulfur and is often used as an indicator of passive volcanic activity in the Suoh area.',
 'Danau ini terbentuk secara dramatis akibat letusan freatik (letusan uap panas bumi) yang maha dahsyat pada tahun 1933. Letusan tersebut dipicu oleh gempa tektonik berskala besar yang mengguncang kawasan Liwa-Suoh. Air danau ini memiliki kadar pH yang sangat rendah (asam) karena tingginya kandungan asam sulfat dari aktivitas vulkanik bawah tanah. Meski sangat asam, ekosistem di sekitar danau ini tetap hidup dengan vegetasi khas yang mampu beradaptasi dengan kondisi tanah bersulfur. Keberadaan danau ini menjadi laboratorium alam yang sangat berharga bagi para ahli vulkanologi dan geologi.',
 'This lake was formed dramatically due to a massive phreatic (steam) eruption in 1933. The eruption was triggered by a large-scale tectonic earthquake that shook the Liwa-Suoh region. The water in this lake has a very low (acidic) pH level due to the high content of sulfuric acid from underground volcanic activity. Despite being highly acidic, the ecosystem around the lake continues to thrive with unique vegetation capable of adapting to sulfurous soil. The existence of this lake serves as an invaluable natural laboratory for volcanologists and geologists.',
 'Masyarakat setempat percaya bahwa warna air Danau Asam bisa menjadi ''alarm'' alam. Jika airnya yang biasa berwarna kehijauan tiba-tiba berubah menjadi kuning pekat atau bahkan memerah, hal itu dipercaya sebagai pertanda akan datangnya gempa bumi atau aktivitas kawah yang meningkat. Selain itu, ada pantangan untuk berteriak atau berkata kotor di sekitar danau agar tidak mengganggu ''penunggu'' tak kasat mata di kawasan tersebut.',
 'Local people believe that the watercolor of Lake Asam can act as a natural ''alarm''. If the normally greenish water suddenly turns thick yellow or even red, it is believed to be a sign of an impending earthquake or increased crater activity. In addition, there is a taboo against shouting or using foul language around the lake so as not to disturb the unseen ''guardians'' of the area.',
 -5.238698319624318, 104.27882688457521),
(2, '/images/danau-lebar-hd.png', 'Danau Lebar', 'Lebar Lake', 'Ekowisata', 'Ecotourism',
 'Kawasan danau air tawar terluas di Suoh. Menjadi pusat aktivitas ekonomi lokal dan penyewaan perahu wisata untuk memancing dan berkeliling.',
 'The largest freshwater lake in Suoh. Serves as the center for local economic activities and tourist boat rentals for fishing and sightseeing.',
 'Lahir dari rahim bencana yang sama dengan Danau Asam, yakni gempa bumi Suoh tahun 1933. Benturan lempeng tektonik menyebabkan cekungan raksasa yang kemudian terisi oleh air hujan dan mata air tanah selama bertahun-tahun. Berbeda dengan Danau Asam yang beracun, Danau Lebar memiliki ekosistem air tawar yang subur. Ratusan spesies ikan endemik hidup di dalamnya, menjadikannya urat nadi kehidupan ekonomi masyarakat sekitar, terutama nelayan lokal. Luasnya yang mencapai puluhan hektar membuat danau ini seolah menyerupai lautan tenang di tengah lembah barisan.',
 'Born from the womb of the same disaster as Lake Asam, namely the 1933 Suoh earthquake. The collision of tectonic plates caused a giant basin which then filled with rainwater and groundwater springs over the years. Unlike the toxic Lake Asam, Lake Lebar has a fertile freshwater ecosystem. Hundreds of endemic fish species live in it, making it the lifeblood of the local community''s economy, especially local fishermen. Its vastness, reaching dozens of hectares, makes this lake look like a calm ocean in the middle of a mountain valley.',
 'Konon, di dasar Danau Lebar terdapat pusaran air misterius yang menghubungkan danau ini langsung dengan samudra di selatan. Nelayan lokal percaya bahwa di bulan-bulan tertentu, ikan-ikan raksasa akan muncul ke permukaan, yang dipercaya sebagai perwujudan roh leluhur yang menjaga keseimbangan ekosistem danau. Turis yang datang dilarang membuang sampah atau mencemari air jika ingin perjalanan mereka selamat.',
 'It is said that at the bottom of Lake Lebar there is a mysterious whirlpool that connects this lake directly to the southern ocean. Local fishermen believe that in certain months, giant fish will rise to the surface, which is believed to be the embodiment of ancestral spirits guarding the lake''s ecosystem. Tourists visiting are forbidden from littering or polluting the water if they want their journey to be safe.',
 -5.251999, 104.274690),
(3, '/images/danau-minyak-hd.png', 'Danau Minyak', 'Minyak Lake', 'Danau Vulkanik', 'Volcanic Lake',
 'Permukaan airnya terlihat seperti dilapisi minyak mengkilap. Memiliki aroma khas dan menjadi salah satu daya tarik visual yang unik.',
 'The surface of the water looks as if it is coated with shiny oil. It has a distinct aroma and is one of the unique visual attractions.',
 'Danau ini adalah salah satu fenomena langka di Indonesia. Permukaan airnya selalu terlihat berkilau seperti tertutup lapisan minyak tebal, namun saat disentuh, airnya tidak berminyak. Efek visual optik ini terjadi akibat reaksi kimia kompleks antara gas hidrokarbon, hidrogen sulfida, dan mikroorganisme purba (archaea) yang hidup bebas di dasar danau. Terbentuk pasca letusan 1933, danau ini menjadi bukti betapa kayanya kandungan mineral yang tersembunyi di bawah perut bumi Suoh.',
 'This lake is one of the rare phenomena in Indonesia. The surface of the water always looks shiny as if covered by a thick layer of oil, but when touched, the water is not oily. This optical visual effect occurs due to a complex chemical reaction between hydrocarbon gases, hydrogen sulfide, and ancient microorganisms (archaea) living freely at the bottom of the lake. Formed after the 1933 eruption, this lake is proof of how rich the mineral content is hidden beneath the belly of the Suoh earth.',
 'Nama ''Minyak'' melahirkan cerita rakyat yang unik. Dahulu, dipercaya bahwa seorang raja sakti pernah menumpahkan cawan pusaka berisi minyak kehidupan di tempat ini saat terjadi peperangan gaib. Siapapun yang mencuci muka dengan air danau ini di malam purnama dipercaya akan awet muda, meskipun bau belerangnya cukup menyengat.',
 'The name ''Minyak'' (Oil) birthed a unique folklore. In the past, it was believed that a powerful king once spilled a sacred chalice filled with the oil of life in this place during a supernatural war. Anyone who washes their face with the water of this lake on a full moon night is believed to stay young forever, even though the smell of sulfur is quite pungent.',
 -5.246098, 104.266782),
(4, '/images/pasir-kuning-hd.png', 'Pasir Kuning', 'Yellow Sand', 'Area Geotermal', 'Geothermal Area',
 'Hamparan padang luas berwarna kuning terang akibat endapan sulfur. Spot foto favorit pengunjung namun perlu kehati-hatian tinggi.',
 'A vast expanse of bright yellow field caused by sulfur deposits. A favorite photo spot for visitors, but extreme caution is required.',
 'Pasir Kuning bukanlah pasir silika seperti di pantai, melainkan hamparan kristal sulfur (belerang) padat yang telah mengendap selama ratusan tahun. Area ini merupakan zona pelepasan gas fumarol yang mengering. Endapan sulfur yang terbawa oleh uap panas perlahan-lahan menumpuk dan menutupi tanah, membunuh vegetasi di sekitarnya dan menciptakan lanskap tandus mirip permukaan planet Mars. Keindahan visualnya sangat kontras dengan hijaunya hutan tropis di sekelilingnya.',
 'Yellow Sand is not silica sand like on the beach, but an expanse of solid sulfur crystals that have settled for hundreds of years. This area is a dried-up fumarole gas release zone. Sulfur deposits carried by hot steam slowly accumulate and cover the ground, killing the surrounding vegetation and creating a barren landscape resembling the surface of the planet Mars. Its visual beauty contrasts sharply with the green tropical rainforest surrounding it.',
 'Masyarakat percaya bahwa hamparan kuning ini adalah sisa emas batangan milik kerajaan tak kasat mata yang dikutuk menjadi pasir karena keserakahan manusia di masa lalu. Berjalan di atas pasir ini diyakini membutuhkan hati yang bersih.',
 'The community believes that this yellow expanse is the remnants of gold bullion belonging to an unseen kingdom that was cursed into sand due to human greed in the past. Walking on this sand is believed to require a pure heart.',
 -5.236056616428336, 104.26727197333017),
(5, '/images/kawah-nirwana-hd.png', 'Kawah Nirwana', 'Nirwana Crater', 'Geotermal Aktif', 'Active Geothermal',
 'Area manifestasi panas bumi sangat aktif dengan letupan lumpur panas. Suhu permukaan sangat tinggi, memerlukan pemantauan ketat.',
 'A highly active geothermal manifestation area with bubbling hot mud. Extremely high surface temperatures, requiring strict monitoring.',
 'Jangan tertipu oleh namanya yang indah. Kawah Nirwana adalah titik geotermal paling agresif dan mematikan di Suoh. Suhu letupan lumpur di sini bisa menembus 100 derajat Celcius.',
 'Don''t be fooled by its beautiful name. Nirwana Crater is the most aggressive and deadly geothermal point in Suoh. The temperature of the mud eruptions here can exceed 100 degrees Celsius.',
 'Dinamakan ''Nirwana'' karena uap putih pekat yang selalu menyelimuti kawah ini menyerupai awan kahyangan. Namun, legenda lokal menyebutnya sebagai ''Gerbang Bawah Dunia''.',
 'Named ''Nirwana'' (Nirvana/Heaven) because the thick white steam that always envelops this crater resembles heavenly clouds. However, local legends call it the ''Gate of the Underworld''.',
 -5.237142698064301, 104.25928872886739),
(6, '/images/kawah-keramikan-hd.png', 'Kawah Keramikan', 'Keramikan Crater', 'Geotermal Aktif', 'Active Geothermal',
 'Dataran luas endapan kawah yang mengeras, retak, dan menyerupai lantai keramik kekuningan. Mengeluarkan asap belerang tebal dari celah retakan.',
 'A vast plain of hardened, cracked crater deposits resembling yellowish ceramic floors. Emits thick sulfur smoke from the cracks.',
 'Kawah Keramikan adalah mahakarya geologi yang menakjubkan. Lapisannya terbentuk dari endapan silika dan kalsium karbonat yang terbawa oleh mata air panas vulkanik.',
 'Keramikan Crater is a stunning geological masterpiece. Its layers are formed from silica and calcium carbonate deposits carried by volcanic hot springs.',
 'Lantai keramik alami ini diyakini oleh tetua adat sebagai puing-puing pelataran istana jin yang hancur saat gempa besar tahun 1933. Retakan-retakannya dipercaya sebagai jalur labirin mistis.',
 'This natural ceramic floor is believed by traditional elders to be the ruins of the courtyard of a jinn palace that was destroyed during the great earthquake of 1933. The cracks are believed to be mystical labyrinth paths.',
 -5.239053909820962, 104.2635823976347);

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read gallery" ON gallery_items FOR SELECT USING (true);
CREATE POLICY "Auth manage gallery" ON gallery_items FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 3. TABEL: safety_rules (Panduan Keselamatan)
-- =====================================================
CREATE TABLE safety_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sort_order INT NOT NULL DEFAULT 0,
  icon_name TEXT NOT NULL DEFAULT 'ShieldAlert',
  title_id TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  desc_id TEXT NOT NULL DEFAULT '',
  desc_en TEXT NOT NULL DEFAULT '',
  image_url TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO safety_rules (sort_order, icon_name, title_id, title_en, desc_id, desc_en) VALUES
(1, 'Wind', 'Wajib Masker Gas', 'Gas Mask Required', 'Beberapa area kawah menghasilkan gas sulfur pekat. Gunakan masker respirator khusus untuk pernapasan.', 'Some crater areas produce concentrated sulfur gas. Use a specialized respirator mask for breathing.'),
(2, 'Footprints', 'Sepatu Trekking Tertutup', 'Closed Trekking Shoes', 'Suhu permukaan tanah (seperti di Keramikan) bisa sangat panas. Dilarang keras memakai sandal.', 'Ground surface temperatures (like in Keramikan) can be extremely hot. Wearing sandals is strictly prohibited.'),
(3, 'Users', 'Didampingi Pemandu', 'Accompanied by a Guide', 'Jalur dan geotermal rawan ambles jika tidak hafal medan. Selalu patuhi arahan pemandu lokal.', 'Ecological and geothermal paths are prone to caving in if you don''t know the terrain. Always follow local guide instructions.'),
(4, 'ShieldAlert', 'Patuhi Zona Aman', 'Obey Safe Zones', 'Jangan pernah melewati batas rambu peringatan zona merah atau mendekati pusat letupan lumpur.', 'Never cross the red zone warning signs or approach the center of mud eruptions.');

ALTER TABLE safety_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read safety" ON safety_rules FOR SELECT USING (true);
CREATE POLICY "Auth manage safety" ON safety_rules FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 4. TABEL: encyclopedia_items (Kisah & Pengetahuan)
-- =====================================================
CREATE TABLE encyclopedia_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sort_order INT NOT NULL DEFAULT 0,
  icon_name TEXT NOT NULL DEFAULT 'BookOpen',
  icon_color TEXT NOT NULL DEFAULT 'red',
  title_id TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  content_id TEXT NOT NULL DEFAULT '',
  content_en TEXT NOT NULL DEFAULT '',
  image_url TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO encyclopedia_items (sort_order, icon_name, icon_color, title_id, title_en, content_id, content_en) VALUES
(1, 'BookOpen', 'red', 'Sejarah Gempa 1933', '1933 Earthquake', 'Lembah Suoh lahir dari tragedi. Pada 25 Juni 1933, gempa tektonik berkekuatan 7.5 SR mengguncang Liwa, membuka celah magma dan menciptakan letusan freatik dahsyat yang melahirkan danau-danau panas ini.', 'Suoh Valley was born from tragedy. On June 25, 1933, a 7.5 SR earthquake struck Liwa, opening a magma vent and triggering massive phreatic eruptions that formed these thermal lakes.'),
(2, 'Flame', 'amber', 'Legenda Ular Naga', 'The Dragon Myth', 'Masyarakat lokal percaya bahwa letupan uap panas dan suara gemuruh dari perut bumi Suoh berasal dari pergerakan Naga raksasa penjaga mata air yang tertidur di bawah tanah.', 'Locals believe the hissing steam and subterranean rumblings of Suoh originate from a giant sleeping dragon that guards the spring.'),
(3, 'Leaf', 'emerald', 'Ekosistem Ekstrem', 'Extreme Ecosystem', 'Meski memiliki tingkat keasaman (pH) dan suhu ekstrem, kawasan ini menjadi rumah bagi anggrek langka dan burung liar endemik Sumatera yang beradaptasi sempurna dengan lingkungan sulfurnya.', 'Despite the extreme acidity (pH) and temperatures, this area is home to rare orchids and wild Sumatran birds that have perfectly adapted to the sulfurous environment.');

ALTER TABLE encyclopedia_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read encyclopedia" ON encyclopedia_items FOR SELECT USING (true);
CREATE POLICY "Auth manage encyclopedia" ON encyclopedia_items FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 5. TABEL: routes (Jalur Menuju Suoh)
-- =====================================================
CREATE TABLE routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sort_order INT NOT NULL DEFAULT 0,
  icon_name TEXT NOT NULL DEFAULT 'Map',
  icon_color TEXT NOT NULL DEFAULT 'emerald',
  title_id TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  desc_id TEXT NOT NULL DEFAULT '',
  desc_en TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO routes (sort_order, icon_name, icon_color, title_id, title_en, desc_id, desc_en) VALUES
(1, 'Map', 'emerald', 'Jalur Liwa (Utara)', 'Liwa Route (North)', 'Via Sekincau - Batu Brak. Jarak ±45 km (1.5 - 2 jam). Jalur ini sudah beraspal cukup mulus namun berkelok tajam melintasi perbukitan kopi.', 'Via Sekincau - Batu Brak. ±45 km (1.5 - 2 hours). The road is smoothly paved but has sharp bends across coffee hills.'),
(2, 'Navigation', 'amber', 'Jalur Tanggamus (Selatan)', 'Tanggamus Route (South)', 'Via Wonosobo - Bandar Negeri Suoh (BNS). Jarak ±80 km (2.5 - 3 jam). Lebih direkomendasikan untuk kendaraan roda dua atau mobil gardan ganda (4x4).', 'Via Wonosobo - Bandar Negeri Suoh. ±80 km (2.5 - 3 hours). Highly recommended to use off-road motorcycles or 4x4 vehicles.');

ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read routes" ON routes FOR SELECT USING (true);
CREATE POLICY "Auth manage routes" ON routes FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 6. TABEL: sensor_readings (Data Sensor Dashboard)
-- =====================================================
CREATE TABLE sensor_readings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  h2s_ppm DOUBLE PRECISION NOT NULL DEFAULT 0,
  ph_level DOUBLE PRECISION NOT NULL DEFAULT 0,
  h2s_status_id TEXT NOT NULL DEFAULT '',
  h2s_status_en TEXT NOT NULL DEFAULT '',
  ph_status_id TEXT NOT NULL DEFAULT '',
  ph_status_en TEXT NOT NULL DEFAULT '',
  recorded_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO sensor_readings (h2s_ppm, ph_level, h2s_status_id, h2s_status_en, ph_status_id, ph_status_en) VALUES
(45, 2.1, 'Waspada: Kawah Nirwana', 'Alert: Nirwana Crater', 'Danau Asam (Tinggi)', 'Acid Lake (High)');

-- Tabel tambahan: data grafik sensor harian
CREATE TABLE sensor_chart_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  time_label TEXT NOT NULL DEFAULT '',
  h2s_value DOUBLE PRECISION NOT NULL DEFAULT 0,
  gempa_value DOUBLE PRECISION NOT NULL DEFAULT 0,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO sensor_chart_data (time_label, h2s_value, gempa_value) VALUES
('00:00', 15, 2),
('04:00', 18, 1),
('08:00', 25, 4),
('12:00', 45, 8),
('16:00', 30, 5),
('20:00', 20, 2),
('24:00', 16, 1);

ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sensor" ON sensor_readings FOR SELECT USING (true);
CREATE POLICY "Auth manage sensor" ON sensor_readings FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE sensor_chart_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read sensor_chart" ON sensor_chart_data FOR SELECT USING (true);
CREATE POLICY "Auth manage sensor_chart" ON sensor_chart_data FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 7. TABEL: testimonials (Ulasan Pengunjung)
-- =====================================================
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  origin TEXT NOT NULL DEFAULT '',
  text TEXT NOT NULL DEFAULT '',
  rating INT NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT DEFAULT NULL,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed 3 ulasan awal (sudah approved)
INSERT INTO testimonials (name, origin, text, rating, avatar_url, approved) VALUES
('Budi Santoso', 'Fotografer Alam', 'Lanskap Keramikan sangat surealis. Seperti memotret di planet lain! Kabut belerangnya memberikan efek sinematik alami yang luar biasa.', 5, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi&backgroundColor=059669', true),
('Sarah Wijaya', 'Peneliti Geologi', 'Aksesnya cukup menantang, tapi terbayar lunas saat melihat Danau Asam. Manifestasi geotermalnya sangat aktif dan menakjubkan.', 5, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=0284c7', true),
('Rio Pratama', 'Travel Vlogger', 'Gila sih Suoh! Wajib bawa drone kalau ke sini. Danau Lebarnya luas banget, dan warga lokalnya sangat ramah menyambut tamu.', 5, 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rio&backgroundColor=ea580c', true);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read approved testimonials" ON testimonials FOR SELECT USING (approved = true);
CREATE POLICY "Public insert testimonials" ON testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth manage testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 8. TABEL: bookings (Pemesanan Tiket)
-- =====================================================
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  visit_date DATE NOT NULL,
  guests INT NOT NULL DEFAULT 1,
  ticket_type TEXT NOT NULL DEFAULT 'day_trip',
  homestay TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth manage bookings" ON bookings FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 9. TABEL: profiles (Profil Admin)
-- =====================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL DEFAULT '',
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Super admin manage profiles" ON profiles FOR ALL USING (auth.role() = 'authenticated');

-- Trigger: auto-create profile saat user sign up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), 
          COALESCE(NEW.raw_user_meta_data->>'role', 'admin'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- 10. STORAGE: Buat bucket untuk media upload
-- =====================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

CREATE POLICY "Public read media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Auth upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Auth update media" ON storage.objects FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Auth delete media" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
