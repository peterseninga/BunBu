<script setup lang="ts">
import type { Content } from "@prismicio/client";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.ImpressumSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ]),
);

useHead({
  title: "BunBu - Impressum",
})
</script>

<template>
  <Bounded
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <PrismicRichText :field="slice.primary.heading" wrapper="h1" class="h heading heading--xl"/>
	<div class="left">
		<PrismicRichText :field="slice.primary.body" />
	</div>
  </Bounded>
</template>

<style scoped>
.h {
	margin-bottom: 1rem; /* mb-4 */
}

@media (min-width: 640px) {
	.h {
		margin-bottom: 1.5rem; /* sm:mb-6 */
	}
}

@media (min-width: 768px) {
	.h {
		margin-bottom: 2rem; /* md:mb-8 */
	}
}

.left {
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: justify;
}
</style>