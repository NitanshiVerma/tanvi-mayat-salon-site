"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Phone, Plus, X } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/BrandIcons";
import { social } from "@/lib/config";

const buttons = [
  { ...social.whatsapp, icon: MessageCircle, color: "#25D366" },
  { ...social.instagram, icon: InstagramIcon, color: "#E1306C" },
  { ...social.facebook, icon: FacebookIcon, color: "#1877F2" },
  { ...social.callNow, icon: Phone, color: "#0B0908" },
];

export default function FloatingButtons() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open &&
          buttons.map((btn, i) => {
            const Icon = btn.icon;
            return (
              <motion.a
                key={btn.label}
                href={btn.url}
                target={btn.label === "Call Now" ? undefined : "_blank"}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.8 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                aria-label={btn.label}
                className="group flex items-center gap-3"
              >
                <span className="bg-ink text-ivory text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:inline-block">
                  {btn.label}
                </span>
                <span
                  style={{ backgroundColor: btn.color }}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-200"
                >
                  <Icon size={20} />
                </span>
              </motion.a>
            );
          })}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close contact options" : "Open contact options"}
        aria-expanded={open}
        className="w-14 h-14 rounded-full bg-gold text-ink shadow-xl flex items-center justify-center hover:bg-gold-soft transition-colors duration-300"
      >
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25 }}>
          {open ? <X size={24} /> : <Plus size={24} />}
        </motion.span>
      </button>
    </div>
  );
}
