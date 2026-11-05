// Fire a callback once, the first time an element scrolls into view. One
// IntersectionObserver per option set, shared across every caller.
const observers = new Map()

export function observeOnce(el, callback, { threshold = 0.2, rootMargin = '0px 0px -8% 0px' } = {}) {
  if (!('IntersectionObserver' in window)) {
    callback()
    return () => {}
  }
  const key = `${threshold}|${rootMargin}`
  let entry = observers.get(key)
  if (!entry) {
    const callbacks = new WeakMap()
    const io = new IntersectionObserver(
      (records) => {
        for (const r of records) {
          if (!r.isIntersecting) continue
          const fn = callbacks.get(r.target)
          io.unobserve(r.target)
          callbacks.delete(r.target)
          fn?.()
        }
      },
      { threshold, rootMargin }
    )
    entry = { io, callbacks }
    observers.set(key, entry)
  }
  entry.callbacks.set(el, callback)
  entry.io.observe(el)
  return () => {
    entry.io.unobserve(el)
    entry.callbacks.delete(el)
  }
}
