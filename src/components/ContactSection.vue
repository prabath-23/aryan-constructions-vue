<script setup>
import { reactive, ref, watch } from 'vue'
import { siteInfo } from '../data/content'
import { reducedMotion } from '../motion/env'

const form = reactive({ fullName: '', phone: '', email: '', projectType: '', message: '' })
const formEl = ref(null)
const status = ref('')
const stamped = ref(false)
const shake = ref(false)
const stampDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()

// Editing after submitting lifts the stamp again
watch(form, () => (stamped.value = false))

// No backend needed: the enquiry opens in WhatsApp with the details filled in,
// and the customer presses send. To use a form service later, replace this.
function onSubmit() {
  if (!formEl.value.checkValidity()) {
    formEl.value.reportValidity()
    return
  }
  // A stamp slams onto the form, then WhatsApp opens.
  stamped.value = true
  shake.value = true
  setTimeout(() => (shake.value = false), 450)
  status.value = 'Opening WhatsApp. Press send there so it reaches us.'

  const text =
    `Hi, I have an enquiry.\n\n` +
    `Name: ${form.fullName}\n` +
    `Phone: ${form.phone}\n` +
    (form.email ? `Email: ${form.email}\n` : '') +
    `Project type: ${form.projectType}\n\n` +
    form.message
  setTimeout(() => {
    window.location.href = `${siteInfo.whatsappHref}?text=${encodeURIComponent(text)}`
  }, reducedMotion ? 0 : 900)
}

const details = [
  { label: 'Phone', value: siteInfo.phone, href: siteInfo.phoneHref },
  { label: 'WhatsApp', value: 'Message us', href: siteInfo.whatsappHref },
  { label: 'Email', value: siteInfo.email, href: siteInfo.emailHref },
  { label: 'Address', value: siteInfo.address, href: siteInfo.mapsHref },
  { label: 'Hours', value: siteInfo.hours },
]
</script>

<template>
  <section class="contact" id="contact">
    <div class="container">
      <div class="index-rule" v-reveal>
        <span class="num" v-scramble="150">G-001</span>
        <span class="line"></span>
        <span class="label" v-scramble="300">Start Your Project</span>
      </div>

      <div class="grid">
        <div class="left">
          <h2 class="section-title" v-split>Tell us what <em>you're building.</em></h2>
          <p class="lede" v-reveal>
            Send us the outline and we'll arrange a site visit and an itemised quote.
          </p>

          <ul class="details" v-reveal.stagger>
            <li v-for="d in details" :key="d.label">
              <span class="label">{{ d.label }}</span>
              <a v-if="d.href" :href="d.href">{{ d.value }}</a>
              <span v-else>{{ d.value }}</span>
            </li>
          </ul>

          <div class="map">
            <iframe
              :src="siteInfo.mapEmbed"
              title="Map showing the Aryan Constructions &amp; Interiors office in Vandalur"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <a :href="siteInfo.mapsHref" target="_blank" rel="noopener" class="link directions">
            <span>Get directions</span><span class="arrow">→</span>
          </a>
        </div>

        <!-- Reactive classes live on this wrapper, not on the v-reveal'd form -->
        <div :class="['form-wrap', { shake }]">
        <Transition name="stamp">
          <div v-if="stamped" class="stamp" aria-hidden="true">
            <span class="stamp-big">READY</span>
            <span class="stamp-small">✓ {{ stampDate }} · ARYAN CONSTRUCTIONS</span>
          </div>
        </Transition>
        <form ref="formEl" class="form" v-reveal novalidate @submit.prevent="onSubmit">
          <div class="field">
            <input id="fullName" v-model="form.fullName" type="text" required autocomplete="name" placeholder=" ">
            <label for="fullName">Full name</label>
          </div>
          <div class="field">
            <input id="phone" v-model="form.phone" type="tel" required autocomplete="tel" placeholder=" ">
            <label for="phone">Phone number</label>
          </div>
          <div class="field">
            <input id="email" v-model="form.email" type="email" autocomplete="email" placeholder=" ">
            <label for="email">Email address (optional)</label>
          </div>
          <div class="field select">
            <select id="projectType" v-model="form.projectType" required>
              <option value="" disabled>Select one</option>
              <option value="New house">New house</option>
              <option value="Interiors">Interiors</option>
              <option value="Renovation">Renovation</option>
              <option value="Commercial">Commercial</option>
              <option value="Not sure yet">Not sure yet</option>
            </select>
            <label for="projectType" class="static">Project type</label>
          </div>
          <div class="field">
            <textarea id="message" v-model="form.message" rows="4" required placeholder=" "></textarea>
            <label for="message">Tell us about your project</label>
          </div>

          <p class="note">Opens WhatsApp with your details filled in.</p>

          <button v-magnetic="0.15" type="submit" class="btn btn-gold btn-block">
            <span v-scramble.hover>Send on WhatsApp</span><span class="arrow">→</span>
          </button>
          <p class="status" role="status" aria-live="polite">{{ status }}</p>
        </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact { padding: var(--section) 0; }

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(2.5rem, 7vw, 6.5rem);
  align-items: start;
}
.left .lede { margin: 1.5rem 0 0; }

