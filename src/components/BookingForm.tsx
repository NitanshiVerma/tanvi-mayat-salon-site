"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import { services, social } from "@/lib/config";

export default function BookingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

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
      serviceId: String(data.get("serviceId") || ""),
      preferredDate: String(data.get("preferredDate") || ""),
      preferredTime: String(data.get("preferredTime") || ""),
      notes: String(data.get("notes") || ""),
    };

    try {
      const res = await fetch("/api/bookings", {
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
    <section id="booking" className="relative bg-ink py-24 sm:py-32">
      <div className="max-w-3xl mx-auto px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="eyebrow text-gold mb-4">Book an appointment</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] text-ivory mb-4">
            Reserve your slot
          </h2>
          <p className="text-ivory/60 leading-relaxed">
            Tell us what you're after and your preferred time — we'll confirm
            by phone or WhatsApp shortly after.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="bg-ivory/[0.04] border border-ivory/10 rounded-sm p-8 sm:p-10"
        >
          {submitted ? (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <div className="w-14 h-14 rounded-full bg-gold/15 flex items-center justify-center mb-5">
                <CalendarCheck className="text-gold" size={22} />
              </div>
              <h3 className="font-display text-2xl text-ivory mb-2">Booking request received</h3>
              <p className="text-ivory/60 text-sm max-w-sm">
                We'll confirm your slot shortly. For a faster confirmation,
                message us directly on WhatsApp.
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
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="b-name" className="block text-ivory/70 text-xs eyebrow mb-2">
                    Name
                  </label>
                  <input
                    id="b-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    className="w-full bg-ivory/5 border border-ivory/15 rounded-sm px-4 py-3 text-ivory text-sm placeholder:text-ivory/30 focus:border-gold focus:outline-none transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="b-phone" className="block text-ivory/70 text-xs eyebrow mb-2">
                    Phone
                  </label>
                  <input
                    id="b-phone"
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
                <label htmlFor="b-email" className="block text-ivory/70 text-xs eyebrow mb-2">
                  Email (optional)
                </label>
                <input
                  id="b-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="w-full bg-ivory/5 border border-ivory/15 rounded-sm px-4 py-3 text-ivory text-sm placeholder:text-ivory/30 focus:border-gold focus:outline-none transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="b-service" className="block text-ivory/70 text-xs eyebrow mb-2">
                  Service
                </label>
                <select
                  id="b-service"
                  name="serviceId"
                  required
                  defaultValue=""
                  className="w-full bg-ivory/5 border border-ivory/15 rounded-sm px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none transition-colors"
                >
                  <option value="" disabled className="text-ink">
                    Select a service
                  </option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id} className="text-ink">
                      {s.name} — from ₹{s.startingPrice}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="b-date" className="block text-ivory/70 text-xs eyebrow mb-2">
                    Preferred date
                  </label>
                  <input
                    id="b-date"
                    name="preferredDate"
                    type="date"
                    required
                    min={today}
                    className="w-full bg-ivory/5 border border-ivory/15 rounded-sm px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none transition-colors [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label htmlFor="b-time" className="block text-ivory/70 text-xs eyebrow mb-2">
                    Preferred time
                  </label>
                  <input
                    id="b-time"
                    name="preferredTime"
                    type="time"
                    required
                    className="w-full bg-ivory/5 border border-ivory/15 rounded-sm px-4 py-3 text-ivory text-sm focus:border-gold focus:outline-none transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="b-notes" className="block text-ivory/70 text-xs eyebrow mb-2">
                  Notes (optional)
                </label>
                <textarea
                  id="b-notes"
                  name="notes"
                  rows={3}
                  className="w-full bg-ivory/5 border border-ivory/15 rounded-sm px-4 py-3 text-ivory text-sm placeholder:text-ivory/30 focus:border-gold focus:outline-none transition-colors resize-none"
                  placeholder="Anything specific we should know?"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn-ripple w-full inline-flex items-center justify-center gap-2 rounded-full bg-gold text-ink px-6 py-4 text-sm font-medium tracking-wide hover:bg-gold-soft transition-colors duration-300 disabled:opacity-60"
              >
                {sending ? "Requesting..." : "Request Booking"}
              </button>

              {error && <p className="text-sm text-red-400 text-center -mt-2">{error}</p>}
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
