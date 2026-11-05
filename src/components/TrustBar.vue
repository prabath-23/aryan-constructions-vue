<script setup>
import { trustStats } from '../data/content'

// Each digit is a strip of 0–9 twice over; on reveal it rolls down to the
// target in the second cycle, so every column spins at least once and
// lower-order digits land later, like a mechanical counter.
const DIGITS = [...'01234567890123456789']
const stats = trustStats.map((s) => ({ ...s, digits: [...String(s.value)] }))
</script>

<template>
  <section class="figures" id="trust">
    <div class="container grid">
      <div v-for="stat in stats" :key="stat.label" class="figure" v-reveal>
        <span class="glyph" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        <p class="value num-display" :aria-label="`${stat.value}${stat.suffix}`">
          <span class="odo" aria-hidden="true">
            <template v-for="(d, di) in stat.digits" :key="di">
              <span v-if="d === '.'" class="dot">.</span>
              <span v-else class="col">
                <span class="strip" :style="{ '--n': d, '--di': di }">
                  <span v-for="(c, ci) in DIGITS" :key="ci">{{ c }}</span>
                </span>
              </span>
            </template>
          </span><span class="suffix" aria-hidden="true">{{ stat.suffix }}</span>
        </p>
        <p class="label">{{ stat.label }}</p>
        <span class="ph note">{{ stat.note }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.figures {
  position: relative;
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  background: var(--ink-1);
}
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.figure {
  padding: clamp(2rem, 4vw, 3.25rem) clamp(1rem, 2.5vw, 2.5rem);
  border-left: 1px solid var(--rule);
  position: relative;
}
.figure:first-child { border-left: 0; padding-left: 0; }

.glyph { margin-bottom: 1.25rem; opacity: 0.75; }

.value {
  display: flex;
  align-items: flex-start;
  font-size: clamp(2.5rem, 4.6vw, 4rem);
  line-height: 1;
  margin: 0 0 0.75rem;
}
.odo { display: inline-flex; }
.col {
  display: inline-block;
  height: 1em;
  overflow: hidden;
}
.strip {
  display: flex;
  flex-direction: column;
  background: linear-gradient(90deg, var(--gold-start), var(--gold-end));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transform: translateY(calc(-1em * (10 + var(--n))));
}
.strip span { height: 1em; line-height: 1; }
/* Before reveal the strips sit at 0; the reveal directive's .is-visible
   rolls them. With no JS the default above is already the final value. */
.figure[data-reveal]:not(.is-visible) .strip { transform: translateY(0); }
.figure.is-visible .strip {
  transition: transform 2s cubic-bezier(0.19, 1, 0.22, 1);
  transition-delay: calc(0.25s + var(--di) * 0.14s);
}
.dot { color: var(--gold-end); line-height: 1; }
.suffix {
  font-size: 0.5em;
  margin-left: 0.08em;
  color: var(--gold);
}

.note { display: none; }
.review-mode .note { display: inline; font-size: 0.625rem; }

@media (max-width: 860px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
  .figure { border-top: 1px solid var(--rule); }
  .figure:nth-child(-n+2) { border-top: 0; }
  .figure:nth-child(odd) { border-left: 0; padding-left: 0; }
}
</style>