.details { margin: clamp(2rem, 4vw, 3rem) 0 0; border-top: 1px solid var(--rule); }
.details li {
  display: grid;
  grid-template-columns: 7rem 1fr;
  gap: 1rem;
  align-items: baseline;
  padding: 0.95rem 0;
  border-bottom: 1px solid var(--rule);
  font-size: 0.9375rem;
  color: var(--bone-70);
}
.details a { transition: color 0.3s var(--ease); }
.details a:hover { color: var(--gold); }

.map {
  margin-top: 2rem;
  height: 16rem;
  border: 1px solid var(--rule);
  background: var(--ink-1);
  overflow: hidden;
}
/* Google's light map pulled into the dark page */
.map iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  filter: grayscale(1) invert(0.9) contrast(0.92);
}
.directions { margin-top: 1rem; }

.form-wrap { position: relative; }
.form-wrap.shake { animation: shake 0.42s cubic-bezier(0.36, 0.07, 0.19, 0.97); }
@keyframes shake {
  10%, 90% { transform: translate(-1px, 1px); }
  20%, 80% { transform: translate(3px, -1px); }
  30%, 50%, 70% { transform: translate(-4px, 2px); }
  40%, 60% { transform: translate(4px, -2px); }
}

/* The RECEIVED stamp: slams down from above the page, rotated, and stays */
.stamp {
  position: absolute;
  z-index: 3;
  top: 32%;
  left: 50%;
  display: grid;
  justify-items: center;
  gap: 0.35rem;
  padding: 1rem 1.6rem 0.9rem;
  border: 3px solid var(--mark);
  outline: 1px solid var(--mark);
  outline-offset: 4px;
  color: var(--mark);
  font-family: var(--font-ui);
  background: rgba(8, 8, 7, 0.78);
  transform: translate(-50%, -50%) rotate(-11deg);
  pointer-events: none;
  mix-blend-mode: screen;
}
.stamp-big { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 600; letter-spacing: 0.18em; line-height: 1; }
.stamp-small { font-size: 0.625rem; letter-spacing: 0.2em; }
.stamp-enter-active { animation: slam 0.42s cubic-bezier(0.2, 0.9, 0.3, 1.25); }
.stamp-leave-active { transition: opacity 0.3s var(--ease); }
.stamp-leave-to { opacity: 0; }
@keyframes slam {
  0% { opacity: 0; transform: translate(-50%, -50%) rotate(-24deg) scale(2.6); }
  60% { opacity: 1; transform: translate(-50%, -50%) rotate(-9deg) scale(0.94); }
  100% { opacity: 1; transform: translate(-50%, -50%) rotate(-11deg) scale(1); }
}

.form { display: grid; gap: 1.75rem; }
.field { position: relative; }
.field input, .field textarea, .field select {
  width: 100%;
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--rule);
  color: var(--bone);
  padding: 1.5rem 0 0.7rem;
  font-size: 0.9375rem;
  font-weight: 400;
  border-radius: 0;
  transition: border-color 0.4s var(--ease);
}
.field textarea { resize: vertical; min-height: 5rem; }
.field select {
  padding-top: 1.5rem;
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--bone-45) 50%),
                    linear-gradient(135deg, var(--bone-45) 50%, transparent 50%);
  background-position: calc(100% - 12px) calc(50% + 4px), calc(100% - 7px) calc(50% + 4px);
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
}
.field select option { background: var(--ink-2); color: var(--bone); }

.field label {
  position: absolute;
  left: 0;
  top: 1.35rem;
  font-size: 0.9375rem;
  color: var(--bone-28);
  pointer-events: none;
  transition: transform 0.35s var(--ease), font-size 0.35s var(--ease), color 0.35s var(--ease), letter-spacing 0.35s var(--ease);
  transform-origin: left top;
}
.field label.static,
.field input:focus + label,
.field textarea:focus + label,
.field input:not(:placeholder-shown) + label,
.field textarea:not(:placeholder-shown) + label {
  transform: translateY(-1.3rem);
  font-size: 0.625rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bone-45);
}
.field input:focus, .field textarea:focus, .field select:focus {
  outline: none;
  border-bottom-color: var(--gold);
}
.field input:focus + label, .field textarea:focus + label { color: var(--gold); }

.note {
  font-size: 0.6875rem;
  color: var(--bone-28);
  border-left: 1px solid var(--gold);
  padding-left: 0.85rem;
  margin: 0;
  line-height: 1.6;
}
.status { margin: 0; font-size: 0.8125rem; color: var(--gold); min-height: 1.2rem; }

@media (max-width: 900px) {
  .grid { grid-template-columns: 1fr; }
  .details li { grid-template-columns: 5.5rem 1fr; font-size: 0.875rem; }
}
</style>
