<script setup>
// The hero drawing, modelled on the building in the client's home-page
// mockup: a modern block in two-point perspective with cantilevered floor
// slabs, glass balustrades, full-height glazing, a vertical fin panel and a
// set-back top floor, with a tower crane, trees, dimensions and level datums.
//
// The building is described in metres and projected through a simple camera
// (verticals stay vertical), so proportions and perspective are consistent.
// It draws itself on load: grid → ground → slabs and structure → glazing →
// fins and railings → crane and trees → dimensions → the lights come on.
// Every stroke is a <path> with pathLength="1" animated with
// stroke-dashoffset in CSS, so it starts at first paint with no JS chunk.
//
// Layers carry a --depth used by the hero's pointer parallax.

// ---- Camera ---------------------------------------------------------------
const CAM = { x: -30, y: 1.7, z: -40 }
const AIM = { x: 8, z: 11 }
const FOCAL = 900
const OX = 380 // screen x of the line of sight
const HORIZON = 470 // screen y of eye level
const len = Math.hypot(AIM.x - CAM.x, AIM.z - CAM.z)
const DX = (AIM.x - CAM.x) / len
const DZ = (AIM.z - CAM.z) / len

// World (x along the right face, y up, z along the left face) → screen
function P(x, y, z) {
  const vx = x - CAM.x
  const vz = z - CAM.z
  const xc = vx * DZ - vz * DX
  const zc = vx * DX + vz * DZ
  return [OX + (FOCAL * xc) / zc, HORIZON - (FOCAL * (y - CAM.y)) / zc]
}
const pt = (q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`
const line = (...pts) => 'M' + pts.map((q) => pt(P(...q))).join(' L')
const quad = (a, b, c, d) => [a, b, c, d].map((q) => pt(P(...q))).join(' ')

const p = (d, delay, dur, cls = 'main') => ({ d, delay, dur, cls })

// ---- Model (metres) -------------------------------------------------------
const W = 16 // right face
const D = 24 // left face
const LEVELS = [0, 4, 7.6, 11.2, 14.8, 18.4] // floor levels; the last is the roof
const SLAB = 0.4 // slab thickness
const OH = 1.2 // slab overhang past the facade
const ROOF = LEVELS[LEVELS.length - 1]
const PH = { x1: 3, x2: 12, z1: 5, z2: 17, top: 21.6 } // set-back top floor
const FINS = { x1: 0.8, x2: 5.6, step: 0.6 }

const ground = P(0, 0, 0)[1]

// ---- Drafting grid ---------------------------------------------------------
const grid = []
for (let i = 0; i <= 11; i++) grid.push(p(`M${40 + i * 62} 20 V580`, 0.05 + i * 0.025, 0.9, 'grid'))
for (let i = 0; i <= 9; i++) grid.push(p(`M20 ${40 + i * 62} H740`, 0.08 + i * 0.025, 0.9, 'grid'))

// ---- Ground ---------------------------------------------------------------
let hatch = ''
for (let x = 24; x <= 736; x += 16) hatch += `M${x} ${ground + 4} l-10 12 `
const groundLines = [p(`M12 ${ground + 2} H748`, 0.3, 0.9), p(hatch, 0.5, 1.1, 'minor')]

// ---- Structure ------------------------------------------------------------
const structure = []
LEVELS.forEach((L, k) => {
  if (k === 0) return
  const top = L + SLAB
  const d = 0.6 + k * 0.12
  // slab edge: top and underside along both faces, plus the corner and ends
  structure.push(p(line([-OH, top, D], [-OH, top, -OH], [W, top, -OH]), d, 0.8))
  structure.push(p(line([-OH, L, D], [-OH, L, -OH], [W, L, -OH]), d + 0.05, 0.8))
  structure.push(p(line([-OH, L, -OH], [-OH, top, -OH]) + ' ' + line([-OH, L, D], [-OH, top, D]) + ' ' + line([W, L, -OH], [W, top, -OH]), d + 0.3, 0.3, 'minor'))
})
// facade corners between slabs
for (let k = 0; k < LEVELS.length - 1; k++) {
  const y1 = k === 0 ? 0 : LEVELS[k] + SLAB
  const y2 = LEVELS[k + 1]
  structure.push(p(line([0, y1, 0], [0, y2, 0]) + ' ' + line([0, y1, D], [0, y2, D]) + ' ' + line([W, y1, 0], [W, y2, 0]), 0.9 + k * 0.1, 0.5))
}
// set-back top floor and its roof slab
const phRoof = PH.top + SLAB
structure.push(p(line([PH.x1, ROOF + SLAB, PH.z2], [PH.x1, PH.top, PH.z2], [PH.x1, PH.top, PH.z1], [PH.x2, PH.top, PH.z1], [PH.x2, ROOF + SLAB, PH.z1]), 1.25, 0.7))
structure.push(p(line([PH.x1, ROOF + SLAB, PH.z1], [PH.x1, PH.top, PH.z1]), 1.3, 0.3))
structure.push(p(line([PH.x1 - 0.8, phRoof, PH.z2], [PH.x1 - 0.8, phRoof, PH.z1 - 0.8], [PH.x2, phRoof, PH.z1 - 0.8]) + ' ' + line([PH.x1 - 0.8, PH.top, PH.z2], [PH.x1 - 0.8, PH.top, PH.z1 - 0.8], [PH.x2, PH.top, PH.z1 - 0.8]), 1.4, 0.6))
// glass balustrades on the slab edges
for (let k = 1; k < LEVELS.length; k++) {
  const h = LEVELS[k] + SLAB + 1.05
  structure.push(p(line([-OH, h, D], [-OH, h, -OH], [W, h, -OH]), 1.5 + k * 0.08, 0.6, 'minor'))
}
// vertical fin panel on the right face, through the upper floors
let fins = ''
for (let x = FINS.x1; x <= FINS.x2 + 0.01; x += FINS.step) fins += line([x, LEVELS[1] + SLAB, 0], [x, ROOF, 0]) + ' '
structure.push(p(fins, 1.6, 0.9, 'minor'))

// ---- Glazing --------------------------------------------------------------
// Each pane is a projected quad: a frame, plus a lit fill for some of them.
const panes = []
let n = 0
function bays(from, to, count, gap = 0.3) {
  const w = (to - from) / count
  return Array.from({ length: count }, (_, i) => [from + i * w + gap, from + (i + 1) * w - gap])
}
const lerp = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t)
function addPane(corners, seed) {
  const hash = (seed * 7 + n * 3) % 5
  const [a, b, c, d] = corners
  // mullions: one or two verticals and a transom near the top
  const wide = Math.hypot(b[0] - a[0], b[2] - a[2]) > 3.2
  const cuts = wide ? [1 / 3, 2 / 3] : [0.5]
  let mull = cuts.map((t) => line(lerp(a, b, t), lerp(d, c, t))).join(' ')
  mull += ' ' + line(lerp(a, d, 0.78), lerp(b, c, 0.78))
  panes.push({
    points: quad(...corners),
    mull,
    frameDelay: 1.7 + n * 0.012,
    lit: hash < 3,
    litDelay: 2.5 + ((n * 13 + seed * 29) % 19) * 0.065,
    glow: hash === 0 ? 0.95 : 0.62,
  })
  n++
}
for (let k = 0; k < LEVELS.length - 1; k++) {
  const y1 = (k === 0 ? 0 : LEVELS[k] + SLAB) + 0.25
  const y2 = LEVELS[k + 1] - 0.2
  for (const [a, b] of bays(0.6, D - 0.6, 5)) addPane([[0, y1, a], [0, y1, b], [0, y2, b], [0, y2, a]], k + 1)
  const rightFrom = k === 0 ? 0.6 : FINS.x2 + 0.8
  for (const [a, b] of bays(rightFrom, W - 0.6, k === 0 ? 4 : 3)) addPane([[a, y1, 0], [b, y1, 0], [b, y2, 0], [a, y2, 0]], k + 5)
}
for (const [a, b] of bays(PH.z1 + 0.5, PH.z2 - 0.5, 3)) addPane([[PH.x1, ROOF + SLAB + 0.25, a], [PH.x1, ROOF + SLAB + 0.25, b], [PH.x1, PH.top - 0.2, b], [PH.x1, PH.top - 0.2, a]], 11)
for (const [a, b] of bays(PH.x1 + 0.5, PH.x2 - 0.5, 3)) addPane([[a, ROOF + SLAB + 0.25, PH.z1], [b, ROOF + SLAB + 0.25, PH.z1], [b, PH.top - 0.2, PH.z1], [a, PH.top - 0.2, PH.z1]], 13)

// ---- Trees ----------------------------------------------------------------
// A trunk with two branches and a lobed canopy outline.
function tree(x, r, h, delay) {
  const g = ground + 1
  const cy = g - h
  let canopy = ''
  const lobes = 9
  for (let i = 0; i <= lobes; i++) {
    const a = (i / lobes) * Math.PI * 2 + Math.PI / 2
    const m = ((i - 0.5) / lobes) * Math.PI * 2 + Math.PI / 2
    const px = x + Math.cos(a) * r
    const py = cy + Math.sin(a) * r * 0.9
    if (i === 0) canopy += `M${px.toFixed(1)} ${py.toFixed(1)}`
    else canopy += ` Q${(x + Math.cos(m) * r * 1.28).toFixed(1)} ${(cy + Math.sin(m) * r * 1.15).toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)}`
  }
  const trunk = `M${x} ${g} V${cy + r * 0.2} M${x} ${cy + r * 0.75} l${-r * 0.4} ${-r * 0.5} M${x} ${cy + r * 0.5} l${r * 0.35} ${-r * 0.45}`
  return [p(trunk, delay, 0.5, 'gold faint'), p(canopy, delay + 0.25, 0.9, 'gold')]
}
const trees = [...tree(92, 30, 92, 1.9), ...tree(46, 15, 42, 2.05), ...tree(630, 22, 62, 2.0), ...tree(196, 11, 30, 2.15)]

// ---- Tower crane ------------------------------------------------------------
const M = { x1: 668, x2: 680, top: 46 }
let mast = `M${M.x1} ${ground}`
for (let y = ground - 22, left = false; y >= M.top + 18; y -= 22, left = !left) mast += ` L${left ? M.x1 : M.x2} ${y}`
const J = { x1: 300, x2: 748, y1: 58, y2: 68 }
let jib = `M${J.x1 + 10} ${J.y2}`
for (let x = J.x1 + 24, up = true; x <= J.x2; x += 16, up = !up) jib += ` L${x} ${up ? J.y1 : J.y2}`
const crane = [
  p(`M${M.x1} ${ground} V${M.top} M${M.x2} ${ground} V${M.top}`, 1.8, 0.9, 'gold'),
  p(mast, 2.0, 1.0, 'gold faint'),
  p(`M${J.x1} ${J.y2} L${J.x1 + 12} ${J.y1} H${J.x2} V${J.y2} Z`, 2.3, 0.8, 'gold'),
  p(jib, 2.45, 0.8, 'gold faint'),
  p(`M${M.x1 + 6} ${J.y1} V22 M${M.x1 + 6} 22 L${J.x1 + 40} ${J.y1} M${M.x1 + 6} 22 L${J.x2} ${J.y1}`, 2.6, 0.6, 'gold faint'),
  p(`M${J.x2 - 26} ${J.y2} v14 h22 v-14`, 2.7, 0.3, 'gold'),
  p(`M${M.x2} ${J.y2 + 4} h16 v16 h-16`, 2.75, 0.3, 'gold'),
]
const HOOK = { x: 438, top: J.y2, bottom: 112 }

// ---- Annotation -------------------------------------------------------------
const backL = P(0, 0, D)
const front = P(0, 0, 0)
const rightE = P(W, 0, 0)
const dimY = ground + 40
const tick = (x, y) => `M${(x - 5).toFixed(1)} ${y + 5} L${(x + 5).toFixed(1)} ${y - 5}`
const backTop = P(-OH, ROOF + SLAB, D)
const vx = backL[0] - 34
const dims = [
  p(`M${backL[0].toFixed(1)} ${dimY} H${rightE[0].toFixed(1)}`, 2.1, 0.6, 'dim'),
  p([backL, front, rightE].map((q) => `M${q[0].toFixed(1)} ${(q[1] + 8).toFixed(1)} V${dimY + 7}`).join(' '), 2.1, 0.4, 'dim'),
  p([backL, front, rightE].map((q) => tick(q[0], dimY)).join(' '), 2.4, 0.2, 'dim'),
  p(`M${vx.toFixed(1)} ${backTop[1].toFixed(1)} V${backL[1].toFixed(1)}`, 2.0, 0.6, 'dim'),
  p(`M${(vx - 6).toFixed(1)} ${backTop[1].toFixed(1)} H${(backL[0] - 10).toFixed(1)} M${(vx - 6).toFixed(1)} ${backL[1].toFixed(1)} H${(backL[0] - 10).toFixed(1)}`, 2.0, 0.4, 'dim'),
  p(tick(vx, backTop[1]) + ' ' + tick(vx, backL[1]), 2.3, 0.2, 'dim'),
]
const mm = (m) => Math.round(m * 1000).toLocaleString('en-IN').replace(/,/g, ' ')
const dimText = [
  { x: (backL[0] + front[0]) / 2, y: dimY + 18, label: mm(D) },
  { x: (front[0] + rightE[0]) / 2, y: dimY + 18, label: mm(W) },
]
const vLabel = { x: vx - 10, y: (backTop[1] + backL[1]) / 2, label: mm(ROOF + SLAB) }

const fmt = (m) => (m === 0 ? '±0.000' : '+' + m.toFixed(3))
const DATUM_X = 684
const levels = [
  { m: PH.top + SLAB, y: P(PH.x2, phRoof, PH.z1 - 0.8)[1] },
  { m: LEVELS[3], y: P(W, LEVELS[3], -OH)[1] },
  { m: 0, y: ground },
].map((l, i) => ({ ...l, label: fmt(l.m), delay: 2.2 + i * 0.12 }))
</script>

<template>
  <svg class="building" viewBox="0 0 760 600" role="img" aria-label="Animated architectural perspective drawing of a modern multi-storey building with a tower crane">
    <defs>
      <linearGradient id="hb-lit" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#E4C063" />
        <stop offset="1" stop-color="#B8892E" />
      </linearGradient>
      <radialGradient id="hb-glow" cx="50%" cy="55%" r="50%">
        <stop offset="0%" stop-color="#CEA437" stop-opacity="0.16" />
        <stop offset="100%" stop-color="#CEA437" stop-opacity="0" />
      </radialGradient>
    </defs>

    <g class="layer" style="--depth: 0.25">
      <path v-for="(l, i) in grid" :key="'g' + i" :d="l.d" pathLength="1" :class="['dr', l.cls]" :style="{ '--d': l.delay + 's', '--dur': l.dur + 's' }" />
    </g>

    <g class="layer" style="--depth: 0.6">
      <ellipse class="glow" cx="390" cy="340" rx="300" ry="240" fill="url(#hb-glow)" />
      <polygon
        v-for="(w, i) in panes"
        :key="'wf' + i"
        class="win fd"
        :points="w.points"
        :style="{ '--d': w.frameDelay + 's' }"
      />
      <polygon
        v-for="(w, i) in panes.filter((x) => x.lit)"
        :key="'wl' + i"
        class="lit"
        :points="w.points"
        :fill-opacity="w.glow"
        :style="{ '--d': w.litDelay + 's' }"
      />
      <path v-for="(w, i) in panes" :key="'wm' + i" :d="w.mull" class="mull fd" :style="{ '--d': w.frameDelay + 0.3 + 's' }" />
      <path v-for="(l, i) in groundLines" :key="'gr' + i" :d="l.d" pathLength="1" :class="['dr', l.cls]" :style="{ '--d': l.delay + 's', '--dur': l.dur + 's' }" />
      <path v-for="(l, i) in structure" :key="'s' + i" :d="l.d" pathLength="1" :class="['dr', l.cls]" :style="{ '--d': l.delay + 's', '--dur': l.dur + 's' }" />
    </g>

    <g class="layer" style="--depth: 0.8">
      <path v-for="(l, i) in trees" :key="'t' + i" :d="l.d" pathLength="1" :class="['dr', l.cls]" :style="{ '--d': l.delay + 's', '--dur': l.dur + 's' }" />
      <path v-for="(l, i) in crane" :key="'c' + i" :d="l.d" pathLength="1" :class="['dr', l.cls]" :style="{ '--d': l.delay + 's', '--dur': l.dur + 's' }" />
      <g class="hook" :style="{ transformOrigin: `${HOOK.x}px ${HOOK.top}px` }">
        <path :d="`M${HOOK.x - 6} ${HOOK.top} h12 v6 h-12 z`" class="gold fd" style="--d: 2.75s" />
        <path :d="`M${HOOK.x} ${HOOK.top + 6} V${HOOK.bottom}`" pathLength="1" class="dr gold faint" style="--d: 2.8s; --dur: 0.5s" />
        <path :d="`M${HOOK.x - 6} ${HOOK.bottom} h12 v5 q0 10 -7 10 q-6 0 -6 -6`" class="gold fd" style="--d: 3.1s" />
      </g>
    </g>

    <g class="layer" style="--depth: 1.1">
      <path v-for="(l, i) in dims" :key="'d' + i" :d="l.d" pathLength="1" :class="['dr', l.cls]" :style="{ '--d': l.delay + 's', '--dur': l.dur + 's' }" />
      <text v-for="(t, i) in dimText" :key="'dt' + i" class="tx fd" :x="t.x" :y="t.y" text-anchor="middle" :style="{ '--d': 2.5 + i * 0.05 + 's' }">{{ t.label }}</text>
      <text class="tx fd" :x="vLabel.x" :y="vLabel.y" :transform="`rotate(-90 ${vLabel.x} ${vLabel.y})`" text-anchor="middle" style="--d: 2.5s">{{ vLabel.label }}</text>

      <g v-for="(l, i) in levels" :key="'lv' + i">
        <path :d="`M${DATUM_X} ${l.y} H748`" pathLength="1" class="dr dim" :style="{ '--d': l.delay + 's', '--dur': '0.4s' }" />
        <path :d="`M${DATUM_X + 14} ${l.y} l7 -9 h-14 z`" class="red-fill fd" :style="{ '--d': l.delay + 0.2 + 's' }" />
        <text class="tx fd" :x="DATUM_X + 22" :y="l.y - 8" :style="{ '--d': l.delay + 0.25 + 's' }">{{ l.label }}</text>
      </g>

      <g class="fd" style="--d: 2.3s">
        <path d="M60 52 a18 18 0 1 1 0 36 a18 18 0 1 1 0 -36" class="dim" fill="none" />
        <path d="M60 56 L67 80 L60 74 L53 80 Z" class="red-fill" />
        <text class="tx" x="60" y="44" text-anchor="middle">N</text>
      </g>
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
path { fill: none; stroke-linecap: square; stroke-linejoin: round; }
.main  { stroke: var(--bone); stroke-opacity: 0.78; stroke-width: 1.3; }
.minor { stroke: var(--bone); stroke-opacity: 0.24; stroke-width: 0.9; }
.grid  { stroke: var(--bone); stroke-opacity: 0.045; stroke-width: 1; }
.dim   { stroke: var(--bone); stroke-opacity: 0.4; stroke-width: 1; }
.gold  { stroke: var(--gold); stroke-opacity: 0.75; stroke-width: 1.3; }
.gold.faint { stroke-opacity: 0.38; stroke-width: 0.9; }
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

.win { fill: var(--ink-2); stroke: var(--bone); stroke-opacity: 0.16; stroke-width: 0.7; }

/* Lights come on with a fluorescent flicker */
.mull { stroke: var(--ink); stroke-opacity: 0.55; stroke-width: 1.2; }

.lit {
  fill: url(#hb-lit);
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
</style>
