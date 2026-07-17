"use client";

import { motion } from "framer-motion";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { social, business } from "@/lib/config";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const monogramY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden bg-ink"
    >
      {/* Ambient gradient backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 75% 20%, rgba(201,161,76,0.18), transparent 60%), radial-gradient(ellipse 60% 50% at 15% 85%, rgba(240,217,212,0.10), transparent 60%), linear-gradient(160deg, #0b0908 0%, #161210 55%, #0b0908 100%)",
        }}
      />

      {/* Oversized monogram watermark — signature element, parallaxed on scroll */}
      <motion.div
        style={{ y: monogramY }}
        aria-hidden="true"
        className="absolute -right-[8%] top-1/2 -translate-y-1/2 select-none pointer-events-none"
      >
        <span className="monogram-watermark text-[40vw] sm:text-[32vw] lg:text-[26vw] font-semibold">
          tm
        </span>
      </motion.div>

      {/* Fine hairline frame, echoing salon signage */}
      <div className="absolute inset-5 sm:inset-8 border border-gold/20 pointer-events-none rounded-[2px]" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full pt-28 pb-20"
      >
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="eyebrow text-gold-soft mb-6"
        >
          Est. {business.established} · Navsari
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-ivory leading-[1.05] text-[clamp(2.5rem,7vw,5.5rem)] max-w-4xl"
        >
          Experience Luxury
          <br />
          <span className="text-gold italic">Beauty</span> &amp; Wellness
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-7 max-w-xl text-ivory/70 text-base sm:text-lg leading-relaxed"
        >
          A refined studio for hair, skin, and bridal artistry — where every
          visit is unhurried, every detail considered, and every client
          leaves feeling like the best version of themselves.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href={social.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ripple inline-flex items-center justify-center rounded-full bg-gold text-ink px-8 py-4 text-sm font-medium tracking-wide hover:bg-gold-soft transition-colors duration-300"
          >
            Book Appointment
          </a>
          <a
            href="#contact"
            className="btn-ripple inline-flex items-center justify-center rounded-full border border-ivory/30 text-ivory px-8 py-4 text-sm font-medium tracking-wide hover:border-gold hover:text-gold transition-colors duration-300"
          >
            Contact Us
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 flex items-center gap-3 text-ivory/60 text-sm"
        >
          <span className="text-gold tracking-wide">★★★★★</span>
          <span>{business.rating} rating from {business.reviewCount}+ happy clients</span>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ivory/40"
      >
        <span className="eyebrow text-[0.6rem]">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="block w-px h-8 bg-gradient-to-b from-gold to-transparent"
        />
      </motion.div>
    </section>
  );
}
