<script setup lang="ts">
import type { Content } from "@prismicio/client";
import { getSliceComponentProps } from "@prismicio/vue";
import { asHTML } from "@prismicio/helpers";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
const { slice } = defineProps(
  getSliceComponentProps<Content.AboutSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ]),
);

const formattedText = asHTML(slice.primary.rechts).replace(
	"<strong>Moin, ich bin Inga</strong>",
	'<strong><span style="color: #8f4200;">Moin, ich bin Inga</span></strong>'
);

console.log(asHTML(slice.primary.rechts));
</script>

<template>
  <Bounded
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
  <PrismicRichText :field="slice.primary.heading" wrapper="h1" class="h heading heading--xl" />
  <div class="layout">
	<div class="left">
		<PrismicRichText :field="slice.primary.links"/>
	</div>
	<div class="right">
		<PrismicImage :field="slice.primary.person" class="person-img" />
		<div v-html="formattedText" />
		<PrismicImage :field="slice.primary.logo" class="logo-img"/>
	</div>
  </div>
</Bounded>
</template>


<style scoped>
.layout {
	@apply grid sm:grid-cols-2 grid-cols-1 gap-10;
}

.h {
	@apply mb-4 sm:mb-6 md:mb-8;
}

.left {
	@apply flex flex-col justify-center text-justify;
	@screen md {
		margin-top: 1rem;
	}
	@screen sm {
		margin-top: 2rem;
	}
}

.right {
	@apply flex flex-col items-center space-y-4;
	text-align: justify;
}

.person-img {
	width: 300px;
	height: 300px;
	border-radius: 50%;
	object-fit: cover;
}

.logo-img {
	width: 241px;
	height: 191px;
	object-fit: contain;
}
</style>