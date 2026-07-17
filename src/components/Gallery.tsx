"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";

type GalleryItem = {
  id: string;
  type: "photo" | "placeholder";
  alt: string;
  span: string; // tailwind row-span classes for masonry feel
  src?: string;
};

const galleryItems: GalleryItem[] = [
  { id: "bridal-glam", type: "photo", alt: "Bridal hairstyle with jewelled headpiece", span: "row-span-2", src: "/images/gallery-1.webp" },
  { id: "salon-floor", type: "photo", alt: "Stylist at the wash station", span: "row-span-1", src: "/images/gallery-2.webp" },
  { id: "bridal-makeup", type: "photo", alt: "Bridal makeup and jewellery styling", span: "row-span-1", src: "/images/gallery-3.webp" },
  { id: "front-desk", type: "photo", alt: "Team member at the Tanvi Mayat front desk", span: "row-span-2", src: "/images/gallery-4.webp" },
  { id: "interior-1", type: "photo", alt: "Styling area at Tanvi Mayat Salon", span: "row-span-1", src: "/images/salon-interior.jpg" },
  { id: "gown-look", type: "photo", alt: "Bridal gown and hairstyling look", span: "row-span-1", src: "/images/gallery-5.webp" },
];

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i - 1 + galleryItems.length) % galleryItems.length)),
    []
  );
  const next = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % galleryItems.length)),
    []
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, close, prev, next]);

  return (
    <section id="gallery" className="relative bg-ivory py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <p className="eyebrow text-gold mb-4">Gallery</p>
          <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.1] text-ink mb-5">
            A glimpse inside the studio
          </h2>
          <p className="text-taupe leading-relaxed">
            Real transformations from the Tanvi Mayat chair — bridal glam,
            styling sessions and everyday artistry.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 auto-rows-[140px] sm:auto-rows-[180px] gap-3 sm:gap-4">
          {galleryItems.map((item, i) => (
            <motion.button
              key={item.id}
              onClick={() => setLightboxIndex(i)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.07 }}
              className={`relative ${item.span} img-zoom rounded-sm overflow-hidden group text-left focus-visible:ring-2 focus-visible:ring-gold`}
              aria-label={`View ${item.alt}`}
            >
              {item.type === "photo" ? (
                <Image
                  src={item.src!}
                  alt={item.alt}
                  fill
                  className="object-cover zoom-target"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blush via-ivory to-gold/10 zoom-target">
                  <Camera className="text-gold/50 mb-2" size={26} strokeWidth={1.5} />
                  <span className="eyebrow text-[0.6rem] text-taupe text-center px-3">
                    Photo coming soon
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors duration-300" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-ink/95 flex items-center justify-center px-6"
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
          >
            <button
              onClick={close}
              aria-label="Close image viewer"
              className="absolute top-6 right-6 text-ivory/70 hover:text-gold p-2"
            >
              <X size={28} />
            </button>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-4 sm:left-8 text-ivory/70 hover:text-gold p-2"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-4 sm:right-8 text-ivory/70 hover:text-gold p-2"
            >
              <ChevronRight size={32} />
            </button>

            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl aspect-[4/5] rounded-sm overflow-hidden"
            >
              {galleryItems[lightboxIndex].type === "photo" ? (
                <Image
                  src={galleryItems[lightboxIndex].src!}
                  alt={galleryItems[lightboxIndex].alt}
                  fill
                  className="object-contain"
                  sizes="90vw"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blush via-ivory to-gold/10">
                  <Camera className="text-gold/50 mb-3" size={40} strokeWidth={1.5} />
                  <span className="eyebrow text-taupe">Photo coming soon</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
