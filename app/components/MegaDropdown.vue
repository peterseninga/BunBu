<template>
  <nav class="mega-navbar">
    <div class="menu-container">
      <!-- Format Menu -->
      <div 
        class="menu-item" 
        :class="{ active: showFormatDropdown }"
        @mouseenter="showFormatDropdown = true" 
        @mouseleave="() => handleMouseLeave('format')"
      >
        <span class="menu-label">Format</span>
        <div 
          class="format-dropdown" 
          :class="{ show: showFormatDropdown }"
          @mouseenter="showFormatDropdown = true"
          @mouseleave="() => handleMouseLeave('format')"
        >
          <div class="format-content">
            <div 
              v-for="(format, index) in formats" 
              :key="index"
              class="format-item"
              @click="selectFormat(format)"
            >
              <h4 class="format-heading"> {{ format.name }} 
                <span class="format-count-grey"> ({{ format.count }}) </span></h4>
            </div>
          </div>
        </div>
      </div>

      <!-- Themen Menu -->
      <div 
        class="menu-item" 
        :class="{ active: showThemenDropdown }"
        @mouseenter="showThemenDropdown = true" 
        @mouseleave="() => handleMouseLeave('themen')"
      >
        <span class="menu-label">Themen</span>
        <div 
          class="mega-dropdown" 
          :class="{ show: showThemenDropdown }"
          @mouseenter="showThemenDropdown = true"
          @mouseleave="() => handleMouseLeave('themen')"
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
</template>

<script setup lang="ts">

// Types
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

// Props
interface Props {
  customCategories?: Category[]
  customFormats?: Format[]
}

const props = withDefaults(defineProps<Props>(), {
  customCategories: undefined,
  customFormats: undefined
})

// Emits
const emit = defineEmits<{
  formatSelected: [format: Format]
  themeSelected: [selection: ThemeSelection]
}>()

// Reactive state
const showThemenDropdown = ref<boolean>(false)
const showFormatDropdown = ref<boolean>(false)

// Timeouts
let formatTimeout: ReturnType<typeof setTimeout> | null = null
let themenTimeout: ReturnType<typeof setTimeout> | null = null

// Default data
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

onMounted(async () => {
  const res = await fetch('/api/counts')
  const data = await res.json()
  formatCounts.value = data.formats
  categoryCounts.value = data.categories
})

// Computed properties Dropdowns werden angezeigt
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


// Methods
const handleMouseLeave = (type: 'format' | 'themen'): void => {
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
}

const selectTheme = (item: string, category: string): void => {
  emit('themeSelected', { item, category })
  showThemenDropdown.value = false
}

const handleClickOutside = (event: Event): void => {
  const target = event.target as Element | null
  const navbar = target?.closest('.mega-navbar')
  if (!navbar) {
    showFormatDropdown.value = false
    showThemenDropdown.value = false
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  // Cleanup alle timeouts
  if (formatTimeout) clearTimeout(formatTimeout)
  if (themenTimeout) clearTimeout(themenTimeout)
})
</script>

<style scoped>

html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.mega-navbar {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  width: max-content;
  display: flex;
  justify-content: center;
  padding-top: 2rem;
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

.menu-label::after {
  margin-left: 0.5rem;
  font-size: 0.8rem;
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
  color: #004b5a;         /* Blau wie bei Themen */
  font-size: 1.1rem;
  font-weight: 600;       /* Fett */
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

.format-name {
  font-weight: 500;
  color: #374151;
}

.format-count {
  background: #004b5a;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 25px;
  text-align: center;
}

.format-count-grey {
  color: #6b7280;
  font-weight: normal;
  margin-left: 0.5rem;
}

.format-count.zero {
  background: #9ca3af;
}

@media (max-width: 768px) {
  .menu-container {
    gap: 1rem;
  }

  .menu-label {
    font-size: 1rem;
    padding: 0.5rem 1rem;
  }

  .mega-dropdown,
  .format-dropdown {
    min-width: 95vw;
    left: 2.5vw;
    transform: none;
  }

  .mega-dropdown.show,
  .format-dropdown.show {
    transform: translateY(0);
  }

  .dropdown-content {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .format-content {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
}

@media (max-width: 640px) {
  .menu-container {
    flex-direction: column;
    gap: 0.5rem;
  }

  .menu-label {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
  
  .format-content {
    grid-template-columns: repeat(2, 1fr); /* 2 Spalten auch auf sehr kleinen Screens */
  }
  
  .format-item {
    min-height: 80px;
    padding: 1rem 0.5rem;
  }
  
  .format-name {
    font-size: 1rem;
  }
}
</style>