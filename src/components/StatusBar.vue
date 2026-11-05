<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { sheets } from '../data/content'
import { onTick } from '../motion/ticker'
import { scrambleTo } from '../directives/scramble'

// A CAD-style status bar pinned to the bottom edge on desktop: the drawing
// sheet you're currently "on", the scale, and how far through the set you
// are. The sheet code decodes each time it changes.
const currentId = ref('hero')
const sheet = computed(() => sheets.find((s) => s.id === currentId.value) ?? sheets[0])
const codeEl = ref(null)
const titleEl = ref(null)
const pctEl = ref(null)
let io = null
let stop = null
let lastPct = -1

watch(sheet, async (s) => {
  await nextTick()
  if (codeEl.value) scrambleTo(codeEl.value, s.code, 500)
  if (titleEl.value) scrambleTo(titleEl.value, s.title.toUpperCase(), 650)
})

onMounted(() => {
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) currentId.value = e.target.id
    },
    { rootMargin: '-45% 0px -50% 0px' }
  )
  for (const s of sheets) {
    const el = document.getElementById(s.id)
    if (el) io.observe(el)
  }
  stop = onTick((y) => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    const pct = max > 0 ? Math.round((y / max) * 100) : 0
    if (pct !== lastPct && pctEl.value) {
      pctEl.value.textContent = String(pct).padStart(3, '0')
      lastPct = pct
    }
  })
})

onUnmounted(() => {
  io?.disconnect()
  stop?.()
})
</script>

<template>
  <div class="status" aria-hidden="true">
    <span class="cell"><b>SHT</b> <span ref="codeEl" class="code">{{ sheet.code }}</span></span>
    <span class="cell title"><span ref="titleEl">{{ sheet.title.toUpperCase() }}</span></span>
    <span class="cell fill"><span class="scalebar"><i></i><i></i><i></i><i></i></span></span>
    <span class="cell">SCALE 1:100</span>
    <span class="cell">REV A</span>
    <span class="cell"><span ref="pctEl">000</span>%</span>
  </div>
</template>

<style scoped>
.status {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 90;
  display: none;
  align-items: stretch;
  height: 30px;
  border-top: 1px solid var(--rule);
  background: rgba(8, 8, 7, 0.86);
  backdrop-filter: blur(10px);
  font-family: var(--font-ui);
  font-size: 0.625rem;
  letter-spacing: 0.14em;
  color: var(--bone-45);
}
.cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1.1rem;
  border-right: 1px solid var(--rule);
  white-space: nowrap;
}
.cell:last-child { border-right: 0; }
.cell b { font-weight: 500; color: var(--bone-28); }
.code { color: var(--mark); }
.title { min-width: 16rem; color: var(--bone-70); }
.fill { flex: 1; justify-content: flex-end; }

/* A drawing's graphic scale bar: alternating filled/open segments */
.scalebar { display: flex; height: 5px; border: 1px solid var(--bone-28); }
.scalebar i { width: 22px; }
.scalebar i:nth-child(odd) { background: var(--bone-28); }

@media (min-width: 1081px) {
  .status { display: flex; }
}
</style>
