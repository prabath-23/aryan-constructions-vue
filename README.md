# Aryan Constructions — Vue 3 site

Vue 3 + Vite rebuild of the marketing site. Component-based, content driven by
`src/data/content.js` so copy/services/projects/testimonials can be swapped
for a CMS or API later without touching templates.

## Develop

```bash
npm install
npm run dev
```

## Build for deployment (Hostinger or any static host)

```bash
npm run build
```

This produces a `dist/` folder — upload **the contents of `dist/`** (not the
project source) to your host's public/www root. `npm run preview` serves that
build locally if you want to sanity-check it first.

> Note: unlike a plain HTML/CSS/JS static site, this is a Vue single-page app,
> so it needs this build step before every deploy — there's no "just upload
> the files" version. If you'd rather skip Node/npm entirely on your host,
> the build step still runs on your machine (or in CI); only the compiled
> `dist/` output needs to reach Hostinger.

## Deploy to GitHub Pages

`main` holds the source. The `gh-pages` branch holds only the built site. The
build uses relative paths (`base: './'` in `vite.config.js`), so it works on a
project URL, a custom domain or Hostinger. To publish a new version:

```bash
npm run build
cd dist
touch .nojekyll
git init -b gh-pages
git add -A
git commit -m "Deploy"
git push -f https://github.com/prabath-23/aryan-constructions-vue.git gh-pages
rm -rf .git
```

## Logo and loading screen

`src/assets/logo-mark.svg` (and the favicon copy in `public/`) is traced from the
client's artwork: five brush strokes and four window panes, each its own shape.

The loading screen is inlined in `index.html` so it paints before any JS or CSS
arrives, and `src/motion/loader.js` lifts it once the app is ready, about 1.35s
in. It draws the strokes in, then lights the window. It shows on the first visit
in a tab only and is skipped for reduced motion. **To replay it, add `?intro` to
the URL.**

## Review mode

Unconfirmed passages are not marked with `[PLACEHOLDER]` tags
printed inline through the prose — that wrecked the design. Instead every
unwritten passage is wrapped in `<span class="ph">`, and a **Review mode**
toggle in the footer highlights them all at once in gold for a client pass.
It's off by default (so the site presents as finished work) and the preference
is remembered per browser.

Contact details are real now (from the Google listing). The one figure still
unconfirmed is "5+ years", flagged in review mode.

**Copy style.** Aryan Constructions & Interiors is a young Chennai firm (about
five years old), so the copy is short and plain: no inflated claims, Indian
conventions, and only things the photos, Google reviews or the company's own
site board back up. Visible text uses no em or en dashes; use a comma, colon,
full stop or "to" instead.

## Design system

**Concept:** the site reads like an active construction document set — a
drawing sheet, not a lifestyle brochure. This was a deliberate pivot away
from the "premium dark editorial agency" template look (warm serif italics,
gold-on-black, `01 —— Label` eyebrows) that a lot of sites in this space have
converged on. Concretely:

- **Sheet-code title blocks** instead of decorative eyebrows — `.index-rule`
  renders a bordered code (`A-101`, `A-201`, `G-001`) rather than a plain
  number. The codes follow real AIA drawing-set numbering (A-1xx plans,
  A-2xx elevations, A-3xx sections, A-4xx details), so Portfolio is
  genuinely tagged as an elevations sheet, Process as a sections sheet, etc.
  — not arbitrary, in case a construction-literate visitor notices.
- **The logo's colours, and only those.** Sampled from the artwork: bronze
  `--gold-start #BF7B25`, gold `--gold-end #CEA437` (also `--gold` and `--mark`),
  window `--gold-deep #B8892E`. `--gold-grad` matches the logo's gradient, which
  reaches full gold just past halfway.
- **Crop/registration marks** (`.crop` utility) on full-bleed panels like the
  hero — corner brackets like a printer's crop mark or a surveyor's
  benchmark.

**Type:** a single family, Libre Franklin — a revival of Morris Fuller
Benton's Franklin Gothic, the American workhorse grotesque of signage,
newspapers and site hoardings. One family at a few weights (400 body,
500–600 headings/labels, 700 wordmark) reads like a real firm's printed
material rather than the display-grotesque + monospace pairing that most
generated sites default to. Labels and buttons are small caps-style
uppercase with open tracking (0.12–0.16em). Emphasis inside headlines
(`<em>` in `.display`/`.section-title`) is Franklin italic at regular weight
in the pale annotation gold. Swap the family in one place: the `--font-*`
tokens at the top of `src/style.css` plus the Google Fonts link in
`index.html`.

Four levels of warm black, hairline rules instead of boxes, a film-grain
overlay at 3.5% opacity (flat black reads cheap on large screens).

Reusable primitives: `.index-rule` (the sheet-code marker), `.display`,
`.section-title`, `.lede`, `.body-copy`, `.label`, `.btn`, `.link`, `.glyph`
(the logo's 2×2 window, reused as a bullet), `.crop` (corner registration
marks).

## Motion

### Signature moments
- **Hero — the drawing builds itself.** `HeroBuilding.vue` is a north
  elevation that draws on load, stroke by stroke (grid → structure → floors →
  dimensions → crane), then the windows flicker on. Pure CSS
  (`stroke-dashoffset` on `pathLength="1"` paths), so it starts at first
  paint with no JS chunk to wait for. Its layers shift at different depths
  with the pointer, and it sinks back as you scroll away.
