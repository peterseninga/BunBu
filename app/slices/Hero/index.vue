<script setup lang="ts">
import type { Content } from "@prismicio/client";
import Bounded from "~/components/Bounded.vue";



// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.HeroSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);
</script>

<template>
  <Bounded :data-slice-type="slice.slice_type" :data-slice-variation="slice.variation">
    <div :class="{
      'horizontal': slice.variation === 'horizontal'
    }">
    <div 
      :class="{
        'default': slice.variation === 'default',
        'horizontal2': slice.variation === 'horizontal'
      }"
    >
      <PrismicRichText :field="slice.primary.heading" class="richheading" wrapper="section" />
      <PrismicRichText :field="slice.primary.body" class="richtext" wrapper="section" />
      <PrismicLink :field="slice.primary.button_link" class="richbutton" wrapper="section">
        {{ slice.primary.button_text }}
      </PrismicLink>
    </div>
    <PrismicImage :field="slice.primary.image" class="image" wrapper="section" />
  </div>
  </Bounded>
</template>

<style scoped>
section:deep(.richheading) {
  font-family: 'Marcellus', serif;
  font-size: 50px;
}
</style>

<style scoped>
section:deep(.richtext) {
  margin: 1em auto;
  font-family: 'Mulish', sans-serif;
  font-size: 18px;
  @apply text-slate-700 max-w-lg;
}
</style>

<style scoped>
section:deep(.richbutton) {
  max-width: 600px;
  font-family: 'Mulish', sans-serif;
  font-size: 18px;
  @apply block w-fit bg-cyan-700 hover:bg-cyan-900 text-white font-bold py-3 px-[39px] rounded-full tracking-wider;
}
</style>

<style scoped>
section:deep(.image) {
  @apply max-w-4xl;
  margin: 2em auto;
  max-height: fit-content;
  }
</style>

<style scoped>
.horizontal {
  @apply grid grid-cols-2;
  text-align: start;
  justify-items: center;
  align-items: start;
}

.horizontal2 {
  padding-top: 120px;
}

.default {
  @apply grid grid-cols-1 ;
  text-align: center;
  align-items: center;
  place-items: center;
}
</style>