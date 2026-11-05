<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useLightbox } from '../composables/useLightbox'

import { photo } from '../data/photos'

const { state, close, step } = useLightbox()
const current = computed(() => photo(state.project.images[state.index]))
const categoryLabels = { home: 'Home', interiors: 'Interiors', design: '3D Design' }
const images = computed(() => state.project?.images ?? [])

// Which way the next photo comes in: 0 is the wipe on opening, otherwise it
// slides in from the side it was asked for.
const dir = ref(0)
function go(by) {
  dir.value = by
  step(by)
}
function goTo(i) {
  dir.value = i > state.index ? 1 : -1
  state.index = i
}

// Fetch the neighbours ahead of time so a swipe never lands on an empty frame.
function preload(i) {
  const count = images.value.length
  const next = photo(images.value[(i + count) % count])
  const img = new Image()
  img.sizes = '(min-width: 820px) 60vw, 100vw'
  img.srcset = next.srcset
  img.src = next.src
}

// Swipe: the photo follows the finger, and a long enough or quick enough flick
// changes it. Vertical drags are left to the browser (touch-action: pan-y) so
// the details below the photo still scroll on a phone.
const dragX = ref(0)
const dragging = ref(false)
let touch = null

function onTouchStart(e) {
  if (e.touches.length !== 1 || e.target.closest('button')) {
    touch = null
    return
  }
  touch = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: e.timeStamp, axis: null }
}
function onTouchMove(e) {
  if (!touch || e.touches.length !== 1) return
  const dx = e.touches[0].clientX - touch.x
  const dy = e.touches[0].clientY - touch.y
  if (!touch.axis && Math.hypot(dx, dy) > 8) touch.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
  if (touch.axis !== 'x') return
  dragging.value = true
  // With only one photo it stretches a little and springs back
  dragX.value = images.value.length > 1 ? dx : dx * 0.25
}
function onTouchEnd(e) {
  const dx = dragX.value
  const quick = touch && Math.abs(dx) > 24 && e.timeStamp - touch.t < 250
  const far = Math.abs(dx) > Math.min(70, e.currentTarget.clientWidth * 0.18)
  dragging.value = false
  dragX.value = 0
  if (touch?.axis === 'x' && images.value.length > 1 && (far || quick)) go(dx < 0 ? 1 : -1)
  touch = null
}
const panel = ref(null)
const closeBtn = ref(null)
let lastFocused = null

watch(
  () => state.isOpen,
  (isOpen) => {
    if (isOpen) {
      dir.value = 0
      lastFocused = document.activeElement
      requestAnimationFrame(() => closeBtn.value?.focus())
    } else if (lastFocused) {
      lastFocused.focus()
    }
  }
)

function onKeydown(e) {
  if (!state.isOpen) return
  if (e.key === 'Escape') {
    close()
    return
  }
  if (e.key === 'ArrowRight') go(1)
  if (e.key === 'ArrowLeft') go(-1)
  // Keep tabbing inside the dialog while it's open.
  if (e.key === 'Tab' && panel.value) {
    const items = panel.value.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')
    if (!items.length) return
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

watch(
  () => [state.isOpen, state.index],
  ([isOpen, i]) => {
    if (!isOpen || images.value.length < 2) return
    preload(i + 1)
    preload(i - 1)
  }
)

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div
    class="lightbox"
    :class="{ open: state.isOpen }"
    role="dialog"
    aria-modal="true"
    :aria-hidden="!state.isOpen"
    aria-labelledby="lbTitle"
    @click.self="close"
  >
    <div ref="panel" class="panel" v-if="state.project" data-lenis-prevent>
      <button ref="closeBtn" class="close" aria-label="Close" @click="close">
        <span aria-hidden="true">✕</span>
      </button>

      <div
        class="media"
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="onTouchEnd"
      >
        <img
          :key="current.src"
          :class="{ 'from-right': dir > 0, 'from-left': dir < 0, dragging }"
          :style="dragX ? { transform: `translateX(${dragX}px)` } : undefined"
          :src="current.src"
          :srcset="current.srcset"
          sizes="(min-width: 820px) 60vw, 100vw"
          :alt="current.alt"
          draggable="false"
        >
        <template v-if="state.project.images.length > 1">
          <button class="nav prev" aria-label="Previous photo" @click="go(-1)">←</button>
          <button class="nav next" aria-label="Next photo" @click="go(1)">→</button>
          <span class="count num-display">{{ state.index + 1 }} / {{ state.project.images.length }}<span class="hint"> · Swipe</span></span>
        </template>
      </div>

      <div class="body">
        <span :class="['cat', state.project.category]">{{ categoryLabels[state.project.category] }}</span>
        <h3 id="lbTitle">{{ state.project.title }}</h3>
        <p class="loc">{{ state.project.client }}</p>
        <p class="body-copy">{{ state.project.description }}</p>

        <div v-if="state.project.images.length > 1" class="thumbs">
          <button
            v-for="(key, i) in state.project.images"
            :key="key"
            :class="['thumb', { active: i === state.index }]"
            :aria-label="`Show photo ${i + 1}`"
            :aria-current="i === state.index ? 'true' : undefined"
            @click="goTo(i)"
          >
            <img :src="photo(key).src" :srcset="photo(key).srcset" sizes="80px" alt="" loading="lazy" decoding="async">
          </button>
        </div>

        <a href="#contact" class="link" @click="close">
          <span>Start a similar project</span><span class="arrow">→</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  padding: clamp(1rem, 4vw, 3rem);
  background: rgba(6, 6, 5, 0.92);
  backdrop-filter: blur(6px);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.4s var(--ease), visibility 0.4s;
}
.lightbox.open { opacity: 1; visibility: visible; }

.panel {
  position: relative;
  width: min(1100px, 100%);
  max-height: 88vh;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  background: var(--ink-1);
  border: 1px solid var(--rule);
  transform: translateY(14px);
  transition: transform 0.5s var(--ease-out);
}
.lightbox.open .panel { transform: none; }

.media { position: relative; overflow: hidden; background: var(--ink-2); height: 88vh; touch-action: pan-y; }
/* Shown whole, not cropped: this is the place to see the full photo */
.media > img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  transition: transform 0.25s var(--ease-out); /* springs back if a swipe falls short */
}
.media > img.dragging { transition: none; }
/* The image wipes in on open, the same plotter reveal as the page frames */
/* Fill backwards only: a finished animation mustn't hold the transform, or the
   photo couldn't follow the finger. */
