// =====================================================
// TypeScript Types untuk semua tabel Supabase
// =====================================================

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  sort_order: number;
  image_url: string;
  title_id: string;
  title_en: string;
  type_id: string;
  type_en: string;
  desc_id: string;
  desc_en: string;
  history_id: string;
  history_en: string;
  mitos_id: string;
  mitos_en: string;
  lat: number;
  lng: number;
  created_at: string;
}

export interface SafetyRule {
  id: string;
  sort_order: number;
  icon_name: string;
  title_id: string;
  title_en: string;
  desc_id: string;
  desc_en: string;
  image_url: string | null;
  created_at: string;
}

export interface EncyclopediaItem {
  id: string;
  sort_order: number;
  icon_name: string;
  icon_color: string;
  title_id: string;
  title_en: string;
  content_id: string;
  content_en: string;
  image_url: string | null;
  created_at: string;
}

export interface Route {
  id: string;
  sort_order: number;
  icon_name: string;
  icon_color: string;
  title_id: string;
  title_en: string;
  desc_id: string;
  desc_en: string;
  created_at: string;
}

export interface SensorReading {
  id: string;
  h2s_ppm: number;
  ph_level: number;
  h2s_status_id: string;
  h2s_status_en: string;
  ph_status_id: string;
  ph_status_en: string;
  recorded_at: string;
}

export interface SensorChartData {
  id: string;
  time_label: string;
  h2s_value: number;
  gempa_value: number;
  recorded_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  origin: string;
  text: string;
  rating: number;
  avatar_url: string | null;
  approved: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  visit_date: string;
  guests: number;
  ticket_type: string;
  homestay: string;
  status: string;
  notes: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin';
  created_at: string;
}

// Helper: pilih field berdasarkan bahasa
export function localized<T extends Record<string, unknown>>(
  item: T,
  field: string,
  lang: 'ID' | 'EN'
): string {
  const key = `${field}_${lang.toLowerCase()}` as keyof T;
  return (item[key] as string) || '';
}
