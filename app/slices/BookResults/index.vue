<template>
  <div class="page-container">
    <!-- Header with results count -->
    <div class="results-header">
      <div class="header-content">
        <h2 class="results-title">
          <span class="heading heading--sm">
            {{ resultsTitle }}
          </span>
        </h2>

        <!-- Mobile Filter Button -->
        <button
          class="mobile-filter-btn"
          @click="toggleMobileFilter"
          :class="{ active: hasActiveFilters }"
        >
          Filtern
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
          <span v-if="hasActiveFilters" class="filter-badge">{{
            activeFilterCount
          }}</span>
        </button>
      </div>
    </div>

    <!-- Mobile Filter Overlay -->
    <teleport to="body" v-if="isMobileFilterOpen">
      <div class="mobile-overlay">
        <div class="mobile-overlay-backdrop" @click="closeMobileFilter"></div>
        <div class="mobile-overlay-content">
          <div class="mobile-overlay-header">
            <h2 class="mobile-overlay-title">Filter wählen</h2>
            <button class="mobile-overlay-close" @click="closeMobileFilter">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="mobile-overlay-body">
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
                      expanded: expandedCategories.includes(category.title),
                    }"
                    @click="toggleCategory(category.title)"
                  >
                    {{ category.title }}
                    <span class="category-total"
                      >({{ getCategoryTotal(category) }})</span
                    >
                    <svg
                      class="expand-icon"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
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

          <!-- Mobile Apply Button -->
          <div class="mobile-apply-section">
            <button @click="applyMobileFilters" class="apply-filters-btn">
              Ergebnisse anzeigen ({{ filteredBooks.length }})
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <div class="layout">
      <!-- Left Filter Sidebar (Desktop) -->
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
                  expanded: expandedCategories.includes(category.title),
                }"
                @click="toggleCategory(category.title)"
              >
                {{ category.title }}
                <span class="category-total"
                  >({{ getCategoryTotal(category) }})</span
                >
                <svg
                  class="expand-icon"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
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
        <div
          v-else-if="filteredBooks.length === 0 && books.length > 0"
          class="no-results"
        >
          <p>Keine Bücher für die aktuellen Filter/Suchergebnisse gefunden.</p>
          <button @click="clearAllFilters" class="reset-btn">
            Filter zurücksetzen
          </button>
        </div>

        <!-- Books List -->
        <div v-else class="books-list">
          <div
            v-for="book in displayedBooks"
            :key="book.slug || book.title"
            @click="navigateToBook(book)"
            class="book-item"
          >
            <img
              :src="book.cover_url || '/placeholder-book.jpg'"
              :alt="`Cover von ${book.title}`"
              class="book-cover"
              @error="(e) => (e.target.src = '/placeholder-book.jpg')"
              loading="lazy"
            />
            <div class="book-details">
              <h4 class="book-title">{{ book.title }}</h4>
              <p class="book-author">{{ book.author }}</p>
            </div>
          </div>

          <!-- Load More Button -->
          <div v-if="hasMoreBooks" class="load-more-container">
            <button @click="loadMoreBooks" class="load-more-btn">
              mehr laden
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRoute, navigateTo } from "#imports";
import type { getSliceComponentProps } from "@prismicio/vue";
import type { Content } from "@prismicio/client";

// Prismic Props
defineProps(
  getSliceComponentProps<Content.BookResultsSlice>([
    "slice",
    "index",
    "slices",
    "context",
  ])
);

useHead({
  title: "BunBu - Suchergebnisse",
})

interface BookData {
  title: string;
  author: string;
  format: string;
  categories: string;
  cover_url?: string;
  description?: string;
  slug: string;
}

interface Format {
  name: string;
  count: number;
}

interface CategoryItem {
  name: string;
  count: number;
}

interface Category {
  title: string;
  items: CategoryItem[];
}

