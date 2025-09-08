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
	@apply mb-4 sm:mb-6 md:mb-8;
}

.left {
	@apply flex flex-col justify-center text-justify;
}
</style>