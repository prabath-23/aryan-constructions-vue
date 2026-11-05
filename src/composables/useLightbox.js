import { reactive } from 'vue'
import { lockScroll } from '../motion'

// Singleton reactive store shared by PortfolioSection (opens it) and
// Lightbox (renders it) without prop drilling through App.vue.
const state = reactive({
  isOpen: false,
  project: null,
  index: 0,
})

export function useLightbox() {
  function open(project) {
    state.project = project
    state.index = 0
    state.isOpen = true
    document.body.style.overflow = 'hidden'
    lockScroll(true)
  }
  function close() {
    state.isOpen = false
    document.body.style.overflow = ''
    lockScroll(false)
  }
  function step(by) {
    const count = state.project.images.length
    state.index = (state.index + by + count) % count
  }
  return { state, open, close, step }
}