- **Process — pinned build sequence.** The section pins for ~3.4 screens while
  one scrubbed GSAP timeline surveys the site, sets out the envelope, draws the
  design, stacks the floors with a working crane, then turns the lights on and
  slams a HANDED OVER stamp. It runs backwards when you scroll up; the stage
  pills jump to each stage.
- **CAD cursor** (`CustomCursor.vue`): crosshair with live X/Y coordinates, a
  trailing ring that tightens over links and opens into a labelled disc over
  anything with `data-cursor="Label"`. Fine pointers only; the native I-beam
  stays in form fields.

### Supporting effects
Smooth scroll (Lenis) · split-word headline reveals (`v-split`) · sheet codes
and labels that decode from random characters (`v-scramble`) · odometer stats
· a capabilities marquee that speeds up, skews and reverses with scroll
velocity · image wipe-reveals with a gold "plotter" line and inner parallax
(`v-parallax`) · blueprint scan sweep on portfolio hover · magnetic buttons
(`v-magnetic`) · hand-drawn circles around the Why numbers · auto-advancing
testimonials that assemble word by word · a RECEIVED stamp on form submit · a
footer wordmark that rises letter by letter · a fixed drafting grid drifting
behind the page · a CAD status bar (current sheet, scale, % through the set).

### How it's wired
- `src/motion/index.js` — the registry. Components call
  `registerMotion(setup)` in `onMounted`; `App.vue` calls `runMotion()`, which
  lazy-loads GSAP, ScrollTrigger and Lenis (separate chunks, off the critical
  path) and runs every setup **in DOM order** so pinned sections measure
  correctly. Call `refreshMotion()` after anything changes page height above a
  pinned section (the portfolio filter already does).
- `src/motion/ticker.js` — one shared rAF loop (scroll position + velocity)
  for the cursor, parallax, marquee and grid.
- **Every animated element's default CSS is its finished state.** If
  JavaScript fails or the visitor prefers reduced motion, the page is complete
  — the build sequence shows the finished, handed-over building; nothing is
  left invisible. Reduced motion also skips Lenis and zeroes animation delays.
- Overlays (mobile menu, lightbox) must call `lockScroll()` — Lenis scrolls
  programmatically, so `overflow: hidden` on `<body>` alone won't stop it.

### Gotchas found while building this
- **Don't use `:global(.x) .y` in scoped styles.** Vue collapses it to just
  `.x`, discarding everything after — that silently applied the process
  section's pinned-layout rules (padding, `position: absolute`, even
  `display: none`) to `<html>`. Write `.x .y`: Vue only scopes the last
  compound selector, so `.motion-on .pin` compiles to exactly what you want.
- **`scroll-behavior: smooth` must be off while Lenis runs**, not just during
  its animations (Lenis 1.3 only adds `.lenis-smooth` mid-animation).
  Otherwise programmatic scrolls — ScrollTrigger's own measurements included —
  get browser-animated on top of Lenis.
- **Never put `clip-path` on an element an IntersectionObserver watches** — it
  zeroes the intersection ratio and the element never reveals. Frames use
  frame (observed) → `.rv` (clipped) → `img`.

Older directives: `v-reveal` (fade + rise), `v-reveal.stagger`,
`v-reveal.clip`, and `v-tilt` (pointer tilt on image frames). The header nav
has a single indicator that slides between links as the active section
changes.

One gotcha worth knowing if you extend `v-reveal`: don't combine it with a
*reactive* `:class` binding on the same element (e.g. a v-for index used for
conditional sizing). Vue reassigns `className` wholesale whenever that
binding's value could have changed, which wipes the `is-visible` class the
directive adds outside Vue's own bookkeeping — this is exactly what the
portfolio filter used to trigger. The directive now has an `updated` hook
that restores it via a `data-revealed` marker, so this class of bug is
already handled — but it's why that hook exists, in case you're debugging
something that looks similar elsewhere.

## Artwork

Photography is **Aryan's own site photos**, sent by Mani on WhatsApp. About 40
of the 185 were selected and edited by `tools/process_client_photos.py`:
framing and tone only, nothing in a building is painted out. To change the
selection, edit the list in that script, run it against the WhatsApp export
folder, then add alt text in `src/data/photos.js` and list the photo on its
project in `src/data/content.js`.

- All metadata is stripped. The iPhone originals carry GPS, which on a house
  photo is a client's home address. Never publish the originals.
- Porur is 3D renders, not a finished building. The card, filter and gallery
  all say so. Keep it that way.
- Photos with housewarming boards are cropped to remove family names.
- Reviews are short excerpts of real Google reviews. One review on the listing
  is about a different company ("Arani Construction", Vancouver): do not use it.

## Project structure

- `src/data/content.js` — all site copy, stats, services, projects,
  testimonials, process steps, contact details. Edit this file to update
  content without touching any component.
- `src/components/` — one component per section.
- `src/motion/` — motion registry, shared ticker, shared IntersectionObserver
  helper, environment flags, lazy GSAP loader.
- `src/composables/` — `useLightbox` (shared modal state), `useScrollSpy`
  (header active-link + progress), `useReviewMode`.
- `src/directives/` — `v-reveal`, `v-split`, `v-scramble`, `v-parallax`,
  `v-magnetic`, `v-tilt`.
- `src/assets/` — placeholder SVG imagery and the logo mark. Swap these for
  real photography/logo files (same filenames, or update the references in
  `content.js` / components).

## Still needs real client input

Search the codebase for `[PLACEHOLDER]` and `// TODO` — every instance marks
copy, numbers, contact details, or the contact form's backend wiring that
needs real content before launch.
