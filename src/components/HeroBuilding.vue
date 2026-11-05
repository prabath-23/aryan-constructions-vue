<script setup>
// A north elevation that draws itself on load: construction grid → ground →
// structure → floors and mullions → dimensions and level datums → crane →
// the lights come on, window by window. Every stroke is a <path> with
// pathLength="1" animated via stroke-dashoffset in CSS (paths, because
// pathLength on basic shapes is patchy in Safari). Pure CSS timing, so it
// starts the moment the page paints — no JS chunk to wait for.
//
// Layers carry a --depth used by the hero's pointer parallax.

const G = 540 // ground line
const T = { x1: 180, x2: 380, top: 150, floors: 8, bays: 4 }
const W = { x1: 380, x2: 520, top: 330, floors: 4, bays: 3 }
const tFloor = (G - T.top) / T.floors
const wFloor = (G - W.top) / W.floors
const tBay = (T.x2 - T.x1) / T.bays
const wBay = (W.x2 - W.x1) / W.bays

const p = (d, delay, dur, cls = 'main') => ({ d, delay, dur, cls })

const grid = []
for (let i = 0; i <= 9; i++) {
  grid.push(p(`M${60 + i * 60} 40 V600`, 0.05 + i * 0.03, 0.9, 'grid'))
  grid.push(p(`M40 ${60 + i * 60} H600`, 0.08 + i * 0.03, 0.9, 'grid'))
}

let hatch = ''
for (let x = 26; x <= 614; x += 16) hatch += `M${x} ${G + 2} l-10 12 `

const structure = [
  p(`M20 ${G} H620`, 0.3, 0.9),
  p(hatch, 0.5, 1.1, 'minor'),
  p(`M${T.x1} ${G} V${T.top} H${T.x2} V${G}`, 0.6, 1.1),
  p(`M${W.x1} ${W.top} H${W.x2} V${G}`, 1.0, 0.8),
  p(`M172 ${T.top} H388`, 1.3, 0.4),
  p(`M250 ${T.top} V122 H330 V${T.top}`, 1.45, 0.5, 'minor'),
]
for (let k = 1; k < T.floors; k++) structure.push(p(`M${T.x1} ${T.top + k * tFloor} H${T.x2}`, 1.2 + k * 0.05, 0.5, 'minor'))
for (let k = 1; k < W.floors; k++) structure.push(p(`M${W.x1} ${W.top + k * wFloor} H${W.x2}`, 1.5 + k * 0.05, 0.4, 'minor'))
for (let j = 1; j < T.bays; j++) structure.push(p(`M${T.x1 + j * tBay} ${T.top} V${G}`, 1.4 + j * 0.06, 0.7, 'minor'))
for (let j = 1; j < W.bays; j++) structure.push(p(`M${W.x1 + j * wBay} ${W.top} V${G}`, 1.6 + j * 0.06, 0.5, 'minor'))
structure.push(p(`M246 ${G - 44} H314`, 1.8, 0.3))
structure.push(p(`M256 ${G} V${G - 36} H304 V${G} M280 ${G - 36} V${G}`, 1.85, 0.4, 'minor'))

// Windows: the entrance bays on the ground floor stay open
const windows = []
let n = 0
function addWindows(b, fh, bw, padX, padY, seed) {
  for (let k = 0; k < b.floors; k++) {
    for (let j = 0; j < b.bays; j++) {
      if (b === T && k === b.floors - 1 && (j === 1 || j === 2)) continue
      const hash = (k * 7 + j * 3 + seed) % 5
      windows.push({
        x: b.x1 + j * bw + padX,
        y: b.top + k * fh + padY,
        w: bw - padX * 2,
        h: fh - padY * 2,
        frameDelay: 1.7 + n * 0.012,
        lit: hash < 3,
        litDelay: 2.5 + ((k * 13 + j * 29 + seed * 5) % 19) * 0.07,
        glow: hash === 0 ? 0.95 : 0.6,
      })
      n++
    }
  }
}
addWindows(T, tFloor, tBay, 8, 9, 1)
addWindows(W, wFloor, wBay, 7, 10, 4)

