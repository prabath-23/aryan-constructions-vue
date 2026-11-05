// One requestAnimationFrame loop shared by everything that tracks scroll or
// the pointer (cursor, parallax, marquee, grid), so scroll position and
// velocity are read once per frame instead of once per effect.
const subs = new Set()
let raf = 0
let lastY = 0
let velocity = 0

function frame(time) {
  const y = window.scrollY
  velocity += (y - lastY - velocity) * 0.18
  lastY = y
  for (const fn of subs) fn(y, velocity, time)
  raf = requestAnimationFrame(frame)
}

export function onTick(fn) {
  subs.add(fn)
  if (!raf) {
    lastY = window.scrollY
    raf = requestAnimationFrame(frame)
  }
  return () => {
    subs.delete(fn)
    if (!subs.size && raf) {
      cancelAnimationFrame(raf)
      raf = 0
    }
  }
}
