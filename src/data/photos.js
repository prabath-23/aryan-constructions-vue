// Aryan's own site photos, selected and edited by tools/process_client_photos.py
// (framing and tone only, all metadata stripped). Self-hosted as WebP. To add a
// photo: add it to that script, run it, then give it alt text here.
const files = import.meta.glob('../assets/photos/*.webp', { eager: true, import: 'default' })

const index = {}
for (const [path, url] of Object.entries(files)) {
  const [, key, width] = path.match(/([^/]+)-(\d+)\.webp$/)
  ;(index[key] ||= []).push({ w: Number(width), url })
}
Object.values(index).forEach((list) => list.sort((a, b) => a.w - b.w))

const alts = {
  about: 'Glass staircase with a gold-finish rail above a double-height living room and kitchen',
  why: 'Corner house with wood cladding and vertical fins against a blue sky',
  founder: 'Er. Manikandan M., Founder and Managing Director of Aryan Constructions & Interiors',
  'service-construction': 'Upper floors of a white corner house with a curved balcony',
  'service-interiors': 'Double-height marble feature wall with a ring chandelier',
  'service-renovation': 'Floating staircase with step lights beside a carved wooden unit',

  'nedungundram-cover': 'House front with geometric cladding and a jali screen against the sky',
  'nedungundram-1': 'House front with geometric cladding and a jali screen',
  'nedungundram-2': 'Double-height living area seen from a glass staircase',
  'nedungundram-3': 'White modular kitchen with an island counter',
  'nedungundram-4': 'Double-height marble feature wall with a ring chandelier',
  'nedungundram-5': 'Floating staircase with glass and gold-finish railing',
  'nedungundram-6': 'Bedroom with a backlit circular mirror unit',
  'nedungundram-7': 'Carved wooden pooja room doors',
  'nedungundram-8': 'Carved wooden main door with a sunburst pattern',

  'mapedu-1': 'White corner house with curved balconies, seen from below',
  'mapedu-2': 'Staircase with timber rail and jali windows',
  'mapedu-3': 'Open living room and kitchen with a staircase behind',
  'mapedu-4': 'Living room with polished grey floor',
  'mapedu-5': 'Covered terrace sit-out with a round skylight',
  'mapedu-6': 'Stairwell seen from the top floor',

  'selvi-1': 'Green modular kitchen framed by a wooden partition',
  'selvi-2': 'Living room with a wooden false ceiling and staircase',
  'selvi-3': 'Wooden unit with carved panels beside the staircase',
  'selvi-4': 'Floating glass staircase beside the kitchen',
  'selvi-5': 'Window seat set into a wardrobe wall',
  'selvi-6': 'Bathroom with black and white marble walls',
  'selvi-7': 'Balcony with a stone-clad wall',

  'mudichur-1': 'Two-floor house with a glass balcony and a jali screen, seen from the corner',
  'mudichur-2': 'The same house from the front, with its wood-finish gate',

  'thalambur-1': 'Living room with a chandelier and a kitchen behind a wooden frame',
  'thalambur-2': 'Glass-front modular kitchen with a white counter',
  'thalambur-3': 'Kitchen seen through a wooden partition',
  'thalambur-4': 'Wardrobe wall built around a window seat',
  'thalambur-5': 'Bedroom wardrobe with arched blue panels',
  'thalambur-6': 'Bathroom with grey stone walls',
  'thalambur-7': 'Galley kitchen with full-height glass cabinets',

  'selaiyur-1': 'Corner house with wood cladding and vertical fins',
  'selaiyur-2': 'The same house lit up at night',

  'jabamani-1': 'Two-floor house lit up with coloured lights at night',
  'jabamani-2': 'Floating timber staircase in the living room',
  'jabamani-3': 'Kitchen with a patterned tile backsplash',
  'jabamani-4': 'Carved wooden main door',
  'jabamani-5': 'Stairwell with a red jali wall and skylight',
  'jabamani-6': 'Living room with a polished marble-look floor',

  'porur-1': '3D design view of a three-floor white building with wood accents',
  'porur-2': '3D design view of the same building from the front',
  'porur-3': '3D design view of the second front design, with stone cladding',
}

export function photo(key) {
  const list = index[key]
  const main = list.find((f) => f.w >= 1200) || list[list.length - 1]
  return {
    src: main.url,
    srcset: list.map((f) => `${f.url} ${f.w}w`).join(', '),
    alt: alts[key] || '',
  }
}
