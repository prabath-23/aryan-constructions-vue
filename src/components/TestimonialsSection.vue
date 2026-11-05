<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { siteInfo, testimonials } from '../data/content'
import { reducedMotion } from '../motion/env'

const i = ref(0)
const dir = ref(1)
const hovering = ref(false)
const inView = ref(false)
const section = ref(null)
let io = null

const current = computed(() => testimonials[i.value])
const words = computed(() => current.value.quote.split(' '))

// Autoplay is driven by the progress bar's own CSS animation: when it ends,
// advance. Pausing the bar (hover, focus, off-screen) therefore pauses the
// carousel with no separate timer to keep in sync. Off under reduced motion.
const autoplay = !reducedMotion
const running = computed(() => autoplay && inView.value && !hovering.value)

function go(step) {
  dir.value = step
  i.value = (i.value + step + testimonials.length) % testimonials.length
}

onMounted(() => {
  io = new IntersectionObserver(([e]) => (inView.value = e.isIntersecting), { threshold: 0.35 })
  io.observe(section.value)
})
onUnmounted(() => io?.disconnect())
</script>

<template>
  <section ref="section" class="testimonials" id="testimonials">
    <div class="container">
      <div class="index-rule" v-reveal>
        <span class="num" v-scramble="150">A-501</span>
        <span class="line"></span>
        <span class="label" v-scramble="300">Client Feedback</span>
      </div>

      <!-- Pause only while the reader is over (or tabbed into) the quote
           itself: the section spans the full width, so pausing on section
           hover would stop autoplay for anyone whose mouse rests on the page. -->
      <div
        class="quote-wrap"
        v-reveal
        @pointerenter="hovering = true"
        @pointerleave="hovering = false"
        @focusin="hovering = true"
        @focusout="hovering = false"
      >
        <span :key="'mark' + i" class="mark" aria-hidden="true">“</span>

        <div aria-live="polite">
          <Transition :name="dir > 0 ? 'q-next' : 'q-prev'" mode="out-in" :duration="{ enter: 1100, leave: 380 }">
            <blockquote :key="i" class="quote">
              <p>
                <template v-for="(w, wi) in words" :key="wi">
                  <span class="qw"><span class="qwi" :style="{ '--i': wi }">{{ w }}</span></span>{{ ' ' }}
                </template>
              </p>
              <cite>{{ current.author }}</cite>
            </blockquote>
          </Transition>
        </div>

        <div class="controls">
          <span class="counter num-display">
            {{ String(i + 1).padStart(2, '0') }}<span class="sep">/</span>{{ String(testimonials.length).padStart(2, '0') }}
          </span>
          <span class="progress" aria-hidden="true">
            <span
              v-if="autoplay"
              :key="i"
              class="fill"
              :style="{ animationPlayState: running ? 'running' : 'paused' }"
              @animationend="go(1)"
            ></span>
          </span>
          <div class="btns">
            <button v-magnetic="0.25" aria-label="Previous testimonial" @click="go(-1)">←</button>
            <button v-magnetic="0.25" aria-label="Next testimonial" @click="go(1)">→</button>
          </div>
        </div>
      </div>

      <a :href="siteInfo.mapsHref" target="_blank" rel="noopener" class="link all" v-reveal>
        <span>Rated 5.0 on Google. Read all the reviews</span><span class="arrow">→</span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.all { margin-top: 2.5rem; }
.testimonials {
  padding: var(--section) 0;
  border-top: 1px solid var(--rule);
  background: var(--ink-1);
}

.quote-wrap { position: relative; max-width: 64rem; }

.mark {
  position: absolute;
  top: -3rem;
  left: -1.25rem;
  font-family: var(--font-head);
  font-size: 12rem;
  line-height: 1;
  color: var(--mark);
  opacity: 0.18;
  pointer-events: none;
  user-select: none;
  animation: markIn 1s var(--ease-out);
}
@keyframes markIn {
  from { opacity: 0; transform: translateY(20px) rotate(-12deg) scale(0.8); }
  to { opacity: 0.18; transform: none; }
}

.quote { margin: 0; min-height: 11rem; }
.quote p {
  font-family: var(--font-head);
  font-weight: 400;
  font-size: clamp(1.4rem, 3.4vw, 2.7rem);
  line-height: 1.25;
  letter-spacing: -0.02em;
  color: var(--bone);
  margin: 0 0 2rem;
}
.qw { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: 0.1em; margin-bottom: -0.1em; }
.qwi { display: inline-block; }
.quote cite {
  font-style: normal;
  font-family: var(--font-ui);
  font-size: 0.6875rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold);
}

/* Entering: words rise in sequence, in the direction of travel */
.q-next-enter-active .qwi,
.q-prev-enter-active .qwi {
  animation: wordIn 0.75s var(--ease-out) both;
  animation-delay: calc(var(--i) * 22ms);
}
.q-prev-enter-active .qwi { animation-name: wordInPrev; }
@keyframes wordIn { from { transform: translateY(110%) rotate(3deg); } to { transform: none; } }
@keyframes wordInPrev { from { transform: translateY(-110%) rotate(-3deg); } to { transform: none; } }
.q-next-enter-active cite, .q-prev-enter-active cite { animation: fadeUp 0.6s var(--ease-out) 0.4s both; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

/* Leaving: slide out opposite to the direction of travel */
.q-next-leave-active, .q-prev-leave-active { transition: opacity 0.35s var(--ease), transform 0.38s var(--ease); }
.q-next-leave-to { opacity: 0; transform: translateX(-40px); }
.q-prev-leave-to { opacity: 0; transform: translateX(40px); }

.controls {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: clamp(2.5rem, 5vw, 4rem);
  padding-top: 1.5rem;
  border-top: 1px solid var(--rule);
}
.counter { font-size: 0.875rem; color: var(--bone-45); letter-spacing: 0.1em; }
.counter .sep { margin: 0 0.4rem; opacity: 0.4; }

.progress { flex: 1; height: 1px; background: var(--rule); overflow: hidden; }
.fill {
  display: block;
  height: 100%;
  background: var(--gold-grad);
  transform-origin: left;
  animation: progress 7s linear forwards;
}
@keyframes progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }

.btns { display: flex; gap: 0.6rem; }
.btns button {
  width: 3rem; height: 3rem;
  background: none;
  border: 1px solid var(--rule);
  border-radius: 50%;
  color: var(--bone-45);
  font-size: 1rem;
}
.btns button:hover {
  color: var(--ink);
  background: var(--gold-grad);
  border-color: transparent;
}

@media (max-width: 620px) {
  .mark { font-size: 7rem; top: -1.75rem; left: -0.25rem; }
  .quote { min-height: 14rem; }
}
</style>
