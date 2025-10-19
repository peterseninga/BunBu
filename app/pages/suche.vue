<template>
  <div>
    <BookResults />
  </div>
</template>

<script setup>
// Expliziter Import
import BookResults from '~/slices/BookResults/index.vue'

console.log('Suchergebnisse-Seite geladen')
console.log('Query params:', useRoute().query)
</script>