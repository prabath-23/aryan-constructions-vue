<script setup>
import { navLinks, siteInfo } from '../data/content'
import { useReviewMode } from '../composables/useReviewMode'

const { isOn, toggle } = useReviewMode()
const year = new Date().getFullYear()

const letters = [...'Aryan Constructions']

const socials = [
  { label: 'Instagram', href: siteInfo.instagramHref },
  { label: 'WhatsApp', href: siteInfo.whatsappHref },
  { label: 'Google Reviews', href: siteInfo.mapsHref },
]
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="top">
        <div class="cta-block">
          <p class="label">Ready to start?</p>
          <a v-magnetic="0.2" href="#contact" class="big-link">
            <span>Book a site visit</span><span class="arrow">→</span>
          </a>
        </div>

        <div class="cols">
          <div class="col">
            <h4 class="label">Navigate</h4>
            <ul>
              <li v-for="l in navLinks" :key="l.href"><a :href="l.href">{{ l.label }}</a></li>
            </ul>
          </div>
          <div class="col">
            <h4 class="label">Contact</h4>
            <ul>
              <li><a :href="siteInfo.phoneHref">{{ siteInfo.phone }}</a></li>
              <li><a :href="siteInfo.emailHref">{{ siteInfo.email }}</a></li>
              <li>{{ siteInfo.address }}</li>
            </ul>
          </div>
          <div class="col">
            <h4 class="label">Follow</h4>
            <ul>
              <li v-for="s in socials" :key="s.label">
                <a :href="s.href" target="_blank" rel="noopener">{{ s.label }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Oversized wordmark as the closing gesture -->
      <div class="wordmark" v-reveal aria-hidden="true">
        <span v-for="(ch, i) in letters" :key="i" class="lt-mask">
          <span class="lt" :style="{ '--i': i }">{{ ch === ' ' ? ' ' : ch }}</span>
        </span>
      </div>

      <div class="bottom">
        <p>© {{ year }} {{ siteInfo.name }}.</p>

        <button class="review" :class="{ on: isOn }" :aria-pressed="isOn" @click="toggle">
          <span class="dot" aria-hidden="true"></span>
          Review mode
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--rule);
  background: var(--ink-1);
  padding-top: clamp(3.5rem, 7vw, 6rem);
  overflow: hidden;
}

.top {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: clamp(2.5rem, 6vw, 5rem);
  padding-bottom: clamp(3rem, 6vw, 5rem);
}

.cta-block .label { display: block; margin-bottom: 1rem; }
.big-link {
  display: inline-flex;
  align-items: baseline;
  gap: 1rem;
  font-family: var(--font-head);
  font-weight: 500;
  font-size: clamp(1.75rem, 3.6vw, 2.75rem);
  letter-spacing: -0.025em;
  line-height: 1.1;
  border-bottom: 1px solid var(--rule);
  padding-bottom: 0.4rem;
  transition: color 0.4s var(--ease), border-color 0.4s var(--ease);
}
.big-link:hover { color: var(--gold); border-bottom-color: var(--gold); }
.big-link .arrow { transition: transform 0.45s var(--ease); font-size: 0.7em; }
.big-link:hover .arrow { transform: translateX(6px); }

.cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.col h4 { margin: 0 0 1.25rem; }
.col ul { display: grid; gap: 0.7rem; }
.col li { font-size: 0.8125rem; color: var(--bone-45); line-height: 1.5; }
.col a { transition: color 0.3s var(--ease); }
.col a:hover { color: var(--gold); }
.handle { display: block; font-size: 0.6875rem; color: var(--bone-28); }

.wordmark {
  font-family: var(--font-head);
  font-weight: 700;
  /* Capped so the full name always fits the container — a wordmark clipped
     mid-letter reads as a bug, not a flourish. */
  font-size: clamp(1.75rem, 8.6vw, 8rem);
  line-height: 0.9;
  letter-spacing: -0.045em;
  white-space: nowrap;
  user-select: none;
  margin-bottom: -0.1em;
}
/* Letters rise out of a mask in sequence when the footer arrives, then each
   one lifts and lights up gold under the pointer. */
.lt-mask {
  display: inline-block;
  overflow: hidden;
  padding-top: 0.12em;
  vertical-align: bottom;
}
.lt {
  display: inline-block;
  color: rgba(237, 234, 227, 0.07);
  transform: translateY(105%);
  transition:
    transform 1.1s var(--ease-out) calc(var(--i) * 32ms),
    translate 0.5s var(--ease),
    color 0.5s var(--ease);
}
.wordmark.is-visible .lt { transform: none; }
.lt:hover {
  translate: 0 -0.1em;
  color: var(--gold);
}
/* Clear the fixed CAD status bar on desktop */
@media (min-width: 1081px) {
  .footer { padding-bottom: 30px; }
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  border-top: 1px solid var(--rule);
  padding: 1.5rem 0;
}
.bottom p { margin: 0; font-size: 0.6875rem; color: var(--bone-28); letter-spacing: 0.04em; }

.review {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: none;
  border: 1px solid var(--rule);
  border-radius: 999px;
  padding: 0.45rem 0.95rem;
  font-size: 0.625rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--bone-28);
  transition: color 0.35s var(--ease), border-color 0.35s var(--ease);
}
.review:hover { color: var(--bone-70); border-color: var(--bone-28); }
.review.on { color: var(--gold); border-color: rgba(206, 164, 55, 0.5); }
.dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--bone-28);
  transition: background 0.35s var(--ease), box-shadow 0.35s var(--ease);
}
.review.on .dot { background: var(--gold); box-shadow: 0 0 0 3px rgba(206, 164, 55, 0.18); }

@media (max-width: 900px) {
  .top { grid-template-columns: 1fr; }
  .cols { grid-template-columns: 1fr 1fr; gap: 2rem 1.5rem; }
}
@media (max-width: 480px) {
  .cols { grid-template-columns: 1fr; }
}
</style>
