// v-magnetic — the element leans toward the pointer while hovered.
// Uses the independent `translate` property (via .magnetic in style.css) so
// it never clobbers a `transform` the element already uses. Fine pointers
// only; a no-op on touch and under reduced motion.
import { reducedMotion, finePointer } from '../motion/env'

export const vMagnetic = {
  mounted(el, binding) {
    if (reducedMotion || !finePointer) return
    const strength = typeof binding.value === 'number' ? binding.value : 0.3
    el.classList.add('magnetic')
    let raf = 0
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - (r.left + r.width / 2)) * strength
      const y = (e.clientY - (r.top + r.height / 2)) * strength
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--mx', `${x.toFixed(1)}px`)
        el.style.setProperty('--my', `${y.toFixed(1)}px`)
      })
    }
    const leave = () => {
      cancelAnimationFrame(raf)
      el.style.setProperty('--mx', '0px')
      el.style.setProperty('--my', '0px')
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    el.__magneticOff = () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  },
  unmounted(el) {
    el.__magneticOff?.()
  },
}
