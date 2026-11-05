<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import HeroBuilding from './HeroBuilding.vue'
import { heroStrip } from '../data/content'
import { registerMotion } from '../motion'
import { reducedMotion, finePointer } from '../motion/env'

const hero = ref(null)
const body = ref(null)
const art = ref(null)
const artScroll = ref(null)

// Pointer depth: layers of the drawing shift by different amounts, so the
// grid, structure and annotations read as separate planes.
let raf = 0
function onPointer(e) {
  const r = hero.value.getBoundingClientRect()
  const px = ((e.clientX - r.left) / r.width - 0.5) * 2
  const py = ((e.clientY - r.top) / r.height - 0.5) * 2
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    art.value?.style.setProperty('--px', px.toFixed(3))
    art.value?.style.setProperty('--py', py.toFixed(3))
  })
}

onMounted(() => {
  if (!reducedMotion && finePointer) hero.value.addEventListener('pointermove', onPointer)

  // Scroll-out: copy lifts and fades while the drawing sinks back, so the
  // hero hands off to the page instead of just scrolling away.
  registerMotion(({ gsap }) => {
    const st = { trigger: hero.value, start: 'top top', end: 'bottom top', scrub: true }
    gsap.to(body.value, { y: -110, opacity: 0.1, ease: 'none', scrollTrigger: st })
    gsap.to(artScroll.value, { y: 120, scale: 0.9, opacity: 0.35, ease: 'none', scrollTrigger: { ...st } })
  })
})

