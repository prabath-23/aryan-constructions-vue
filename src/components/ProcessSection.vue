<script setup>
import { onMounted, ref } from 'vue'
import BuildStages from './BuildStages.vue'
import { processSteps } from '../data/content'
import { registerMotion, scrollToY } from '../motion'

const section = ref(null)
const pin = ref(null)
const pct = ref(null)
const active = ref(0)
let trigger = null

// Jump to the middle of a stage's scroll range
function goTo(i) {
  if (!trigger) return
  scrollToY(trigger.start + (trigger.end - trigger.start) * ((i + 0.6) / processSteps.length))
}

onMounted(() => {
  // The section pins for ~3.4 viewports while one timeline assembles the
  // drawing: survey the site, set out the envelope, draw the design, stack
  // the floors with the crane working, then lights on, crane out, stamped.
  // Scroll position drives it directly (scrub), so it runs backwards too.
  registerMotion(({ gsap, ScrollTrigger }) => {
    const q = gsap.utils.selector(section.value)
    const tl = gsap.timeline({ defaults: { ease: 'none' } })
    const draw = (t, at, duration = 0.45, stagger = 0) =>
      tl.fromTo(t, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration, stagger, ease: 'power2.out' }, at)
    const fade = (t, at, duration = 0.3, stagger = 0) =>
      tl.fromTo(t, { opacity: 0 }, { opacity: 1, duration, stagger }, at)

    // 1 · Enquiry — the site
    draw(q('.s1 .dr'), 0.02, 0.45, 0.14)
    tl.fromTo(q('.s1 .pop'), { scale: 0, transformOrigin: '50% 100%' }, { scale: 1, duration: 0.25, stagger: 0.12, ease: 'back.out(3)' }, 0.3)
    fade(q('.s1 .fade'), 0.6, 0.3, 0.1)

    // 2 · Site visit — setbacks, height limit, survey pegs
    tl.fromTo(q('.s2 .setback'), { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.4, stagger: 0.1 }, 1.02)
    tl.fromTo(q('.s2 .limit'), { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.4 }, 1.2)
    tl.fromTo(q('.s2 .peg'), { y: -70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.08, ease: 'bounce.out' }, 1.25)
    draw(q('.s2 .dr'), 1.5, 0.35)
    fade(q('.s2 .fade2'), 1.45, 0.3, 0.15)

    // 3 · Design & quote — wireframe, then the quote tag lands
    draw(q('.s3 .wire .dr'), 2.02, 0.45, 0.035)
    fade(q('.s3 .win-outline'), 2.4, 0.2, 0.006)
    tl.fromTo(q('.s3 .quote'), { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, 2.6)

    // 4 · Build — crane rises, floors stack from the ground up
    tl.fromTo(q('.s3 .wire'), { opacity: 0.9 }, { opacity: 0.18, duration: 0.6 }, 3.05)
    tl.fromTo(q('.s4 .crane'), { y: 330, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }, 3.0)
    tl.fromTo(q('.s4 .slab'), { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: 0.16, stagger: 0.07, ease: 'power2.out' }, 3.12)
    fade(q('.s4 .win-dark'), 3.55, 0.12, 0.005)

    // 5 · Handover — crane out, lights on, stamp
    tl.to(q('.s4 .crane'), { y: 360, opacity: 0, duration: 0.45, ease: 'power2.in' }, 4.05)
    fade(q('.s5 .glow'), 4.2, 0.5)
    tl.fromTo(q('.s5 .lit'), { opacity: 0 }, { opacity: 1, duration: 0.08, stagger: { each: 0.014, from: 'random' } }, 4.2)
    tl.fromTo(q('.s5 .stamp'), { scale: 2.8, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2.2)' }, 4.6)

    // Stage progress bars under the step pills
    processSteps.forEach((_, i) => {
      tl.fromTo(q(`[data-seg="${i}"]`), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'none' }, i)
    })

    // The hook swings on its own, independent of scroll
    gsap.fromTo(q('.hook'), { rotation: -6, svgOrigin: '360 68' }, { rotation: 6, svgOrigin: '360 68', duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut' })

    trigger = ScrollTrigger.create({
      trigger: pin.value,
      pin: true,
      start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * 3.4)}`,
      scrub: 0.7,
      animation: tl,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const i = Math.min(processSteps.length - 1, Math.floor(self.progress * processSteps.length))
        if (i !== active.value) active.value = i
        if (pct.value) pct.value.textContent = String(Math.round(self.progress * 100)).padStart(3, '0')
      },
    })
  })
})
</script>

<template>
  <section ref="section" class="process" id="process">
    <div ref="pin" class="pin">
      <div class="container layout">
        <div class="index-rule rule-area" v-reveal>
          <span class="num" v-scramble="150">A-301</span>
          <span class="line"></span>
          <span class="label" v-scramble="300">How We Work</span>
        </div>
        <h2 class="section-title title-area" v-split>From first call <em>to handover.</em></h2>

        <div class="pills" role="tablist" aria-label="Build stages">
          <button
            v-for="(s, i) in processSteps"
            :key="s.index"
            role="tab"
            :aria-selected="i === active"
            :aria-label="`Stage ${s.index}: ${s.title}`"
            :class="['pill', { active: i === active, done: i < active }]"
            @click="goTo(i)"
          >
            <span class="n">{{ s.index }}</span>
            <span class="bar"><span class="seg" :data-seg="i"></span></span>
          </button>
        </div>

        <div class="stage-list">
          <article v-for="(s, i) in processSteps" :key="s.index" :class="['stage', { active: i === active }]">
            <p class="stage-meta"><span class="red">STAGE {{ s.index }}</span> / 0{{ processSteps.length }}</p>
            <h3>{{ s.title }}</h3>
            <p class="body-copy">{{ s.description }}</p>
          </article>
        </div>

        <div class="visual">
          <BuildStages />
          <div class="readout" aria-hidden="true">
            <span>BUILD SEQUENCE</span>
            <span><span ref="pct">100</span>% COMPLETE</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.process {
  border-top: 1px solid var(--rule);
  background: var(--ink-1);
}
.pin { padding: var(--section) 0; }

.layout {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  grid-template-areas:
    "rule visual"
    "title visual"
    "pills visual"
    "stages visual";
  grid-template-rows: auto auto auto 1fr;
  column-gap: clamp(2rem, 6vw, 6rem);
  align-content: center;
}
.rule-area { grid-area: rule; }
.title-area { grid-area: title; }
.pills { grid-area: pills; }
.stage-list { grid-area: stages; }
.visual { grid-area: visual; align-self: center; position: relative; }

.stage-list { display: grid; gap: 2.25rem; margin-top: 2.5rem; align-content: start; }
.stage-meta {
  font-family: var(--font-ui);
  font-size: 0.6875rem;
  letter-spacing: 0.18em;
  color: var(--bone-28);
  margin: 0 0 0.75rem;
}
.red { color: var(--mark); }
.stage h3 { font-size: clamp(1.5rem, 2.8vw, 2.25rem); margin-bottom: 0.75rem; }

.readout {
  display: flex;
  justify-content: space-between;
  margin-top: 0.85rem;
  font-family: var(--font-ui);
  font-size: 0.625rem;
  letter-spacing: 0.18em;
  color: var(--bone-28);
}

/* Pills only make sense once the timeline exists */
.pills { display: none; }
.pill {
  display: grid;
  gap: 0.5rem;
  background: none;
  border: 0;
  padding: 0.5rem 0;
  text-align: left;
}
.pill .n {
  font-family: var(--font-ui);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  color: var(--bone-28);
  transition: color 0.3s var(--ease);
}
.pill.active .n, .pill.done .n { color: var(--bone); }
.pill.active .n { color: var(--mark); }
.bar { display: block; height: 2px; background: var(--rule); overflow: hidden; }
.seg { display: block; height: 100%; background: var(--gold-grad); transform-origin: left; }

/* ---- Pinned mode (timeline running) ---- */
.motion-on .pin {
  height: 100vh;
  height: 100svh;
  padding: 5.5rem 0 3rem;
  display: flex;
  align-items: center;
}
.motion-on .layout { width: 100%; }
.motion-on .pills {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.6rem;
  margin: 2.25rem 0 1.5rem;
}
.motion-on .stage-list {
  display: block;
  position: relative;
  min-height: 12rem;
  margin-top: 0;
}
.motion-on .stage {
  position: absolute;
  inset: 0 0 auto 0;
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.45s var(--ease), transform 0.6s var(--ease-out);
  pointer-events: none;
}
.motion-on .stage.active {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}

@media (max-width: 899px) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-areas: "rule" "title" "visual" "pills" "stages";
    grid-template-rows: none;
  }
  .visual { margin: 1.75rem 0 0.5rem; }
  .readout { display: none; }

  .motion-on .pin { padding: 4.75rem 0 1rem; align-items: flex-start; }
  .motion-on .process .index-rule { margin-bottom: 0.9rem; }
  .motion-on .process .section-title { font-size: 1.65rem; }
  .motion-on .visual { margin: 0.75rem 0 0; }
  .motion-on .visual :deep(svg) { max-height: 33svh; width: auto; max-width: 100%; margin: 0 auto; display: block; }
  .motion-on .pills { margin: 0.9rem 0 1rem; }
  .motion-on .stage h3 { font-size: 1.3rem; margin-bottom: 0.4rem; }
  .motion-on .stage .body-copy { font-size: 0.9rem; line-height: 1.6; }
}
</style>
