"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={`fixed bottom-28 right-6 z-40 transition-all duration-500 print:hidden ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}>
      <button
        onClick={scrollToTop}
        aria-label="Kembali ke atas"
        className="p-3 bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-900/30 hover:bg-emerald-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-900/40 transition-all border border-emerald-400 group"
      >
        <ArrowUp size={24} className="group-hover:animate-bounce" />
      </button>
    </div>
  );
}
