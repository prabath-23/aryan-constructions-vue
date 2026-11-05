// The loading screen lives in index.html so it paints before any JS arrives.
// This takes it away: once the app has mounted, the draw-on has played and the
// font is ready (or we've stopped waiting for it), the panel lifts and the
// hero's intro starts underneath it.
import { lockScroll } from './index'

const MIN_MS = 1350 // draw-on length, counted from navigation start
const FONT_WAIT_MS = 900

const root = document.documentElement
const active = root.classList.contains('loader-on')

let release
// Anything timed to the hero's intro waits on this. Already resolved when
// the loader is skipped.
export const loaderDone = new Promise((r) => (release = r))
if (!active) release()

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

export async function finishLoader() {
  if (!active) return
  await Promise.race([document.fonts?.ready, wait(FONT_WAIT_MS)])
  await wait(MIN_MS - performance.now())

  const el = document.getElementById('loader')
  el?.classList.add('out')
  root.classList.remove('loader-on')
  lockScroll(false)
  release()
  setTimeout(() => el?.remove(), 800)
}
