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

// Helper Funktion damit BookURL von Titel generiert werden kann
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

			<!-- Buecher Sektion -->
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
								<PrismicText :field="item.titel" wrapper="h5" class="book-title" />
								<PrismicText :field="item.author" wrapper="p" class="book-author" />
							</div>
						</NuxtLink>
					</template>
					<div v-else class="text-center text-gray-500 py-8">
						Keine Bücher gefunden. Fügen Sie Bücher in Prismic hinzu.
					</div>
				</div>
				<NuxtLink to="/suche?q=Buch&filter=format" class="load-more-link">
					<PrismicText :field="slice.primary.mehr_laden"/>
					<span class="count-badge"> (1829)</span>
				</NuxtLink>
			</div>
			
			<!-- Hoerbuecher Sektion -->
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
								<PrismicText :field="item.title" wrapper="h5" class="book-title"/>
								<PrismicText :field="item.author" wrapper="p" class="book-author" />
							</div>
						</NuxtLink>
					</template>
					<div v-else class="text-center text-gray-500 py-8">
						Keine Hörbücher gefunden. Fügen Sie Hörbücher in Prismic hinzu.
					</div>
				</div>
				<NuxtLink to="/suche?q=Hörbuch&filter=format" class="load-more-link">
					<PrismicText :field="slice.primary.mehr_laden" />
					<span class="count-badge"> (991)</span>
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

.book-title {
	font-size: 1rem;
  font-weight: 600;
  color: #000;
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
}

.lay {
	@apply grid sm:grid-cols-1 lg:grid-cols-2;
}

.done {
	@apply flex flex-col gap-6 w-full;
}

.book-card {
	@apply flex flex-row place-items-center gap-4 sm:w-[450px] md:w-[500px] lg:w-[450px] xl:w-[500px] bg-[rgba(0,75,90,0.1)] rounded-lg p-4;
}

.bottom {
	@apply pl-4 sm:pl-0;
}

.audio {
	@apply md:bg-[rgba(0,75,90,0.1)] md:rounded-lg md:p-4;
}

.book-author {
	color: #666;
	margin: 0;
	font-size: 0.9rem;
}

.count-badge {
	color: #6b7280;
	font-size: 0.95em;
}

.book-image {
	width: 85px;
	height: 115px;
	object-fit: cover;
	border-radius: 4px;
	flex-shrink: 0;
}

.book-info {
	flex: 1;
}

/* Load More Link Animation */
.load-more-link {
	display: inline-block;
	padding: 0.2rem 0;
	margin-top: 1rem;
	position: relative;
	color: #000;
	text-decoration: none;
}

.load-more-link::after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	width: 0;
	height: 1px;
	background: #000;
	transition: all 0.3s ease;
	transform: translateX(-50%);
}

.load-more-link:hover::after {
	width: 100%;
}
</style>