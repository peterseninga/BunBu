<template>
  <div class="page-container">
    <!-- Header with results count -->
    <div class="results-header">
      <h2 class="results-title">
        <span class="heading heading--sm">
          {{ resultsTitle }}
        </span>
      </h2>
    </div>

    <div class="layout">
      <!-- Left Filter Sidebar -->
      <div class="filter-sidebar">
        <!-- Format Filter -->
        <div class="filter-section">
          <h3 class="filter-title">Format</h3>
          <div class="filter-options">
            <label 
              v-for="format in allFormatsWithCounts" 
              :key="format.name"
              class="filter-option"
              :class="{ disabled: format.count === 0 }"
            >
              <input
                type="checkbox"
                :value="format.name"
                v-model="selectedFormats"
                class="filter-checkbox"
                :class="{ checked: selectedFormats.includes(format.name) }"
                :disabled="format.count === 0"
              />
              <span class="filter-text">
                {{ format.name }}
                <span class="filter-count">({{ format.count }})</span>
              </span>
            </label>
          </div>
        </div>

        <!-- Theme Filter -->
        <div class="filter-section">
          <h3 class="filter-title">Thema</h3>
          <div class="theme-categories">
            <div 
              v-for="category in allCategoriesWithCounts" 
              :key="category.title"
              class="theme-category"
            >
              <button
                class="category-button"
                :class="{ 
                  expanded: expandedCategories.includes(category.title)
                }"
                @click="toggleCategory(category.title)"
              >
                {{ category.title }}
                <span class="category-total">({{ getCategoryTotal(category) }})</span>
                <svg class="expand-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </button>
              
              <div 
                v-if="expandedCategories.includes(category.title)"
                class="category-content"
              >
                <label 
                  v-for="item in category.items" 
                  :key="item.name"
                  class="filter-option theme-item"
                  :class="{ disabled: item.count === 0 }"
                >
                  <input
                    type="checkbox"
                    :value="item.name"
                    v-model="selectedThemes"
                    class="filter-checkbox"
                    :class="{ checked: selectedThemes.includes(item.name) }"
                    :disabled="item.count === 0"
                  />
                  <span class="filter-text">
                    {{ item.name }}
                    <span class="filter-count">({{ item.count }})</span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Clear Filters Button -->
        <div v-if="hasActiveFilters" class="filter-section">
          <button @click="clearAllFilters" class="clear-filters-btn">
            Alle Filter zurücksetzen
          </button>
        </div>
      </div>
      
      <!-- Right Content Area -->
      <div class="content-area">
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-message">
          Bücher werden geladen...
        </div>
        
        <!-- No Results -->
        <div v-else-if="filteredBooks.length === 0 && books.length > 0" class="no-results">
          <p>Keine Bücher für die aktuellen Filter gefunden.</p>
          <button @click="clearAllFilters" class="reset-btn">Filter zurücksetzen</button>
        </div>
        
        <!-- Books List -->
        <div v-else class="books-list">
          <div
            v-for="book in filteredBooks"
            :key="book.slug || book.title"
            @click="navigateToBook(book)"
            class="book-item"
          >
            <img 
              :src="book.cover_url || '/placeholder-book.jpg'" 
              :alt="`Cover von ${book.title}`" 
              class="book-cover"
              @error="(e) => e.target.src = '/placeholder-book.jpg'"
              loading="lazy"
            />
            <div class="book-details">
              <h4 class="book-title">{{ book.title }}</h4>
              <p class="book-author">{{ book.author }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, navigateTo } from '#imports'
import type { getSliceComponentProps } from '@prismicio/vue'
import type { Content } from "@prismicio/client"

// Prismic Props
defineProps(
  getSliceComponentProps<Content.BookResultsSlice>([
    "slice",
    "index", 
    "slices",
    "context",
  ])
)

interface BookData {
  title: string
  author: string
  format: string
  categories: string
  cover_url?: string
  description?: string
  slug: string
}

interface Format {
  name: string
  count: number
}

interface CategoryItem {
  name: string
  count: number
}

interface Category {
  title: string
  items: CategoryItem[]
}

// Reactive state
const route = useRoute()
const expandedCategories = ref<string[]>([])
const books = ref<BookData[]>([])
const isLoading = ref(false)

// Lokale Filter-States
const selectedThemes = ref<string[]>([])
const selectedFormats = ref<string[]>([])

