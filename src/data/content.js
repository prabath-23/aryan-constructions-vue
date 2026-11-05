// Centralized site content. Structured as plain data so it's a straight swap
// for a CMS or API response later — components just consume these shapes.

export const siteInfo = {
  name: 'Aryan Constructions & Interiors',
  phone: '+91 93444 15551',
  phoneHref: 'tel:+919344415551',
  whatsappHref: 'https://wa.me/919344415551',
  email: 'contact@aryanconstructions.co.in',
  emailHref: 'mailto:contact@aryanconstructions.co.in',
  address: 'Seethakati Complex, GST Road, Vandalur, Chennai, Tamil Nadu 600048',
  hours: 'From 9 am. Please call before visiting.',
  instagramHref: 'https://www.instagram.com/aryan__constructions',
  // Google Maps listing: also where the reviews live
  mapsHref: 'https://www.google.com/maps/place/ARYAN+CONSTRUCTIONS+%26+INTERIORS/data=!4m2!3m1!1s0x0:0x698e20a243992367',
  mapEmbed: 'https://www.google.com/maps?q=12.8784466,80.080191&z=16&output=embed',
}

// Metadata strip along the bottom of the hero.
export const heroStrip = [
  { label: 'We do', value: 'Construction · Interiors' },
  { label: 'Office', value: 'Vandalur, Chennai' },
  { label: 'Call', value: '+91 93444 15551' },
]

// Rating and review count are from the Google listing: update when they change.
export const trustStats = [
  { value: '5', suffix: '+', label: 'Years Building', note: '[PLACEHOLDER: confirm founding year]' },
  { value: '5.0', suffix: '', label: 'Google Rating', note: '' },
  { value: '13', suffix: '', label: 'Google Reviews', note: '' },
  { value: '8', suffix: '', label: 'Sites Shown Here', note: '' },
]

export const services = [
  {
    id: 'construction',
    title: 'Construction',
    image: 'service-construction',
    description: 'Independent houses and villas from plan to handover, plus commercial buildings. Design changes along the way are fine.',
    capabilities: ['Independent houses', 'Villas', 'Renovations & upgrades', 'Commercial buildings'],
  },
  {
    id: 'interiors',
    title: 'Interiors',
    image: 'service-interiors',
    description: 'The same team can finish the inside too, so you are not chasing a second contractor.',
    capabilities: ['Modular kitchens', 'Wardrobes & storage', 'False ceilings & feature walls', 'Pooja rooms & carved doors'],
  },
]

// Site names and client names are as Mani gave them. `cover` overrides the
// card image when the first gallery photo doesn't suit the card's shape.
export const projects = [
  {
    id: 'nedungundram',
    title: 'Nedungundram Site',
    client: 'Mrs. Venkata Lakshmi',
    category: 'home',
    cover: 'nedungundram-cover',
    images: ['nedungundram-1', 'nedungundram-2', 'nedungundram-3', 'nedungundram-4', 'nedungundram-5', 'nedungundram-6', 'nedungundram-7', 'nedungundram-8'],
    description: 'A double-height living room with a marble feature wall, a floating staircase with gold-finish railing, a full kitchen and carved wooden doors.',
  },
  {
    id: 'mapedu',
    title: 'Mapedu Site',
    client: 'Mr. Prabhu',
    category: 'home',
    images: ['mapedu-1', 'mapedu-2', 'mapedu-3', 'mapedu-4', 'mapedu-5', 'mapedu-6'],
    description: 'A corner house with curved balconies, a staircase lit through jali windows and a covered sit-out on the terrace.',
  },
  {
    id: 'vandalur-selvi',
    title: 'Vandalur Site',
    client: 'Mrs. Selvi',
    category: 'interiors',
    images: ['selvi-1', 'selvi-2', 'selvi-3', 'selvi-4', 'selvi-5', 'selvi-6', 'selvi-7'],
    description: 'A green modular kitchen, wooden partition units, a floating glass staircase and marble bathrooms.',
  },
  {
    id: 'mudichur',
    title: 'Mudichur Site',
    client: 'Mr. Ramesh',
    category: 'home',
    images: ['mudichur-1', 'mudichur-2'],
    description: 'A clean two-floor house front with a glass balcony, a screen panel and a wood-finish gate.',
  },
  {
    id: 'thalambur',
    title: 'Thalambur Site',
    client: 'Mr. Pondhuran',
    category: 'interiors',
    images: ['thalambur-1', 'thalambur-2', 'thalambur-3', 'thalambur-4', 'thalambur-5', 'thalambur-6', 'thalambur-7'],
    description: 'A glass-front kitchen, wardrobes built around window seats and marble-look floors throughout.',
  },
  {
    id: 'selaiyur',
    title: 'Selaiyur Site',
    client: 'Mr. Joel',
    category: 'home',
    images: ['selaiyur-1', 'selaiyur-2'],
    description: 'A corner house with wood cladding, vertical fins and a glass balcony.',
  },
  {
    id: 'vandalur-jabamani',
    title: 'Vandalur Site',
    client: 'Mr. Jabamani',
    category: 'home',
    images: ['jabamani-1', 'jabamani-2', 'jabamani-3', 'jabamani-4', 'jabamani-5', 'jabamani-6'],
    description: 'A two-floor house with a floating timber staircase, a carved main door and a jali wall in the stairwell.',
  },
  {
    id: 'porur',
    title: 'Porur Site',
    client: 'Mr. Sathish',
    category: 'design',
    images: ['porur-1', 'porur-2', 'porur-3'],
    description: 'A three-floor building with two front designs to choose from. These are 3D design views, not photos.',
  },
]