const normalize = (str: string): string =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const getRelevanceScore = (book: BookData, query: string): number => {
  const q = normalize(query);

  let score = 0;
  if (normalize(book.title) === q) score += 100;
  else if (normalize(book.title).includes(q)) score += 80;
  if (normalize(book.author).includes(q)) score += 60;
  if (normalize(book.categories).includes(q)) score += 40;
  if (normalize(book.description || "").includes(q)) score += 20;

  return score;
};

// Reactive state
const route = useRoute();
const expandedCategories = ref<string[]>([]);
const books = ref<BookData[]>([]);
const isLoading = ref(false);
const isMobileFilterOpen = ref(false);
const displayLimit = ref(20);

// Lokale Filter-States
const selectedThemes = ref<string[]>([]);
const selectedFormats = ref<string[]>([]);

// URL-Parameter
const searchQuery = computed(() => route.query.q?.toString() || "");
const filterType = computed(() => route.query.filter?.toString() || "");

// All possible formats
const allFormats = ["Buch", "Hörbuch", "E-Book", "Braille"];

// Default category structure
const defaultCategories = [
  {
    title: "Gesellschaft & Werte",
    items: [
      "Vielfalt & Diversität",
      "Inklusion & Behinderung",
      "Religion & Glaube",
      "Toleranz & Respekt",
      "Gleichberechtigung & Rollenbilder",
      "Gerechtigkeit & Konfliktlösung",
    ],
  },
  {
    title: "Kreativität & Ausdruck",
    items: ["Körperbild", "Kreativität & Fantasie"],
  },
  {
    title: "Beziehung & Lebenswelten",
    items: [
      "Freundschaft & Familie",
      "Detektivische Lebenswelten",
      "Tiere",
      "Soziale Medien",
      "Coolness",
    ],
  },
  {
    title: "Entwicklung & Bildung",
    items: [
      "Leseförderung & Bildung",
      "Frühförderung & Babythemen",
      "Leichte Sprache & Barrierefreiheit",
      "Mehrsprachigkeit & Migration",
    ],
  },
  {
    title: "Soziale & emotionale Kompetenzen",
    items: [
      "Emotionale Intelligenz & Empathie",
      "Gemeinschaft",
      "Konsens & Autonomie",
      "Selbstbewusstsein & Selbstliebe",
      "Psychische Gesundheit",
    ],
  },
  {
    title: "Herausfordernde Themen",
    items: ["Gewalt & Missbrauch", "Diskriminierung", "Mobbing & Ausgrenzung"],
  },
];

// Load CSV data
const loadBooksData = async () => {
  try {
    isLoading.value = true;
    const response = await fetch("/books.csv");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();
    const lines = csvText.split("\n");

    if (lines.length === 0) {
      throw new Error("CSV file is empty");
    }

    const headers = lines[0]
      .split(";")
      .map((h) => h.trim().replace(/^\uFEFF/, ""));
    const bookData: BookData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(";").map((v) => v.trim());

      const book: BookData = {
        title: values[headers.indexOf("title")] || "",
        author: values[headers.indexOf("author")] || "",
        format: values[headers.indexOf("format")] || "",
        categories: values[headers.indexOf("categories")] || "",
        cover_url: values[headers.indexOf("cover_url")] || "",
        description: values[headers.indexOf("description")] || "",
        slug: values[headers.indexOf("slug")] || "",
      };

      if (book.title) {
        bookData.push(book);
      }
    }

    books.value = bookData;
    console.log(`📚 ${bookData.length} Bücher geladen`);
  } catch (error) {
    console.error("❌ Fehler beim Laden der CSV:", error);

    // Fallback Demo-Daten
    books.value = [
      {
        title: "Kennt ihr Blauland?",
        author: "Tina Rau",
        format: "Buch",
        categories: "Vielfalt & Diversität, Toleranz & Respekt",
        cover_url: "https://via.placeholder.com/100x150?text=Buch+1",
        description: "Ein liebevoll gestaltetes Bilderbuch...",
        slug: "kennt-ihr-blauland",
      },
      {
        title: "Freunde fürs Leben",
        author: "Anna Autorin",
        format: "Hörbuch",
        categories: "Freundschaft & Familie, Emotionale Intelligenz & Empathie",
        cover_url: "https://via.placeholder.com/100x150?text=Buch+2",
        description: "Eine Geschichte über wahre Freundschaft",
        slug: "freunde-fuers-leben",
      },
    ];
  } finally {
    isLoading.value = false;
  }
};

