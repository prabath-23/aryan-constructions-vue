<script setup>
import { onMounted } from 'vue'
import TheHeader from './components/TheHeader.vue'
import HeroSection from './components/HeroSection.vue'
import TrustBar from './components/TrustBar.vue'
import AboutSection from './components/AboutSection.vue'
import ServicesSection from './components/ServicesSection.vue'
import MarqueeBand from './components/MarqueeBand.vue'
import PortfolioSection from './components/PortfolioSection.vue'
import ProcessSection from './components/ProcessSection.vue'
import WhySection from './components/WhySection.vue'
import TestimonialsSection from './components/TestimonialsSection.vue'
import ContactSection from './components/ContactSection.vue'
import TheFooter from './components/TheFooter.vue'
import Lightbox from './components/Lightbox.vue'
import CustomCursor from './components/CustomCursor.vue'
import WhatsAppButton from './components/WhatsAppButton.vue'
import BlueprintGrid from './components/BlueprintGrid.vue'
import StatusBar from './components/StatusBar.vue'
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
      <TrustBar />
      <AboutSection />
      <ServicesSection />
      <MarqueeBand :items="marqueeItems" />
      <PortfolioSection />
      <ProcessSection />
      <WhySection />
      <TestimonialsSection />
      <ContactSection />
    </main>
    <TheFooter />
    <StatusBar />
    <WhatsAppButton />
    <Lightbox />
    <CustomCursor />
  </div>
</template>
