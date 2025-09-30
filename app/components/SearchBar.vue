<template>
  <div class="search-container">
    <div class="search-input-wrapper">
      <input
        v-model="query"
        @input="onInput"
        @keydown.enter="handleEnterKey"
        @keydown.escape="clearSuggestions"
        @keydown.arrow-down="navigateSuggestions(1)"
        @keydown.arrow-up="navigateSuggestions(-1)"
        @focus="showSuggestions = true"
        @blur="hideSuggestionsDelayed"
        type="text"
        placeholder="Hier suchen..."
        class="search-input"
        ref="searchInput"
      />
      
      <button 
        @click="handleEnterKey"
        class="search-button"
        :disabled="!query.trim()"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="M21 21l-4.35-4.35"></path>
        </svg>
      </button>
    </div>

    <!-- Suggestion Dropdown -->
    <div 
      v-if="showSuggestions && (filteredSuggestions.length > 0 || isLoading)"
      class="suggestions-dropdown"
    >
      <!-- Loading -->
      <div v-if="isLoading" class="suggestion-item loading">
        <div class="loading-spinner"></div>
        <span>Hier suchen...</span>
      </div>

      <!-- No Results -->
      <div v-else-if="query.length > 0 && filteredSuggestions.length === 0" class="suggestion-item no-results">
        <span>Keine Ergebnisse für "{{ query }}"</span>
      </div>

      <!-- Suggestions -->
      <div
        v-for="(suggestion, index) in filteredSuggestions"
        :key="index"
        @click="selectSuggestion(suggestion)"
        @mouseenter="selectedIndex = index"
        class="suggestion-item"
        :class="{ 
          'selected': index === selectedIndex,
          'book': suggestion.type === 'book',
          'author': suggestion.type === 'author',
          'category': suggestion.type === 'category',
          'format': suggestion.type === 'format'
        }"
      >
        <div class="suggestion-icon">
          <svg v-if="suggestion.type === 'book'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          <svg v-else-if="suggestion.type === 'author'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12l2 2 4-4"></path>
            <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
            <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
          </svg>
        </div>

        <div class="suggestion-content">
          <div class="suggestion-main">
            <span class="suggestion-text" v-html="highlightMatch(suggestion.text, query)"></span>
            <div class="suggestion-badges">
              <span class="suggestion-type">{{ getTypeLabel(suggestion.type) }}</span>
              <svg v-if="suggestion.type === 'book'" class="external-link-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 17L17 7"></path>
                <path d="M7 7h10v10"></path>
              </svg>
            </div>
          </div>
          <div v-if="suggestion.subtitle" class="suggestion-subtitle">
            {{ suggestion.subtitle }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface BookData {
  title: string
  authors: string
  formats: string
  categories: string
  cover_url?: string
  description?: string
  slug: string
}

interface Suggestion {
  text: string
  type: 'book' | 'author' | 'category' | 'format'
  subtitle?: string
  data?: BookData
}

const emit = defineEmits<{
  search: [query: string, filters?: any]
}>()

const normalize = (str: string): string =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()


// Reactive state
const query = ref('')
const suggestions = ref<Suggestion[]>([])
const filteredSuggestions = ref<Suggestion[]>([])
const showSuggestions = ref(false)
const isLoading = ref(false)
const selectedIndex = ref(-1)
const searchInput = ref<HTMLInputElement>()

// Book data storage
const books = ref<BookData[]>([])
const authors = ref<Set<string>>(new Set())
const categories = ref<Set<string>>(new Set())
const formats = ref<Set<string>>(new Set())

// Load CSV data
const loadBooksData = async () => {
  try {
    isLoading.value = true
    
    // In a real Nuxt app, you would fetch this from an API endpoint
    // For now, we'll simulate loading CSV data
    const response = await fetch('/books.csv')
    const csvText = await response.text()
    
    // Parse CSV
    const lines = csvText.split('\n')
    const headers = lines[0].split(';').map(h => h.trim().replace(/^\uFEFF/, ''))
    
    const bookData: BookData[] = []
    const authorSet = new Set<string>()
    const categorySet = new Set<string>()
    const formatSet = new Set<string>()
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      const values = line.split(';').map(v => v.trim())
      
      const book: BookData = {
        title: values[headers.indexOf('title')] || '',
        authors: values[headers.indexOf('author')] || '',
        formats: values[headers.indexOf('format')] || '',
        categories: values[headers.indexOf('categories')] || '',
        cover_url: values[headers.indexOf('cover_url')] || '',
        description: values[headers.indexOf('description')] || '',
        slug: values[headers.indexOf('slug')] || ''
      }
      
      if (book.title) {
        bookData.push(book)
        
        // Collect authors
        if (book.authors) {
          book.authors.split(',').forEach(author => {
            authorSet.add(author.trim())
          })
        }
        
        // Collect categories
        if (book.categories) {
          book.categories.split(',').forEach(category => {
            categorySet.add(category.trim())
          })
        }

        // Collect formats
        if (book.formats) {
          book.formats.split(',').forEach(format => {
            formatSet.add(format.trim())
          })
        }
      }
    }
    
    books.value = bookData
    authors.value = authorSet
    categories.value = categorySet
    formats.value = formatSet
    
    console.log(`${bookData.length} Bücher geladen`)
    
  } catch (error) {
    console.error('Fehler beim Laden der Buchdaten:', error)
    
    // beispieldaten wenn Fehler
    books.value = [
      {
        title: 'Kennt ihr Blauland?',
        authors: 'Tina Rau',
        formats: 'Buch',
        categories: 'Vielfalt & Diversität, Toleranz & Respekt',
        cover_url: 'https://example.com/cover1.jpg',
        description: 'Ein liebevoll gestaltetes Bilderbuch...',
        slug: 'kennt-ihr-blauland'
      }
    ]
    authors.value = new Set(['Tina Rau'])
    categories.value = new Set(['Vielfalt & Diversität', 'Toleranz & Respekt'])
    formats.value = new Set(['Buch'])
    
  } finally {
    isLoading.value = false
  }
}

