<script setup>
const route = useRoute()
const slug = route.params.slug

// Alle Bücher aus der CSV laden
const { data: books } = await $fetch('/api/books')

// Passendes Buch anhand des Slugs finden
const book = books.find(b => b.slug === slug)

// 404 wenn Buch nicht gefunden
if (!book) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Buch nicht gefunden'
  })
}

// SEO Meta-Tags
useSeoMeta({
  title: `${book.title} - ${book.author}`,
  ogTitle: `${book.title} - ${book.author}`,
  description: book.description,
  ogDescription: book.description,
  ogImage: book.cover_image,
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- Zurück-Button -->
    <NuxtLink to="/" class="inline-flex items-center text-blue-600 hover:underline mb-6">
      ← Zurück zur Übersicht
    </NuxtLink>

    <div class="grid md:grid-cols-2 gap-8">
      <!-- Buchcover -->
      <div class="flex justify-center">
        <img 
          :src="book.cover_image" 
          :alt="book.title"
          class="w-80 h-auto object-cover rounded-lg shadow-lg"
        />
      </div>

      <!-- Buchinformationen -->
      <div class="space-y-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ book.title }}</h1>
          <p class="text-xl text-gray-600 mb-4">von {{ book.author }}</p>
        </div>

        <div class="space-y-3">
          <div v-if="book.genre" class="flex">
            <span class="font-semibold text-gray-700 w-20">Genre:</span>
            <span class="text-gray-600">{{ book.genre }}</span>
          </div>
          <div class="flex">
            <span class="font-semibold text-gray-700 w-20">Typ:</span>
            <span class="text-gray-600">{{ book.type === 'audiobook' ? 'Hörbuch' : 'Buch' }}</span>
          </div>
        </div>

        <div v-if="book.description" class="prose">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Beschreibung</h3>
          <p class="text-gray-700 leading-relaxed">{{ book.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>