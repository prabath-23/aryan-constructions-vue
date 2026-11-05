// Motion registry: components register their GSAP/ScrollTrigger setup in
// onMounted; App.vue calls runMotion() once all children have mounted, which
// loads GSAP + Lenis (code-split, off the critical path) and runs every setup
// in DOM order. Running them in one pass, in order, is what lets pinned
// sections measure their start/end positions correctly.
//
// Nothing essential depends on this: every animated element's default CSS is
// its finished state, so if the chunk fails or the visitor prefers reduced
// motion, the page is complete — just still.
import { loadGsap } from './gsap'
import { reducedMotion } from './env'

const queue = []
let lenis = null
let ScrollTriggerRef = null
let refreshTimer = 0

export function registerMotion(setup) {
  queue.push(setup)
}

export const getLenis = () => lenis

// Call after anything changes page height below a pinned section (e.g. the
// portfolio filter), or ScrollTrigger keeps stale start/end positions.
export function refreshMotion() {
  clearTimeout(refreshTimer)
  refreshTimer = setTimeout(() => ScrollTriggerRef?.refresh(), 120)
}

// Lenis drives scrolling programmatically, so `overflow: hidden` on <body>
// no longer stops it — overlays must stop Lenis explicitly.
export function lockScroll(locked) {
  if (!lenis) return
  if (locked) lenis.stop()
  else lenis.start()
}

export function scrollToY(y) {
  if (lenis) lenis.scrollTo(y, { duration: 1.2, force: true })
  else window.scrollTo({ top: y, behavior: reducedMotion ? 'auto' : 'smooth' })
}

// Lenis's own `anchors` option doesn't preventDefault, so the browser's
// native hash jump fights the smooth scroll. Handle in-page links ourselves.
function onAnchorClick(e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || !lenis) return
  const link = e.target.closest?.('a[href^="#"]')
  if (!link) return
  const hash = link.getAttribute('href')
  const target = hash.length > 1 ? document.querySelector(hash) : null
  if (!target) return
  e.preventDefault()
  lenis.scrollTo(target, { offset: hash === '#top' ? 0 : -72, duration: 1.4, force: true })
}

export async function runMotion() {
  if (reducedMotion) return
  let libs
  try {
    libs = await loadGsap()
  } catch {
    return
  }
  const { gsap, ScrollTrigger } = libs
  ScrollTriggerRef = ScrollTrigger

  try {
    const { default: Lenis } = await import('lenis')
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 })
    if (document.documentElement.classList.contains('loader-on')) lenis.stop()
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
    document.addEventListener('click', onAnchorClick)
  } catch {
    lenis = null
  }

  ScrollTrigger.config({ ignoreMobileResize: true })
  document.documentElement.classList.add('motion-on')

  gsap.context(() => {
    for (const setup of queue) {
      try {
        setup({ gsap, ScrollTrigger, lenis })
      } catch (err) {
        console.error('[motion]', err)
      }
    }
  })

  ScrollTrigger.refresh()
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
}
