<script setup>
import { photo } from '../data/photos'

const img = photo('about')
</script>

<template>
  <section class="about" id="about">
    <div class="container">
      <div class="index-rule" v-reveal>
        <span class="num" v-scramble="150">A-001</span>
        <span class="line"></span>
        <span class="label" v-scramble="300">Who We Are</span>
      </div>

      <div class="grid">
        <div class="copy">
          <h2 class="section-title" v-split>A small team. <em>Careful work.</em></h2>

          <div class="prose" v-reveal.stagger>
            <p class="body-copy">
              Aryan Constructions &amp; Interiors is run by Er. Manikandan M, a registered CMDA construction
              engineer, from our office on GST Road, Vandalur. We build independent houses and villas
              across Chennai, and do the interiors too.
            </p>
            <p class="body-copy">
              You deal with the same people from the first site visit to handover, and if your plans
              change along the way, we work with that.
            </p>
            <a href="#portfolio" class="link"><span>View the portfolio</span><span class="arrow">→</span></a>
          </div>
        </div>

        <figure class="media">
          <div class="frame frame-media" v-reveal.clip v-tilt>
            <div class="rv" v-parallax="0.14">
              <img :src="img.src" :srcset="img.srcset" sizes="(min-width: 1000px) 55vw, 100vw" :alt="img.alt" loading="lazy" decoding="async" width="1200" height="900">
            </div>
          </div>
          <figcaption v-reveal>
            <span class="glyph" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
            <span>Nedungundram Site, Chennai</span>
          </figcaption>
        </figure>
      </div>

      <blockquote class="pull">
        <p v-split>“The interior design is also done by them with good quality.”</p>
        <cite v-reveal>Krishna Balan, Google review</cite>
      </blockquote>
    </div>
  </section>
</template>

<style scoped>
.about { padding: var(--section) 0; }

.grid {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: clamp(2.5rem, 7vw, 7rem);
  align-items: start;
}

.prose { display: grid; gap: 1.5rem; justify-items: start; margin-top: 2rem; }

.media { margin: 0; position: relative; }
/* Lift the image out of the text baseline — asymmetry keeps it from reading
   like a two-column template. */
@media (min-width: 1000px) { .media { margin-top: -5rem; } }

.frame {
  aspect-ratio: 4 / 3;
  border: 1px solid var(--rule);
  background: var(--ink-1);
}

figcaption {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-top: 1rem;
  font-size: 0.6875rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bone-28);
}

.pull {
  margin: clamp(3.5rem, 9vw, 7rem) 0 0;
  padding-top: clamp(2rem, 4vw, 3rem);
  border-top: 1px solid var(--rule);
  max-width: 60rem;
}
.pull p {
  font-family: var(--font-head);
  font-size: clamp(1.4rem, 3.2vw, 2.5rem);
  font-weight: 400;
  font-style: italic;
  line-height: 1.22;
  letter-spacing: -0.02em;
  margin: 0 0 1.5rem;
  color: var(--bone-70);
  max-width: 24ch;
}
.pull cite {
  font-style: normal;
  font-size: 0.6875rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--gold);
}

@media (max-width: 999px) {
  .grid { grid-template-columns: 1fr; gap: 2.5rem; }
}
</style>