// URL-Parameter
const searchQuery = computed(() => route.query.q?.toString() || '')
const filterType = computed(() => route.query.filter?.toString() || '')

// All possible formats
const allFormats = [
  'Buch',
  'Hörbuch', 
  'E-Book',
  'Braille'
]

// Default category structure
const defaultCategories = [
  {
    title: 'Gesellschaft & Werte',
    items: [
      'Vielfalt & Diversität',
      'Inklusion & Behinderung',
      'Religion & Glaube',
      'Toleranz & Respekt',
      'Gleichberechtigung & Rollenbilder',
      'Gerechtigkeit & Konfliktlösung'
    ]
  },
  {
    title: 'Kreativität & Ausdruck',
    items: [
      'Körperbild',
      'Kreativität & Fantasie'
    ]
  },
  {
    title: 'Beziehung & Lebenswelten',
    items: [
      'Freundschaft & Familie',
      'Detektivische Lebenswelten',
      'Tiere',
      'Soziale Medien',
      'Coolness'
    ]
  },
  {
    title: 'Entwicklung & Bildung',
    items: [
      'Leseförderung & Bildung',
      'Frühförderung & Babythemen',
      'Leichte Sprache & Barrierefreiheit',
      'Mehrsprachigkeit & Migration'
    ]
  },
  {
    title: 'Soziale & emotionale Kompetenzen',
    items: [
      'Emotionale Intelligenz & Empathie',
      'Gemeinschaft',
      'Konsens & Autonomie',
      'Selbstbewusstsein & Selbstliebe',
      'Psychische Gesundheit'
    ]
  },
  {
    title: 'Herausfordernde Themen',
    items: [
      'Gewalt & Missbrauch',
      'Diskriminierung',
      'Mobbing & Ausgrenzung'
    ]
  }
]

// Load CSV data
const loadBooksData = async () => {
  try {
    isLoading.value = true
    const response = await fetch('/books.csv')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const csvText = await response.text()
    const lines = csvText.split('\n')
    
    if (lines.length === 0) {
      throw new Error('CSV file is empty')
    }
    
    const headers = lines[0].split(';').map(h => h.trim().replace(/^\uFEFF/, ''))
    const bookData: BookData[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      const values = line.split(';').map(v => v.trim())
      
      const book: BookData = {
        title: values[headers.indexOf('title')] || '',
        author: values[headers.indexOf('author')] || '',
        format: values[headers.indexOf('format')] || '',
        categories: values[headers.indexOf('categories')] || '',
        cover_url: values[headers.indexOf('cover_url')] || '',
        description: values[headers.indexOf('description')] || '',
        slug: values[headers.indexOf('slug')] || ''
      }
      
      if (book.title) {
        bookData.push(book)
      }
    }
    
    books.value = bookData
    console.log(`📚 ${bookData.length} Bücher geladen`)
    
  } catch (error) {
    console.error('❌ Fehler beim Laden der CSV:', error)
    
    // Fallback Demo-Daten
    books.value = [
      {
        title: 'Kennt ihr Blauland?',
        author: 'Tina Rau',
        format: 'Buch',
        categories: 'Vielfalt & Diversität, Toleranz & Respekt',
        cover_url: 'https://via.placeholder.com/100x150?text=Buch+1',
        description: 'Ein liebevoll gestaltetes Bilderbuch...',
        slug: 'kennt-ihr-blauland'
      },
      {
        title: 'Freunde fürs Leben',
        author: 'Anna Autorin',
        format: 'Hörbuch',
        categories: 'Freundschaft & Familie, Emotionale Intelligenz & Empathie',
        cover_url: 'https://via.placeholder.com/100x150?text=Buch+2',
        description: 'Eine Geschichte über wahre Freundschaft',
        slug: 'freunde-fuers-leben'
      }
    ]
  } finally {
    isLoading.value = false
  }
}

// Filter aus URL übernehmen und Suche implementieren  
watch([searchQuery, filterType], ([q, type]) => {
  console.log('🔍 URL Parameter:', { q, type })
  
  // Filter zurücksetzen
  selectedThemes.value = []
  selectedFormats.value = []
  
  if (!q || !type) return
  
  // Spezifische Filter aus URL anwenden
  if (type === 'category') {
    selectedThemes.value = [q]
  } else if (type === 'format') {
    selectedFormats.value = [q]
  }
}, { immediate: true })

