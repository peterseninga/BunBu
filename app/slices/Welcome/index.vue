<script setup lang="ts">
import type { Content } from "@prismicio/client";
import { getSliceComponentProps } from "@prismicio/vue";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
const props = defineProps(
  getSliceComponentProps<Content.WelcomeSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ]),
);

useHead({
  title: "BunBu",
})
</script>

<template>
  <section
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
	class="welcome-section"
  >
    <div class="content">
		<PrismicImage :field="slice.primary.background_image" class="img"/>
		<PrismicRichText :field="slice.primary.heading" wrapper="h1" class="h heading"/>
		<PrismicRichText :field="slice.primary.description" class="body--sm"/>
	</div>
  </section>
</template>

<style scoped>
.welcome-section {
	background-image: url('/Startbildschirm.png');
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	width: 100%;
	height: 400px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: -1;
}

.content {
	padding: 2rem;
	border-radius: 0.5rem;
	text-align: center;
	max-width: 48rem;
	color: white;
}

.h {
	text-align: center;
	color: white;
	font-size: 80px;
}

.logo {
	width: 80px;
	height: auto;
	margin-bottom: 1.5rem;
}

.b {
	--tw-text-opacity: 1;
    color: rgb(255 255 255 / var(--tw-text-opacity, 1));
}

.img {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto;
	height: 10rem;
	width: auto;
}
</style>