// Filter aus URL übernehmen und Suche implementieren
watch(
  [searchQuery, filterType],
  ([q, type]) => {
    console.log("🔍 URL Parameter:", { q, type });

    // Filter zurücksetzen
    selectedThemes.value = [];
    selectedFormats.value = [];
    displayLimit.value = 20; // Reset beim URL-Wechsel

    if (!q || !type) return;

    const normalizedQ = normalize(q);

    // Spezifische Filter aus URL anwenden
    if (type === "category") {
      selectedThemes.value = [q];
    } else if (type === "format") {
      selectedFormats.value = [q];
    } else if (type === 'general') {
    // Automatisch aktivieren, wenn exakter Treffer bei Format
    const matchedFormat = allFormats.find(f => normalize(f) === normalizedQ)
    if (matchedFormat) {
      selectedFormats.value = [matchedFormat]
      console.log('✅ Format automatisch aktiviert:', matchedFormat)
    }

    // Automatisch aktivieren, wenn exakter Treffer bei Kategorie
    const matchedTheme = defaultCategories
      .flatMap(c => c.items)
      .find(item => normalize(item) === normalizedQ)
    if (matchedTheme) {
      selectedThemes.value = [matchedTheme]
      console.log('✅ Thema automatisch aktiviert:', matchedTheme)
    }
  }

  },
  { immediate: true }
);

// Computed properties
const hasActiveFilters = computed(() => {
  return selectedFormats.value.length > 0 || selectedThemes.value.length > 0;
});

const activeFilterCount = computed(() => {
  return selectedFormats.value.length + selectedThemes.value.length;
});

const resultsTitle = computed(() => {
  if (searchQuery.value) {
    if (hasActiveFilters.value) {
      return `Filtersuche: "${searchQuery.value}" - ${filteredBooks.value.length} Treffer`;
    } else {
      return `Suchergebnisse für "${searchQuery.value}" - ${filteredBooks.value.length} Treffer`;
    }
  } else if (hasActiveFilters.value) {
    return `Filtersuche: ${filteredBooks.value.length} Treffer`;
  } else {
    return `${books.value.length} Bücher`;
  }
});

const allFormatsWithCounts = computed<Format[]>(() => {
  return allFormats.map((format) => {
    let filteredBooks = books.value;

    // Textsuche anwenden
    if (searchQuery.value && filterType.value === "general") {
      const query = searchQuery.value.toLowerCase();
      filteredBooks = filteredBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.categories.toLowerCase().includes(query) ||
          book.format.toLowerCase().includes(query)
      );
    }

    // Theme filter anwenden
    if (selectedThemes.value.length > 0) {
      filteredBooks = filteredBooks.filter((book) => {
        if (!book.categories) return false;
        const bookCategories = book.categories.toLowerCase();
        return selectedThemes.value.every((theme) =>
          bookCategories.includes(theme.toLowerCase())
        );
      });
    }

    // Andere Format-Filter anwenden
    const otherSelectedFormats = selectedFormats.value.filter(
      (f) => f !== format
    );
    if (otherSelectedFormats.length > 0) {
      filteredBooks = filteredBooks.filter((book) => {
        if (!book.format) return false;
        const bookFormats = book.format.toLowerCase();
        return otherSelectedFormats.every((f) =>
          bookFormats.includes(f.toLowerCase())
        );
      });
    }

    // Zählen für dieses spezifische Format
    const count = filteredBooks.filter(
      (book) =>
        book.format && book.format.toLowerCase().includes(format.toLowerCase())
    ).length;

    return {
      name: format,
      count,
    };
  });
});