// Computed properties
const hasActiveFilters = computed(() => {
  return selectedFormats.value.length > 0 || selectedThemes.value.length > 0
})

const resultsTitle = computed(() => {
  if (searchQuery.value) {
    if (hasActiveFilters.value) {
      return `Filtersuche: "${searchQuery.value}" - ${filteredBooks.value.length} Treffer`
    } else {
      return `Suchergebnisse für "${searchQuery.value}" - ${filteredBooks.value.length} Treffer`
    }
  } else if (hasActiveFilters.value) {
    return `Filtersuche: ${filteredBooks.value.length} Treffer`
  } else {
    return `${books.value.length} Bücher`
  }
})

const allFormatsWithCounts = computed<Format[]>(() => {
  return allFormats.map(format => {
    let filteredBooks = books.value
    
    // Textsuche anwenden
    if (searchQuery.value && filterType.value === 'general') {
      const query = searchQuery.value.toLowerCase()
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.categories.toLowerCase().includes(query)
      )
    }
    
    // Theme filter anwenden
    if (selectedThemes.value.length > 0) {
      filteredBooks = filteredBooks.filter(book => {
        if (!book.categories) return false
        const bookCategories = book.categories.toLowerCase()
        return selectedThemes.value.every(theme =>
          bookCategories.includes(theme.toLowerCase())
        )
      })
    }
    
    // Andere Format-Filter anwenden
    const otherSelectedFormats = selectedFormats.value.filter(f => f !== format)
    if (otherSelectedFormats.length > 0) {
      filteredBooks = filteredBooks.filter(book => {
        if (!book.format) return false
        const bookFormats = book.format.toLowerCase()
        return otherSelectedFormats.every(f =>
          bookFormats.includes(f.toLowerCase())
        )
      })
    }
    
    // Zählen für dieses spezifische Format
    const count = filteredBooks.filter(book =>
      book.format && book.format.toLowerCase().includes(format.toLowerCase())
    ).length
    
    return {
      name: format,
      count
    }
  })
})

const allCategoriesWithCounts = computed<Category[]>(() => {
  const categoryMap = new Map<string, Map<string, number>>()
  
  // Alle Kategorien mit 0 initialisieren
  defaultCategories.forEach(category => {
    categoryMap.set(category.title, new Map())
    category.items.forEach(item => {
      categoryMap.get(category.title)!.set(item, 0)
    })
  })
  
  // Für jedes Theme-Item berechnen
  defaultCategories.forEach(category => {
    category.items.forEach(item => {
      let filteredBooks = books.value
      
      // Textsuche anwenden
      if (searchQuery.value && filterType.value === 'general') {
        const query = searchQuery.value.toLowerCase()
        filteredBooks = filteredBooks.filter(book => 
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.categories.toLowerCase().includes(query)
        )
      }
      
      // Format filter anwenden
      if (selectedFormats.value.length > 0) {
        filteredBooks = filteredBooks.filter(book =>
          selectedFormats.value.some(format =>
            book.format.toLowerCase().includes(format.toLowerCase())
          )
        )
      }
      
      // Andere Theme-Filter anwenden
      if (selectedThemes.value.length > 0) {
        const otherSelectedThemes = selectedThemes.value.filter(theme => theme !== item)
        if (otherSelectedThemes.length > 0) {
          filteredBooks = filteredBooks.filter(book => {
            if (!book.categories) return false
            const bookCategories = book.categories.toLowerCase()
            return otherSelectedThemes.every(theme =>
              bookCategories.includes(theme.toLowerCase())
            )
          })
        }
      }
      
      // Zählen für dieses spezifische Theme
      const count = filteredBooks.filter(book =>
        book.categories && book.categories.toLowerCase().includes(item.toLowerCase())
      ).length
      
      categoryMap.get(category.title)!.set(item, count)
    })
  })
  
  return defaultCategories.map(category => ({
    title: category.title,
    items: category.items.map(item => ({
      name: item,
      count: categoryMap.get(category.title)?.get(item) || 0
    }))
  }))
})

