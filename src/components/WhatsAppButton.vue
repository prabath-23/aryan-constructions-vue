<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { siteInfo } from '../data/content'

const href = `${siteInfo.whatsappHref}?text=${encodeURIComponent('Hi, I would like to know about building with Aryan Constructions.')}`

// The contact section has its own WhatsApp button, and this one would sit on
// top of it: step aside while that section is on screen.
const hidden = ref(false)
let io = null
onMounted(() => {
  io = new IntersectionObserver(([e]) => (hidden.value = e.isIntersecting), { threshold: 0.15 })
  io.observe(document.getElementById('contact'))
})
onUnmounted(() => io?.disconnect())
</script>

<template>
  <a :href="href" :class="['wa', { hidden }]" :tabindex="hidden ? -1 : undefined" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp" data-cursor="Chat">
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      <path fill="currentColor" d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.13-1.35A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.04.8.81-2.97-.2-.3a8.2 8.2 0 1 1 6.91 3.8Zm4.5-6.14c-.25-.12-1.46-.72-1.68-.8-.23-.08-.4-.12-.56.13-.17.24-.64.8-.79.96-.14.17-.29.19-.54.06-.24-.12-1.03-.38-1.97-1.21-.72-.65-1.21-1.45-1.36-1.69-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.3-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.41-.56-.42h-.48c-.17 0-.43.06-.66.3-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.57c.13.16 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.6.19 1.14.16 1.56.1.48-.07 1.46-.6 1.67-1.17.2-.58.2-1.07.14-1.17-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  </a>
</template>

<style scoped>
/* Gold rather than WhatsApp green: the page is gold-only. The glyph says what it is. */
.wa {
  position: fixed;
  right: var(--gutter);
  bottom: calc(30px + 1.25rem);
  z-index: 90;
  width: 3.25rem;
  height: 3.25rem;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--gold-grad);
  color: var(--ink);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  transition: transform 0.35s var(--ease), opacity 0.35s var(--ease), visibility 0.35s;
}
.wa:hover { transform: translateY(-3px); }
.wa.hidden { opacity: 0; visibility: hidden; transform: translateY(8px); }
@media (max-width: 1080px) {
  .wa { bottom: 1.25rem; }
}
</style>
