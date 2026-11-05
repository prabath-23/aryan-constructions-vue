// v-split — splits a heading into words that rise out of a mask, staggered,
// the first time it scrolls into view. Nested elements (e.g. the redline <em>)
// keep their wrapper; their words are split inside it.
//
// Only use on static text: the directive rewrites the element's children,
// which Vue won't know about if the content is reactive.
import { observeOnce } from '../motion/observe'
import { reducedMotion } from '../motion/env'

function wrapWords(node, counter) {
  for (const child of [...node.childNodes]) {
    if (child.nodeType === Node.TEXT_NODE) {
      if (!child.nodeValue.trim()) continue
      const frag = document.createDocumentFragment()
      for (const part of child.nodeValue.split(/(\s+)/)) {
        if (!part) continue
        if (!part.trim()) {
          frag.appendChild(document.createTextNode(part))
          continue
        }
        const outer = document.createElement('span')
        outer.className = 'sw'
        const inner = document.createElement('span')
        inner.className = 'swi'
        inner.textContent = part
        inner.style.setProperty('--i', counter.n++)
        outer.appendChild(inner)
        frag.appendChild(outer)
      }
      child.replaceWith(frag)
    } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
      wrapWords(child, counter)
    }
  }
}

export const vSplit = {
  mounted(el) {
    if (el.dataset.split) return
    el.dataset.split = '1'
    el.classList.add('split')
    if (reducedMotion) {
      el.classList.add('is-in')
      return
    }
    wrapWords(el, { n: 0 })
    el.__splitOff = observeOnce(el, () => el.classList.add('is-in'), { threshold: 0.25 })
  },
  unmounted(el) {
    el.__splitOff?.()
  },
}
