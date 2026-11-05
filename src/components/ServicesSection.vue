<script setup>
import { services } from '../data/content'

import { photo } from '../data/photos'
</script>

<template>
  <section class="services" id="services">
    <div class="container">
      <div class="head">
        <div class="index-rule" v-reveal>
          <span class="num" v-scramble="150">A-101</span>
          <span class="line"></span>
          <span class="label" v-scramble="300">What We Do</span>
        </div>
        <h2 class="section-title" v-split>Construction and <em>interiors.</em></h2>
      </div>

      <div class="tracks">
        <article v-for="(service, i) in services" :key="service.id" class="track" v-reveal>
          <span class="ordinal num-display" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>

          <div class="media frame-media" v-reveal.clip v-tilt>
            <div class="rv" v-parallax="0.12">
              <img
                :src="photo(service.image).src"
                :srcset="photo(service.image).srcset"
                sizes="(min-width: 900px) 50vw, 100vw"
                :alt="photo(service.image).alt"
                loading="lazy"
                decoding="async"
                width="1200"
                height="900"
              >
            </div>
          </div>

          <div class="body">
            <h3>{{ service.title }}</h3>
            <p class="body-copy">{{ service.description }}</p>

            <ul class="caps" v-reveal.stagger>
              <li v-for="cap in service.capabilities" :key="cap">
                <span class="glyph" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
                <span>{{ cap }}</span>
              </li>
            </ul>

            <a href="#contact" class="link"><span>Enquire about {{ service.title.toLowerCase() }}</span><span class="arrow">→</span></a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services {
  padding: var(--section) 0;
  background: var(--ink-1);
  border-top: 1px solid var(--rule);
}
.head { margin-bottom: clamp(3rem, 6vw, 5rem); }

.tracks {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1.5rem, 3vw, 3rem);
}

.track {
  position: relative;
  border-top: 1px solid var(--rule);
  padding-top: 2rem;
  transition: border-color 0.5s var(--ease);
}
.track:hover { border-top-color: rgba(206, 164, 55, 0.5); }

.ordinal {
  position: absolute;
  top: 1.5rem;
  right: 0;
  font-size: clamp(3rem, 7vw, 6rem);
  line-height: 1;
  color: var(--bone);
  opacity: 0.05;
  pointer-events: none;
}

.media {
  aspect-ratio: 16 / 10;
  background: var(--ink-2);
  border: 1px solid var(--rule);
  margin-bottom: 2rem;
}
.track:hover .media img { scale: 1.06; }

.body h3 {
  font-size: clamp(1.6rem, 2.8vw, 2.35rem);
  margin-bottom: 1rem;
}

.caps { margin: 1.75rem 0; border-top: 1px solid var(--rule-soft); }
.caps li {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--rule-soft);
  font-size: 0.875rem;
  color: var(--bone-70);
}
.caps .glyph { width: 10px; height: 10px; gap: 2px; opacity: 0.8; }

@media (max-width: 900px) {
  .tracks { grid-template-columns: 1fr; gap: 3.5rem; }
}
</style>
