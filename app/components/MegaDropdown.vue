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
              <span class="format-name">{{ format.name }}</span>
              <span 
                class="format-count" 
                :class="{ zero: format.count === 0 }"
              >
                {{ format.count }}
              </span>
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
      'Frühförderung & Behinderung',
      'Leichte Sprache & Barrierefreiheit',
      'Mehrsprachigkeit & Migration'
    ]
  },
  {
    title: 'Beziehung & Lebenswelten',
    items: [
      'Freundschaft & Familie',
      'Behinderung & Lebenswelten',
      'Tiere',
      'Soziale Medien',
      'Coolness'
    ]
  },
  {
    title: 'Kreativität & Ausdruck',
    items: [
      'Körperbild',
      'Kreativität & Medien'
    ]
  },
  {
    title: 'Soziale & emotionale Kompetenzen',
    items: [
      'Emotionale Intelligenz & Empathie',
      'Gemeinschaft',
      'Konsens & Autonomie',
      'Selbstbewusstsein & Selbstbild',
      'Psychische Gesundheit'
    ]
  },
  {
    title: 'Herausfordernde Themen',
    items: [
      'Gewalt & Missbrauch',
      'Diskriminierung',
      'Mobbing'
    ]
  },
  {
    title: 'Gesellschaft & Werte',
    items: [
      'Vielfalt & Diversität',
      'Inklusion & Behinderung',
      'Nachhaltigkeit & Umwelt',
      'Demokratie & Partizipation',
      'Gerechtigkeit & Religion',
      'Gender & Rollenbilder'
    ]
  }
]

const defaultFormats: Format[] = [
  { name: 'Buch', count: 6 },
  { name: 'Hörbuch', count: 2 },
  { name: 'Braille', count: 0 },
  { name: 'E-Book', count: 0 }
]

// Computed properties
const categories = computed<Category[]>(() => props.customCategories || defaultCategories)
const formats = computed<Format[]>(() => props.customFormats || defaultFormats)

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
.mega-navbar {
  position: relative;
  z-index: 50;
  width: 100%;
  display: flex;
  justify-content: right;
  margin-right: 25%;
}

.menu-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

.menu-item {
  position: relative;
  cursor: pointer;
}

.menu-label {
  color: white;
  font-weight: 500;
  font-size: 1.1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  display: inline-block;
  position: relative;
  user-select: none;
}

.menu-label:hover {
  text-decoration: underline;
  background: white;
  color: black;
  border-radius: 15px 15px 0 0;
}

.menu-label::after {
  margin-left: 0.5rem;
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.menu-item.active .menu-label::after {
  transform: rotate(180deg);
}

.mega-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  min-width: fit-content;
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
  transform: translateX(-50%) translateY(0);
}

.dropdown-content {
  display: grid;
  grid-template-columns: repeat(6, max-content);
  gap: 2rem;
  padding: 2rem;
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
  padding: 0.5rem 0;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0.25rem;
  padding-left: 0.5rem;
}

.dropdown-column li:hover {
  color: #004b5a;
  background: #f3f4f6;
  padding-left: 1rem;
}

.format-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  transform: translateX(-50%);
  background: white;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-radius: 0 0 0.75rem 0.75rem;
  opacity: 0;
  visibility: hidden;
  transform: translateX(-50%) translateY(-10px);
  z-index: 999;
  min-width: fit-content;
}

.format-dropdown.show {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.format-content {
  display: grid;
  grid-template-columns: repeat(4, 250px);
  max-height: 80vh;
  gap: 1rem;
  padding: 2rem;
  overflow-y: auto;
}

.format-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e5e7eb;
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