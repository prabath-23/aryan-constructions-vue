<script setup>
import LineIcon from './LineIcon.vue'
import { team } from '../data/content'
</script>

<template>
  <section class="team" id="team">
    <div class="container">
      <div class="grid">
        <div class="copy">
          <div class="index-rule" v-reveal>
            <span class="num" v-scramble="150">A-003</span>
            <span class="line"></span>
            <span class="label" v-scramble="300">Our Team</span>
          </div>
          <h2 class="section-title" v-split>A Team That <em>Turns Ideas Into Reality.</em></h2>
          <div class="prose" v-reveal.stagger>
            <p v-for="(para, i) in team.paragraphs" :key="i" class="body-copy">{{ para }}</p>
          </div>
        </div>

        <div class="structure">
          <p class="label" v-reveal>Our Team Structure</p>
          <ul class="cards" v-reveal.stagger>
            <li v-for="(t, i) in team.structure" :key="t.title" class="card">
              <LineIcon :name="t.icon" />
              <span class="idx num-display">{{ String(i + 1).padStart(2, '0') }}</span>
              <h3>{{ t.title }}</h3>
              <p>{{ t.text }}</p>
            </li>
          </ul>
        </div>
      </div>

      <p class="motto" v-reveal>
        <span>Strong Foundations. Skilled Teams. <em>Thoughtful Designs.</em></span>
        <span class="rule" aria-hidden="true"></span>
      </p>
    </div>
  </section>
</template>

<style scoped>
.team { padding: var(--section) 0; }

.grid {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: clamp(2.5rem, 6vw, 6rem);
  align-items: start;
}
.prose { display: grid; gap: 1.1rem; margin-top: 1.75rem; }

.structure > .label { margin: 0 0 1.25rem; color: var(--bone-45); }

/* Six-column grid: three cards on the first row, two wider ones below,
   as in the client's layout. */
.cards {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
}
.card {
  grid-column: span 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  padding: 1.75rem 1.25rem;
  border: 1px solid var(--rule);
  background: var(--ink-1);
  transition: border-color 0.4s var(--ease), background 0.4s var(--ease);
}
.card:nth-child(n + 4) { grid-column: span 3; }
.card:hover { border-color: rgba(206, 164, 55, 0.5); background: var(--ink-2); }
.card .line-icon { width: 2.4rem; height: 2.4rem; color: var(--gold); stroke-width: 1.2; margin-bottom: 0.5rem; }
.idx { font-size: 0.6875rem; color: var(--gold); letter-spacing: 0.1em; }
.card h3 { font-size: 1rem; line-height: 1.25; }
.card p { margin: 0.25rem 0 0; font-size: 0.8125rem; line-height: 1.55; color: var(--bone-45); }

.motto {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin: clamp(3rem, 7vw, 5rem) 0 0;
  font-family: var(--font-head);
  font-size: clamp(1.05rem, 1.8vw, 1.4rem);
  letter-spacing: 0.04em;
  color: var(--bone-70);
}
.motto em { font-style: normal; color: var(--gold); }
.motto .rule { flex: 1; height: 1px; background: linear-gradient(90deg, var(--gold), transparent); opacity: 0.6; }

@media (max-width: 999px) {
  .grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .cards { grid-template-columns: 1fr; }
  .card, .card:nth-child(n + 4) {
    grid-column: auto;
    display: grid;
    grid-template-columns: 2.4rem 1fr;
    gap: 0.2rem 1rem;
    align-items: start;
    text-align: left;
    padding: 1.25rem;
  }
  .card .line-icon { grid-row: span 3; margin: 0; }
  .motto { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .motto .rule { width: 100%; }
}
</style>
