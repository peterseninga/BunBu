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
  margin-bottom: 2rem;
}

.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 72rem;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 768px) {
  .layout {
    grid-template-columns: repeat(3, 1fr);
  }
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
    width: 100%;
    text-align: left;
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
    width: 100%;
    text-align: left;
  }

  .img {
    width: 30%;
    max-width: 30%;
  }
}

.cover {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

@media (min-width: 768px) {
  .cover {
    justify-content: flex-start;
  }
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  margin-top: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: flex-start;
}

@media (min-width: 1024px) {
  .sidebar {
    display: none;
  }
}

.sidebardesk {
  display: none;
}

@media (min-width: 1024px) {
  .sidebardesk {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-end;
    flex-wrap: wrap;
  }
}

.kat {
  text-align: center;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  background-color: #8f4200;
  color: white;
  font-size: 0.875rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

@media (min-width: 1024px) {
  .kat {
    width: 200px;
  }
}

.form {
  display: inline-block;
  padding: 0.25rem 1rem;
  border: 1px solid #8f4200;
  border-radius: 9999px;
  font-size: 0.875rem;
  color: #8f4200;
  margin-right: 1.25rem;
  margin-bottom: 5rem;
}

.prose {
  color: black;
  line-height: 1.625;
  font-size: 1rem;
  margin-top: 2rem;
}

.max-w-none {
  max-width: none;
}

.mt-12 {
  margin-top: 3rem;
}
</style>