<script setup lang="ts">
import type { Content } from "@prismicio/client";
import { asText } from "@prismicio/client";

// The array passed to `getSliceComponentProps` is purely optional.
// Consider it as a visual hint for you when templating your slice.
const props = defineProps(
  getSliceComponentProps<Content.DetailSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

const bookTitle = computed(() => {
  if (props.slice?.primary?.title) {
    return asText(props.slice.primary.title);
  }
  return "Details";
});

useHead({
  title: computed(() => `BunBu - ${bookTitle.value}`),
});

</script>

<template>
  <Bounded
    :data-slice-type="slice.slice_type"
    :data-slice-variation="slice.variation"
  >
    <div class="layout">
      <div class="cover">
        <img :src="slice.primary.cover_url" alt="Cover" class="img" />
      </div>

      <div class="content">
        <PrismicRichText
          :field="slice.primary.title"
          wrapper="h2"
          class="heading heading--sm"
        />
        <PrismicRichText :field="slice.primary.author" />
        <div class="formate">
          <div v-for="item in slice.primary.formate" class="form">
            {{ item.format }}
          </div>
        </div>

        <div class="prose max-w-none mt-12">
          <br />
          <strong>Beschreibung:</strong>
          <br />
          <br />

          <PrismicRichText :field="slice.primary.beschreibung" />
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

  .img {
    width: 120%;
    max-width: 120%;
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
    width: 30%;
    max-width: 30%;
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
    width: 80%;
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
    width: 30%;
    max-width: 30%;
  }

}

.cover {
  @apply flex justify-center md:justify-start items-start;
}

.content {
  @apply space-y-4;
}

.img {
  display: block;
  overflow: hidden;
  height: auto;
  margin: 0 auto;
  object-fit: cover;
  border-radius: 10px;
  flex-shrink: 0;
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
