<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { onTick } from '../motion/ticker'
import { reducedMotion } from '../motion/env'

// A faint drafting grid fixed behind the page, drifting at a fraction of the
// scroll speed. The offset wraps at one cell so the element never needs to
// be taller than the viewport plus a cell, and it's transform-only.
const CELL = 64
const el = ref(null)
let stop = null

onMounted(() => {
  if (reducedMotion) return
  stop = onTick((y) => {
    if (el.value) el.value.style.transform = `translate3d(0, ${-((y * 0.18) % CELL)}px, 0)`
  })
})
onUnmounted(() => stop?.())
</script>

<template>
  <div ref="el" class="bp-grid" aria-hidden="true"></div>
</template>

<style scoped>
.bp-grid {
  position: fixed;
  left: 0;
  right: 0;
  top: -64px;
  bottom: -64px;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(var(--rule-soft) 1px, transparent 1px),
    linear-gradient(90deg, var(--rule-soft) 1px, transparent 1px);
  background-size: 64px 64px;
  -webkit-mask-image: radial-gradient(ellipse 80% 70% at 60% 40%, #000 20%, transparent 80%);
  mask-image: radial-gradient(ellipse 80% 70% at 60% 40%, #000 20%, transparent 80%);
  will-change: transform;
}
</style>
