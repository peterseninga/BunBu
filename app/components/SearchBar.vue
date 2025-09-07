<template>
  <div class="relative w-full sm:w-64">
    <input
      v-model="query"
      @input="onInput"
      type="text"
      placeholder="Hier suchen..."
      class="w-full px-4 py-2 rounded-full text-black sm:flex-row"
    />
    <ul v-if="suggestions.length" class="absolute bg-white text-black w-full mt-1 rounded shadow">
      <li
        v-for="(suggestion, index) in suggestions"
        :key="index"
        @click="selectSuggestion(suggestion)"
        class="px-4 py-2 hover:bg-gray-200 cursor-pointer"
      >
        {{ suggestion }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const query = ref('');
const suggestions = ref<string[]>([]);

// Beispiel-Datenquelle
const allWords = ['Apfel', 'Banane', 'Birne', 'Buch', 'Buchstaben', 'Butter', 'Bus'];

function onInput() {
  const q = query.value.toLowerCase();
  suggestions.value = allWords.filter(word => word.toLowerCase().startsWith(q)).slice(0, 5);
}

function selectSuggestion(suggestion: string) {
  query.value = suggestion;
  suggestions.value = [];
  // Optional: Trigger Suche oder Navigation
}
</script>