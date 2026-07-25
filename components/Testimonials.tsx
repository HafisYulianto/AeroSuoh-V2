"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote, Star, Send, CheckCircle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabase";

const fallbackReviews = [
  {
    name: "Budi Santoso",
    role: "Fotografer Alam",
    text: "Lanskap Keramikan sangat surealis. Seperti memotret di planet lain! Kabut belerangnya memberikan efek sinematik alami yang luar biasa.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi&backgroundColor=059669",
    rating: 5
  },
  {
    name: "Sarah Wijaya",
    role: "Peneliti Geologi",
    text: "Aksesnya cukup menantang, tapi terbayar lunas saat melihat Danau Asam. Manifestasi geotermalnya sangat aktif dan menakjubkan.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=0284c7",
    rating: 5
  },
  {
    name: "Rio Pratama",
    role: "Travel Vlogger",
    text: "Gila sih Suoh! Wajib bawa drone kalau ke sini. Danau Lebarnya luas banget, dan warga lokalnya sangat ramah menyambut tamu.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rio&backgroundColor=ea580c",
    rating: 5
  },
];

export default function Testimonials() {
  const { t, lang } = useLanguage();
  const [reviews, setReviews] = useState<any[]>([]);

  // Form states
  const [name, setName] = useState("");
  const [origin, setOrigin] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("approved", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        const mapped = data.map(item => ({
          name: item.name,
          role: item.origin,
          text: item.text,
          avatar: item.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.name}&backgroundColor=059669`,
          rating: item.rating
        }));
        setReviews(mapped);
      } else {
        setReviews(fallbackReviews);
      }
    } catch (err) {
      console.error("Gagal memuat ulasan:", err);
      setReviews(fallbackReviews);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !origin.trim() || !text.trim()) return;

    setSubmitStatus("loading");
    try {
      const randomSeed = Math.floor(Math.random() * 1000);
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}_${randomSeed}&backgroundColor=059669`;
      
      const { error } = await supabase
        .from("testimonials")
        .insert([
          {
            name,
            origin,
            text,
            rating,
            avatar_url: avatarUrl,
            approved: false
          }
        ]);
      if (error) throw error;

      setSubmitStatus("success");
      setName("");
      setOrigin("");
      setText("");
      setRating(5);
      
      // Auto clear success message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (err) {
      console.error("Gagal mengirim ulasan:", err);
      setSubmitStatus("error");
    }
  };

  return (
    <section className="py-24 px-4 bg-slate-50 relative overflow-hidden print:hidden" id="testimonials">
      {/* Decorative bg */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-50/50 to-transparent -z-10"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-800 text-sm font-bold tracking-widest uppercase rounded-full mb-4 shadow-sm"
          >
            {t("testi_badge" as any)}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight"
          >
            {t("testi_title" as any)}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            {t("testi_desc" as any)}
          </motion.p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 relative group hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="absolute -top-5 -right-5 opacity-5 text-emerald-600 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500">
                <Quote size={120} />
              </div>
              
              <div>
                <div className="flex gap-1 text-amber-400 mb-6">
                  {Array.from({ length: review.rating || 5 }).map((_, star) => (
                    <Star key={star} size={18} fill="currentColor" />
                  ))}
                </div>
                
                <p className="text-slate-700 leading-relaxed mb-8 relative z-10 italic">
                  "{review.text}"
                </p>
              </div>
              
              <div className="flex items-center gap-4 mt-auto">
                <img 
                  src={review.avatar} 
                  alt={review.name} 
                  className="w-12 h-12 rounded-full border-2 border-emerald-100 shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-slate-900">{review.name}</h4>
                  <p className="text-xs text-emerald-600 font-medium">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Submit Review Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl p-8 relative overflow-hidden"
        >
          <h3 className="text-2xl font-bold text-slate-800 mb-2 text-center">
            {lang === "ID" ? "Tulis Ulasan Anda" : "Leave Your Review"}
          </h3>
          <p className="text-sm text-slate-500 mb-6 text-center">
            {lang === "ID" 
              ? "Ulasan Anda membantu kami meningkatkan kualitas layanan wisata Suoh."
              : "Your review helps us improve the Suoh tourism experience."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  {lang === "ID" ? "Nama Lengkap" : "Full Name"}
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Budi"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  {lang === "ID" ? "Pekerjaan / Asal" : "Origin / Role"}
                </label>
                <input 
                  type="text" 
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  required
                  placeholder="e.g. Jakarta"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-amber-400 focus:outline-none hover:scale-110 transition-transform"
                  >
                    <Star size={24} fill={star <= rating ? "currentColor" : "none"} stroke="currentColor" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                {lang === "ID" ? "Isi Ulasan" : "Review Content"}
              </label>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                rows={4}
                placeholder={lang === "ID" ? "Tulis pengalaman seru kamu di Suoh..." : "Write your amazing experience in Suoh..."}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitStatus === "loading"}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:bg-emerald-400"
            >
              {submitStatus === "loading" ? (
                <span>{lang === "ID" ? "Mengirim..." : "Submitting..."}</span>
              ) : (
                <>
                  <Send size={16} />
                  <span>{lang === "ID" ? "Kirim Ulasan" : "Submit Review"}</span>
                </>
              )}
            </button>

            {submitStatus === "success" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2"
              >
                <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                <span>
                  {lang === "ID" 
                    ? "Ulasan berhasil dikirim! Ulasan akan tampil setelah disetujui admin." 
                    : "Review submitted successfully! It will appear once approved by admin."}
                </span>
              </motion.div>
            )}

            {submitStatus === "error" && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-lg">
                {lang === "ID" ? "Gagal mengirim ulasan. Coba lagi nanti." : "Failed to submit review. Try again later."}
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
