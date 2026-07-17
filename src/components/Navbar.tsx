"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks, social, business } from "@/lib/config";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-surface shadow-[0_1px_0_rgba(201,161,76,0.25)]" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-3 group" aria-label={`${business.fullName} — Home`}>
          <Image
            src="/images/monogram.png"
            alt={`${business.fullName} monogram`}
            width={42}
            height={26}
            className="object-contain"
            priority
          />
          <span
            className={`font-display text-lg sm:text-xl tracking-wide transition-colors duration-500 ${
              scrolled ? "text-ink" : "text-ivory"
            }`}
          >
            Tanvi Mayat
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-9">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`eyebrow transition-colors duration-300 relative after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full hover:text-gold ${
                scrolled ? "text-ink/70" : "text-ivory/80"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:block">
          <a
            href={social.whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-ripple inline-flex items-center rounded-full px-6 py-2.5 text-sm font-medium tracking-wide transition-colors duration-300 ${
              scrolled
                ? "bg-ink text-ivory hover:bg-gold hover:text-ink"
                : "bg-gold text-ink hover:bg-gold-soft"
            }`}
          >
            Book Appointment
          </a>
        </div>

        <button
          className={`lg:hidden p-2 transition-colors duration-300 ${scrolled ? "text-ink" : "text-ivory"}`}
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
        >
          <Menu size={26} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-md lg:hidden"
          >
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full px-8 pt-8"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="font-display text-xl text-ivory">Tanvi Mayat</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="p-2 text-ivory"
                >
                  <X size={26} />
                </button>
              </div>
              <div className="flex flex-col gap-7">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-3xl text-ivory hover:text-gold transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <a
                href={social.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-10 inline-flex items-center justify-center rounded-full bg-gold text-ink px-6 py-3.5 text-sm font-medium tracking-wide"
              >
                Book Appointment
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
