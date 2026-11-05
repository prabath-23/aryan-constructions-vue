import { ref, onMounted, onUnmounted } from 'vue'

// Tracks scroll position for the header: how far down the page we are (for the
// progress rule) and which section is currently in view (for nav state).
export function useScrollSpy(sectionIds) {
  const isScrolled = ref(false)
  const progress = ref(0)
  const activeId = ref('')
  let io

  function onScroll() {
    const y = window.scrollY
    isScrolled.value = y > 40
    const max = document.documentElement.scrollHeight - window.innerHeight
    progress.value = max > 0 ? Math.min(y / max, 1) : 0
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    if (!('IntersectionObserver' in window)) return
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) activeId.value = entry.target.id
        })
      },
      // Narrow band across the middle of the viewport: whichever section
      // crosses it owns the nav highlight.
      { rootMargin: '-45% 0px -50% 0px' }
    )
    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    if (io) io.disconnect()
  })

  return { isScrolled, progress, activeId }
}