export const processSteps = [
  { index: '01', title: 'Enquiry', description: 'Call, WhatsApp or fill in the form. Tell us about your plot and what you want to build.' },
  { index: '02', title: 'Site Visit', description: 'We visit the site with you to understand what you want and what we need to work around.' },
  { index: '03', title: 'Design & Quote', description: "An itemised quote, so you know exactly what you're paying for." },
  { index: '04', title: 'Build', description: 'Regular updates and one contact for the whole build.' },
  { index: '05', title: 'Handover', description: 'We walk through the finished job with you, fix anything left, and hand over the paperwork.' },
]

// Each of these is something clients actually mention in the Google reviews.
export const whyPoints = [
  { title: 'Interiors under one roof', description: 'Construction and interiors from the same team.' },
  { title: 'Open to changes', description: 'Plans change during a build. We work with that.' },
  { title: 'On time', description: 'We give you a realistic schedule and keep to it.' },
  { title: 'Clear communication', description: 'You know where things stand at every stage.' },
]

// Short excerpts from real Google reviews (full text on the listing, linked
// from the section). Replace freely, but only ever with real reviews.
export const testimonials = [
  { quote: 'Mr. Manikandan has been very supportive all through the construction of our Independent Villa.', author: 'Krishna Balan, Google review' },
  { quote: 'A trust worth builder who helped to update and make my Home beautiful.', author: 'vicky R, Google review' },
  { quote: 'We are very happy with the final outcome.', author: 'Jaya Suriya, Google review' },
]

// Drawing-sheet index for the status bar — codes match each section's
// title block (AIA numbering: A-1xx plans, A-2xx elevations, A-3xx sections…).
export const sheets = [
  { id: 'hero', code: 'A-000', title: 'Cover Sheet' },
  { id: 'about', code: 'A-001', title: 'Who We Are' },
  { id: 'services', code: 'A-101', title: 'What We Build' },
  { id: 'portfolio', code: 'A-201', title: 'Selected Work' },
  { id: 'process', code: 'A-301', title: 'Build Sequence' },
  { id: 'why', code: 'A-401', title: 'Details' },
  { id: 'testimonials', code: 'A-501', title: 'Client Feedback' },
  { id: 'contact', code: 'G-001', title: 'Start Your Project' },
]

export const marqueeItems = ['Independent Houses', 'Villas', 'Modular Kitchens', 'Wardrobes', 'False Ceilings', 'Staircases', 'Pooja Rooms', 'Carved Doors']

export const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#process', label: 'Process' },
  { href: '#why', label: 'Why Us' },
  { href: '#contact', label: 'Contact' },
]
