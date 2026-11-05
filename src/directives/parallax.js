// v-parallax="0.12" — the element drifts against the scroll inside its
// (overflow-hidden) parent, so imagery moves slower than its frame.
//
// Measures the *parent's* rect, never the moved element's own, so the
// transform can't feed back into its own measurement. Driven by the shared
// ticker rather than GSAP so it also covers elements mounted later (the
// portfolio filter re-creates cards) without any re-registration.
import { onTick } from '../motion/ticker'
import { reducedMotion } from '../motion/env'

const items = new Set()
let stop = null
let lastY = NaN
let frame = 0

function update(y) {
  // Recompute when scrolling, and periodically otherwise to catch layout
  // shifts (filtered grids, font loads) that move frames without a scroll.
  if (y === lastY && ++frame % 30) return
  lastY = y
  const vh = window.innerHeight
  for (const it of items) {
    const box = it.anchor.getBoundingClientRect()
    if (box.bottom < -120 || box.top > vh + 120) continue
    const limit = box.height * 0.1
    let shift = (box.top + box.height / 2 - vh / 2) * it.speed
    shift = Math.max(-limit, Math.min(limit, shift))
    if (Math.abs(shift - it.last) < 0.1) continue
    it.last = shift
    it.el.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`
  }
}

export const vParallax = {
  mounted(el, binding) {
    if (reducedMotion || !el.parentElement) return
    const it = { el, anchor: el.parentElement, speed: -(binding.value ?? 0.12), last: NaN }
    el.__parallax = it
    items.add(it)
    lastY = NaN
    if (!stop) stop = onTick(update)
  },
  unmounted(el) {
    items.delete(el.__parallax)
    if (!items.size && stop) {
      stop()
      stop = null
    }
  },
}
