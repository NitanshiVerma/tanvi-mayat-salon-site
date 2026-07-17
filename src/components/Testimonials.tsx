"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials } from "@/lib/config";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Testimonials() {
  return (
    <section id="reviews" className="relative bg-ink py-24 sm:py-32 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute right-0 -top-10 select-none pointer-events-none"
      >
        <span className="monogram-watermark text-[16rem] font-semibold">tm</span>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <p className="eyebrow text-gold mb-4">Reviews</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] text-ivory">
            Loved by our clients
          </h2>
        </motion.div>
      </div>

      <div className="scroll-rail flex gap-6 overflow-x-auto px-6 sm:px-10 pb-6 snap-x snap-mandatory">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="snap-start shrink-0 w-[300px] sm:w-[340px] bg-ivory/[0.05] border border-ivory/10 rounded-sm p-7 flex flex-col"
          >
            <Quote className="text-gold/50 mb-4" size={28} strokeWidth={1.5} />
            <p className="text-ivory/75 text-sm leading-relaxed flex-1 mb-6">
              &ldquo;{t.review}&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-ivory/10">
              <div className="w-10 h-10 rounded-full bg-gold/15 text-gold flex items-center justify-center font-display text-sm">
                {initials(t.name)}
              </div>
              <div>
                <p className="text-ivory text-sm font-medium">{t.name}</p>
                <p className="text-gold text-xs tracking-wide" aria-label={`${t.rating} out of 5 stars`}>
                  {"★".repeat(t.rating)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
