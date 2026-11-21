// Centralized site content. Structured as plain data so it's a straight swap
// for a CMS or API response later: components just consume these shapes.
// Copy comes from the client's own content document (Nov 2026).

export const siteInfo = {
  name: 'Aryan Constructions & Interiors',
  founded: '2019',
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

// Key facts under the hero buttons. Icons are names in LineIcon.vue.
export const heroStats = [
  { icon: 'calendar', text: 'Est. 2019' },
  { icon: 'layers', text: '60+ Projects' },
  { icon: 'helmet', text: '12+ Years Experience' },
  { icon: 'pin', text: 'Serving Tamil Nadu' },
]

// Metadata strip along the bottom of the hero.
export const heroStrip = [
  { label: 'We do', value: 'Construction · Interiors' },
  { label: 'Office', value: 'Vandalur, Chennai' },
  { label: 'Call', value: '+91 93444 15551' },
]

// "Who we are", straight after the hero.
export const intro = {
  paragraphs: [
    'Established in 2019, Aryan Constructions & Interiors is a Chennai-based construction, architecture and interior design company headquartered in Vandalur, Chennai, Tamil Nadu.',
    'We specialise in thoughtfully designed residential and commercial spaces, through a combination of quality-driven construction, architectural creativity and technical expertise.',
    "From architectural planning and house construction to interior design, renovation and turnkey solutions, we tailor every project to our clients' requirements, lifestyle and budget.",
    'With our roots in Chennai and projects across Tamil Nadu, we are committed to functional, refined and lasting spaces through transparent communication, professional execution and attention to detail.',
  ],
  tagline: 'From Chennai to every corner of Tamil Nadu, we build spaces that inspire.',
}

export const story = {
  paragraphs: [
    'Established in 2019, Aryan Constructions & Interiors is led by Er. Manikandan M., Founder and Managing Director and a CMDA-registered construction engineer.',
    'Based in Vandalur, Chennai, we bring together architectural creativity, engineering knowledge and construction expertise to deliver thoughtfully planned residential and commercial spaces.',
    'Under his leadership, Aryan is driven by professional standards, quality workmanship, client-focused planning and responsible project execution.',
  ],
  facts: [
    { icon: 'calendar', value: 'Est.', label: '2019' },
    { icon: 'layers', value: '60+', label: 'Projects' },
    { icon: 'pin', value: 'Chennai', label: 'Tamil Nadu' },
  ],
  vision: 'To become a trusted name in the construction industry by creating high-quality, sustainable and thoughtfully designed spaces that stand the test of time.',
  mission: 'To deliver quality construction and design solutions at the right cost by combining modern architectural concepts, practical engineering and efficient project execution while maintaining transparency and customer satisfaction.',
}

export const founder = {
  name: 'Er. Manikandan M.',
  // A photo key from photos.js (null shows his initials instead). This is a
  // casual photo for now: swap in a proper portrait when there is one.
  photo: 'founder',
  initials: 'MM',
  signature: 'Manikandan M.',
  role: 'Founder & Managing Director',
  credentials: ['B.E. Civil Engineering', 'CMDA-Registered Construction Engineer', '12+ Years Experience'],
  bio: [
    'A Civil Engineering graduate from B.S. Abdur Rahman University, Chennai and a CMDA-registered engineer, he brings 12+ years of professional experience in the construction and engineering industry.',
    'He leads the company with a focus on quality-driven execution, functional design, technical standards and transparent client relationships, guiding Aryan in creating thoughtfully designed spaces across Tamil Nadu.',
  ],
}

export const team = {
  paragraphs: [
    'At Aryan Constructions & Interiors, we believe successful projects are built through teamwork, technical expertise and effective coordination.',
    'Our multidisciplinary team brings together construction professionals, site engineers, architects and administrative staff, working together to turn ideas into completed spaces.',
  ],
  structure: [
    { icon: 'worker', title: 'Professional Construction Team', text: 'Skilled construction professionals focused on quality workmanship and systematic project execution.' },
    { icon: 'clipboard', title: 'Site Engineering Team', text: 'Site engineers who oversee construction progress, technical coordination, supervision and quality.' },
    { icon: 'compass', title: 'In-house Architecture Team', text: 'Architects who handle planning, creative design, space optimisation, drawings and design development.' },
    { icon: 'users', title: 'Office Administration', text: 'Supports daily operations, client coordination and project documentation.' },
    { icon: 'calculator', title: 'Accounts & Finance', text: 'Manages financial coordination, project accounts and administrative records.' },
  ],
}

// `summary` is shown on the card; `description` (the full text from the
// client's document) opens beneath it.
export const services = [
  {
    id: 'turnkey',
    title: 'Turnkey Construction',
    image: 'selaiyur-1',
    summary: 'End-to-end construction, from planning and material procurement to execution and final handover.',
    description: 'We manage every stage, from architectural planning and material procurement to construction, finishing and final handover, with quality workmanship, transparent cost planning and seamless project coordination.',
  },
  {
    id: 'construction',
    title: 'Residential, Commercial & Industrial Construction',
    image: 'service-construction',
    summary: 'Quality construction for homes, villas, offices, factories, schools and institutional buildings.',
    description: 'Individual houses, luxury villas, apartments, offices, retail showrooms, shopping complexes, factories, warehouses, industrial sheds, schools, preschools and other public and private facilities, built for structural strength, quality materials, efficient execution and long-term durability.',
  },
  {
    id: 'architecture',
    title: 'Architectural Design & Planning',
    image: 'porur-1',
    summary: 'Thoughtful architectural designs, functional space planning, 2D drawings and 3D elevations.',
    description: 'Our in-house architecture team designs residential, commercial, industrial and institutional projects: space planning, architectural drawings, 3D elevation designs and customised building layouts that combine modern design with practical engineering.',
  },
  {
    id: 'interiors',
    title: 'Interior Design & Execution',
    image: 'service-interiors',
    summary: 'Customised interior solutions for residential, commercial and institutional spaces.',
    description: 'Functional, refined interiors for homes, offices, commercial establishments and educational spaces: space planning, modular kitchens, wardrobes, custom furniture, false ceilings, lighting design and complete interior execution.',
  },
  {
    id: 'renovation',
    title: 'Renovation & Remodelling',
    image: 'selvi-2',
    summary: 'Modern upgrades, structural improvements and interior renovations for existing buildings.',
    description: 'We transform existing residential, commercial and institutional spaces through renovation, remodelling, structural modifications where feasible, interior upgrades and modern design improvements that add function, looks and property value.',
  },
  {
    id: 'consultation',
    title: 'Consultation & Project Management',
    image: 'mapedu-5',
    summary: 'Construction consultation, cost estimation, site supervision and coordinated project execution.',
    description: 'Professional construction consultation, project planning, cost estimation, site supervision, quality monitoring and execution coordination, from initial planning to final handover.',
  },
]

export const portfolioIntro = {
  paragraph: "With over 60 completed projects since 2019, our work covers architectural design, residential construction, interiors, renovation and turnkey execution. Every project brings its own requirements, so we start by understanding each client's vision. Here are a few recent sites.",
  facts: ['60+ Projects', 'Since 2019', 'Across Tamil Nadu'],
}

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

// The client's core values, shown as "Why choose Aryan?"
export const coreValues = [
  { icon: 'award', title: 'Quality', description: 'Delivering durable, high-quality construction at the right cost.' },
  { icon: 'shield', title: 'Trust', description: 'Building lasting relationships through transparency and honest communication.' },
  { icon: 'bulb', title: 'Innovation', description: 'Combining modern architecture with practical engineering solutions.' },
  { icon: 'smile', title: 'Customer Satisfaction', description: 'Understanding client needs and exceeding expectations.' },
  { icon: 'clock', title: 'Commitment', description: 'Maintaining quality workmanship and timely project delivery.' },
]

// Real Google reviews, quoted word for word from the listing (13 reviews,
// 5.0). Only ever replace with real reviews. Do not use the review about
// "Arani Construction" (Vancouver): it is about a different company.
export const reviewSummary = { rating: '5.0', count: 13 }
export const featuredQuote = {
  quote: 'The house has come out exactly as we expected.',
  author: 'Jaya Suriya',
}
export const testimonials = [
  {
    author: 'Krishna Balan',
    meta: 'Local Guide · Independent villa',
    quote: 'Mr. Manikandan has been very supportive all through the construction of our Independent Villa. We made many changes in the design during the development and he proactively supported without any hesitation. The interior design is also done by them with good quality.',
  },
  {
    author: 'Jaya Suriya',
    meta: 'Google review · New house',
    quote: 'They maintained clear communication at every stage and made the entire process smooth and stress-free for us. We are very happy with the final outcome.',
  },
  {
    author: 'vicky R',
    meta: 'Google review · Home upgrade',
    quote: 'A trust worth builder who helped to update and make my Home beautiful.',
  },
]

export const marqueeItems = ['Turnkey Construction', 'Independent Houses', 'Villas', 'Apartments', 'Commercial Buildings', 'Industrial Sheds', 'Interiors', 'Modular Kitchens', 'Renovation', '3D Elevations']

export const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#team', label: 'Team' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#services', label: 'Services' },
  { href: '#why', label: 'Why Us' },
  { href: '#testimonials', label: 'Reviews' },
  { href: '#contact', label: 'Contact' },
]
