<script setup lang="ts">
import type { Content } from "@prismicio/client";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
defineProps(
  getSliceComponentProps<Content.DetailSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);
</script>

<template>
  <Bounded
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div class="layout">
      <div class="cover">
        <PrismicImage :field="slice.primary.cover" class="img" />
      </div>

      <div class="content">
        <PrismicRichText
          :field="slice.primary.title"
          wrapper="h2"
          class="heading heading--sm"
        />
        <PrismicRichText :field="slice.primary.author"/>
		<div class="formate mb-8">
			<div v-for="item in slice.primary.formate" class="form">
			  {{ item.format }}
			</div>
		</div>

        <div class="prose max-w-none mt-12">
			<PrismicRichText :field="slice.primary.beschreibung" /> 
			<br/>
			<PrismicRichText :field="slice.primary.description" />
        </div>
      
		  <div class="sidebar">
			<div v-for="item in slice.primary.kategorien" class="kat">
			  {{ item.label }}
			</div>
		  </div>
	</div>
		  <div class="sidebardesk">
			<div v-for="item in slice.primary.kategorien" class="kat">
			  {{ item.label }}
			</div>
		  </div>
		</div>
  </Bounded>
</template>

<style scoped>
.formate {
	@apply mb-8;
}

.layout {
  @apply grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto;
}

@media (min-width: 1024px) {
	.layout {
		grid-template-columns: 225px 1fr 200px;
	}

	.sidebar {
		align-items: baseline;
	}
}
 @media (min-width: 728px) and (max-width: 1023px) {
	.layout {
	grid-template-columns: 225px 1fr;
  }
  .sidebar {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	align-items: stretch;
  }
  .kat {
	width: 200px;
	text-align: center;
  }
}

@media (min-width: 640px) and (max-width: 680px) {
	.sidebar {
		flex-direction: column;
		align-items: stretch;
	}

	.kat {
		@apply w-full text-left;
	}
	.img {
		max-width: 100%;
	}
}

@media (min-width: 681px) and (max-width: 727px) {
	.layout {
		grid-template-columns: 225px 1fr;
	}

	.sidebar {
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	gap: 0.5rem;
	justify-content: flex-start;
	align-items: flex-start;
	}

	.kat {
		width: 200px;
		text-align: center;
	}
	.img {
		max-width: 80%;
	}
}
@media (max-width: 639px) {
	.sidebar {
		flex-direction: column;
		align-items: stretch;
	}

	.kat {
		@apply w-full text-left;
	}
	.img {
		max-width: 100%;
	}
}
	


.cover {
  @apply flex justify-center md:justify-start items-start;
}

.content {
  @apply space-y-4;
}

.img {
  @apply w-full max-w-[200px] lg:max-w-md h-auto;
}

.sidebar {
	@apply mt-6 lg:hidden flex flex-wrap gap-2 items-start;
}

.sidebardesk {
	@apply hidden lg:flex flex-col gap-2 items-end flex-wrap;
}

.kat {
  @apply text-center px-4 py-2 rounded-xl bg-[#8f4200] text-white text-sm mr-2 mb-2 lg:w-[200px];
}

.form {
  @apply inline-block px-4 py-1 border border-[#8f4200] rounded-full text-sm text-[#8f4200] mr-5 mb-20;
}

.prose {
	@apply text-black leading-relaxed text-base mt-8;
}

</style>
