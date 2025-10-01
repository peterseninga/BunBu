<template>
  <div>
    <nav class="mega-navbar">
      <div class="menu-container">
        <!-- Format Menu -->
        <div 
          class="menu-item" 
          :class="{ active: showFormatDropdown && !isMobile }"
          @mouseenter="!isMobile && (showFormatDropdown = true)" 
          @mouseleave="!isMobile && handleMouseLeave('format')"
          @click="isMobile && handleFormatClick()"
        >
          <span class="menu-label">Format</span>
          <div 
            v-if="!isMobile"
            class="format-dropdown" 
            :class="{ show: showFormatDropdown }"
            @mouseenter="showFormatDropdown = true"
            @mouseleave="handleMouseLeave('format')"
          >
            <div class="format-content">
              <div 
                v-for="(format, index) in formats" 
                :key="index"
                class="format-item"
                @click="selectFormat(format)"
              >
                <h4 class="format-heading">{{ format.name }} 
                  <span class="format-count-grey">({{ format.count }})</span>
                </h4>
              </div>
            </div>
          </div>
        </div>

        <!-- Themen Menu -->
        <div 
          class="menu-item" 
          :class="{ active: showThemenDropdown && !isMobile }"
          @mouseenter="!isMobile && (showThemenDropdown = true)" 
          @mouseleave="!isMobile && handleMouseLeave('themen')"
          @click="isMobile && handleThemenClick()"
        >
          <span class="menu-label">Themen</span>
          <div 
            v-if="!isMobile"
            class="mega-dropdown" 
            :class="{ show: showThemenDropdown }"
            @mouseenter="showThemenDropdown = true"
            @mouseleave="handleMouseLeave('themen')"
          >
            <div class="dropdown-content">
              <div 
                v-for="(category, index) in categories" 
                :key="index"
                class="dropdown-column"
              >
                <h4>{{ category.title }}</h4>
                <ul>
                  <li 
                    v-for="(item, itemIndex) in category.items" 
                    :key="itemIndex"
                    @click="selectTheme(item, category.title)"
                  >
                   {{ item }}
                   <span class="format-count-grey">({{ categoryCounts[item] || 0 }})</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Mobile Format Overlay -->
    <teleport to="body" v-if="isMobile && showFormatDropdown">
      <div class="mobile-overlay">
        <div class="mobile-overlay-backdrop" @click="closeOverlay"></div>
        <div class="mobile-overlay-content">
          <div class="mobile-overlay-header">
            <h2 class="mobile-overlay-title">Format wählen</h2>
            <button @click="closeOverlay" class="mobile-overlay-close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="mobile-overlay-body">
            <div class="mobile-format-list">
              <div 
                v-for="(format, index) in formats" 
                :key="index"
                class="mobile-format-item"
                @click="selectFormat(format)"
              >
                <h4 class="mobile-format-name">{{ format.name }}</h4>
                <span class="mobile-format-count">({{ format.count }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Mobile Themen Overlay -->
    <teleport to="body" v-if="isMobile && showThemenDropdown">
      <div class="mobile-overlay">
        <div class="mobile-overlay-backdrop" @click="closeOverlay"></div>
        <div class="mobile-overlay-content">
          <div class="mobile-overlay-header">
            <h2 class="mobile-overlay-title">Themen wählen</h2>
            <button @click="closeOverlay" class="mobile-overlay-close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="mobile-overlay-body">
            <div class="mobile-theme-list">
              <div 
                v-for="(category, index) in categories" 
                :key="index"
                class="mobile-theme-category"
              >
                <h4 class="mobile-category-title">{{ category.title }}</h4>
                <ul class="mobile-category-items">
                  <li 
                    v-for="(item, itemIndex) in category.items" 
                    :key="itemIndex"
                    class="mobile-theme-item"
                    @click="selectTheme(item, category.title)"
                  >
                    <span class="mobile-theme-name">{{ item }}</span>
                    <span class="mobile-theme-count">({{ categoryCounts[item] || 0 }})</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Format {
  name: string
  count: number
}

interface Category {
  title: string
  items: string[]
}

interface ThemeSelection {
  item: string
  category: string
}

interface Props {
  customCategories?: Category[]
  customFormats?: Format[]
}

const props = withDefaults(defineProps<Props>(), {
  customCategories: undefined,
  customFormats: undefined
})

const emit = defineEmits<{
  formatSelected: [format: Format]
  themeSelected: [selection: ThemeSelection]
}>()

const showThemenDropdown = ref<boolean>(false)
const showFormatDropdown = ref<boolean>(false)
const isMobile = ref<boolean>(false)

let formatTimeout: ReturnType<typeof setTimeout> | null = null
let themenTimeout: ReturnType<typeof setTimeout> | null = null

const defaultCategories: Category[] = [
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
    title: 'Herausfordernde Themen',
    items: [
      'Gewalt & Missbrauch',
      'Diskriminierung',
      'Mobbing & Ausgrenzung'
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
    title: 'Gesellschaft & Werte',
    items: [
      'Vielfalt & Diversität',
      'Inklusion & Behinderung',
      'Religion & Glaube',
      'Toleranz & Respekt',
      'Gleichberechtigung & Rollenbilder',
      'Gerechtigkeit & Konfliktlösung'
    ]
  }
]

const categoryCounts = ref<Record<string, number>>({})
const formatCounts = ref<Record<string, number>>({})

const checkMobile = (): void => {
  isMobile.value = window.innerWidth <= 1024
}

onMounted(async () => {
  try {
    const response = await fetch('/books.csv')
    const csvText = await response.text()
    const lines = csvText.split('\n')
    
    if (lines.length === 0) return
    
    const headers = lines[0].split(';').map(h => h.trim().replace(/^\uFEFF/, ''))
    const books: any[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      const values = line.split(';').map(v => v.trim())
      
      const book = {
        title: values[headers.indexOf('title')] || '',
        author: values[headers.indexOf('author')] || '',
        format: values[headers.indexOf('format')] || '',
        categories: values[headers.indexOf('categories')] || ''
      }
      
      if (book.title) {
        books.push(book)
      }
    }
    
    const formatCountsFromCSV: Record<string, number> = {}
    const categoryCountsFromCSV: Record<string, number> = {}
    
    books.forEach(book => {
      if (book.format) {
        const bookFormats = book.format.split(',').map((f: string) => f.trim())
        bookFormats.forEach((format: string) => {
          formatCountsFromCSV[format] = (formatCountsFromCSV[format] || 0) + 1
        })
      }
      
      if (book.categories) {
        const bookCategories = book.categories.split(',').map((c: string) => c.trim())
        bookCategories.forEach((category: string) => {
          categoryCountsFromCSV[category] = (categoryCountsFromCSV[category] || 0) + 1
        })
      }
    })
    
    formatCounts.value = formatCountsFromCSV
    categoryCounts.value = categoryCountsFromCSV
    
  } catch (error) {
    console.error('Fehler beim Laden der CSV:', error)
  }

  checkMobile()
  window.addEventListener('resize', checkMobile)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  document.removeEventListener('click', handleClickOutside)
  document.documentElement.classList.remove('overlay-open')
  document.body.classList.remove('overlay-open')
  if (formatTimeout) clearTimeout(formatTimeout)
  if (themenTimeout) clearTimeout(themenTimeout)
})

const categories = computed<Category[]>(() => {
  if (props.customCategories) return props.customCategories
  return defaultCategories
})

const formats = computed<Format[]>(() => {
  if (props.customFormats) return props.customFormats

  return [
    { name: 'Buch', count: formatCounts.value['Buch'] || 0 },
    { name: 'Hörbuch', count: formatCounts.value['Hörbuch'] || 0 },
    { name: 'Braille', count: formatCounts.value['Braille'] || 0 },
    { name: 'E-Book', count: formatCounts.value['E-Book'] || 0 }
  ]
})

const handleFormatClick = (): void => {
  if (isMobile.value) {
    showFormatDropdown.value = true
    document.documentElement.classList.add('overlay-open')
    document.body.classList.add('overlay-open')
  }
}

const handleThemenClick = (): void => {
  if (isMobile.value) {
    showThemenDropdown.value = true
    document.documentElement.classList.add('overlay-open')
    document.body.classList.add('overlay-open')
  }
}

const handleMouseLeave = (type: 'format' | 'themen'): void => {
  if (isMobile.value) return

  if (type === 'format') {
    formatTimeout = setTimeout(() => {
      showFormatDropdown.value = false
    }, 150)
  } else if (type === 'themen') {
    themenTimeout = setTimeout(() => {
      showThemenDropdown.value = false
    }, 150)
  }
}

const selectFormat = (format: Format): void => {
  emit('formatSelected', format)
  showFormatDropdown.value = false
  document.documentElement.classList.remove('overlay-open')
  document.body.classList.remove('overlay-open')

  navigateTo({
    path: '/suche',
    query: { 
      q: format.name,
      filter: 'format'
    }
  })
}

const selectTheme = (item: string, category: string): void => {
  emit('themeSelected', { item, category })
  showThemenDropdown.value = false
  document.documentElement.classList.remove('overlay-open')
  document.body.classList.remove('overlay-open')

  navigateTo({
    path: '/suche',
    query: { 
      q: item,
      filter: 'category'
    }
  })
}

const closeOverlay = (): void => {
  showFormatDropdown.value = false
  showThemenDropdown.value = false
  document.documentElement.classList.remove('overlay-open')
  document.body.classList.remove('overlay-open')
}

const handleClickOutside = (event: Event): void => {
  if (isMobile.value) return

  const target = event.target as Element | null
  const navbar = target?.closest('.mega-navbar')
  if (!navbar) {
    showFormatDropdown.value = false
    showThemenDropdown.value = false
  }
}
</script>

<style scoped>
.mega-navbar {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%); 
  z-index: 50;
  width: max-content;
  display: grid;
  justify-content: center; 
  margin-top: 3em; 
}

.menu-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

.menu-item {
  position: relative;
  cursor: default;
  text-decoration: underline;
}

.menu-label {
  font-weight: 500;
  font-size: 1.1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 15px 15px 0 0;
  display: inline-block;
  position: relative;
  user-select: none;
  cursor: pointer;
}

.menu-item.active,
.menu-label:hover {
  text-decoration: underline;
  color: black;
  background: white;
  border-radius: 0.75rem 0.75rem 0 0;
}

.mega-dropdown {
  overflow-inline: hidden;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  width: 1265px;
  transform: translateX(-50%);
  background: white;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-radius: 0 0 0.75rem 0.75rem;
  opacity: 0;
  visibility: hidden;
  transform: translateX(-50%) translateY(-10px);
  z-index: 999;
}

.mega-dropdown.show {
  opacity: 1;
  visibility: visible;
  transform: translateX(-51%) translateY(0);
}

.dropdown-content {
  display: grid;
  grid-template-columns: repeat(3, 350px);
  gap: 2rem;
  padding: 2rem;
  margin-left: 40px;
  max-height: 80vh;
  overflow-y: auto;
}

.dropdown-column h4 {
  color: #004b5a;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #004b5a;
}

.dropdown-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-column li {
  padding: 0.25rem 0;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0.25rem;
  padding-left: 0.5rem;
  font-size: 0.9rem;
}

.dropdown-column li:hover {
  color: #004b5a;
  background: #f3f4f6;
  padding-left: 1rem;
}

.format-dropdown {
  overflow-inline: hidden;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  width: 1265px;
  height: 497px;
  transform: translateX(-50%);
  background: white;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-radius: 0 0 0.75rem 0.75rem;
  opacity: 0;
  visibility: hidden;
  transform: translateX(-50%) translateY(-10px);
  z-index: 999;
}

.format-heading {
  color: #004b5a;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-block;
}

.format-dropdown.show {
  opacity: 1;
  visibility: visible;
  transform: translateX(-40.15%) translateY(0);
}

.format-content {
  display: flex;
  grid-template-columns: repeat(4, 100px);
  max-height: 80vh;
  gap: 2rem;
  text-align: center;
  padding: 2rem;
  justify-content: center;
}

.format-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.format-item:hover {
  background: #f3f4f6;
  border-color: #004b5a;
  transform: translateY(-2px);
}

.format-count-grey {
  color: #6b7280;
  font-weight: normal;
  margin-left: 0.5rem;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
}

.mobile-overlay-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  touch-action: none;
}