const filteredBooks = computed(() => {
  let filtered = books.value

  // Textsuche (wenn kein spezifischer Filter)
  if (searchQuery.value && filterType.value === 'general') {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(book => 
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.categories.toLowerCase().includes(query)
    )
  }

  // Format filter - ALL selected formats must match
  if (selectedFormats.value.length > 0) {
    filtered = filtered.filter(book => {
      if (!book.format) return false
      
      const bookFormats = book.format.toLowerCase()
      return selectedFormats.value.every(format =>
        bookFormats.includes(format.toLowerCase())
      )
    })
  }

  // Theme filter - ALL selected themes must match
  if (selectedThemes.value.length > 0) {
    filtered = filtered.filter(book => {
      if (!book.categories) return false
      
      const bookCategories = book.categories.toLowerCase()
      return selectedThemes.value.every(theme =>
        bookCategories.includes(theme.toLowerCase())
      )
    })
  }

  return filtered
})

// Methods
const toggleCategory = (categoryTitle: string) => {
  const index = expandedCategories.value.indexOf(categoryTitle)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(categoryTitle)
  }
}

const getCategoryTotal = (category: Category): number => {
  return category.items.reduce((total, item) => total + item.count, 0)
}

const clearAllFilters = () => {
  selectedFormats.value = []
  selectedThemes.value = []
}

const navigateToBook = (book: BookData) => {
  console.log('Navigate to book:', book.title)
  if (book.slug) {
    navigateTo(`/book/${book.slug}`)
  } else {
    // Fallback - generiere slug aus Titel
    const slug = book.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
    navigateTo(`/book/${slug}`)
  }
}

// Debug logging
watch([searchQuery, filterType], ([query, filter]) => {
  console.log('🔍 URL Parameter geändert:', { query, filter })
}, { immediate: true })

// Load data on mount
onMounted(() => {
  console.log('✅ BookResults Slice geladen')
  console.log('🔍 Initial URL params:', route.query)
  loadBooksData()
})
</script>

<style scoped>
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.results-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.results-title {
  font-size: 1.5rem;
  color: #000;
  margin-top: 100px;
}

.layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  align-items: start;
}

/* Filter Sidebar */
.filter-sidebar {
  background: #ffffff;
  border-radius: 8px;
  padding: 0;
  position: sticky;
  top: 2rem;
}

.filter-section {
  margin-bottom: 2rem;
}

.filter-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 1rem;
  padding: 0;
  border: none;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.25rem 0;
  transition: opacity 0.2s ease;
}

.filter-option.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.filter-checkbox {
  width: 16px;
  height: 16px;
  margin-right: 0.75rem;
  accent-color: #000;
  cursor: pointer;
}

.filter-checkbox:disabled {
  cursor: not-allowed;
}

.filter-checkbox.checked {
  background: #000;
}

.filter-text {
  font-size: 0.9rem;
  color: #333;
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.filter-count {
  color: #666;
  font-size: 0.85rem;
}

/* Theme Categories */
.theme-categories {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.theme-category {
  border: none;
}

.category-button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: #000;
  text-align: left;
  transition: opacity 0.2s ease;
}

.category-button:hover {
  color: #000;
}

.category-total {
  color: #666;
  font-weight: normal;
  margin-left: auto;
  margin-right: 0.5rem;
}

.expand-icon {
  transition: transform 0.2s ease;
  color: #999;
}

.category-button.expanded .expand-icon {
  transform: rotate(180deg);
}

.category-content {
  padding-left: 1rem;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.theme-item {
  font-size: 0.85rem;
  padding: 0.25rem 0;
}

.clear-filters-btn {
  width: 100%;
  padding: 0.75rem;
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.clear-filters-btn:hover {
  background: #e8e8e8;
  border-color: #ccc;
}

/* Content Area */
.content-area {
  min-height: 400px;
}

.loading-message {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.no-results p {
  margin-bottom: 1rem;
}

.reset-btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
}

.reset-btn:hover {
  background: #e0e0e0;
}

/* Books List */
.books-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.book-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 75, 90, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  align-items: center;
}

.book-item:hover {
  background: rgba(0, 75, 90, 0.15);
  transform: translateY(-1px);
}

.book-cover {
  width: 85px;
  height: 115px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.book-details {
  flex: 1;
}

.book-title {
  font-size: 1rem;
  font-weight: 600;
  color: #000;
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
}

.book-author {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .filter-sidebar {
    position: static;
  }
  
  .page-container {
    padding: 1rem;
  }
  
  .book-item {
    padding: 0.75rem;
  }
  
  .book-cover {
    width: 50px;
    height: 75px;
  }
  
  .results-title {
    font-size: 1.2rem;
  }
}
</style>