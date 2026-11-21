<script setup>
import { photo } from '../data/photos'
import { intro } from '../data/content'

const img = photo('about')
</script>

<template>
  <section class="about" id="about">
    <div class="container">
      <div class="grid">
        <div class="copy">
          <div class="index-rule" v-reveal>
            <span class="num">A-001</span>
            <span class="line"></span>
            <span class="label">Who We Are</span>
          </div>
          <h2 class="section-title" v-split>Built on Trust. <em>Driven by Excellence.</em></h2>

          <div class="prose" v-reveal.stagger>
            <p v-for="(para, i) in intro.paragraphs" :key="i" class="body-copy">{{ para }}</p>
            <a href="#portfolio" class="link"><span>View our projects</span><span class="arrow">→</span></a>
          </div>
        </div>

        <figure class="media">
          <div class="frame frame-media" v-reveal.clip>
            <div class="rv" v-parallax="0.14">
              <img :src="img.src" :srcset="img.srcset" sizes="(min-width: 1000px) 50vw, 100vw" :alt="img.alt" loading="lazy" decoding="async" width="1200" height="900">
            </div>
          </div>
          <figcaption v-reveal>
            <svg class="squiggle" viewBox="0 0 40 24" aria-hidden="true"><path d="M2 20 C 10 4, 24 2, 36 8 M30 3 L37 8 L30 13" /></svg>
            <span class="hand hand-tilt">Mrs. Venkata Lakshmi's home, Nedungundram</span>
          </figcaption>
        </figure>
      </div>

      <p class="tagline" v-split>{{ intro.tagline }}</p>
    </div>
  </section>
</template>

<style scoped>
.about { padding: var(--section) 0; }

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: clamp(2.5rem, 7vw, 7rem);
}

.prose { display: grid; gap: 1.5rem; justify-items: start; margin-top: 2rem; }

.media { margin: 0; position: relative; }

.frame {
  aspect-ratio: 4 / 3;
  border: 1px solid var(--rule);
  background: var(--ink-1);
}

figcaption {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 1rem;
}
.squiggle { width: 2.25rem; height: 1.4rem; flex-shrink: 0; transform: scaleY(-1); }
.squiggle path { fill: none; stroke: var(--gold); stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }

.tagline {
  margin: clamp(3.5rem, 8vw, 6rem) 0 0;
  padding-top: clamp(2rem, 4vw, 3rem);
  border-top: 1px solid var(--rule);
  font-family: var(--font-body);
  font-style: italic;
  font-size: clamp(1.3rem, 2.6vw, 2rem);
  line-height: 1.35;
  color: var(--bone-70);
  max-width: 36ch;
}

@media (max-width: 999px) {
  .grid { grid-template-columns: 1fr; gap: 2.5rem; }
}
</style>
