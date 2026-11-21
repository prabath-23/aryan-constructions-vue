<script setup>
import LineIcon from './LineIcon.vue'
import { coreValues } from '../data/content'
import { photo } from '../data/photos'

const img = photo('why')
</script>

<template>
  <section class="why" id="why">
    <div class="container grid">
      <div class="head">
        <div class="index-rule" v-reveal>
          <span class="num">A-401</span>
          <span class="line"></span>
          <span class="label">Why Aryan</span>
        </div>
        <h2 class="section-title" v-split>Why Choose <em>Aryan?</em></h2>
        <p class="lede" v-reveal>Built on Trust. Driven by Quality.</p>

        <div class="frame frame-media" v-reveal.clip>
          <div class="rv" v-parallax="0.12">
            <img :src="img.src" :srcset="img.srcset" sizes="(min-width: 1000px) 40vw, 100vw" :alt="img.alt" loading="lazy" decoding="async" width="1200" height="900">
          </div>
        </div>
      </div>

      <div>
        <p class="label list-label" v-reveal>Our Core Values</p>
        <ul class="points">
          <li v-for="(v, i) in coreValues" :key="v.title" class="point" v-reveal>
            <span class="idx-wrap">
              <!-- a hand-drawn redline circle, like a reviewer marking the item -->
              <svg class="ring" viewBox="0 0 64 44" aria-hidden="true">
                <path pathLength="1" d="M10 25 C 6 12, 24 4, 38 5 C 55 6, 62 17, 57 28 C 52 38, 31 41, 17 37 C 7 34, 5 25, 14 16" />
              </svg>
              <span class="idx num-display">{{ String(i + 1).padStart(2, '0') }}</span>
            </span>
            <span class="icon-box"><LineIcon :name="v.icon" /></span>
            <div class="text">
              <h3>{{ v.title }}</h3>
              <p class="body-copy">{{ v.description }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.why { padding: var(--section) 0; }
.grid {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: clamp(2.5rem, 6vw, 6rem);
  align-items: start;
}

@media (min-width: 1000px) {
  .head { position: sticky; top: 7rem; }
}
.lede { margin: 1.25rem 0 2.5rem; color: var(--bone-70); }
.frame {
  aspect-ratio: 4 / 3;
  border: 1px solid var(--rule);
  background: var(--ink-2);
}

.list-label { margin: 0 0 0.5rem; color: var(--bone-45); }
.points { border-top: 1px solid var(--rule); }
.point {
  display: grid;
  grid-template-columns: 4.25rem 3.25rem 1fr;
  align-items: center;
  gap: 1.25rem;
  padding: clamp(1.4rem, 2.6vw, 2rem) 0;
  border-bottom: 1px solid var(--rule);
}
.idx-wrap {
  position: relative;
  display: grid;
  place-items: center;
  width: 3.4rem;
  height: 2.4rem;
}
.idx {
  position: relative;
  font-size: 0.875rem;
  color: var(--gold);
  letter-spacing: 0.08em;
}
.ring {
  position: absolute;
  inset: -0.2rem -0.3rem;
  width: calc(100% + 0.6rem);
  height: calc(100% + 0.4rem);
  overflow: visible;
}
.ring path {
  fill: none;
  stroke: var(--mark);
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}
.point.is-visible .ring path {
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 1s var(--ease-out) 0.35s;
}
/* Redraw on hover */
.point:hover .ring path { animation: redraw 0.8s var(--ease-out); }
@keyframes redraw {
  from { stroke-dashoffset: 1; }
  to { stroke-dashoffset: 0; }
}

.icon-box {
  display: grid;
  place-items: center;
  width: 3.25rem;
  height: 3.25rem;
  border: 1px solid var(--rule);
  color: var(--bone-70);
  transition: color 0.4s var(--ease), border-color 0.4s var(--ease);
}
.point:hover .icon-box { color: var(--gold); border-color: rgba(206, 164, 55, 0.5); }

.text h3 {
  font-size: clamp(1.1rem, 1.8vw, 1.35rem);
  margin-bottom: 0.35rem;
  transition: translate 0.5s var(--ease);
}
.point:hover h3 { translate: 6px 0; }
.text .body-copy { margin: 0; }

@media (max-width: 999px) {
  .grid { grid-template-columns: 1fr; gap: 2.5rem; }
}
@media (max-width: 560px) {
  .point { grid-template-columns: 3.75rem 1fr; gap: 0.85rem 1rem; }
  .icon-box { display: none; }
}
</style>
