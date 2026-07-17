"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors, Sparkles, Droplet, Hand, Wand2 } from "lucide-react";
import { services, type Service } from "@/lib/config";

const categories: { label: Service["category"] | "All"; icon: typeof Scissors }[] = [
  { label: "All", icon: Sparkles },
  { label: "Hair", icon: Scissors },
  { label: "Makeup", icon: Wand2 },
  { label: "Skin", icon: Droplet },
  { label: "Nails", icon: Hand },
  { label: "Hair Removal", icon: Sparkles },
];

const categoryIcon: Record<Service["category"], typeof Scissors> = {
  Hair: Scissors,
  Makeup: Wand2,
  Skin: Droplet,
  Nails: Hand,
  "Hair Removal": Sparkles,
};

export default function Services() {
  const [active, setActive] = useState<Service["category"] | "All">("All");

  const filtered = useMemo(
    () => (active === "All" ? services : services.filter((s) => s.category === active)),
    [active]
  );

  return (
    <section id="services" className="relative bg-ink py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <p className="eyebrow text-gold mb-4">Our Services</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] text-ivory mb-5">
            Crafted for every occasion
          </h2>
          <p className="text-ivory/60 leading-relaxed">
            From everyday grooming to bridal transformations — each service
            is delivered with precision, premium products, and genuine care.
          </p>
        </motion.div>

        {/* Category filter pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {categories.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setActive(label)}
              aria-pressed={active === label}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm tracking-wide transition-all duration-300 border ${
                active === label
                  ? "bg-gold text-ink border-gold"
                  : "border-ivory/20 text-ivory/70 hover:border-gold hover:text-gold"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Service cards */}
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((service, i) => {
              const Icon = categoryIcon[service.category];
              return (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  whileHover={{ y: -6 }}
                  className="group relative bg-ivory/[0.04] border border-ivory/10 rounded-sm p-7 hover:border-gold/40 hover:bg-ivory/[0.06] transition-colors duration-300"
                >
                  {service.popular && (
                    <span className="absolute top-5 right-5 eyebrow text-[0.6rem] text-gold">
                      Popular
                    </span>
                  )}
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors duration-300">
                    <Icon className="text-gold" size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-xl text-ivory mb-2">{service.name}</h3>
                  <p className="text-ivory/55 text-sm leading-relaxed mb-6 min-h-[3.5rem]">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-ivory/10">
                    <span className="text-gold-soft font-display text-lg">
                      ₹{service.startingPrice.toLocaleString("en-IN")}
                      <span className="text-ivory/40 text-xs font-body ml-1">onwards</span>
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
