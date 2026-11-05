<script setup>
// The build-sequence drawing driven by ProcessSection's scroll timeline.
// Elements are grouped by stage (.s1 … .s5) and tagged by how they animate
// (.dr = stroke draw, .pop, .peg, .slab, .lit, …). Every element's default
// state here is its FINISHED state, so without the timeline (reduced
// motion, or GSAP failing to load) this renders as the completed building.
const G = 380
const T = { x1: 170, x2: 330, top: 130, floors: 6, bays: 4 }
const W = { x1: 330, x2: 420, top: 250, floors: 3, bays: 3 }
const tFh = (G - T.top) / T.floors
const wFh = (G - W.top) / W.floors
const tBw = (T.x2 - T.x1) / T.bays
const wBw = (W.x2 - W.x1) / W.bays

let hatch = ''
for (let x = 40; x <= 520; x += 14) hatch += `M${x} ${G + 2} l-9 10 `

const floorLines = []
for (let k = 1; k < T.floors; k++) floorLines.push(`M${T.x1} ${T.top + k * tFh} H${T.x2}`)
for (let k = 1; k < W.floors; k++) floorLines.push(`M${W.x1} ${W.top + k * wFh} H${W.x2}`)

// Slabs listed bottom-up so the stagger builds from the ground
const slabs = []
for (let k = T.floors - 1; k >= 0; k--) slabs.push({ x: T.x1, y: T.top + k * tFh, w: T.x2 - T.x1, h: tFh })
for (let k = W.floors - 1; k >= 0; k--) slabs.push({ x: W.x1, y: W.top + k * wFh, w: W.x2 - W.x1, h: wFh })

const windows = []
function addWindows(b, fh, bw, px, py) {
  for (let k = 0; k < b.floors; k++) {
    for (let j = 0; j < b.bays; j++) {
      windows.push({ x: b.x1 + j * bw + px, y: b.top + k * fh + py, w: bw - px * 2, h: fh - py * 2, lit: (k * 5 + j * 3) % 4 !== 0 })
    }
  }
}
addWindows(T, tFh, tBw, 7, 8)
addWindows(W, wFh, wBw, 6, 9)

const pegs = [150, 230, 330, 410]
const setbacks = [130, 440]

let lattice = `M456 ${G}`
for (let y = G - 22, l = false; y >= 64; y -= 22, l = !l) lattice += ` L${l ? 456 : 464} ${y}`
</script>

