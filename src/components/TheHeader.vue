<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import logoMark from '../assets/logo-mark.svg'
import { navLinks, siteInfo } from '../data/content'
import { useScrollSpy } from '../composables/useScrollSpy'
import { lockScroll } from '../motion'

const { isScrolled, progress, activeId } = useScrollSpy(navLinks.map((l) => l.href.slice(1)))
const isNavOpen = ref(false)

watch(isNavOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  lockScroll(open)
})

// A single indicator slides between nav items as the active section changes,
// rather than the usual left-fixed underline — measured off the real link
// so it always lines up regardless of label width or font load timing.
const navTrack = ref(null)
const indicator = ref({ left: '0px', width: '0px', opacity: 0 })

function updateIndicator() {
  const track = navTrack.value
  const activeLink = track?.querySelector('a.active')
  if (!track || !activeLink) {
    indicator.value = { ...indicator.value, opacity: 0 }
    return
  }
  const trackRect = track.getBoundingClientRect()
  const linkRect = activeLink.getBoundingClientRect()
  indicator.value = {
    left: `${linkRect.left - trackRect.left}px`,
    width: `${linkRect.width}px`,
    opacity: 1,
  }
}

watch(activeId, () => nextTick(updateIndicator))
function onKeydown(e) {
  if (e.key === 'Escape') isNavOpen.value = false
}

onMounted(() => {
  updateIndicator()
  window.addEventListener('resize', updateIndicator)
  document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateIndicator)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <header class="header" :class="{ scrolled: isScrolled }">
    <div class="progress" :style="{ transform: `scaleX(${progress})` }"></div>

    <div class="container bar">
      <a href="#top" class="brand" aria-label="Aryan Constructions &amp; Interiors home" @click="isNavOpen = false">
        <img :src="logoMark" alt="" width="34" height="42">
        <span class="wordmark">
          <span class="name">Aryan</span>
          <span class="sub">Constructions &amp; Interiors</span>
        </span>
      </a>

      <nav class="nav" aria-label="Primary">
        <div ref="navTrack" class="nav-track">
          <ul>
            <li v-for="(link, i) in navLinks" :key="link.href">
              <a
                :href="link.href"
                :class="{ active: activeId === link.href.slice(1) }"
                :aria-current="activeId === link.href.slice(1) ? 'true' : undefined"
              >
                <span class="i">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="t" v-scramble.hover>{{ link.label }}</span>
              </a>
            </li>
          </ul>
          <span class="nav-indicator" :style="indicator" aria-hidden="true"></span>
        </div>
      </nav>

      <a v-magnetic="0.25" href="#contact" class="btn btn-gold cta"><span v-scramble.hover>Get a Quote</span><span class="arrow">→</span></a>

      <button
        class="burger"
        :class="{ open: isNavOpen }"
        :aria-expanded="isNavOpen"
        aria-label="Toggle menu"
        aria-controls="mobileNav"
        @click="isNavOpen = !isNavOpen"
      ><span></span><span></span></button>
    </div>
  </header>

  <!-- Outside <header> on purpose: the header's backdrop-filter once scrolled
       makes it the containing block for position: fixed children, which would
       shrink this to the height of the bar. -->
  <div id="mobileNav" class="drawer" :class="{ open: isNavOpen }" data-lenis-prevent>
    <ul class="drawer-links">
      <li v-for="(link, i) in navLinks" :key="link.href">
        <a :href="link.href" @click="isNavOpen = false">
          <span class="i">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="t">{{ link.label }}</span>
          <span class="arrow">→</span>
        </a>
      </li>
    </ul>
    <div class="drawer-foot">
      <a :href="siteInfo.phoneHref">{{ siteInfo.phone }}</a>
      <a href="#contact" class="btn btn-gold btn-block" @click="isNavOpen = false">
        <span>Book a Site Visit</span><span class="arrow">→</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.header {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 100;
  transition: background 0.5s var(--ease), border-color 0.5s var(--ease);
  border-bottom: 1px solid transparent;
}
.header.scrolled {
  background: rgba(8, 8, 7, 0.82);
  backdrop-filter: blur(14px) saturate(140%);
  border-bottom-color: var(--rule);
}

.progress {
  position: absolute;
  top: 0; left: 0;
  height: 1.5px;
  width: 100%;
  background: var(--gold-grad);
  transform-origin: left;
  transform: scaleX(0);
  opacity: 0.85;
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding-top: 1.1rem;
  padding-bottom: 1.1rem;
  transition: padding 0.5s var(--ease);
}
.scrolled .bar { padding-top: 0.75rem; padding-bottom: 0.75rem; }

.brand { display: flex; align-items: center; gap: 0.75rem; }
.wordmark { display: flex; flex-direction: column; line-height: 1.15; }
.name {
  font-family: var(--font-head);
  font-size: 1.05rem;
  letter-spacing: 0.01em;
}
.sub {
  font-size: 0.5625rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--bone-45);
}

