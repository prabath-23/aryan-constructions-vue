<script setup>
import { whyPoints } from '../data/content'
</script>

<template>
  <section class="why" id="why">
    <div class="container grid">
      <div class="head">
        <div class="index-rule" v-reveal>
          <span class="num" v-scramble="150">A-401</span>
          <span class="line"></span>
          <span class="label" v-scramble="300">Why Aryan</span>
        </div>
        <h2 class="section-title" v-split>What you can <em>expect.</em></h2>
      </div>

      <ul class="points">
        <li v-for="(point, i) in whyPoints" :key="point.title" class="point" v-reveal>
          <span class="idx-wrap">
            <!-- a hand-drawn redline circle, like a reviewer marking the item -->
            <svg class="ring" viewBox="0 0 64 44" aria-hidden="true">
              <path pathLength="1" d="M10 25 C 6 12, 24 4, 38 5 C 55 6, 62 17, 57 28 C 52 38, 31 41, 17 37 C 7 34, 5 25, 14 16" />
            </svg>
            <span class="idx num-display">{{ String(i + 1).padStart(2, '0') }}</span>
          </span>
          <div>
            <h3>{{ point.title }}</h3>
            <p class="body-copy">{{ point.description }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.why { padding: var(--section) 0; }
.grid {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: clamp(2.5rem, 6vw, 6rem);
  align-items: start;
}

@media (min-width: 1000px) {
  .head { position: sticky; top: 8rem; }
}

.points { border-top: 1px solid var(--rule); }
.point {
  display: grid;
  grid-template-columns: 4.5rem 1fr;
  gap: 1.25rem;
  padding: clamp(1.75rem, 3vw, 2.5rem) 0;
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

.point h3 {
  font-size: clamp(1.2rem, 2vw, 1.55rem);
  margin-bottom: 0.5rem;
  transition: translate 0.5s var(--ease);
}
.point:hover h3 { translate: 6px 0; }

@media (max-width: 999px) {
  .grid { grid-template-columns: 1fr; gap: 2.5rem; }
}
@media (max-width: 560px) {
  .point { grid-template-columns: 3.75rem 1fr; gap: 0.85rem; }
}
</style>
