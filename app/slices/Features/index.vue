<script setup lang="ts">
import type { Content } from "@prismicio/client";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.FeaturesSlice>([
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
  	<PrismicText :field="slice.primary.heading" 
	wrapper="h2"
	class="h heading heading--md "
	/>
<div class="layout">
	<div 
	 v-for="item in slice.primary.features" class="item">
		<div v-if="item.icon" class="item2">
			<Icon :name="item.icon" />

		</div>
		<PrismicText :field="item.title" 
		wrapper="h3"
		class="he heading heading--sm !font-medium"/>
		<PrismicText :field="item.description" 
		wrapper="section"
		class="descr"/>
	</div>
 </div>   
</Bounded>
</template>

<style scoped>
.h {
	text-align: center;
	font-weight: 500; /* entspricht !font-medium */
	padding-bottom: 2.5rem; /* pb-10 */
}

.he {
	margin-top: 1rem; /* mt-4 */
	padding-bottom: 1.25rem; /* pb-5 */
}

.layout {
	display: grid;
	grid-template-columns: repeat(1, minmax(0, 1fr));
	gap: 3rem 2rem; /* gap-y-12 gap-x-8 */
	max-width: 80rem; /* max-w-5xl */
	margin-left: auto;
	margin-right: auto;
	place-items: center;
}

@media (min-width: 640px) {
	.layout {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		place-items: start;
	}
}

@media (min-width: 1024px) {
	.layout {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
}

.descr {
	font-size: 1rem; /* text-base */
	font-weight: 500; /* font-medium */
	font-family: 'YourBodyFont', sans-serif; /* font-body */
	color: #475569; /* text-slate-600 */
	line-height: 1.75; /* leading-loose */
}

.item {
	max-width: 20rem; /* max-w-xs */
	display: grid;
	text-align: center;
	place-items: center;
}

@media (min-width: 640px) {
	.item {
		place-items: start;
		text-align: left;
	}
}

.item2 {
	margin-bottom: 0;
}
</style>