.nav-track { position: relative; }
.nav ul { display: flex; gap: 0.35rem; }
.nav-indicator {
  position: absolute;
  bottom: -1px;
  height: 1px;
  background: var(--gold-grad);
  transition: left 0.45s var(--ease), width 0.45s var(--ease), opacity 0.3s var(--ease);
  pointer-events: none;
}
.nav a {
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
  padding: 0.5rem 0.85rem;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--bone-45);
  transition: color 0.35s var(--ease);
}
.nav a .i {
  font-size: 0.5rem;
  letter-spacing: 0.1em;
  color: var(--bone-28);
  font-variant-numeric: tabular-nums;
  transition: color 0.35s var(--ease);
}
.nav a:hover { color: var(--bone); }
.nav a.active { color: var(--bone); }
.nav a.active .i { color: var(--gold); }

.cta { padding: 0.8rem 1.4rem; font-size: 0.6875rem; }

.burger {
  display: none;
  width: 40px; height: 40px;
  background: none;
  border: 1px solid var(--rule);
  border-radius: 1px;
  padding: 0;
  position: relative;
}
.burger span {
  position: absolute;
  left: 11px;
  width: 18px; height: 1px;
  background: var(--bone);
  transition: transform 0.4s var(--ease), opacity 0.3s var(--ease);
}
.burger span:nth-child(1) { top: 17px; }
.burger span:nth-child(2) { top: 22px; }
.burger.open span:nth-child(1) { transform: translateY(2.5px) rotate(45deg); }
.burger.open span:nth-child(2) { transform: translateY(-2.5px) rotate(-45deg); }

/* Drawer */
.drawer {
  position: fixed;
  inset: 0;
  z-index: 99; /* under the header, so the close button stays on top */
  background: var(--ink-1);
  padding: 6.5rem var(--gutter) 2.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  overflow-y: auto; /* short phones and landscape */
  overscroll-behavior: contain;
  transform: translateY(-100%);
  /* Stay visible until the slide-up has finished */
  transition: transform 0.6s var(--ease), visibility 0s linear 0.6s;
  visibility: hidden;
}
.drawer.open {
  transform: translateY(0);
  visibility: visible;
  transition: transform 0.6s var(--ease), visibility 0s;
}

.drawer-links li { border-bottom: 1px solid var(--rule); }
.drawer-links a {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  padding: 1.15rem 0;
  font-family: var(--font-head);
  font-size: 1.75rem;
  font-weight: 500;
}
.drawer-links .i {
  font-family: var(--font-ui);
  font-size: 0.625rem;
  letter-spacing: 0.2em;
  color: var(--gold);
  font-variant-numeric: tabular-nums;
}
.drawer-links .t { flex: 1; }
.drawer-links .arrow { font-size: 1rem; color: var(--bone-28); }

.drawer-foot { display: grid; gap: 1rem; }
.drawer-foot > a:first-child {
  font-size: 0.8125rem;
  letter-spacing: 0.06em;
  color: var(--bone-45);
}

@media (max-width: 1080px) {
  .nav, .cta { display: none; }
  .burger { display: block; }
}
@media (min-width: 1081px) {
  .drawer { display: none; }
}
</style>
