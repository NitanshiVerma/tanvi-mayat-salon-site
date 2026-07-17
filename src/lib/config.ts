// =============================================================================
// SITE CONFIGURATION — Tanvi Mayat Salon & Makeup Studio
// -----------------------------------------------------------------------------
// Every editable piece of business data lives in this single file.
// Update phone numbers, prices, hours, or links here — no need to touch
// any component code elsewhere in the project.
// =============================================================================

export const business = {
  name: "Tanvi Mayat",
  fullName: "Tanvi Mayat Salon & Makeup Studio",
  tagline: "Salon & Makeup Studio",
  established: 2016,
  rating: 4.7,
  reviewCount: 479,
  description:
    "A relaxed, premium salon in Navsari providing haircuts, colouring, bridal hair and makeup, skin care, and nail care — trusted by hundreds of clients since 2016.",
};

export const contact = {
  phoneDisplay: "+91 96383 92624",
  phoneRaw: "919638392624", // used for tel: and wa.me links, no + or spaces
  email: "hello@tanvimayatsalon.com",
  address: {
    line1: "Shop No. 9, Swastik Apartment",
    line2: "Opposite Sub Jail, Bus Station Road, Lunsikui",
    line3: "Navsari, Gujarat 396445",
    full: "Shop No. 9, Swastik Apartment, Opposite Sub Jail, Bus Station Road, Lunsikui, Navsari, Gujarat 396445",
  },
  mapEmbedSrc:
    "https://www.google.com/maps?q=Tanvi+Mayat+Salon+%26+Makeup+Studio,+Lunsikui,+Navsari,+Gujarat+396445&output=embed",
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=Tanvi+Mayat+Salon+%26+Makeup+Studio+Lunsikui+Navsari",
};

export const hours = [
  { day: "Monday", time: "9:30 AM – 8:30 PM" },
  { day: "Tuesday", time: "9:30 AM – 8:30 PM" },
  { day: "Wednesday", time: "9:30 AM – 8:30 PM" },
  { day: "Thursday", time: "9:30 AM – 8:30 PM" },
  { day: "Friday", time: "9:30 AM – 8:30 PM" },
  { day: "Saturday", time: "9:30 AM – 8:30 PM" },
  { day: "Sunday", time: "9:30 AM – 8:30 PM" },
];

export const social = {
  whatsapp: {
    url: `https://wa.me/919638392624?text=${encodeURIComponent(
      "Hello! I would like to book an appointment."
    )}`,
    label: "WhatsApp",
  },
  instagram: {
    url: "https://www.instagram.com/tanvi_mayat_salon/?hl=en",
    label: "Instagram",
  },
  facebook: {
    // Placeholder — replace with the real Facebook page URL when available.
    url: "https://www.facebook.com/",
    label: "Facebook",
  },
  callNow: {
    url: "tel:+919638392624",
    label: "Call Now",
  },
};

export type Service = {
  id: string;
  name: string;
  category: "Hair" | "Makeup" | "Skin" | "Nails" | "Hair Removal";
  description: string;
  startingPrice: number; // INR, editable
  popular?: boolean;
};