const allCategoriesWithCounts = computed<Category[]>(() => {
  const categoryMap = new Map<string, Map<string, number>>();

  // Alle Kategorien mit 0 initialisieren
  defaultCategories.forEach((category) => {
    categoryMap.set(category.title, new Map());
    category.items.forEach((item) => {
      categoryMap.get(category.title)!.set(item, 0);
    });
  });

  // Für jedes Theme-Item berechnen
  defaultCategories.forEach((category) => {
    category.items.forEach((item) => {
      let filteredBooks = books.value;

      // Textsuche anwenden
      if (searchQuery.value && filterType.value === "general") {
        const query = searchQuery.value.toLowerCase();
        filteredBooks = filteredBooks.filter(
          (book) =>
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            book.categories.toLowerCase().includes(query)
        );
      }

      // Format filter anwenden
      if (selectedFormats.value.length > 0) {
        filteredBooks = filteredBooks.filter((book) =>
          selectedFormats.value.some((format) =>
            book.format.toLowerCase().includes(format.toLowerCase())
          )
        );
      }

      // Andere Theme-Filter anwenden
      if (selectedThemes.value.length > 0) {
        const otherSelectedThemes = selectedThemes.value.filter(
          (theme) => theme !== item
        );
        if (otherSelectedThemes.length > 0) {
          filteredBooks = filteredBooks.filter((book) => {
            if (!book.categories) return false;
            const bookCategories = book.categories.toLowerCase();
            return otherSelectedThemes.every((theme) =>
              bookCategories.includes(theme.toLowerCase())
            );
          });
        }
      }

      // Zählen für dieses spezifische Theme
      const count = filteredBooks.filter(
        (book) =>
          book.categories &&
          book.categories.toLowerCase().includes(item.toLowerCase())
      ).length;

      categoryMap.get(category.title)!.set(item, count);
    });
  });

  return defaultCategories.map((category) => ({
    title: category.title,
    items: category.items.map((item) => ({
      name: item,
      count: categoryMap.get(category.title)?.get(item) || 0,
    })),
  }));
});

const filteredBooks = computed(() => {
  let filtered = books.value;

  // Textsuche (wenn kein spezifischer Filter)
  if (searchQuery.value && filterType.value === "general") {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.categories.toLowerCase().includes(query) ||
        book.format.toLowerCase().includes(query)
    );
  }

  if (searchQuery.value && filterType.value === "author") {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((book) => {
      const authors = book.author.split(",").map((a) => a.trim().toLowerCase());
      return authors.includes(query);
    });
  }

  if (searchQuery.value && filterType.value === "format") {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((book) => {
      const formate = book.format.split(",").map((f) => f.trim().toLowerCase());
      return formate.includes(query);
    }
    );
  }


  // Theme filter - ALL selected themes must match
  if (selectedThemes.value.length > 0) {
    filtered = filtered.filter((book) => {
      if (!book.categories) return false;

      const bookCategories = book.categories.toLowerCase();
      return selectedThemes.value.every((theme) =>
        bookCategories.includes(theme.toLowerCase())
      );
    });
  }

  if (searchQuery.value) {
    filtered = filtered.sort(
      (a, b) =>
        getRelevanceScore(b, searchQuery.value) -
        getRelevanceScore(a, searchQuery.value)
    );
  }
  return filtered;
});

const displayedBooks = computed(() => {
  return filteredBooks.value.slice(0, displayLimit.value);
});

const hasMoreBooks = computed(() => {
  return filteredBooks.value.length > displayLimit.value;
});

const remainingBooksCount = computed(() => {
  return filteredBooks.value.length - displayLimit.value;
});

// Methods
const toggleCategory = (categoryTitle: string) => {
  const index = expandedCategories.value.indexOf(categoryTitle);
  if (index > -1) {
    expandedCategories.value.splice(index, 1);
  } else {
    expandedCategories.value.push(categoryTitle);
  }
};

