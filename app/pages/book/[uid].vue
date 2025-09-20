<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useAsyncData } from '#app';
import { usePrismic } from '@prismicio/vue';
import { components } from '~/slices';

const route = useRoute();
const uid = route.params.uid as string;

const prismic = usePrismic();

const { data: book } = await useAsyncData(`book-${uid}`, () =>
  prismic.client.getByUID('book', uid)
);

useHead({
  title: prismic.asText(book.value?.data.title),
});
</script>

<template>
  <SliceZone
    wrapper="main"
    :slices="book?.data.slices ?? []"
    :components="components"
  />
</template>