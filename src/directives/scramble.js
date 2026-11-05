// v-scramble — text decodes from random characters into its real value,
// like a plotter resolving a label. Works with proportional fonts: the
// element is width-locked while it decodes so nothing around it jitters.
//
//   v-scramble          on first scroll into view
//   v-scramble="300"    same, after a 300ms delay
//   v-scramble.load="750"  on mount, after a delay
//   v-scramble.hover    each time the enclosing link/button is hovered
//
// Mutates the element's existing text node rather than replacing
// textContent, so Vue's reference to that node stays valid.
import { observeOnce } from '../motion/observe'
import { reducedMotion } from '../motion/env'
import { loaderDone } from '../motion/loader'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/+-'

function textNode(el) {
  const node = el.firstChild
  return node && node.nodeType === Node.TEXT_NODE && el.childNodes.length === 1 ? node : null
}

// With a proportional font, random glyphs are wider or narrower than the
// real text, which would make the element (and its neighbours: nav items,
// button arrows) jitter every frame. Lock its box to the final text's width
// for the duration, then release it.
function lockWidth(el, finalText, node) {
  if (el.__scrambleLocked) return
  const cs = getComputedStyle(el)
  const saved = { display: el.style.display, width: el.style.width, whiteSpace: el.style.whiteSpace, overflow: el.style.overflow, textAlign: el.style.textAlign }
  const prev = node.nodeValue
  node.nodeValue = finalText
  const w = el.getBoundingClientRect().width
  node.nodeValue = prev
  if (cs.display === 'inline') el.style.display = 'inline-block'
  el.style.width = `${w}px`
  el.style.whiteSpace = 'nowrap'
  el.style.overflow = 'hidden'
  el.style.textAlign = cs.textAlign === 'start' ? 'left' : cs.textAlign
  el.__scrambleLocked = saved
}
function unlockWidth(el) {
  const saved = el.__scrambleLocked
  if (!saved) return
  Object.assign(el.style, saved)
  el.__scrambleLocked = null
}

export function scrambleTo(el, finalText, duration = 700) {
  const node = textNode(el)
  if (!node || reducedMotion) return
  cancelAnimationFrame(el.__scrambleRaf)
  lockWidth(el, finalText, node)
  const start = performance.now()
  const step = (now) => {
    const p = Math.min((now - start) / duration, 1)
    const settled = Math.floor(p * finalText.length)
    let out = ''
    for (let i = 0; i < finalText.length; i++) {
      const ch = finalText[i]
      out += i < settled || ch === ' ' ? ch : CHARS[(Math.random() * CHARS.length) | 0]
    }
    node.nodeValue = out
    if (p < 1) el.__scrambleRaf = requestAnimationFrame(step)
    else {
      node.nodeValue = finalText
      unlockWidth(el)
    }
  }
  el.__scrambleRaf = requestAnimationFrame(step)
}

export const vScramble = {
  mounted(el, binding) {
    if (reducedMotion) return
    const node = textNode(el)
    if (!node) return
    const original = node.nodeValue
    const delay = typeof binding.value === 'number' ? binding.value : 0

    if (binding.modifiers.hover) {
      const host = el.closest('a, button') || el
      const run = () => scrambleTo(el, original, 420)
      host.addEventListener('pointerenter', run)
      el.__scrambleOff = () => host.removeEventListener('pointerenter', run)
    } else if (binding.modifiers.load) {
      // Timed from when the loading screen lifts, or it would play unseen
      let t = 0
      let off = false
      loaderDone.then(() => {
        if (!off) t = setTimeout(() => scrambleTo(el, original), delay)
      })
      el.__scrambleOff = () => {
        off = true
        clearTimeout(t)
      }
    } else {
      el.__scrambleOff = observeOnce(el, () => setTimeout(() => scrambleTo(el, original), delay), { threshold: 0.6 })
    }
  },
  unmounted(el) {
    cancelAnimationFrame(el.__scrambleRaf)
    el.__scrambleOff?.()
  },
}