onUnmounted(() => {
  hero.value?.removeEventListener('pointermove', onPointer)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <section ref="hero" class="hero crop" id="hero">
    <div ref="art" class="art">
      <div ref="artScroll" class="art-scroll">
        <HeroBuilding />
      </div>
    </div>
    <div class="scrim"></div>

    <!-- vertical rail -->
    <div class="rail" aria-hidden="true">
      <span class="rail-line"></span>
      <span class="rail-text">Vandalur, Chennai</span>
    </div>

    <div ref="body" class="container hero-body">
      <div class="index-rule">
        <span class="num" v-scramble.load="150">A-000</span>
        <span class="line"></span>
        <span class="label" v-scramble.load="300">Residential &amp; Commercial Builders</span>
      </div>

      <h1 class="display headline">
        <span class="mask"><span class="in">Building homes</span></span>
        <span class="mask"><span class="in">and <em v-scramble.load="820">interiors</em></span></span>
        <span class="mask"><span class="in">the right way.</span></span>
      </h1>

      <p class="lede fade-1">
        We convert your dreams to reality. A Chennai builder based in Vandalur, doing new
        houses and full interiors with clear communication from start to handover.
      </p>

      <div class="actions fade-2">
        <a v-magnetic href="#contact" class="btn btn-gold"><span v-scramble.hover>Get a Quote</span><span class="arrow">→</span></a>
        <a v-magnetic href="#portfolio" class="btn btn-ghost"><span v-scramble.hover>View Our Work</span><span class="arrow">→</span></a>
      </div>
    </div>

    <!-- bottom data strip -->
    <div class="strip fade-3">
      <div class="container strip-inner">
        <dl>
          <div v-for="item in heroStrip" :key="item.label">
            <dt class="label">{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>
        <a href="#trust" class="cue" aria-label="Scroll to explore">
          <span class="cue-text">Scroll</span>
          <span class="cue-track"><span class="cue-dot"></span></span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  padding: 5.75rem 0 0;
  isolation: isolate;
}

.art {
  position: absolute;
  z-index: -2;
  right: clamp(-2rem, 1vw, 3rem);
  top: 50%;
  width: min(50vw, 760px);
  transform: translateY(-52%);
}
.art-scroll { will-change: transform; transform-origin: 50% 80%; }

.scrim {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background:
    linear-gradient(to right, var(--ink) 4%, rgba(8, 8, 7, 0.6) 34%, rgba(8, 8, 7, 0) 60%),
    linear-gradient(to top, var(--ink) 0%, rgba(8, 8, 7, 0) 28%);
}

/* Vertical rail */
.rail {
  position: absolute;
  left: calc(var(--gutter) - 0.35rem);
  bottom: 12rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  z-index: 2;
}
.rail-line { width: 1px; height: 4.5rem; background: linear-gradient(to bottom, transparent, var(--gold)); opacity: 0.5; }
.rail-text {
  writing-mode: vertical-rl;
  font-family: var(--font-ui);
  font-size: 0.5625rem;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: var(--bone-28);
}

.hero-body { position: relative; z-index: 2; flex: 1; display: flex; flex-direction: column; justify-content: center; will-change: transform, opacity; }
/* Add to the container gutter (not replace it) to clear the vertical rail */
@media (min-width: 900px) { .hero-body { padding-left: calc(var(--gutter) + 3.5rem); } }

.headline { margin: 0 0 1.5rem; max-width: 15ch; font-size: clamp(2.8rem, min(6.6vw, 11.5vh), 7rem); }
.mask { display: block; overflow: hidden; padding-bottom: 0.08em; margin-bottom: -0.08em; }
.mask .in {
  display: block;
  transform: translateY(105%) rotate(3deg);
  transform-origin: 0 100%;
  animation: rise 1.1s var(--ease-out) forwards;
}
.mask:nth-child(1) .in { animation-delay: 0.08s; }
.mask:nth-child(2) .in { animation-delay: 0.2s; }
.mask:nth-child(3) .in { animation-delay: 0.32s; }
@keyframes rise { to { transform: none; } }

/* Flex column: margins don't collapse here, so the p's defaults would stack */
.lede { max-width: 42ch; margin: 0; }

.fade-1, .fade-2, .fade-3 { opacity: 0; animation: fade 0.9s var(--ease-out) forwards; }
.fade-1 { animation-delay: 0.55s; }
.fade-2 { animation-delay: 0.7s; }
.fade-3 { animation-delay: 0.9s; }
@keyframes fade { to { opacity: 1; } }

.index-rule { opacity: 0; animation: fade 0.9s var(--ease-out) 0.05s forwards; }
/* Hero's marker animates on load rather than via the scroll-reveal
   directive, so its line grows on its own timeline. */
.index-rule .line {
  transform: scaleX(0);
  transform-origin: left;
  animation: growLine 1s var(--ease-out) 0.35s forwards;
}
@keyframes growLine { to { transform: scaleX(1); } }

.actions { display: flex; gap: 0.85rem; margin-top: 1.75rem; flex-wrap: wrap; }
/* Clear the fixed CAD status bar on desktop */
@media (min-width: 1081px) { .strip { margin-bottom: 30px; } }

/* Bottom strip */
.strip {
  position: relative;
  z-index: 2;
  border-top: 1px solid var(--rule);
  margin-top: auto;
  background: linear-gradient(to top, rgba(8, 8, 7, 0.85), rgba(8, 8, 7, 0.4));
  backdrop-filter: blur(6px);
}
.strip-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding-top: 1.1rem;
  padding-bottom: 1.1rem;
}
.strip dl { display: flex; gap: clamp(1.5rem, 5vw, 4.5rem); margin: 0; }
.strip dt { margin-bottom: 0.3rem; }
.strip dd {
  margin: 0;
  font-size: 0.8125rem;
  letter-spacing: 0.02em;
  color: var(--bone-70);
}

/* margin keeps it clear of the floating WhatsApp button */
.cue { display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; margin-right: 4.5rem; }
.cue-text { font-family: var(--font-ui); font-size: 0.5625rem; letter-spacing: 0.34em; text-transform: uppercase; color: var(--bone-28); }
.cue-track { position: relative; width: 1px; height: 2.75rem; background: var(--rule); overflow: hidden; }
.cue-dot { position: absolute; inset: 0; background: var(--gold-grad); animation: drop 2.2s var(--ease) infinite; }
@keyframes drop {
  0% { transform: translateY(-100%); }
  60%, 100% { transform: translateY(100%); }
}

@media (max-width: 899px) {
  .rail { display: none; }
  .hero { padding-top: 7rem; }
  /* On narrow screens the drawing sits behind the copy as a faint plate */
  .art {
    width: 120vw;
    right: -38vw;
    top: 4rem;
    transform: none;
    opacity: 0.3;
  }
  .scrim {
    background: linear-gradient(to top, var(--ink) 0%, rgba(8, 8, 7, 0.55) 45%, rgba(8, 8, 7, 0.2) 100%);
  }
  .actions { flex-direction: column; align-items: stretch; }
  .strip dl { flex-wrap: wrap; gap: 1.25rem 2rem; }
  .cue { display: none; }
}
</style>
