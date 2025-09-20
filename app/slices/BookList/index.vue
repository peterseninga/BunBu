<script setup lang="ts">
import type { Content } from "@prismicio/client";




// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
	getSliceComponentProps<Content.BookListSlice>([
		"slice",
		"index",
		"slices",
		"context",
	]),
);
</script>

<template>
	<Bounded :data-slice-type="slice.slice_type" :data-slice-variation="slice.variation">
		<div class="lay">
			<div class="layout">
				<PrismicText :field="slice.primary.heading" wrapper="h2" class="h heading heading--lg" />
				<div class="done">
					<!-- NuxtLink to .book noch anpassen, denn .book gibts noch nicht haha -->
					<NuxtLink to="`/book/${item.book.uid}`" v-for="item in slice.primary.content" class="book-card">
						<PrismicImage :field="item.cover_image" class="book-image" />
						<div class="book-info">
							<PrismicText :field="item.titel" wrapper="h5" class="hed body--sm" />
							<PrismicText :field="item.author"  />
						</div>
					</NuxtLink>
				</div>
				<NuxtLink to="/about" class="hover:underline">
					<PrismicText :field="slice.primary.mehr_laden"/>
				</NuxtLink>
			</div>
			
			<div class="layout ">
					<PrismicText :field="slice.primary.heading_2" wrapper="h2" class="h heading heading--lg" />
					<div class="done layout-left">
						<NuxtLink to="/.book" v-for="item in slice.primary.content_2" class="book-card bottom audio">
							<PrismicImage :field="item.cover_image" class="book-image"/>
							<div class="book-info">
								<PrismicText :field="item.title" wrapper="h5" class="hed body--sm"/>
								<PrismicText :field="item.author" />
							</div>
						</NuxtLink>
					</div>
					<NuxtLink to="/impressum" class="hover:underline">
						<PrismicText :field="slice.primary.mehr_laden" />
					</NuxtLink>
				</div>
				</div>

	</Bounded>
</template>

<style scoped>


.layout {
	@apply grid sm:grid-cols-1 gap-x-4 gap-y-2 max-w-5xl mx-auto place-items-center;
}

.layout-left {
	@apply sm:ml-9;
}

.h {
	@apply w-full text-center place-items-center items-center font-medium pt-7 pb-8;
}

.hed {
	@apply text-start items-start !font-medium mt-auto;
}

.lay {
	@apply grid sm:grid-cols-1 lg:grid-cols-2;
}

.done {
	@apply flex flex-col gap-6 w-full;
}

.book-card {
	@apply flex flex-row place-items-center gap-4 sm:w-[400px] md:w-[500px] lg:w-[500px] bg-[rgba(0,75,90,0.1)] rounded-lg p-4;
}

.bottom {
	@apply pl-4 sm:pl-0;
}

.audio {
	@apply md:bg-[rgba(0,75,90,0.1)] md:rounded-lg md:p-4;
}

.book-image {
	@apply w-24 h-auto object-cover;
}

.book-info {
	@apply flex flex-col justify-center gap-1;
}
</style>