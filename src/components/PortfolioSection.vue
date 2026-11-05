<script setup>
import { computed, ref } from 'vue'
import { projects } from '../data/content'
import { useLightbox } from '../composables/useLightbox'
import { refreshMotion } from '../motion'

import { photo } from '../data/photos'

const categoryLabels = { home: 'Homes', interiors: 'Interiors', design: '3D Designs' }
const activeFilter = ref('all')
const cover = (project) => photo(project.cover || project.images[0])
const filters = computed(() => [
  { value: 'all', label: 'All', count: projects.length },
  ...Object.entries(categoryLabels).map(([value, label]) => ({
    value,
    label,
    count: projects.filter((p) => p.category === value).length,
  })),
])

const filtered = computed(() =>
  activeFilter.value === 'all' ? projects : projects.filter((p) => p.category === activeFilter.value)
)

const { open } = useLightbox()

// The pinned Process section sits below this grid; when a filter changes the
// grid's height, its scroll positions must be recalculated.
const onLayoutChange = () => refreshMotion()
</script>

<template>
  <section class="portfolio" id="portfolio">
    <div class="container">
      <div class="head">
        <div>
          <div class="index-rule" v-reveal>
            <span class="num" v-scramble="150">A-201</span>
            <span class="line"></span>
            <span class="label" v-scramble="300">Selected Work</span>
          </div>
          <h2 class="section-title" v-split>Recent <em>sites.</em></h2>
        </div>

        <div class="filters" v-reveal role="tablist" aria-label="Filter projects">
          <button
            v-for="f in filters"
            :key="f.value"
            role="tab"
            :aria-selected="activeFilter === f.value"
            :class="['filter', { active: activeFilter === f.value }]"
            @click="activeFilter = f.value"
          >
            <span v-scramble.hover>{{ f.label }}</span><sup>{{ f.count }}</sup>
          </button>
        </div>
      </div>

      <transition-group
        tag="div"
        name="proj"
        class="grid"
        @after-enter="onLayoutChange"
        @after-leave="onLayoutChange"
      >
        <article
          v-for="(project, i) in filtered"
          :key="project.id"
          :class="['card', { feature: i === 0 }]"
          v-reveal
        >
          <button class="trigger" :aria-label="`Open photos of ${project.title}, ${project.client}`" @click="open(project)">
            <span class="frame frame-media" v-reveal.clip v-tilt data-cursor="View">
              <span class="rv" v-parallax="0.1">
                <img
                  :src="cover(project).src"
                  :srcset="cover(project).srcset"
                  :sizes="i === 0 ? '(min-width: 900px) 66vw, (min-width: 560px) 50vw, 100vw' : '(min-width: 900px) 33vw, (min-width: 560px) 50vw, 100vw'"
                  :alt="cover(project).alt"
                  loading="lazy"
                  decoding="async"
                >
              </span>
              <span class="scan" aria-hidden="true"></span>
              <span class="view"><span class="arrow">↗</span></span>
            </span>

            <span class="meta">
              <span class="meta-main">
                <span class="idx num-display">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="text">
                  <strong>{{ project.title }}</strong>
                  <em>{{ project.client }}</em>
                </span>
              </span>
              <span :class="['cat', project.category]">{{ categoryLabels[project.category] }} · {{ project.images.length }}</span>
            </span>
          </button>
        </article>
      </transition-group>
    </div>
  </section>
</template>

<style scoped>
.portfolio { padding: var(--section) 0; }

.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
}

.filters { display: flex; flex-wrap: wrap; gap: 0.75rem 1.75rem; padding-bottom: 0.5rem; }
.filter {
  background: none;
  border: 0;
  padding: 0 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bone-28);
  position: relative;
  white-space: nowrap;
  transition: color 0.35s var(--ease);
}
.filter sup { font-size: 0.6em; margin-left: 0.35em; font-variant-numeric: tabular-nums; }
.filter::after {
  content: "";
  position: absolute;
  left: 0; bottom: 0;
  width: 100%; height: 1px;
  background: var(--gold-grad);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.45s var(--ease);
}
.filter:hover { color: var(--bone-70); }
.filter.active { color: var(--bone); }
.filter.active::after { transform: scaleX(1); transform-origin: left; }

.grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: clamp(1.5rem, 3vw, 2.75rem) clamp(1.25rem, 2.5vw, 2rem);
}
.card { grid-column: span 2; }
/* First item runs wider so the grid has a focal point rather than nine equal tiles */
.card.feature { grid-column: span 4; }

/* Filter switching: surviving cards slide to their new grid position (Vue's
   FLIP), entering/leaving ones fade and lift instead of popping in place. */
.proj-move {
  transition: transform 0.5s var(--ease-out);
}
.proj-enter-active {
  transition: opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out);
}
.proj-leave-active {
  transition: opacity 0.35s var(--ease), transform 0.35s var(--ease);
  /* Pulled out of grid flow while leaving so the remaining cards can slide
     into place immediately rather than waiting for it to finish fading. */
  position: absolute;
}
.proj-enter-from { opacity: 0; transform: translateY(18px) scale(0.97); }
.proj-leave-to { opacity: 0; transform: scale(0.96); }

.trigger {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  text-align: left;
}

.frame {
  display: block;
  /* Most site photos are upright phone shots. The feature card is the height
     of its upright neighbour, so the row lines up. */
  aspect-ratio: 4 / 5;
  background: var(--ink-1);
  border: 1px solid var(--rule);
}
.feature .frame { aspect-ratio: 5 / 3; }
.rv { display: block; }
.trigger:hover img { scale: 1.07; }

/* Hover: a blueprint grid washes over the image while a scan line sweeps
   down it, like a drawing being checked. */
.scan {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0;
  background:
    linear-gradient(to bottom, transparent 30%, rgba(206, 164, 55, 0.22) 49.5%, var(--gold) 50%, transparent 50.5%) 0 -10% / 100% 200% no-repeat,
    linear-gradient(var(--rule) 1px, transparent 1px) 0 0 / 28px 28px,
    linear-gradient(90deg, var(--rule) 1px, transparent 1px) 0 0 / 28px 28px;
  transition: opacity 0.4s var(--ease);
}
.trigger:hover .scan { opacity: 1; animation: scan 1.4s var(--ease-out) forwards; }
@keyframes scan {
  from { background-position: 0 100%, 0 0, 0 0; }
  to { background-position: 0 -10%, 0 0, 0 0; }
}

/* The arrow badge is for touch/keyboard; with the custom cursor the cursor
   itself says "View". */
.has-cursor .view { display: none; }

.view {
  position: absolute;
  right: 1rem; bottom: 1rem;
  width: 2.75rem; height: 2.75rem;
  display: grid;
  place-items: center;
  background: var(--gold-grad);
  color: var(--ink);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.45s var(--ease), transform 0.45s var(--ease);
}
.trigger:hover .view, .trigger:focus-visible .view { opacity: 1; transform: none; }

.meta {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 1px solid var(--rule);
  transition: border-color 0.45s var(--ease);
}
.trigger:hover .meta { border-top-color: rgba(206, 164, 55, 0.45); }

.meta-main { display: flex; gap: 0.9rem; }
.idx { font-size: 0.75rem; color: var(--gold); padding-top: 0.2rem; }
.text { display: flex; flex-direction: column; gap: 0.15rem; }
.text strong {
  font-family: var(--font-head);
  font-weight: 600;
  font-size: 1.15rem;
  letter-spacing: -0.01em;
}
.text em { font-style: normal; font-size: 0.75rem; color: var(--bone-28); letter-spacing: 0.04em; }

.cat {
  font-size: 0.5625rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bone-28);
  white-space: nowrap;
  padding-top: 0.3rem;
}
.cat.home { color: var(--gold); }

@media (max-width: 900px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
  .card, .card.feature { grid-column: span 1; }
  .feature .frame { aspect-ratio: 4 / 5; }
  .head { align-items: flex-start; }
}
@media (max-width: 560px) {
  .grid { grid-template-columns: 1fr; }
  .filters { gap: 1.25rem; }
}
</style>
