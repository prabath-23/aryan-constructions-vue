// v-tilt — a subtle pointer-driven 3D tilt for image frames. Skipped
// entirely for touch devices (no hover to drive it) and reduced motion.

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isFinePointer = window.matchMedia('(pointer: fine)').matches

const MAX_DEG = 5

function onMove(el, e) {
  const r = el.getBoundingClientRect()
  const px = (e.clientX - r.left) / r.width - 0.5
  const py = (e.clientY - r.top) / r.height - 0.5
  el.style.transform = `perspective(1000px) rotateX(${(-py * MAX_DEG).toFixed(2)}deg) rotateY(${(px * MAX_DEG).toFixed(2)}deg)`
}

export const vTilt = {
  mounted(el) {
    if (prefersReducedMotion || !isFinePointer) return
    el.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)'

    const move = (e) => {
      el.style.transition = 'transform 0.15s linear'
      onMove(el, e)
    }
    const leave = () => {
      el.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
      el.style.transform = ''
    }

    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    el.__tiltCleanup = () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  },
  unmounted(el) {
    el.__tiltCleanup?.()
  },
}
