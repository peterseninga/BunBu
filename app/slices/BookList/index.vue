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
							:to="`/book/${item.slug || createSlugFromTitle(item.titel?.[0]?.text || '')}`" 
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
							:to=" `/book/${item.slug || createSlugFromTitle(item.title?.[0]?.text || '')}`" 
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
	display: grid;
	grid-template-columns: 1fr;
	gap: 1rem 1rem;
	max-width: 64rem;
	margin-left: auto;
	margin-right: auto;
	place-items: center;
}

@media (min-width: 640px) {
	.layout {
		grid-template-columns: 1fr;
	}
}

.layout-left {
	margin-left: 0;
}

@media (min-width: 640px) {
	.layout-left {
		margin-left: 2.25rem;
	}
}

.h {
	width: 100%;
	text-align: center;
	place-items: center;
	align-items: center;
	font-weight: 500;
	padding-top: 1.75rem;
	padding-bottom: 2rem;
}

.hed {
	text-align: start;
	align-items: flex-start;
	font-weight: 500 !important;
	margin-top: auto;
}

.lay {
	display: grid;
	grid-template-columns: 1fr;
}

@media (min-width: 640px) {
	.lay {
		grid-template-columns: 1fr;
	}
}

@media (min-width: 1024px) {
	.lay {
		grid-template-columns: repeat(2, 1fr);
	}
}

.done {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	width: 100%;
}

.book-card {
	display: flex;
	flex-direction: row;
	place-items: center;
	gap: 1rem;
	width: 100%;
	background-color: rgba(0, 75, 90, 0.1);
	border-radius: 0.5rem;
	padding: 1rem;
}

@media (min-width: 640px) {
	.book-card {
		width: 450px;
	}
}

@media (min-width: 768px) {
	.book-card {
		width: 500px;
	}
}

@media (min-width: 1024px) {
	.book-card {
		width: 450px;
	}
}

@media (min-width: 1280px) {
	.book-card {
		width: 500px;
	}
}

.bottom {
	padding-left: 1rem;
}

@media (min-width: 640px) {
	.bottom {
		padding-left: 0;
	}
}

.audio {
	background-color: transparent;
	border-radius: 0;
	padding: 0;
}

@media (min-width: 768px) {
	.audio {
		background-color: rgba(0, 75, 90, 0.1);
		border-radius: 0.5rem;
		padding: 1rem;
	}
}

.book-image {
	width: 85px;
	height: 115px;
	object-fit: cover;
	border-radius: 4px;
	flex-shrink: 0;
}

.book-info {
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 0.25rem;
}
</style>