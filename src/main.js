import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { vReveal } from './directives/reveal'
import { vTilt } from './directives/tilt'
import { vSplit } from './directives/split'
import { vScramble } from './directives/scramble'
import { vMagnetic } from './directives/magnetic'
import { vParallax } from './directives/parallax'

const app = createApp(App)
app.directive('reveal', vReveal)
app.directive('tilt', vTilt)
app.directive('split', vSplit)
app.directive('scramble', vScramble)
app.directive('magnetic', vMagnetic)
app.directive('parallax', vParallax)
app.mount('#app')