// Annotation layer: dimension strings, level datums, north point
const dims = [
  p(`M120 ${T.top} V${G}`, 2.0, 0.6, 'dim'),
  p(`M128 ${T.top} H172 M128 ${G} H172`, 2.0, 0.4, 'dim'),
  p(`M114 ${T.top + 6} L126 ${T.top - 6} M114 ${G + 6} L126 ${G - 6}`, 2.3, 0.2, 'dim'),
  p(`M${T.x1} 590 H${W.x2}`, 2.1, 0.6, 'dim'),
  p(`M${T.x1} 548 V598 M${T.x2} 548 V598 M${W.x2} 548 V598`, 2.1, 0.4, 'dim'),
  p(`M${T.x1 - 6} 596 L${T.x1 + 6} 584 M${T.x2 - 6} 596 L${T.x2 + 6} 584 M${W.x2 - 6} 596 L${W.x2 + 6} 584`, 2.4, 0.2, 'dim'),
]
const levels = [
  { y: T.top, label: '+31.500' },
  { y: W.top, label: '+16.800' },
  { y: G, label: '±0.000' },
].map((l, i) => ({ ...l, delay: 2.2 + i * 0.12 }))

// Tower crane, drawn in the brand gold
let lattice = `M466 ${G}`
for (let y = G - 24, left = false; y >= 70; y -= 24, left = !left) lattice += ` L${left ? 466 : 474} ${y}`
const crane = [
  p(`M466 ${G} V64 M474 ${G} V64`, 1.8, 0.9, 'gold'),
  p(lattice, 2.0, 1.0, 'gold faint'),
  p('M300 70 H632 M300 78 H632', 2.4, 0.7, 'gold'),
  p('M470 64 V34 M470 34 L318 70 M470 34 L624 70', 2.6, 0.6, 'gold faint'),
  p('M404 78 V92 H432 V78', 2.7, 0.3, 'gold'),
]
</script>

<template>
  <svg class="building" viewBox="0 0 640 640" role="img" aria-label="Animated architectural elevation drawing of a multi-storey building">
    <defs>
      <radialGradient id="hb-glow" cx="50%" cy="60%" r="50%">
        <stop offset="0%" stop-color="#CEA437" stop-opacity="0.18" />
        <stop offset="100%" stop-color="#CEA437" stop-opacity="0" />
      </radialGradient>
    </defs>

    <g class="layer" style="--depth: 0.25">
      <path v-for="(l, i) in grid" :key="'g' + i" :d="l.d" pathLength="1" :class="['dr', l.cls]" :style="{ '--d': l.delay + 's', '--dur': l.dur + 's' }" />
    </g>

    <g class="layer" style="--depth: 0.6">
      <ellipse class="glow" cx="330" cy="380" rx="260" ry="220" fill="url(#hb-glow)" />
      <rect
        v-for="(w, i) in windows"
        :key="'wf' + i"
        class="win fd"
        :x="w.x" :y="w.y" :width="w.w" :height="w.h"
        :style="{ '--d': w.frameDelay + 's' }"
      />
      <rect
        v-for="(w, i) in windows.filter((x) => x.lit)"
        :key="'wl' + i"
        class="lit"
        :x="w.x" :y="w.y" :width="w.w" :height="w.h"
        :fill-opacity="w.glow"
        :style="{ '--d': w.litDelay + 's' }"
      />
      <path v-for="(l, i) in structure" :key="'s' + i" :d="l.d" pathLength="1" :class="['dr', l.cls]" :style="{ '--d': l.delay + 's', '--dur': l.dur + 's' }" />
    </g>

    <g class="layer" style="--depth: 0.8">
      <path v-for="(l, i) in crane" :key="'c' + i" :d="l.d" pathLength="1" :class="['dr', l.cls]" :style="{ '--d': l.delay + 's', '--dur': l.dur + 's' }" />
      <g class="hook">
        <path d="M360 78 V210" pathLength="1" class="dr gold faint" style="--d: 2.8s; --dur: 0.5s" />
        <path d="M353 210 h14 v6 q0 11 -8 11 q-7 0 -7 -7" class="gold fd" fill="none" style="--d: 3.1s" />
      </g>
    </g>

    <g class="layer" style="--depth: 1.1">
      <path v-for="(l, i) in dims" :key="'d' + i" :d="l.d" pathLength="1" :class="['dr', l.cls]" :style="{ '--d': l.delay + 's', '--dur': l.dur + 's' }" />
      <text class="tx fd" x="108" y="345" transform="rotate(-90 108 345)" text-anchor="middle" style="--d: 2.5s">31 500</text>
      <text class="tx fd" x="280" y="580" text-anchor="middle" style="--d: 2.55s">20 000</text>
      <text class="tx fd" x="450" y="580" text-anchor="middle" style="--d: 2.6s">14 000</text>

      <g v-for="(l, i) in levels" :key="'lv' + i">
        <path :d="`M532 ${l.y} H606`" pathLength="1" class="dr dim" :style="{ '--d': l.delay + 's', '--dur': '0.4s' }" />
        <path :d="`M556 ${l.y} l7 -9 h-14 z`" class="red-fill fd" :style="{ '--d': l.delay + 0.2 + 's' }" />
        <text class="tx fd" x="568" :y="l.y - 12" :style="{ '--d': l.delay + 0.25 + 's' }">{{ l.label }}</text>
      </g>

      <g class="fd" style="--d: 2.3s">
        <path d="M84 78 a18 18 0 1 1 0 36 a18 18 0 1 1 0 -36" class="dim" fill="none" />
        <path d="M84 82 L91 106 L84 100 L77 106 Z" class="red-fill" />
        <text class="tx" x="84" y="70" text-anchor="middle">N</text>
      </g>

      <text class="tx tag fd" x="20" y="628" style="--d: 2.8s">NORTH ELEVATION · 1:200</text>
    </g>
  </svg>
