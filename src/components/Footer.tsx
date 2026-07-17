import Image from "next/image";
import { MessageCircle, Phone } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/BrandIcons";
import { business, contact, navLinks, services, social } from "@/lib/config";

export default function Footer() {
  const year = new Date().getFullYear();
  const topServices = services.slice(0, 6);

  return (
    <footer className="bg-ink text-ivory pt-20 pb-8 border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/images/monogram.png"
                alt={`${business.fullName} monogram`}
                width={38}
                height={24}
                className="object-contain"
              />
              <span className="font-display text-lg">Tanvi Mayat</span>
            </div>
            <p className="text-ivory/50 text-sm leading-relaxed mb-6">
              {business.description}
            </p>
            <div className="flex items-center gap-3">
              <a
                href={social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Instagram"
                className="w-9 h-9 rounded-full border border-ivory/15 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href={social.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Facebook page"
                className="w-9 h-9 rounded-full border border-ivory/15 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
              >
                <FacebookIcon size={16} />
              </a>
              <a
                href={social.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Message us on WhatsApp"
                className="w-9 h-9 rounded-full border border-ivory/15 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href={social.callNow.url}
                aria-label="Call us now"
                className="w-9 h-9 rounded-full border border-ivory/15 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
              >
                <Phone size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="eyebrow text-gold mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-ivory/60 text-sm hover:text-gold transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-gold mb-5">Services</h4>
            <ul className="space-y-3">
              {topServices.map((s) => (
                <li key={s.id}>
                  <a href="#services" className="text-ivory/60 text-sm hover:text-gold transition-colors">
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-gold mb-5">Contact</h4>
            <ul className="space-y-3 text-ivory/60 text-sm">
              <li>{contact.address.line1}</li>
              <li>{contact.address.line2}</li>
              <li>{contact.address.line3}</li>
              <li className="pt-2">
                <a href={social.callNow.url} className="hover:text-gold transition-colors">
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="hover:text-gold transition-colors">
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="hairline mb-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-ivory/40 text-xs">
          <p>&copy; {year} {business.fullName}. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
