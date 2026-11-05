import { ref, watch } from 'vue'

// Client-review toggle. Off by default so the site presents as finished work;
// on, every passage still awaiting real copy is highlighted in place.
const KEY = 'aryan:review-mode'
const isOn = ref(false)

try {
  isOn.value = localStorage.getItem(KEY) === '1'
} catch {
  // Private browsing / blocked storage — default off, no further action needed.
}

watch(isOn, (on) => {
  document.documentElement.classList.toggle('review-mode', on)
  try {
    localStorage.setItem(KEY, on ? '1' : '0')
  } catch {
    // Preference simply won't persist; the toggle still works this session.
  }
}, { immediate: true })

export function useReviewMode() {
  return { isOn, toggle: () => { isOn.value = !isOn.value } }
}