<template>
  <svg class="stages" viewBox="0 0 560 480" role="img" aria-label="Drawing of a building being surveyed, designed, constructed and handed over">
    <defs>
      <radialGradient id="bs-glow" cx="50%" cy="55%" r="50%">
        <stop offset="0%" stop-color="#CEA437" stop-opacity="0.28" />
        <stop offset="100%" stop-color="#CEA437" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!-- Sheet frame + title block: always present -->
    <path d="M12 12 H548 V468 H12 Z" class="frame-line" />
    <path d="M380 432 H548 M380 432 V468 M468 432 V468" class="frame-line" />
    <text x="392" y="454" class="t red">A-301</text>
    <text x="478" y="449" class="t faint">BUILD</text>
    <text x="478" y="460" class="t faint">SEQUENCE</text>

    <!-- 1 · Enquiry: the site -->
    <g class="s1">
      <path :d="`M36 ${G} H524`" pathLength="1" class="dr ln-main" />
      <path :d="hatch" pathLength="1" class="dr ln-minor" />
      <g v-for="x in [90, 470]" :key="'stake' + x" class="pop">
        <path :d="`M${x} ${G} V${G - 30}`" class="ln-main" />
        <path :d="`M${x} ${G - 30} l15 5 l-15 5 z`" class="red-fill" />
      </g>
      <path :d="`M90 ${G + 30} H470 M84 ${G + 36} L96 ${G + 24} M464 ${G + 36} L476 ${G + 24}`" pathLength="1" class="dr ln-dim" />
      <text x="280" :y="G + 24" text-anchor="middle" class="t fade">PLOT FRONTAGE</text>
      <g class="fade">
        <path d="M52 40 a16 16 0 1 1 0 32 a16 16 0 1 1 0 -32" class="ln-dim" />
        <path d="M52 44 L58 66 L52 61 L46 66 Z" class="red-fill" />
        <text x="52" y="34" text-anchor="middle" class="t">N</text>
      </g>
    </g>

    <!-- 2 · Site visit: survey and setbacks -->
    <g class="s2">
      <path v-for="x in setbacks" :key="'sb' + x" :d="`M${x} ${G} V80`" class="setback ln-dash" />
      <path d="M110 80 H460" class="limit ln-dash" />
      <text x="116" y="72" class="t fade2">HEIGHT LIMIT</text>
      <g v-for="x in pegs" :key="'peg' + x" class="peg">
        <path :d="`M${x} ${G} V${G - 14}`" class="ln-main" />
        <circle :cx="x" :cy="G - 17" r="3.2" class="red-fill" />
      </g>
      <path :d="`M150 ${G - 30} H410 M144 ${G - 24} L156 ${G - 36} M404 ${G - 24} L416 ${G - 36}`" pathLength="1" class="dr ln-dim" />
      <text x="280" :y="G - 38" text-anchor="middle" class="t fade2">FOOTPRINT</text>
    </g>

    <!-- 3 · Design & quote: the wireframe -->
    <g class="s3">
      <g class="wire">
        <path :d="`M${T.x1} ${G} V${T.top} H${T.x2} V${G}`" pathLength="1" class="dr ln-wire" />
        <path :d="`M${W.x1} ${W.top} H${W.x2} V${G}`" pathLength="1" class="dr ln-wire" />
        <path v-for="(d, i) in floorLines" :key="'fl' + i" :d="d" pathLength="1" class="dr ln-wire thin" />
        <rect v-for="(w, i) in windows" :key="'wo' + i" :x="w.x" :y="w.y" :width="w.w" :height="w.h" class="win-outline" />
      </g>
      <g transform="translate(436 150)">
        <g class="quote">
          <path d="M0 0 H104 V38 H0 Z" class="ln-red" />
          <text x="9" y="15" class="t red">ITEMISED QUOTE</text>
          <text x="9" y="29" class="t">LINE BY LINE</text>
        </g>
      </g>
    </g>

    <!-- 4 · Build: floors stack up, the crane works -->
    <g class="s4">
      <rect v-for="(s, i) in slabs" :key="'slab' + i" :x="s.x" :y="s.y" :width="s.w" :height="s.h" class="slab" />
      <rect v-for="(w, i) in windows" :key="'wd' + i" :x="w.x" :y="w.y" :width="w.w" :height="w.h" class="win-dark" />
      <g class="crane">
        <path :d="`M452 ${G} V58 M460 ${G} V58`" class="ln-gold" />
        <path :d="lattice" class="ln-gold faint" />
        <path d="M300 62 H540 M300 68 H540" class="ln-gold" />
        <path d="M456 58 V32 M456 32 L318 62 M456 32 L532 62" class="ln-gold faint" />
        <path d="M392 68 V80 H416 V68" class="ln-gold" />
        <g class="hook">
          <path d="M360 68 V150" class="ln-gold faint" />
          <path d="M354 150 h12 v5 q0 10 -7 10 q-6 0 -6 -6" class="ln-gold" />
        </g>
      </g>
    </g>

    <!-- 5 · Handover: lights on, crane out, stamped -->
    <g class="s5">
      <ellipse class="glow" cx="295" cy="260" rx="230" ry="190" fill="url(#bs-glow)" />
      <rect v-for="(w, i) in windows.filter((x) => x.lit)" :key="'lit' + i" :x="w.x" :y="w.y" :width="w.w" :height="w.h" class="lit" />
      <g transform="translate(368 96) rotate(-9)">
        <g class="stamp">
          <path d="M0 0 H158 V56 H0 Z" class="stamp-line" />
          <path d="M5 5 H153 V51 H5 Z" class="stamp-line thin" />
          <text x="79" y="27" text-anchor="middle" class="t stamp-t">HANDED OVER</text>
          <text x="79" y="43" text-anchor="middle" class="t red">✓ HANDED OVER</text>
        </g>
      </g>
    </g>
  </svg>
</template>

<style scoped>
.stages { width: 100%; height: auto; overflow: visible; }

path, rect { fill: none; }
.frame-line { stroke: var(--rule); stroke-width: 1; }
.ln-main { stroke: var(--bone); stroke-opacity: 0.7; stroke-width: 1.3; }
.ln-minor { stroke: var(--bone); stroke-opacity: 0.22; stroke-width: 1; }
.ln-dim { stroke: var(--bone); stroke-opacity: 0.4; stroke-width: 1; }
.ln-dash { stroke: var(--mark); stroke-opacity: 0.55; stroke-width: 1; stroke-dasharray: 5 6; }
.ln-wire { stroke: var(--bone); stroke-opacity: 0.8; stroke-width: 1.1; }
.ln-wire.thin { stroke-opacity: 0.35; stroke-width: 0.8; }
.ln-red { stroke: var(--mark); stroke-width: 1.2; }
.ln-gold { stroke: var(--gold); stroke-opacity: 0.8; stroke-width: 1.3; }
.ln-gold.faint { stroke-opacity: 0.35; stroke-width: 0.9; }
.red-fill { fill: var(--mark); stroke: none; }

/* stroke-draw hooks: finished by default (offset 0) */
.dr { stroke-dasharray: 1; stroke-dashoffset: 0; }

.win-outline { stroke: var(--bone); stroke-opacity: 0.25; stroke-width: 0.7; }
.wire { opacity: 0.18; }
.slab { fill: var(--ink-3); stroke: var(--bone); stroke-opacity: 0.45; stroke-width: 1; }
.win-dark { fill: var(--ink-1); stroke: var(--bone); stroke-opacity: 0.12; stroke-width: 0.6; }
.lit { fill: var(--gold); fill-opacity: 0.85; }

/* The crane has left by the finished state */
.crane { opacity: 0; }

.stamp-line { stroke: var(--mark); stroke-width: 2; }
.stamp-line.thin { stroke-width: 0.8; }

.t {
  font-family: var(--font-ui);
  font-size: 8.5px;
  letter-spacing: 0.1em;
  fill: var(--bone-45);
}
.t.red { fill: var(--mark); }
.t.faint { fill: var(--bone-28); font-size: 7px; }
.stamp-t { font-size: 13px; font-weight: 600; letter-spacing: 0.16em; fill: var(--mark); }
</style>
