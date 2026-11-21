<script setup>
import LineIcon from './LineIcon.vue'
import { founder, story } from '../data/content'
import { photo } from '../data/photos'

const img = photo('selaiyur-2')
</script>

<template>
  <section class="story" id="story">
    <div class="container grid">
      <div class="left">
        <div class="index-rule" v-reveal>
          <span class="num">A-002</span>
          <span class="line"></span>
          <span class="label">About Us</span>
        </div>
        <h2 class="section-title" v-split>Our Story. <em>Our Vision.</em></h2>

        <div class="prose" v-reveal.stagger>
          <p v-for="(para, i) in story.paragraphs" :key="i" class="body-copy">{{ para }}</p>
        </div>

        <ul class="facts" v-reveal.stagger>
          <li v-for="f in story.facts" :key="f.label">
            <LineIcon :name="f.icon" />
            <span><strong>{{ f.value }}</strong>{{ f.label }}</span>
          </li>
        </ul>

        <div class="frame frame-media" v-reveal.clip>
          <div class="rv" v-parallax="0.12">
            <img :src="img.src" :srcset="img.srcset" sizes="(min-width: 1000px) 45vw, 100vw" :alt="img.alt" loading="lazy" decoding="async" width="1200" height="900">
          </div>
        </div>
      </div>

      <div class="right">
        <div class="vm" v-reveal>
          <span class="icon-box"><LineIcon name="binoculars" /></span>
          <div>
            <h3>Our <em>Vision</em></h3>
            <p class="body-copy">{{ story.vision }}</p>
          </div>
        </div>
        <div class="vm" v-reveal>
          <span class="icon-box"><LineIcon name="target" /></span>
          <div>
            <h3>Our <em>Mission</em></h3>
            <p class="body-copy">{{ story.mission }}</p>
          </div>
        </div>

        <article class="founder" v-reveal>
          <div class="founder-head">
            <img
              v-if="founder.photo"
              class="portrait"
              :src="photo(founder.photo).src"
              :alt="`${founder.name}, ${founder.role}`"
              width="96"
              height="96"
            >
            <span v-else class="portrait monogram" aria-hidden="true">
              {{ founder.initials }}
              <span class="ph">Add a photo of Mani</span>
            </span>
            <div>
              <p class="label">Our Founder</p>
              <h3 class="name">{{ founder.name }}</h3>
              <p class="role">{{ founder.role }}</p>
            </div>
          </div>
          <ul class="creds">
            <li v-for="c in founder.credentials" :key="c">{{ c }}</li>
          </ul>
          <p v-for="(para, i) in founder.bio" :key="i" class="body-copy">{{ para }}</p>
          <p class="sign"><span class="hand">{{ founder.signature }}</span><span class="sign-role">Founder, Aryan</span></p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.story {
  padding: var(--section) 0;
  background: var(--ink-1);
  border-top: 1px solid var(--rule);
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: clamp(2.5rem, 6vw, 6rem);
  align-items: start;
}
@media (min-width: 1000px) {
  .right { border-left: 1px solid var(--rule); padding-left: clamp(2rem, 4vw, 4rem); }
}

.prose { display: grid; gap: 1.1rem; margin-top: 1.75rem; }

.facts {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 2.25rem;
  margin: 2.25rem 0;
}
.facts li { display: flex; align-items: center; gap: 0.7rem; color: var(--gold); }
.facts span {
  display: flex;
  flex-direction: column;
  font-family: var(--font-ui);
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bone-45);
  line-height: 1.4;
}
.facts strong { color: var(--bone); font-size: 0.75rem; }

.frame {
  aspect-ratio: 16 / 10;
  border: 1px solid var(--rule);
  background: var(--ink-2);
}

.vm {
  display: grid;
  grid-template-columns: 3.5rem 1fr;
  gap: 1.25rem;
  padding-bottom: 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--rule);
}
.icon-box {
  display: grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  border: 1px solid var(--rule);
  color: var(--gold);
}
.vm h3 { font-family: var(--font-head); font-size: clamp(1.35rem, 2.2vw, 1.75rem); margin-bottom: 0.6rem; }
.vm h3 em { font-style: normal; color: var(--gold); }

.founder {
  position: relative;
  padding: clamp(1.75rem, 3vw, 2.5rem);
  border: 1px solid rgba(206, 164, 55, 0.55);
  border-radius: 10px;
  background: linear-gradient(160deg, var(--gold-wash), transparent 55%);
}
.founder-head { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 1.25rem; }
.portrait {
  position: relative;
  flex-shrink: 0;
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(206, 164, 55, 0.55);
}
.monogram {
  display: grid;
  place-items: center;
  font-family: var(--font-head);
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--gold);
  background: var(--gold-wash);
}
.monogram .ph { display: none; }
.review-mode .monogram .ph {
  display: block;
  position: absolute;
  top: 100%;
  left: 50%;
  translate: -50% 0.4rem;
  white-space: nowrap;
  font-family: var(--font-ui);
  font-size: 0.625rem;
  letter-spacing: 0.04em;
}
.founder .label { color: var(--bone-45); margin: 0 0 0.4rem; }
.sign { display: flex; align-items: baseline; gap: 0.9rem; margin: 1.5rem 0 0; }
.sign .hand { font-size: 2.1rem; font-weight: 600; transform: rotate(-4deg); display: inline-block; }
.sign-role { font-size: 0.6875rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--bone-28); }
.founder .name { font-family: var(--font-head); font-size: clamp(1.4rem, 2.6vw, 2rem); margin-bottom: 0.35rem; }
.role {
  margin: 0;
  font-family: var(--font-ui);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
}
.creds { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
.creds li {
  font-size: 0.6875rem;
  letter-spacing: 0.06em;
  padding: 0.3rem 0.65rem;
  border: 1px solid var(--rule);
  color: var(--bone-70);
}
.founder .body-copy + .body-copy { margin-top: 0.9rem; }

@media (max-width: 999px) {
  .grid { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .founder-head { gap: 1rem; }
  .portrait { width: 3.75rem; height: 3.75rem; }
  .monogram { font-size: 1.05rem; }
  .founder .name { font-size: 1.3rem; }
  .role { letter-spacing: 0.14em; }
}
</style>