// Prices are starting prices in INR — easy to update as needed.
export const services: Service[] = [
  {
    id: "haircut",
    name: "Hair Cut",
    category: "Hair",
    description: "A precision cut tailored to your face shape and style, finished with a wash and blow-dry.",
    startingPrice: 300,
  },
  {
    id: "hair-styling",
    name: "Hair Styling",
    category: "Hair",
    description: "Expert blow-dry, curls, or sleek finishes for everyday elegance or special occasions.",
    startingPrice: 400,
  },
  {
    id: "hair-coloring",
    name: "Hair Colouring",
    category: "Hair",
    description: "Global colour, balayage, or root touch-ups using premium, low-ammonia formulas.",
    startingPrice: 1200,
    popular: true,
  },
  {
    id: "hair-spa",
    name: "Hair Spa",
    category: "Hair",
    description: "A deeply nourishing ritual that restores shine, softness, and strength to tired hair.",
    startingPrice: 800,
  },
  {
    id: "keratin",
    name: "Keratin Treatment",
    category: "Hair",
    description: "Smoothens frizz and adds long-lasting shine while protecting hair's natural structure.",
    startingPrice: 2500,
  },
  {
    id: "smoothening",
    name: "Hair Smoothening",
    category: "Hair",
    description: "Tames frizz and flyaways for a sleek, manageable finish that lasts for months.",
    startingPrice: 2800,
  },
  {
    id: "rebonding",
    name: "Hair Rebonding",
    category: "Hair",
    description: "Transforms curly or wavy hair into permanently straight, silky strands.",
    startingPrice: 3000,
  },
  {
    id: "bridal-makeup",
    name: "Bridal Makeup",
    category: "Makeup",
    description: "A full bridal package with HD makeup, trial session, and draping — flawless from morning to mandap.",
    startingPrice: 8000,
    popular: true,
  },
  {
    id: "party-makeup",
    name: "Party Makeup",
    category: "Makeup",
    description: "Glamorous, photo-ready makeup for engagements, sangeet nights, and celebrations.",
    startingPrice: 1500,
  },
  {
    id: "facial",
    name: "Facial",
    category: "Skin",
    description: "Customised facials — herbal, brightening, or anti-ageing — for healthy, radiant skin.",
    startingPrice: 600,
  },
  {
    id: "cleanup",
    name: "Cleanup",
    category: "Skin",
    description: "A quick refresh that deep-cleans, exfoliates, and revives dull, tired skin.",
    startingPrice: 400,
  },
  {
    id: "waxing",
    name: "Waxing",
    category: "Hair Removal",
    description: "Smooth, gentle hair removal using premium wax, suited to even sensitive skin.",
    startingPrice: 300,
  },
  {
    id: "threading",
    name: "Threading",
    category: "Hair Removal",
    description: "Precise, clean shaping for brows and face using the traditional threading technique.",
    startingPrice: 50,
  },
  {
    id: "manicure",
    name: "Manicure",
    category: "Nails",
    description: "Soak, shape, buff, and polish for soft, well-groomed hands.",
    startingPrice: 350,
  },
  {
    id: "pedicure",
    name: "Pedicure",
    category: "Nails",
    description: "A relaxing foot treatment that leaves feet soft, smooth, and polished.",
    startingPrice: 450,
  },
  {
    id: "nail-art",
    name: "Nail Art",
    category: "Nails",
    description: "Creative, custom nail designs to match your mood, outfit, or occasion.",
    startingPrice: 500,
  },
];

export type WhyChooseItem = {
  title: string;
  description: string;
};

export const whyChooseUs: WhyChooseItem[] = [
  {
    title: "Certified Professionals",
    description: "A trained team with years of hands-on experience across hair, skin, and makeup.",
  },
  {
    title: "Premium Products",
    description: "We use trusted, high-quality brands that are gentle on hair and skin.",
  },
  {
    title: "Hygienic Environment",
    description: "Sanitised tools and a clean, air-conditioned studio for every visit.",
  },
  {
    title: "Affordable Pricing",
    description: "Honest, transparent pricing without compromising on quality.",
  },
  {
    title: "Personalised Care",
    description: "Every service is tailored to you — your skin, your hair, your occasion.",
  },
  {
    title: "Customer Satisfaction",
    description: "Rated 4.7★ from 479+ reviews — our clients keep coming back.",
  },
];

export type Testimonial = {
  name: string;
  rating: number;
  review: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Priya Desai",
    rating: 5,
    review:
      "Got my bridal makeup done here and it lasted the entire wedding day without a single touch-up. The team understood exactly what I wanted.",
  },
  {
    name: "Khushi Patel",
    rating: 5,
    review:
      "My go-to salon for hair colour for two years now. Always professional, always hygienic, and the results never disappoint.",
  },
  {
    name: "Riya Shah",
    rating: 5,
    review:
      "The hair spa treatment here is unmatched. My hair feels softer than it has in years. Booking through WhatsApp made it so easy too.",
  },
  {
    name: "Anjali Mehta",
    rating: 5,
    review:
      "Lovely, calm environment and genuinely skilled staff. The keratin treatment completely transformed my frizzy hair.",
  },
  {
    name: "Sneha Joshi",
    rating: 5,
    review:
      "Booked a party makeup session last minute and they fit me in. Stunning work, and incredibly sweet staff throughout.",
  },
];

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "#reviews" },
  { label: "Book Now", href: "#booking" },
  { label: "Contact", href: "#contact" },
];

export const seo = {
  title: "Tanvi Mayat Salon & Makeup Studio | Luxury Beauty Salon in Navsari",
  description:
    "Tanvi Mayat Salon & Makeup Studio in Lunsikui, Navsari — premium hair, skin, bridal makeup, and nail care since 2016. Rated 4.7★ from 479+ reviews. Book your appointment today.",
  siteUrl: "https://www.tanvimayatsalon.com",
};