// Search functionality
const onInput = () => {
  if (query.value.length === 0) {
    filteredSuggestions.value = []
    selectedIndex.value = -1
    return
  }
  
// Searching after 1 character input  
  if (query.value.length < 1) {
    filteredSuggestions.value = []
    return
  }
  
  generateSuggestions()
  showSuggestions.value = true
}

const generateSuggestions = () => {
  const searchTerm = normalize(query.value)
  const suggestions: Suggestion[] = []
  
  // Search in books
  books.value.forEach(book => {
    if (normalize(book.title).includes(searchTerm)) {
      suggestions.push({
        text: book.title,
        type: 'book',
        subtitle: book.authors,
        data: book
      })
    }
  })
  
  // Search in authors
  authors.value.forEach(author => {
    if (normalize(author).includes(searchTerm)) {
      const bookCount = books.value.filter(book => 
        book.authors.toLowerCase().includes(author.toLowerCase())
      ).length
      
      suggestions.push({
        text: author,
        type: 'author',
        subtitle: `${bookCount} ${bookCount === 1 ? 'Buch' : 'Bücher'}`
      })
    }
  })
  
  // Search in categories
  categories.value.forEach(category => {
    if (normalize(category).includes(searchTerm)) {
      const bookCount = books.value.filter(book => 
        book.categories.toLowerCase().includes(category.toLowerCase())
      ).length
      
      suggestions.push({
        text: category,
        type: 'category',
        subtitle: `${bookCount} ${bookCount === 1 ? 'Buch' : 'Bücher'}`
      })
    }
  })

  formats.value.forEach(format => {
    if (normalize(format).includes(searchTerm)) {
      const bookCount = books.value.filter(book => 
        book.formats.toLowerCase().includes(format.toLowerCase())
      ).length
      
      suggestions.push({
        text: format,
        type: 'format',
        subtitle: `${bookCount} ${bookCount === 1 ? 'Buch' : 'Bücher'}`
      })
    }
  })
  
  // Sort by relevance and limit
  filteredSuggestions.value = suggestions
    .sort((a, b) => {
      // Exact matches first
      const aExact = a.text.toLowerCase() === searchTerm
      const bExact = b.text.toLowerCase() === searchTerm
      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1
      
      // Then by type priority: books > authors > categories
      const typeOrder = { book: 0, author: 1, category: 2, format: 3 }
      return typeOrder[a.type] - typeOrder[b.type]
    })
    .slice(0, 8)
}

const selectSuggestion = (suggestion: Suggestion) => {
  query.value = suggestion.text
  showSuggestions.value = false
  selectedIndex.value = -1
  
  // If it's a book, navigate directly to the book page
  if (suggestion.type === 'book' && suggestion.data?.slug) {
    navigateTo(`/book/${suggestion.data.slug}`)
    return
  }
  
  // For authors and categories, perform search
  performSearch(suggestion)
}

const performSearch = (selectedSuggestion?: Suggestion) => {
  if (!query.value.trim()) return
  
  const searchQuery = query.value.trim()
  const filters: any = {}
  
  if (selectedSuggestion) {
    filters.type = selectedSuggestion.type
    if (selectedSuggestion.data) {
      filters.book = selectedSuggestion.data
    }
  }
  
  console.log('🔍 Performing search:', searchQuery, filters)
  
  navigateTo({
    path: '/suche', 
    query: { 
      q: searchQuery,
      filter: filters.type || 'general' // 'author' | 'category' | 'general'
    }
  })
  
  // UI zurücksetzen
  query.value = ''
  showSuggestions.value = false
  searchInput.value?.blur()
}