.lightbox.open .media > img { animation: lbWipe 0.7s var(--ease-out) backwards; }
.lightbox.open .media > img.from-right { animation: lbFromRight 0.32s var(--ease-out) backwards; }
.lightbox.open .media > img.from-left { animation: lbFromLeft 0.32s var(--ease-out) backwards; }
@keyframes lbFromRight { from { opacity: 0.2; transform: translateX(14%); } }
@keyframes lbFromLeft { from { opacity: 0.2; transform: translateX(-14%); } }
@keyframes lbWipe {
  from { clip-path: inset(0 0 100% 0); transform: scale(1.12); }
  to { clip-path: inset(0 0 0 0); transform: none; }
}

.body {
  padding: clamp(1.75rem, 3.5vw, 3rem);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.85rem;
}
.cat {
  font-size: 0.5625rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--bone-28);
  padding-bottom: 0.5rem;
}
.cat.home { color: var(--gold); }

.body h3 {
  font-size: clamp(1.5rem, 2.6vw, 2.1rem);
  margin: 0;
}
.loc { margin: 0; font-size: 0.8125rem; color: var(--bone-28); letter-spacing: 0.04em; }
.nav {
  position: absolute;
  top: 50%;
  width: 2.75rem; height: 2.75rem;
  margin-top: -1.375rem;
  background: rgba(8, 8, 7, 0.7);
  border: 1px solid var(--rule);
  color: var(--bone);
  transition: color 0.3s var(--ease), border-color 0.3s var(--ease);
}
.nav:hover { color: var(--gold); border-color: var(--gold); }
.prev { left: 0.85rem; }
.next { right: 0.85rem; }
.count {
  position: absolute;
  left: 0.85rem; bottom: 0.85rem;
  padding: 0.25rem 0.55rem;
  background: rgba(8, 8, 7, 0.7);
  font-size: 0.75rem;
  color: var(--bone-70);
}
.hint { display: none; }
@media (hover: none) { .hint { display: inline; } }

.thumbs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.4rem;
  width: 100%;
  margin-top: 0.5rem;
}
.thumb {
  aspect-ratio: 1;
  padding: 0;
  border: 1px solid var(--rule);
  background: var(--ink-2);
  overflow: hidden;
  opacity: 0.6;
  transition: opacity 0.3s var(--ease), border-color 0.3s var(--ease);
}
.thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.thumb:hover { opacity: 1; }
.thumb.active { opacity: 1; border-color: var(--gold); }
.body .link { margin-top: auto; padding-top: 1.5rem; }

.close {
  position: absolute;
  top: 0.85rem; right: 0.85rem;
  z-index: 2;
  width: 2.75rem; height: 2.75rem;
  background: rgba(8, 8, 7, 0.7);
  border: 1px solid var(--rule);
  border-radius: 50%;
  color: var(--bone-70);
  font-size: 0.8rem;
  transition: color 0.3s var(--ease), border-color 0.3s var(--ease), transform 0.3s var(--ease);
}
.close:hover { color: var(--gold); border-color: var(--gold); transform: rotate(90deg); }

@media (max-width: 820px) {
  .panel { grid-template-columns: 1fr; }
  .media { height: 58vh; }
}
</style>
