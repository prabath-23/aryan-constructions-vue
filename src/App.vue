<script setup>
import { onMounted } from 'vue'
import TheHeader from './components/TheHeader.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import StorySection from './components/StorySection.vue'
import TeamSection from './components/TeamSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import MarqueeBand from './components/MarqueeBand.vue'
import PortfolioSection from './components/PortfolioSection.vue'
import ProcessSection from './components/ProcessSection.vue'
import WhySection from './components/WhySection.vue'
import TestimonialsSection from './components/TestimonialsSection.vue'
import ContactSection from './components/ContactSection.vue'
import TheFooter from './components/TheFooter.vue'
import Lightbox from './components/Lightbox.vue'
import WhatsAppButton from './components/WhatsAppButton.vue'
import BlueprintGrid from './components/BlueprintGrid.vue'
import { marqueeItems } from './data/content'
import { runMotion } from './motion'
import { finishLoader } from './motion/loader'

// Children's onMounted hooks (which register their scroll setups) have all
// run by the time the parent's fires — so this runs them all, in DOM order.
onMounted(() => {
  runMotion()
  finishLoader()
})
</script>

<template>
  <div id="top">
    <BlueprintGrid />
    <TheHeader />
    <main>
      <HeroSection />
      <AboutSection />
      <StorySection />
      <TeamSection />
      <PortfolioSection />
      <ServicesSection />
      <MarqueeBand :items="marqueeItems" />
      <ProcessSection />
      <WhySection />
      <TestimonialsSection />
      <ContactSection />
    </main>
    <TheFooter />
    <WhatsAppButton />
    <Lightbox />
  </div>
</template>
