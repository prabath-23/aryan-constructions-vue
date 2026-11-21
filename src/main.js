import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { vReveal } from './directives/reveal'
import { vSplit } from './directives/split'
import { vParallax } from './directives/parallax'

const app = createApp(App)
app.directive('reveal', vReveal)
app.directive('split', vSplit)
app.directive('parallax', vParallax)
app.mount('#app')
