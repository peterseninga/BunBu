<script setup lang="ts">
import type { Content } from "@prismicio/client";

const props = defineProps(
	getSliceComponentProps<Content.BookListSlice>([
		"slice",
		"index",
		"slices",
		"context",
	]),
);

// Helper function to create book URL from title
const createSlugFromTitle = (title: string) => {
  return title.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};
</script>

<template>
	<Bounded :data-slice-type="slice.slice_type" :data-slice-variation="slice.variation">
		<div class="lay">
			<!-- Bücher Sektion -->
			<div class="layout">
				<PrismicText :field="slice.primary.heading" wrapper="h2" class="h heading heading--lg" />
				<div class="done">
					<template v-if="slice.primary.content && slice.primary.content.length > 0">
						<NuxtLink 
							:to="item.book_link?.url || `/book/${item.slug || createSlugFromTitle(item.titel?.[0]?.text || '')}`" 
							v-for="(item, index) in slice.primary.content" 
							:key="index"
							class="book-card hover:bg-[rgba(0,75,90,0.15)] transition-colors cursor-pointer block"
						>
							<PrismicImage :field="item.cover_image" class="book-image"/> 
							<div class="book-info">
								<PrismicText :field="item.titel" wrapper="h5" class="hed body--sm" />
								<PrismicText :field="item.author" wrapper="p" />
							</div>
						</NuxtLink>
					</template>
					<div v-else class="text-center text-gray-500 py-8">
						Keine Bücher gefunden. Fügen Sie Bücher in Prismic hinzu.
					</div>
				</div>
				<NuxtLink to="/suche?q=Buch&filter=format" class="hover:underline">
					<PrismicText :field="slice.primary.mehr_laden"/>
				</NuxtLink>
			</div>
			
			<!-- Hörbücher Sektion -->
			<div class="layout">
				<PrismicText :field="slice.primary.heading_2" wrapper="h2" class="h heading heading--lg" />
				<div class="done layout-left">
					<template v-if="slice.primary.content_2 && slice.primary.content_2.length > 0">
						<NuxtLink 
							:to="item.book_link?.url || `/book/${item.slug || createSlugFromTitle(item.title?.[0]?.text || '')}`" 
							v-for="(item, index) in slice.primary.content_2" 
							:key="index"
							class="book-card bottom audio hover:bg-[rgba(0,75,90,0.15)] transition-colors cursor-pointer block"
						>
							<PrismicImage :field="item.cover_image" class="book-image"/>
							<div class="book-info">
								<PrismicText :field="item.title" wrapper="h5" class="hed body--sm"/>
								<PrismicText :field="item.author" wrapper="p" />
							</div>
						</NuxtLink>
					</template>
					<div v-else class="text-center text-gray-500 py-8">
						Keine Hörbücher gefunden. Fügen Sie Hörbücher in Prismic hinzu.
					</div>
				</div>
				<NuxtLink to="/suche?q=Hörbuch&filter=format" class="hover:underline">
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
	width: 85px;
	height: 115px;
	object-fit: cover;
	border-radius: 4px;
	flex-shrink: 0;
}

.book-info {
	@apply flex flex-col justify-center gap-1;
}
</style>