</template>

<style scoped>
.building { width: 100%; height: auto; overflow: visible; }

.layer {
  transform: translate3d(
    calc(var(--px, 0) * var(--depth) * 16px),
    calc(var(--py, 0) * var(--depth) * 12px),
    0
  );
  transition: transform 1s var(--ease-out);
}

/* Stroke styles */
path { fill: none; stroke-linecap: square; }
.main  { stroke: var(--bone); stroke-opacity: 0.8; stroke-width: 1.4; }
.minor { stroke: var(--bone); stroke-opacity: 0.22; stroke-width: 1; }
.grid  { stroke: var(--bone); stroke-opacity: 0.045; stroke-width: 1; }
.dim   { stroke: var(--bone); stroke-opacity: 0.4; stroke-width: 1; }
.gold  { stroke: var(--gold); stroke-opacity: 0.7; stroke-width: 1.4; }
.gold.faint { stroke-opacity: 0.35; stroke-width: 1; }
.red-fill { fill: var(--mark); stroke: none; }

/* Draw-on */
.dr {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw var(--dur, 1s) var(--ease-out) var(--d, 0s) forwards;
}
@keyframes draw { to { stroke-dashoffset: 0; } }

.fd {
  opacity: 0;
  animation: fadeIn 0.6s var(--ease-out) var(--d, 0s) forwards;
}
@keyframes fadeIn { to { opacity: 1; } }

.win { fill: var(--ink-2); stroke: var(--bone); stroke-opacity: 0.12; stroke-width: 0.8; }

/* Lights come on with a fluorescent flicker */
.lit {
  fill: var(--gold);
  opacity: 0;
  animation: lightOn 0.7s linear var(--d, 0s) forwards;
}
@keyframes lightOn {
  0% { opacity: 0; }
  12% { opacity: 1; }
  22% { opacity: 0.15; }
  34% { opacity: 0.9; }
  46% { opacity: 0.3; }
  100% { opacity: 1; }
}

.glow {
  opacity: 0;
  animation: fadeIn 1.6s var(--ease-out) 2.9s forwards;
}

.hook {
  transform-box: view-box;
  transform-origin: 360px 78px;
  animation: swing 3.6s ease-in-out 3.2s infinite alternate;
}
@keyframes swing {
  from { transform: rotate(-4deg); }
  to { transform: rotate(4deg); }
}

.tx {
  font-family: var(--font-ui);
  font-size: 11px;
  letter-spacing: 0.08em;
  fill: var(--bone-45);
}
.tag { font-size: 10px; letter-spacing: 0.18em; fill: var(--bone-28); }
</style>
