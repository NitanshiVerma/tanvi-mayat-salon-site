"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { contact, hours, social } from "@/lib/config";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSending(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      message: String(data.get("message") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok) {
        setError(result?.error || "Something went wrong. Please try WhatsApp instead.");
        setSending(false);
        return;
      }

      setSending(false);
      setSubmitted(true);
    } catch {
      setError("Could not reach the server. Please try WhatsApp instead.");
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative bg-ivory py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p className="eyebrow text-gold mb-4">Contact</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] text-ink">
            Visit or reach out
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Info column */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 space-y-7"
          >
            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                <MapPin className="text-gold" size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-display text-base text-ink mb-1">Address</h3>
                <p className="text-taupe text-sm leading-relaxed">
                  {contact.address.line1}
                  <br />
                  {contact.address.line2}
                  <br />
                  {contact.address.line3}
                </p>
                <a
                  href={contact.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold text-sm hover:underline mt-1 inline-block"
                >
                  Get directions →
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                <Phone className="text-gold" size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-display text-base text-ink mb-1">Phone</h3>
                <a href={social.callNow.url} className="text-taupe text-sm hover:text-gold transition-colors">
                  {contact.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                <Mail className="text-gold" size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-display text-base text-ink mb-1">Email</h3>
                <a href={`mailto:${contact.email}`} className="text-taupe text-sm hover:text-gold transition-colors">
                  {contact.email}
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                <Clock className="text-gold" size={18} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-base text-ink mb-2">Business Hours</h3>
                <ul className="text-taupe text-sm space-y-1">
                  {hours.map((h) => (
                    <li key={h.day} className="flex justify-between gap-4 max-w-xs">
                      <span>{h.day}</span>
                      <span className="text-ink/70">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-sm overflow-hidden border border-gold/20 h-56 mt-4">
              <iframe
                title="Map to Tanvi Mayat Salon & Makeup Studio"
                src={contact.mapEmbedSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          {/* Form column */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 bg-ink rounded-sm p-8 sm:p-10"
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-14 h-14 rounded-full bg-gold/15 flex items-center justify-center mb-5">
                  <Send className="text-gold" size={22} />
                </div>
                <h3 className="font-display text-2xl text-ivory mb-2">Message sent</h3>
                <p className="text-ivory/60 text-sm max-w-sm">
                  Thank you for reaching out — our team will get back to you
                  shortly. For a faster response, message us directly on WhatsApp.
                </p>
                <a
                  href={social.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center rounded-full bg-gold text-ink px-6 py-3 text-sm font-medium"
                >
                  Message on WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-display text-2xl text-ivory mb-1">Send us a message</h3>
                <p className="text-ivory/50 text-sm mb-6">
                  We typically reply within a few hours.
                </p>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-ivory/70 text-xs eyebrow mb-2">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      className="w-full bg-ivory/5 border border-ivory/15 rounded-sm px-4 py-3 text-ivory text-sm placeholder:text-ivory/30 focus:border-gold focus:outline-none transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-ivory/70 text-xs eyebrow mb-2">
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      className="w-full bg-ivory/5 border border-ivory/15 rounded-sm px-4 py-3 text-ivory text-sm placeholder:text-ivory/30 focus:border-gold focus:outline-none transition-colors"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-ivory/70 text-xs eyebrow mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="w-full bg-ivory/5 border border-ivory/15 rounded-sm px-4 py-3 text-ivory text-sm placeholder:text-ivory/30 focus:border-gold focus:outline-none transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-ivory/70 text-xs eyebrow mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full bg-ivory/5 border border-ivory/15 rounded-sm px-4 py-3 text-ivory text-sm placeholder:text-ivory/30 focus:border-gold focus:outline-none transition-colors resize-none"
                    placeholder="Tell us what you're looking for..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-ripple w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold text-ink px-6 py-4 text-sm font-medium tracking-wide hover:bg-gold-soft transition-colors duration-300 disabled:opacity-60"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>

                {error && (
                  <p className="text-sm text-red-400 text-center -mt-2">{error}</p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