const getCategoryTotal = (category: Category): number => {
  return category.items.reduce((total, item) => total + item.count, 0);
};

const clearAllFilters = () => {
  selectedFormats.value = [];
  selectedThemes.value = [];
  displayLimit.value = 20; // Reset beim Filter-Reset
};

const loadMoreBooks = () => {
  displayLimit.value += 20;
};

const toggleMobileFilter = () => {
  isMobileFilterOpen.value = !isMobileFilterOpen.value;
  if (isMobileFilterOpen.value) {
    document.documentElement.classList.add("overlay-open");
    document.body.classList.add("overlay-open");
  } else {
    document.documentElement.classList.remove("overlay-open");
    document.body.classList.remove("overlay-open");
  }
};

const closeMobileFilter = () => {
  isMobileFilterOpen.value = false;
  document.documentElement.classList.remove("overlay-open");
  document.body.classList.remove("overlay-open");
};

const applyMobileFilters = () => {
  closeMobileFilter();
};

const navigateToBook = (book: BookData) => {
  console.log("Navigate to book:", book.title);
  if (book.slug) {
    navigateTo(`/book/${book.slug}`);
  } else {
    // Fallback - generiere slug aus Titel
    const slug = book.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    navigateTo(`/book/${slug}`);
  }
};

// Debug logging
watch(
  [searchQuery, filterType],
  ([query, filter]) => {
    console.log("🔍 URL Parameter geändert:", { query, filter });
  },
  { immediate: true }
);

// Load data on mount
onMounted(() => {
  console.log("✅ BookResults Slice geladen");
  console.log("🔍 Initial URL params:", route.query);
  loadBooksData();
});

onUnmounted(() => {
  document.documentElement.classList.remove("overlay-open");
  document.body.classList.remove("overlay-open");
});
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

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.mobile-filter-btn {
  display: none;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  color: #000;
  transition: all 0.2s ease;
  position: relative;
}

.mobile-filter-btn:hover {
  border-color: #000;
}

.mobile-filter-btn.active {
  background: #004b5a;
  color: #fff;
  border-color: #004b5a;
}

.mobile-filter-btn.active svg {
  color: #fff;
}

.filter-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #004b5a;
  color: #fff;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.mobile-filter-btn.active .filter-badge {
  background: #fff;
  color: #000;
}

/* Mobile Overlay Styles (wie MegaDropdown) */
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
  z-index: 10;
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
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
}

.mobile-apply-section {
  display: none;
  position: sticky;
  bottom: 0;
  background: #fff;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.apply-filters-btn {
  width: 100%;
  padding: 1rem;
  background: #004b5a;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.apply-filters-btn:hover {
  background: #003a47;
}

.results-title {
  font-size: 1.5rem;
  color: #000;
  margin-top: 50px;
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
  accent-color: #004b5a;
  cursor: pointer;
}

.filter-checkbox:disabled {
  cursor: not-allowed;
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

/* Load More Button */
.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 1rem;
}

.load-more-btn {
  padding: 0;
  background: transparent;
  color: #000;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 400;
  transition: all 0.2s ease;
  text-decoration: none;
  position: relative;
}

.load-more-btn:hover {
  text-decoration: underline;
}

/* Responsive */
@media (min-width: 769px) {
  /* Desktop: Overlay verstecken */
  .mobile-filter-btn {
    display: none !important;
  }

  .mobile-overlay {
    display: none !important;
  }
}

@media (max-width: 768px) {
  .mobile-filter-btn {
    display: flex;
  }

  .mobile-apply-section {
    display: block;
  }

  .layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .filter-sidebar {
    display: none;
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
    font-size: 1rem;
  }

  .header-content {
    flex-wrap: wrap;
  }
}
</style>

<style>
/* Global overlay styles */
html.overlay-open,
body.overlay-open {
  overflow: hidden !important;
  position: fixed;
  width: 100%;
  height: 100%;
}
</style>
