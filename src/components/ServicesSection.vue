<script setup>
import { ref } from 'vue'
import LineIcon from './LineIcon.vue'
import { services } from '../data/content'
import { photo } from '../data/photos'

// Cards show a one-line summary; the button opens the full description.
const openId = ref(null)
const toggle = (id) => (openId.value = openId.value === id ? null : id)
</script>

<template>
  <section class="services" id="services">
    <div class="container">
      <div class="index-rule" v-reveal>
        <span class="num">A-101</span>
        <span class="line"></span>
        <span class="label">What We Do</span>
      </div>
      <h2 class="section-title head" v-split>Building Spaces. <em>Delivering Excellence.</em></h2>

      <div class="cards">
        <article
          v-for="(s, i) in services"
          :key="s.id"
          :class="['card', { open: openId === s.id }]"
          v-reveal
        >
          <div class="media frame-media">
            <div class="rv">
              <img
                :src="photo(s.image).src"
                :srcset="photo(s.image).srcset"
                sizes="(min-width: 900px) 18vw, 40vw"
                :alt="photo(s.image).alt"
                loading="lazy"
                decoding="async"
                width="640"
                height="480"
              >
            </div>
          </div>

          <div class="body">
            <span class="idx num-display">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3>{{ s.title }}</h3>
            <p class="summary">{{ s.summary }}</p>
            <div class="more" :id="`svc-${s.id}`" :inert="openId !== s.id">
              <p>{{ s.description }}</p>
            </div>
          </div>

          <button
            class="toggle"
            :aria-expanded="openId === s.id"
            :aria-controls="`svc-${s.id}`"
            :aria-label="`${openId === s.id ? 'Hide' : 'Read more about'} ${s.title}`"
            @click="toggle(s.id)"
          >
            <LineIcon name="plus" />
          </button>
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
.head { max-width: none; margin-bottom: clamp(2.5rem, 5vw, 4rem); }

.cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.card {
  position: relative;
  display: grid;
  grid-template-columns: minmax(8rem, 0.75fr) 1.25fr;
  border: 1px solid var(--rule);
  background: var(--ink);
  transition: border-color 0.4s var(--ease);
}
.card:hover, .card.open { border-color: rgba(206, 164, 55, 0.5); }

.media { min-height: 11rem; background: var(--ink-2); }
/* No parallax here, so the image can fill the frame exactly */
.media > .rv { inset: 0; }
.media > .rv img { transform: none; }
.card:hover .media img { scale: 1.06; }

.body { padding: 1.4rem 3.75rem 1.4rem 1.5rem; }
.idx { font-size: 0.6875rem; color: var(--gold); letter-spacing: 0.1em; }
.body h3 { font-size: clamp(1rem, 1.4vw, 1.15rem); line-height: 1.25; margin: 0.4rem 0 0.6rem; }
.summary { margin: 0; font-size: 0.8125rem; line-height: 1.6; color: var(--bone-45); }

.more {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.5s var(--ease);
}
.more > p {
  overflow: hidden;
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: var(--bone-70);
}
.open .more { grid-template-rows: 1fr; }
.open .more > p { padding-top: 0.75rem; }

.toggle {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  display: grid;
  place-items: center;
  width: 2.1rem;
  height: 2.1rem;
  padding: 0;
  border: 1px solid rgba(206, 164, 55, 0.55);
  background: transparent;
  color: var(--gold);
  transition: background 0.3s var(--ease), color 0.3s var(--ease);
}
.toggle:hover { background: var(--gold); color: var(--ink); }
.toggle .line-icon { width: 1rem; height: 1rem; transition: rotate 0.4s var(--ease); }
.open .toggle .line-icon { rotate: 45deg; }

@media (max-width: 1000px) {
  .cards { grid-template-columns: 1fr; }
}
@media (max-width: 520px) {
  .card { grid-template-columns: 1fr; }
  .media { aspect-ratio: 16 / 9; min-height: 0; }
}
</style>
