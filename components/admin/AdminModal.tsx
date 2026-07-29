"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, CheckCircle2, XCircle, Info, X } from "lucide-react";

export interface ModalState {
  isOpen: boolean;
  type?: "danger" | "warning" | "success" | "info";
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  isConfirmOnly?: boolean;
}

export default function AdminModal({
  isOpen,
  type = "danger",
  title,
  description,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  onConfirm,
  onCancel,
  isConfirmOnly = false,
}: ModalState) {
  if (!isOpen) return null;

  const iconMap = {
    danger: <Trash2 className="text-rose-400" size={28} />,
    warning: <AlertTriangle className="text-amber-400" size={28} />,
    success: <CheckCircle2 className="text-emerald-400" size={28} />,
    info: <Info className="text-sky-400" size={28} />,
  };

  const bgIconMap = {
    danger: "bg-rose-500/10 border-rose-500/20",
    warning: "bg-amber-500/10 border-amber-500/20",
    success: "bg-emerald-500/10 border-emerald-500/20",
    info: "bg-sky-500/10 border-sky-500/20",
  };

  const btnConfirmMap = {
    danger: "bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-rose-950/50",
    warning: "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold shadow-amber-950/50",
    success: "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-emerald-950/50",
    info: "bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white shadow-sky-950/50",
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel || onConfirm}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-white z-10 overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className={`absolute -top-16 -left-16 w-32 h-32 rounded-full blur-2xl pointer-events-none ${
            type === "danger" ? "bg-rose-500/20" : type === "warning" ? "bg-amber-500/20" : type === "success" ? "bg-emerald-500/20" : "bg-sky-500/20"
          }`} />

          {/* Close button */}
          <button
            onClick={onCancel || onConfirm}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col items-center text-center">
            {/* Header Icon */}
            <div className={`p-4 rounded-2xl border mb-4 ${bgIconMap[type]}`}>
              {iconMap[type]}
            </div>

            {/* Title & Description */}
            <h3 className="text-xl font-black text-white mb-2 tracking-wide">{title}</h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              {description}
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-3 w-full">
              {!isConfirmOnly && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700"
                >
                  {cancelText}
                </button>
              )}
              <button
                type="button"
                onClick={onConfirm}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm shadow-lg transition-all cursor-pointer ${btnConfirmMap[type]}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
