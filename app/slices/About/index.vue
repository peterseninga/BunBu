<script setup lang="ts">
import type { Content } from "@prismicio/client";
import { getSliceComponentProps } from "@prismicio/vue";
import { asHTML } from "@prismicio/helpers";

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
	border-radius: 50%;
	object-fit: cover;
	
	/* Mobile: 200px */
	width: 200px;
	height: 200px;
	
	/* Small Tablet (640-768px): 220px */
	@media (min-width: 640px) and (max-width: 768px) {
		width: 220px;
		height: 220px;
	}
	
	/* Tablet (md): 250px */
	@screen md {
		width: 250px;
		height: 250px;
	}
	
	/* Desktop (lg): 280px */
	@screen lg {
		width: 280px;
		height: 280px;
	}
	
	/* Large Desktop (xl): 300px */
	@screen xl {
		width: 300px;
		height: 300px;
	}
}

.logo-img {
	object-fit: contain;
	
	/* Mobile: 160px × 127px (ca. 66% der Originalgröße) */
	width: 160px;
	height: 127px;
	
	/* Small Tablet (640-768px): 180px × 143px (ca. 75% der Originalgröße) */
	@media (min-width: 640px) and (max-width: 768px) {
		width: 180px;
		height: 143px;
	}
	
	/* Tablet (md): 200px × 159px (ca. 83% der Originalgröße) */
	@screen md {
		width: 200px;
		height: 159px;
	}
	
	/* Desktop (lg): 220px × 175px (ca. 91% der Originalgröße) */
	@screen lg {
		width: 220px;
		height: 175px;
	}
	
	/* Large Desktop (xl): 241px × 191px (100% - Original) */
	@screen xl {
		width: 241px;
		height: 191px;
	}
}
</style>