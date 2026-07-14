"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function GeothermalParticles() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Kita kurangi jumlahnya jadi 30, tapi ukurannya kita buat RAKSASA. 
    // Jauh lebih ringan di GPU (anti-kedip) tapi tetap terlihat tebal.
    const count = 30;
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + "%", 
      size: Math.random() * 200 + 150, // Ukuran SANGAT BESAR (150px - 350px)
      duration: Math.random() * 15 + 15, // Lambat & sinematik (15s - 30s)
      
      // === RAHASIA 2: DELAY NEGATIF! ===
      // Ini bikin uap langsung ada di tengah layar saat web pertama kali dibuka.
      delay: -(Math.random() * 30), 
      
      driftX: Math.random() * 200 - 100, // Jarak geser kiri/kanan
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bottom-[-20%] rounded-full"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            // === RAHASIA 1: RADIAL GRADIENT ===
            // Menggantikan blur-3xl. Bagian tengah putih opacity 40%, makin ke pinggir makin hilang (0%).
            // Super ringan, dijamin 100% anti-kedip/anti-lag!
            background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%)",
            willChange: "transform, opacity" // Kode khusus agar pergerakan dirender langsung oleh GPU
          }}
          animate={{
            y: ["0vh", "-120vh"], 
            opacity: [0, 0.8, 0], // Tebal di tengah jalan
            scale: [1, 2, 3], // Makin ke atas makin besar
            // === RAHASIA 3: LOOPING MULUS ===
            // Gerak dari 0 -> ke titik X -> balik lagi ke 0. Jadi pas ngulang ga ada patahan.
            x: [0, p.driftX, 0], 
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}