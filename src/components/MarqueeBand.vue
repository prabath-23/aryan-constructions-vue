<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { onTick } from '../motion/ticker'
import { observeOnce } from '../motion/observe'
import { reducedMotion } from '../motion/env'

// An oversized capabilities band that drifts on its own, speeds up with
// scroll velocity, leans (skews) into fast scrolls, and reverses direction
// when you scroll back up.
defineProps({ items: { type: Array, required: true } })

const band = ref(null)
const track = ref(null)
let x = 0
let dir = 1
let half = 0
let inView = false
let stop = null
let io = null

function measure() {
  if (track.value) half = track.value.scrollWidth / 2
}

onMounted(() => {
  if (reducedMotion) return
  measure()
  window.addEventListener('resize', measure)
  document.fonts?.ready.then(measure)

  io = new IntersectionObserver(([e]) => (inView = e.isIntersecting), { rootMargin: '100px 0px' })
  io.observe(band.value)

  stop = onTick((_, vel) => {
    if (!inView || !half || !track.value) return
    if (Math.abs(vel) > 0.6) dir = vel > 0 ? 1 : -1
    x -= (0.7 + Math.min(Math.abs(vel) * 0.35, 18)) * dir
    if (x <= -half) x += half
    if (x > 0) x -= half
    const skew = Math.max(-10, Math.min(10, -vel * 0.35))
    track.value.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0) skewX(${skew.toFixed(2)}deg)`
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', measure)
  io?.disconnect()
  stop?.()
})
</script>

<template>
  <section ref="band" class="band" aria-label="Capabilities">
    <div ref="track" class="track">
      <div v-for="copy in 2" :key="copy" class="set" :aria-hidden="copy === 2">
        <template v-for="(item, i) in items" :key="item">
          <span :class="['word', { outline: i % 2 === 1 }]">{{ item }}</span>
          <span class="glyph sep" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.band {
  position: relative;
  overflow: hidden;
  padding: clamp(2.5rem, 6vw, 5rem) 0;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
}
.track {
  display: flex;
  width: max-content;
  will-change: transform;
}
.set {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.word {
  font-family: var(--font-head);
  font-weight: 700;
  font-size: clamp(3rem, 9vw, 8.5rem);
  line-height: 1;
  letter-spacing: -0.035em;
  color: var(--bone);
  white-space: nowrap;
  padding: 0 clamp(1rem, 2.5vw, 2.25rem);
}
.word.outline {
  color: transparent;
  -webkit-text-stroke: 1px var(--bone-45);
}
.sep {
  width: clamp(18px, 2vw, 28px);
  height: clamp(18px, 2vw, 28px);
  gap: 4px;
}
</style>