const navigateSuggestions = (direction: number) => {
  if (filteredSuggestions.value.length === 0) return
  
  selectedIndex.value += direction
  
  if (selectedIndex.value >= filteredSuggestions.value.length) {
    selectedIndex.value = 0
  } else if (selectedIndex.value < 0) {
    selectedIndex.value = filteredSuggestions.value.length - 1
  }
}

// Handle Enter key when a suggestion is selected
const handleEnterKey = () => {
  if (selectedIndex.value >= 0 && selectedIndex.value < filteredSuggestions.value.length) {
    selectSuggestion(filteredSuggestions.value[selectedIndex.value])
  } else {
    performSearch()
  }
}

const clearSuggestions = () => {
  showSuggestions.value = false
  selectedIndex.value = -1
}

const hideSuggestionsDelayed = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

const highlightMatch = (text: string, query: string): string => {
  if (!query.trim()) return text
  
  const regex = new RegExp(`(${query.trim()})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

const getTypeLabel = (type: string): string => {
  const labels = {
    book: 'Buch',
    author: 'Autor',
    category: 'Kategorie',
    format: 'Format'
  }
  return labels[type as keyof typeof labels] || type
}

// Load data on mount
onMounted(() => {
  loadBooksData()
})
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  z-index: 10000; /* Basis z-index für Container */
  margin: -8px auto;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 1rem;
  border-radius: 9999px;
  border: 2px solid transparent;
  background: white;
  color: #374151;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #004b5a;
  box-shadow: 0 0 0 3px rgba(0, 75, 90, 0.1);
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-button {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: #004b5a;
  color: white;
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-button:hover:not(:disabled) {
  background: #006b7a;
  transform: translateY(-50%) scale(1.05);
}

.search-button:disabled {
  background: #004b5a;
  cursor: not-allowed;
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;
  z-index: 10001; /* Höher als alle anderen Elemente */
  max-height: 400px;
  overflow-y: auto;
  margin-top: 0.5rem;
  overflow-x: hidden; /* Verhindert horizontales Scrollen im Dropdown, ggf noch die breite erhöhen */
}

.suggestion-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f3f4f6;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover,
.suggestion-item.selected {
  background: #c2c2c2;
}

.suggestion-item.show-all {
  background: #004b5a;
  color: white;
  font-weight: 500;
}

.suggestion-item.show-all:hover {
  background: #006b7a;
}

.suggestion-item.loading {
  cursor: default;
  color: #6b7280;
}

.suggestion-item.no-results {
  cursor: default;
  color: #6b7280;
  font-style: italic;
}

.suggestion-icon {
  margin-right: 0.75rem;
  color: #6b7280;
  flex-shrink: 0;
}

.suggestion-item.book .suggestion-icon {
  color: #004b5a;
}

.suggestion-item.author .suggestion-icon {
  color: #8f4200;
}

.suggestion-item.category .suggestion-icon {
  color: #7c3aed;
}

.suggestion-item.format .suggestion-icon {
  color: #059669;
}

.suggestion-content {
  flex: 1;
  min-width: 0;
}

.suggestion-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.suggestion-text {
  font-weight: 500;
  color: #374151;
}

.suggestion-text :deep(mark) {
  background: #f2ddcc;
  color: #8f4200;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}

.suggestion-badges {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.suggestion-type {
  font-size: 0.75rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.external-link-icon {
  color: #004b5a;
  opacity: 0.6;
}

.suggestion-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #004b5a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .search-container {
    max-width: 100%;
  }
  
  .search-input {
    font-size: 0.9rem;
    padding: 0.625rem 2.5rem 0.625rem 0.875rem;
  }
  
  .search-button {
    width: 2rem;
    height: 2rem;
    right: 0.375rem;
  }
}

@media (min-width: 1024px) {
  /* Entfernt den margin-top von der SearchBar auf Desktop */
  .w-xl.lg\\:w-auto.lg\\:ml-auto.order-2.lg\\:order-3.mt-5 {
    margin-top: 0 !important;
  }

   .search-wrapper {
    margin-top: 0 !important;
  }
}

.header-flex-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px; /* Mindesthöhe für konsistente Zentrierung */
}

/* 4. Alternative: Grid-Layout für bessere Kontrolle */
.header-grid-layout {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  gap: 1rem;
  min-height: 80px;
}

@media (min-width: 1024px) {
  .header-grid-layout {
    grid-template-columns: auto 1fr auto;
  }
}
</style>