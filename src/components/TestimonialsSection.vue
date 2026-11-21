<script setup>
import { featuredQuote, reviewSummary, siteInfo, testimonials } from '../data/content'

const initials = (name) => name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
</script>

<template>
  <section class="testimonials" id="testimonials">
    <div class="container">
      <div class="index-rule" v-reveal>
        <span class="num">A-501</span>
        <span class="line"></span>
        <span class="label">Client Testimonials</span>
      </div>

      <div class="head">
        <h2 class="section-title" v-split>What Our <em>Clients Say.</em></h2>
        <a :href="siteInfo.mapsHref" target="_blank" rel="noopener" class="rating" v-reveal>
          <span class="stars" aria-hidden="true">★★★★★</span>
          <span><strong>{{ reviewSummary.rating }}</strong> on Google · {{ reviewSummary.count }} reviews</span>
        </a>
      </div>

      <figure class="featured" v-reveal>
        <blockquote>“{{ featuredQuote.quote }}”</blockquote>
        <figcaption class="hand hand-tilt">{{ featuredQuote.author }}, about their new home</figcaption>
      </figure>

      <ul class="cards" v-reveal.stagger>
        <li v-for="t in testimonials" :key="t.author" class="card">
          <span class="stars" aria-label="5 out of 5 stars">★★★★★</span>
          <p class="quote">“{{ t.quote }}”</p>
          <div class="who">
            <span class="avatar" aria-hidden="true">{{ initials(t.author) }}</span>
            <span>
              <strong>{{ t.author }}</strong>
              <span class="meta">{{ t.meta }}</span>
            </span>
          </div>
        </li>
      </ul>

      <a :href="siteInfo.mapsHref" target="_blank" rel="noopener" class="link all" v-reveal>
        <span>Read all the reviews on Google</span><span class="arrow">→</span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.testimonials {
  padding: var(--section) 0;
  border-top: 1px solid var(--rule);
  background: var(--ink-1);
}

.head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem 3rem;
  flex-wrap: wrap;
}
.rating {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: var(--bone-70);
}
.rating strong { color: var(--bone); }
.stars { color: var(--gold); letter-spacing: 0.15em; font-size: 0.875rem; }

.featured {
  margin: clamp(2.5rem, 6vw, 4.5rem) 0;
  max-width: 46rem;
}
.featured blockquote {
  margin: 0 0 1rem;
  font-family: var(--font-body);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(1.5rem, 3.2vw, 2.4rem);
  line-height: 1.3;
  color: var(--bone);
}
.featured figcaption { font-size: 1.5rem; }

.cards {
  display: grid;
  grid-template-columns: 1.25fr 1fr 1fr;
  gap: 1rem;
  align-items: start;
}
.card {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: clamp(1.5rem, 2.5vw, 2rem);
  border: 1px solid var(--rule);
  border-radius: 10px;
  background: var(--ink);
}
.quote { margin: 0; font-size: 0.9375rem; line-height: 1.7; color: var(--bone-70); }
.who { display: flex; align-items: center; gap: 0.85rem; }
.avatar {
  display: grid;
  place-items: center;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 50%;
  background: var(--gold-wash);
  border: 1px solid rgba(206, 164, 55, 0.4);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--gold);
}
.who strong { display: block; font-size: 0.9375rem; font-weight: 600; color: var(--bone); }
.meta { font-size: 0.75rem; color: var(--bone-45); }

.all { margin-top: 2.5rem; }

@media (max-width: 960px) {
  .cards { grid-template-columns: 1fr; }
}
</style>
