"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Gem, Sparkles, BadgeIndianRupee, HeartHandshake, Star } from "lucide-react";
import { whyChooseUs } from "@/lib/config";

const icons = [ShieldCheck, Gem, Sparkles, BadgeIndianRupee, HeartHandshake, Star];

export default function WhyChooseUs() {
  return (
    <section className="relative bg-blush/30 py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <p className="eyebrow text-gold mb-4">Why Choose Us</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] text-ink">
            The Tanvi Mayat difference
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUs.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-ivory/80 rounded-sm p-8 border border-gold/15 hover:border-gold/40 transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-5">
                  <Icon className="text-gold" size={20} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-lg text-ink mb-2">{item.title}</h3>
                <p className="text-taupe text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
