<script setup>
// Small line icons drawn for this site (24px grid, 1.5 stroke, currentColor),
// so the stats, team and values lists match the mockups without an icon font.
defineProps({ name: { type: String, required: true } })

const ICONS = {
  calendar: 'M4 6.5h16v14H4z M4 10.5h16 M8.5 3.5v5 M15.5 3.5v5',
  layers: 'M12 3.5l8.5 4.5L12 12.5 3.5 8z M3.5 12.2l8.5 4.5 8.5-4.5 M3.5 16.2l8.5 4.5 8.5-4.5',
  helmet: 'M3.5 17.5h17 M5.5 17.5a6.5 6.5 0 0 1 13 0 M10 11.5V7.5h4v4 M4.5 17.5v2h15v-2',
  pin: 'M12 21s-6.5-6-6.5-11.5a6.5 6.5 0 0 1 13 0C18.5 15 12 21 12 21z M12 7.2a2.3 2.3 0 1 0 0 4.6a2.3 2.3 0 1 0 0-4.6z',
  binoculars: 'M6.5 12.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7z M17.5 12.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7z M10 16h4 M3.4 14.5L6 5h3l1 9 M20.6 14.5L18 5h-3l-1 9',
  target: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M12 7.5a4.5 4.5 0 1 0 0 9a4.5 4.5 0 1 0 0-9z M12 11.2a.8.8 0 1 0 0 1.6a.8.8 0 1 0 0-1.6z',
  worker: 'M6.5 10a5.5 5.5 0 0 1 11 0 M5 10h14 M12 4.5v2.5 M8.5 10a3.5 3.5 0 0 0 7 0 M5 21a7 7 0 0 1 14 0',
  clipboard: 'M5.5 4.5h13v16h-13z M9 4.5V3h6v1.5 M8.5 11l2.2 2.2 4.8-4.7 M8.5 17h7',
  compass: 'M12 3a1.6 1.6 0 1 0 0 3.2a1.6 1.6 0 1 0 0-3.2z M11 6L6 21 M13 6l5 15 M7.4 16.5c3 1.4 6.2 1.4 9.2 0',
  users: 'M9 5a3.2 3.2 0 1 0 0 6.4A3.2 3.2 0 1 0 9 5z M3 20a6 6 0 0 1 12 0 M16.5 6.5a2.6 2.6 0 1 1 0 5.2 M17 14.2a5 5 0 0 1 4 5.8',
  calculator: 'M5.5 3h13v18h-13z M8.5 6h7v4h-7z M8.75 14h.01 M12 14h.01 M15.25 14h.01 M8.75 17.5h.01 M12 17.5h.01 M15.25 17.5h.01',
  award: 'M12 3a6 6 0 1 0 0 12a6 6 0 1 0 0-12z M8.6 14l-1.6 7.5 5-2.7 5 2.7-1.6-7.5',
  shield: 'M12 3l7.5 3v5.5c0 4.7-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.8-7.5-9.5V6z M8.7 12l2.3 2.3 4.3-4.6',
  bulb: 'M9 17.5h6 M10 20.5h4 M12 3a6 6 0 0 0-3.8 10.6c.6.6.8 1.3.8 2.1v.3h6v-.3c0-.8.2-1.5.8-2.1A6 6 0 0 0 12 3z',
  smile: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M8.3 14a4.2 4.2 0 0 0 7.4 0 M9 9.5h.01 M15 9.5h.01',
  clock: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18z M12 7v5.2l3.4 2.1',
  plus: 'M12 5v14 M5 12h14',
}
</script>

<template>
  <svg class="line-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path :d="ICONS[name]" />
  </svg>
</template>

<style scoped>
.line-icon {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
