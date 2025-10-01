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

useHead({
  title: "BunBu - About",
})
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
	display: grid;
	grid-template-columns: 1fr;
	gap: 2.5rem;
}

@media (min-width: 640px) {
	.layout {
		grid-template-columns: repeat(2, 1fr);
	}
}

.h {
	margin-bottom: 1rem;
}

@media (min-width: 640px) {
	.h {
		margin-bottom: 1.5rem;
	}
}

@media (min-width: 768px) {
	.h {
		margin-bottom: 2rem;
	}
}

.left {
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: justify;
}

@media (min-width: 640px) {
	.left {
		margin-top: 2rem;
	}
}

@media (min-width: 768px) {
	.left {
		margin-top: 1rem;
	}
}

.right {
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: justify;
}

.right > * + * {
	margin-top: 1rem;
}

.person-img {
	border-radius: 50%;
	object-fit: cover;
	width: 200px;
	height: 200px;
}

@media (min-width: 640px) and (max-width: 768px) {
	.person-img {
		width: 220px;
		height: 220px;
	}
}

@media (min-width: 768px) {
	.person-img {
		width: 250px;
		height: 250px;
	}
}

@media (min-width: 1024px) {
	.person-img {
		width: 280px;
		height: 280px;
	}
}

@media (min-width: 1280px) {
	.person-img {
		width: 300px;
		height: 300px;
	}
}

.logo-img {
	object-fit: contain;
	width: 160px;
	height: 127px;
}

@media (min-width: 640px) and (max-width: 768px) {
	.logo-img {
		width: 180px;
		height: 143px;
	}
}

@media (min-width: 768px) {
	.logo-img {
		width: 200px;
		height: 159px;
	}
}

@media (min-width: 1024px) {
	.logo-img {
		width: 220px;
		height: 175px;
	}
}

@media (min-width: 1280px) {
	.logo-img {
		width: 241px;
		height: 191px;
	}
}
</style>