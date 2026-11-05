<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { onTick } from '../motion/ticker'
import { reducedMotion, finePointer } from '../motion/env'

// A CAD-style crosshair with live page coordinates. The crosshair tracks the
// pointer exactly; the ring trails it. Over links the ring tightens, over
// anything with data-cursor="Label" it opens into a labelled disc, and over
// form fields it gets out of the way of the native I-beam.
const enabled = finePointer && !reducedMotion

const dot = ref(null)
const ring = ref(null)
const xy = ref(null)
const mode = ref('')
const label = ref('')
const visible = ref(false)
const pressed = ref(false)

let mx = 0, my = 0, rx = 0, ry = 0
let stop = null
let lastCoords = ''

function onMove(e) {
  mx = e.clientX
  my = e.clientY
  if (!visible.value) {
    rx = mx
    ry = my
    visible.value = true
  }
}

function onOver(e) {
  const t = e.target
  if (!(t instanceof Element)) return
  if (t.closest('input, textarea, select')) {
    mode.value = 'text'
    return
  }
  const labelled = t.closest('[data-cursor]')
  if (labelled) {
    mode.value = 'label'
    label.value = labelled.dataset.cursor
    return
  }
  mode.value = t.closest('a, button, [role="tab"], label') ? 'link' : ''
}

const onLeave = () => (visible.value = false)
const onDown = () => (pressed.value = true)
const onUp = () => (pressed.value = false)

function render(scrollY) {
  rx += (mx - rx) * 0.2
  ry += (my - ry) * 0.2
  if (dot.value) dot.value.style.transform = `translate3d(${mx}px, ${my}px, 0)`
  if (ring.value) ring.value.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
  const coords = `X ${String(Math.round(mx)).padStart(4, '0')}  Y ${String(Math.round(my + scrollY)).padStart(5, '0')}`
  if (coords !== lastCoords && xy.value) {
    xy.value.textContent = coords
    lastCoords = coords
  }
}

onMounted(() => {
  if (!enabled) return
  document.documentElement.classList.add('has-cursor')
  window.addEventListener('pointermove', onMove, { passive: true })
  document.addEventListener('pointerover', onOver)
  document.documentElement.addEventListener('pointerleave', onLeave)
  window.addEventListener('pointerdown', onDown)
  window.addEventListener('pointerup', onUp)
  stop = onTick(render)
})

onUnmounted(() => {
  if (!enabled) return
  document.documentElement.classList.remove('has-cursor')
  window.removeEventListener('pointermove', onMove)
  document.removeEventListener('pointerover', onOver)
  document.documentElement.removeEventListener('pointerleave', onLeave)
  window.removeEventListener('pointerdown', onDown)
  window.removeEventListener('pointerup', onUp)
  stop?.()
})
</script>

<template>
  <div v-if="enabled" class="cursor" :class="[mode, { on: visible, down: pressed }]" aria-hidden="true">
    <div ref="ring" class="ring-pos">
      <div class="ring"><span class="lbl">{{ label }}</span></div>
    </div>
    <div ref="dot" class="dot-pos">
      <span class="h"></span><span class="v"></span>
      <span ref="xy" class="xy"></span>
    </div>
  </div>
</template>

<style scoped>
.cursor {
  position: fixed;
  inset: 0;
  z-index: 10000;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s var(--ease);
}
.cursor.on { opacity: 1; }
.cursor.text { opacity: 0; }

.ring-pos, .dot-pos {
  position: fixed;
  left: 0;
  top: 0;
  will-change: transform;
}

.ring {
  position: absolute;
  width: 36px;
  height: 36px;
  left: -18px;
  top: -18px;
  border: 1px solid var(--bone-28);
  border-radius: 50%;
  display: grid;
  place-items: center;
  transition:
    width 0.45s var(--ease), height 0.45s var(--ease),
    left 0.45s var(--ease), top 0.45s var(--ease),
    background 0.35s var(--ease), border-color 0.35s var(--ease),
    scale 0.25s var(--ease);
}
.lbl {
  font-family: var(--font-ui);
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink);
  opacity: 0;
  transition: opacity 0.25s var(--ease);
}

.cursor.link .ring {
  width: 56px; height: 56px; left: -28px; top: -28px;
  border-color: var(--gold);
  background: var(--gold-wash);
}
.cursor.label .ring {
  width: 92px; height: 92px; left: -46px; top: -46px;
  background: var(--gold-grad);
  border-color: transparent;
}
.cursor.label .lbl { opacity: 1; transition-delay: 0.1s; }
.cursor.down .ring { scale: 0.82; }

/* Crosshair */
.h, .v {
  position: absolute;
  background: var(--mark);
  transition: opacity 0.25s var(--ease);
}
.h { width: 15px; height: 1px; left: -7px; top: 0; }
.v { width: 1px; height: 15px; left: 0; top: -7px; }
.cursor.label .h, .cursor.label .v { opacity: 0; }

.xy {
  position: absolute;
  left: 16px;
  top: 12px;
  white-space: pre;
  font-family: var(--font-ui);
  font-size: 0.5625rem;
  letter-spacing: 0.08em;
  color: var(--bone-45);
  transition: opacity 0.25s var(--ease);
}
.cursor.label .xy, .cursor.link .xy { opacity: 0; }
</style>
