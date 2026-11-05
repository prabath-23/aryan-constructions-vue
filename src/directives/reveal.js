// v-reveal — reveals an element the first time it scrolls into view.
//
//   v-reveal          fade + rise
//   v-reveal.stagger  children rise in sequence (delays come from CSS)
//   v-reveal.clip     mask-wipe, for imagery
//
// Pure IntersectionObserver: no animation library on the critical path, so
// reveals work the moment the component mounts.

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

let observer
function getObserver() {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    )
  }
  return observer
}

function reveal(el) {
  el.classList.add('is-visible')
  // Recorded on the element itself (a data attribute, not a class) so it
  // survives a Vue re-render even though `is-visible` doesn't — see `updated`.
  el.dataset.revealed = 'true'
}

export const vReveal = {
  mounted(el, binding) {
    if (binding.modifiers.stagger) el.classList.add('stagger')
    else if (binding.modifiers.clip) el.classList.add('clip-reveal')
    else el.setAttribute('data-reveal', '')

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      reveal(el)
      return
    }
    getObserver().observe(el)
  },
  // A reactive `:class` binding on the same element (e.g. a v-for index used
  // for sizing) makes Vue reassign `className` wholesale on every re-render,
  // wiping the `is-visible` class this directive added outside Vue's own
  // bookkeeping — reproduced by the portfolio filter, which reorders `i` for
  // surviving cards. Restore it immediately; this runs before the browser
  // paints, so there's nothing to see.
  updated(el) {
    if (el.dataset.revealed === 'true' && !el.classList.contains('is-visible')) {
      el.classList.add('is-visible')
    }
  },
  unmounted(el) {
    if (observer) observer.unobserve(el)
  },
}
