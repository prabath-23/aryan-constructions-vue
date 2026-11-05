// Shared, cached loader for GSAP + ScrollTrigger. Both are code-split and
// only fetched after first call, so nothing on the critical path waits on
// them. Multiple components (hero parallax, process scroll-line) share one
// load and one registerPlugin call instead of each doing their own.
let cache

export function loadGsap() {
  if (!cache) {
    cache = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger)
        return { gsap, ScrollTrigger }
      }
    )
  }
  return cache
}
