"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { business } from "@/lib/config";

const points = [
  {
    title: "Our Story",
    text: `Founded in ${business.established}, Tanvi Mayat Salon & Makeup Studio began with a simple belief: that great beauty care should feel personal, not transactional.`,
  },
  {
    title: `${new Date().getFullYear() - business.established}+ Years of Craft`,
    text: "Nearly a decade of refining technique, staying current with trends, and building lasting relationships with our clients.",
  },
  {
    title: "Skilled, Caring Hands",
    text: "Our professionals are trained across hair, skin, and bridal artistry — and genuinely invested in how you feel when you leave.",
  },
  {
    title: "A Clean, Calm Studio",
    text: "An air-conditioned, meticulously sanitised space designed for you to unwind, not just get a service done.",
  },
];

export default function About() {
  return (
    <section id="about" className="relative bg-ivory py-24 sm:py-32 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute -left-16 top-10 select-none pointer-events-none"
      >
        <span className="monogram-watermark text-[18rem] font-semibold">tm</span>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 grid lg:grid-cols-12 gap-14 lg:gap-10 items-center">
        {/* Image column */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 relative"
        >
          <div className="relative aspect-[3/4] max-w-sm mx-auto lg:mx-0 img-zoom rounded-sm">
            <Image
              src="/images/salon-interior.jpg"
              alt="Interior of Tanvi Mayat Salon & Makeup Studio showing the styling area"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 90vw, 420px"
            />
            <div className="absolute inset-0 ring-1 ring-gold/30" />
          </div>
          {/* Gold corner accent frame, offset behind the photo */}
          <div className="hidden sm:block absolute -bottom-6 -right-6 w-32 h-32 border border-gold/40 -z-10" />
          <div className="absolute -top-5 -left-5 sm:-left-8 bg-ink text-ivory px-6 py-5 max-w-[160px]">
            <p className="font-display text-3xl text-gold">{business.rating}★</p>
            <p className="text-xs text-ivory/70 mt-1 leading-snug">
              from {business.reviewCount}+ client reviews
            </p>
          </div>
        </motion.div>

        {/* Text column */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7"
        >
          <p className="eyebrow text-gold mb-4">About Us</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] text-ink mb-6">
            Where craft meets care
          </h2>
          <p className="text-taupe text-lg leading-relaxed max-w-2xl mb-10">
            {business.description}
          </p>

          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
            {points.map((point, i) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="hairline w-10 mb-3" />
                <h3 className="font-display text-lg text-ink mb-2">{point.title}</h3>
                <p className="text-taupe text-sm leading-relaxed">{point.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