.mobile-overlay-content {
  position: relative;
  background: white;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  touch-action: auto;
}

.mobile-overlay-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: white;
  position: sticky;
  top: 0;
  z-index: 100;
}

.mobile-overlay-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.mobile-overlay-close {
  padding: 0.5rem;
  background: none;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-overlay-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.mobile-overlay-body {
  padding: 2rem 1rem 3rem 1rem;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  min-height: 0;
}

.mobile-format-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: stretch;
}

.mobile-format-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 60px;
}

.mobile-format-item:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 75, 90, 0.1);
}

.mobile-format-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #004b5a;
  margin: 0;
}

.mobile-format-count {
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
}

.mobile-theme-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mobile-theme-category {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mobile-category-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #004b5a;
  border-bottom: 2px solid #004b5a;
  padding-bottom: 0.5rem;
  margin: 0;
}

.mobile-category-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-theme-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-theme-item:hover {
  background: #f3f4f6;
}

.mobile-theme-name {
  color: #374151;
}

.mobile-theme-count {
  color: #6b7280;
  font-size: 0.875rem;
}

@media (max-width: 1024px) {
  .menu-item {
    cursor: pointer;
  }
  
  .menu-container {
    gap: 1rem;
  }

  .menu-label {
    font-size: 1rem;
    padding: 0.5rem 1rem;
  }
}

@media (max-width: 640px) {
  .menu-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0;
  }

  .menu-label {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }

  .mobile-overlay-body {
    padding: 2rem 1rem 5rem 1rem;
  }
}

@media (min-width: 640px) and (max-width: 768px) {
  .menu-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0;
  }

  .menu-label {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .menu-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
    margin-top: 5px;
  }

  .menu-label {
    font-size: 1rem;
    padding: 0.5rem 1rem;
  }
}
</style>

<style>
html.overlay-open,
body.overlay-open {
  overflow: hidden !important;
  position: fixed;
  width: 100%;
  height: 100%;
  padding-right: var(--scrollbar-width, 0px);
}
</style>