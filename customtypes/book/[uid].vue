<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useAsyncData } from 'nuxt/app';
import { usePrismic } from '@prismicio/vue';

const route = useRoute();
const uid = route.params.uid as string;

const prismic = usePrismic();

const { data: book } = await useAsyncData(`book-${uid}`, () =>
  prismic.client.getByUID('book', uid)
);

console.log('📚 Buch geladen:', book)
console.log('📚 Slices:', book.value?.data?.slices);
</script>

<template>
  <Bounded>
    <div v-if="book">
      <SliceZone :slices="book.data.slices" :context="book" />
    </div>
    <div v-else class="not-found">
      <p>Dieses Buch wurde nicht gefunden.</p>
    </div>
  </Bounded>
</template>

<style scoped>
.not-found {
  @apply text-center text-red-500 pt-20;
}
</style>