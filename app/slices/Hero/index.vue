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
section .richheading {
  font-family: 'Marcellus', serif;
  font-size: 50px;
}

section .richtext {
  margin: 1em auto;
  font-family: 'Mulish', sans-serif;
  font-size: 18px;
  color: #334155; /* text-slate-700 */
  max-width: 32rem; /* max-w-lg */
}

section .richbutton {
  max-width: 600px;
  font-family: 'Mulish', sans-serif;
  font-size: 18px;
  display: block;
  width: fit-content;
  background-color: #0e7490; /* bg-cyan-700 */
  color: white;
  font-weight: 700;
  padding: 0.75rem 39px; /* py-3 px-[39px] */
  border-radius: 9999px; /* rounded-full */
  letter-spacing: 0.05em; /* tracking-wider */
  transition: background-color 0.3s ease;
}

section .richbutton:hover {
  background-color: #164e63; /* hover:bg-cyan-900 */
}

section .image {
  margin: 2em auto;
  width: 100%;
}

@media (min-width: 640px) {
  section .image {
    width: 80%;
  }
}

@media (min-width: 768px) {
  section .image {
    width: 75%;
  }
}

@media (min-width: 1024px) {
  section .image {
    width: 66.666667%;
  }
}

@media (min-width: 1280px) {
  section .image {
    width: 50%;
  }
}

.horizontal {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  text-align: start;
  justify-items: center;
  align-items: start;
}

@media (min-width: 768px) {
  .horizontal {
    grid-template-columns: repeat(2, 1fr);
  }
}

.horizontal2 {
  padding-top: 120px;
  text-align: center;
  place-items: center;
  justify-content: center;
  display: grid;
}

.default {
  display: grid;
  grid-template-columns: 1fr;
  text-align: center;
  align-items: center;
  place-items: center;
}
</style>