<template>
  <div class="page-container">

    <!-- Header mit Ergebniszaehler -->
    <div class="results-header">
      <div class="header-content">
        <h2 class="results-title">
          <span class="heading heading--sm">
            {{ resultsTitle }}
          </span>
        </h2>

        <!-- Mobile Filter Button (nur fuer kleine Bildschrime sichtbar) -->
        <button
          class="mobile-filter-btn"
          @click="toggleMobileFilter"
          :class="{ active: hasActiveFilters }"
        >
          Filtern
          <!-- Hamburger Icon -->
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
          <!-- Anzahl aktiver Filter -->
          <span v-if="hasActiveFilters" class="filter-badge">{{
            activeFilterCount
          }}</span>
        </button>
      </div>

      <!-- Aktive Filter auf Display (nur Desktop) -->
      <div v-if="hasActiveFilters" class="active-filters desktop-only" ref="activeFiltersRef">
        <!-- Schroll-Pfeil links -->
        <button 
          v-if="canScrollLeft"
          @click="scrollFiltersLeft"
          class="scroll-arrow scroll-arrow-left"
          aria-label="Nach links scrollen"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>

        <!-- Scrollbar Container fuer Filter-Tags -->
        <div class="active-filters-scroll" ref="filtersScrollRef" @scroll="checkScrollPosition">
          <div class="active-filters-list">
            <span
              v-for="filter in allActiveFilters"
              :key="filter"
              class="active-filter-tag"
            >
              {{ filter }}
              <button
                @click="removeFilter(filter)"
                class="remove-filter-btn"
                aria-label="Filter entfernen"
              >
                <!-- X-Icon zum Schliessen -->
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </span>
          </div>
        </div>
        
        <!-- Scroll-Pfeil rechts -->
        <button 
          v-if="canScrollRight"
          @click="scrollFiltersRight"
          class="scroll-arrow scroll-arrow-right"
          aria-label="Nach rechts scrollen"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Filter Overlay (Fullscreen) -->
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

          <!-- Scrollbarer Bereich mit Filtern -->
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

                  <!-- Ausgeklappter Inhalt mit Themen -->
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

            <!-- Zuruecksetzen Filter Button -->
            <div v-if="hasActiveFilters" class="filter-section">
              <button @click="clearAllFilters" class="clear-filters-btn">
                Alle Filter zurücksetzen
              </button>
            </div>
          </div>

          <!-- Sticky Button zum Anwenden der Filter (Mobile) -->
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

        <!-- Themen Filter -->
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

        <!-- Filter Zuruecksetzen Button -->
        <div v-if="hasActiveFilters" class="filter-section">
          <button @click="clearAllFilters" class="clear-filters-btn">
            Alle Filter zurücksetzen
          </button>
        </div>
      </div>

      <!-- Rechter Inhaltsbereich -->
      <div class="content-area">
        <!-- Ladezustand -->
        <div v-if="isLoading" class="loading-message">
          Bücher werden geladen...
        </div>

        <!-- Keine Ergebnisse -->
        <div
          v-else-if="filteredBooks.length === 0 && books.length > 0"
          class="no-results"
        >
          <p class="body--sm"><strong>Keine Bücher für die aktuellen <br>
            Filter/Suchergebnisse <br>
            gefunden.</strong></p>
        </div>

        <!-- Buecher Liste -->
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
              loading="lazy"
            />
            <div class="book-details">
              <h4 class="book-title">{{ book.title }}</h4>
              <p class="book-author">{{ book.author }}</p>
            </div>
          </div>

          <!-- Mehr Laden Button -->
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
import { useRoute, useRouter, navigateTo } from "#imports";
import type { getSliceComponentProps } from "@prismicio/vue";
import type { Content } from "@prismicio/client";

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

/**
 * Normalisiert String fuer die Suche
 * Entfernt Akzente und konvertiert zu Kleinbuchstaben
 * @param {string} str Der zu normalisierende String
 * @returns {string} Normalisierter String
 */
const normalize = (str: string): string =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

    /**
     * Berechnet Relevanz eines Buches fuer eine Suchanfrage
     * Hoehere Scores fuer genauere Matches (Titel > Autor > Kategorien > Beschreibung)
     * @param {BookData} book Das zu bewertende Buch
     * @param {string} query Die Suchanfrage
     * @returns {number} Relevanz-Score 
     */
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

const route = useRoute();
const router = useRouter();
// UI-Zustand
const expandedCategories = ref<string[]>([]);
const books = ref<BookData[]>([]);
const isLoading = ref(false);
const isMobileFilterOpen = ref(false);
const displayLimit = ref(20);
// Scroll-Funktionalitaet fuer Filter-Tags
const activeFiltersRef = ref(null);
const visibleFiltersCount = ref(10);
const filtersScrollRef = ref<HTMLElement | null>(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

// Ausgewaehlte Filter
const selectedThemes = ref<string[]>([]);
const selectedFormats = ref<string[]>([]);

// Liest Filter aus der URL
const readFiltersFromQuery = () => {
  const formatsParam = route.query.formats?.toString() || "";
  const themesParam = route.query.themes?.toString() || "";

  if (formatsParam) {
    selectedFormats.value = formatsParam.split(",").filter(Boolean);
  }
  if (themesParam) {
    selectedThemes.value = themesParam.split(",").filter(Boolean);
  }
};

// Schreibt current Filter zurueck in die URL
const writeFiltersToQuery = () => {
  const current = { ...route.query };

  if (selectedFormats.value.length > 0) {
    current.formats = selectedFormats.value.join(",");
  } else {
    delete current.formats;
  }

  if (selectedThemes.value.length > 0) {
    current.themes = selectedThemes.value.join(",");
  } else {
    delete current.themes;
  }

  router.replace({ query: current });
};

// Alles aus der Route anwenden
const applyFiltersFromRoute = () => {
  // Leeren
  selectedThemes.value = [];
  selectedFormats.value = [];
  displayLimit.value = 20;

  readFiltersFromQuery();

  if (
    selectedFormats.value.length === 0 &&
    selectedThemes.value.length === 0
  ) {
    const q = route.query.q?.toString();
    const type = route.query.filter?.toString();

    if (q && type) {
      const normalizedQ = normalize(q);

      if (type === "category") {
        selectedThemes.value = [q];
      } else if (type === "format") {
        selectedFormats.value = [q];
      } else if (type === "general") {
        const matchedFormat = allFormats.find(
          (f) => normalize(f) === normalizedQ
        );
        if (matchedFormat) {
          selectedFormats.value = [matchedFormat];
        }

        const matchedTheme = defaultCategories
          .flatMap((c) => c.items)
          .find((item) => normalize(item) === normalizedQ);
        if (matchedTheme) {
          selectedThemes.value = [matchedTheme];
        }
      }
    }
  }
};

const searchQuery = computed(() => route.query.q?.toString() || "");
const filterType = computed(() => route.query.filter?.toString() || "");

// Alle verfuegbaren Formate
const allFormats = ["Buch", "Hörbuch", "E-Book", "Braille"];

// Alle Kategorien
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

/**
 * Laedt Buecher-Daten aus CSV
 * Parst CSV und erstellt BookData-Objekte
 * Bei Fehler werden Fallback-Daten verwendet
 * @returns {Promise<void>}
 */
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

    // Header-Zeile parsen
    const headers = lines[0]
      .split(";")
      .map((h) => h.trim().replace(/^\uFEFF/, ""));
    const bookData: BookData[] = [];

    // Jede Zeile verarbeiten
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(";").map((v) => v.trim());

      // Buch Objekt erstellen
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
    console.log(`${bookData.length} Bücher geladen`);
  } catch (error) {
    console.error("Fehler beim Laden der CSV:", error);
    
    // Fallback-Daten bei Fehler
    books.value = [
      {
        title: "Kennt ihr Blauland?",
        author: "Tina Rau",
        format: "Buch",
        categories: "Vielfalt & Diversität, Toleranz & Respekt",
        cover_url: "https://via.placeholder.com/100x150?text=Buch+1",
        description: "Ein liebevoll gestaltetes Bilderbuch...",
        slug: "kenntihrblauland",
      },
      {
        title: "Freunde fürs Leben",
        author: "Anna Autorin",
        format: "Hörbuch",
        categories: "Freundschaft & Familie, Emotionale Intelligenz & Empathie",
        cover_url: "https://via.placeholder.com/100x150?text=Buch+2",
        description: "Eine Geschichte über wahre Freundschaft",
        slug: "freundefuersleben",
      },
    ];
  } finally {
    isLoading.value = false;
  }
};

/**
 * Beobachtet Veraenderungen der URL-Params
 * Aktiviert automatisch passende Filter basierend auf URL
 */
watch(
  [searchQuery, filterType],
  ([q, type], [oldQ, oldType]) => {
    // Rrster Lauf, da nichts resetten
    if (oldQ === undefined && oldType === undefined) return;

    // Nur reagieren, wenn Aenderung
    if (q !== oldQ || type !== oldType) {
      // Basis-Reset
      selectedThemes.value = [];
      selectedFormats.value = [];
      displayLimit.value = 20;

       readFiltersFromQuery();

      if (
        selectedFormats.value.length === 0 &&
        selectedThemes.value.length === 0 &&
        q &&
        type
      ) {
        const normalizedQ = normalize(q);

        if (type === "category") {
          selectedThemes.value = [q];
        } else if (type === "format") {
          selectedFormats.value = [q];
        } else if (type === "general") {
          // Schauen, ob q einem Format entspricht
          const matchedFormat = allFormats.find(
            (f) => normalize(f) === normalizedQ
          );
          if (matchedFormat) {
            selectedFormats.value = [matchedFormat];
          }

          // Oder einem Thema
          const matchedTheme = defaultCategories
            .flatMap((c) => c.items)
            .find((item) => normalize(item) === normalizedQ);
          if (matchedTheme) {
            selectedThemes.value = [matchedTheme];
          }
        }
      }
    }
  },
  { immediate: true }
);



// Wenn Filter geaendert werden, dann URL aktualisieren
watch(
  [selectedFormats, selectedThemes],
  () => {
    writeFiltersToQuery();
  },
  { deep: true }
);

// Prueft ob mind. 1 Filter aktiv
const hasActiveFilters = computed(() => {
  return selectedFormats.value.length > 0 || selectedThemes.value.length > 0;
});

// Zaehlt die Anzahl der aktiven Filter
const activeFilterCount = computed(() => {
  return selectedFormats.value.length + selectedThemes.value.length;
});

/**
 * Generiert dynamischen Titel fuer Ergebnisanzeige
 * Passt sich Filter-Typ und Suchanfrage an
 */
const resultsTitle = computed(() => {
  if (filterType.value === 'format' || filterType.value === 'category') {
    if (hasActiveFilters.value && searchQuery.value) {
      return `Filtersuche: ${filteredBooks.value.length} Treffer`;
    } else if (hasActiveFilters.value) {
      return `Filtersuche: ${filteredBooks.value.length} Treffer`;
    } else {
      return `Filtersuche: ${filteredBooks.value.length} Treffer`;
    }
  }
  
  if (searchQuery.value && (filterType.value === 'general' || filterType.value === 'author')) {
    if (hasActiveFilters.value) {
      return `Suchergebnis: "${searchQuery.value}" - ${filteredBooks.value.length} Treffer`;
    } else {
      return `Suchergebnis: "${searchQuery.value}" - ${filteredBooks.value.length} Treffer`;
    }
  }
  
  if (hasActiveFilters.value) {
    return `Filtersuche: ${filteredBooks.value.length} Treffer`;
  }
  
  return `${books.value.length} Bücher`;
});

/**
 * Berechnet fuer jedes Format die Anzahl verfuegbarer Buecher
 * unter Beruecksichtigung der aktuellen Filter und Suchanfrage
 */
const allFormatsWithCounts = computed<Format[]>(() => {
  return allFormats.map((format) => {
    let filteredBooks = books.value;

    if (searchQuery.value && filterType.value === "general") {
      const query = searchQuery.value.toLowerCase();
      filteredBooks = filteredBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.categories.toLowerCase().includes(query) ||
          book.format.toLowerCase().includes(query) ||
          (book.description && book.description.toLowerCase().includes(query))
      );
    }

    if (searchQuery.value && filterType.value === "author") {
      const query = searchQuery.value.toLowerCase();
      filteredBooks = filteredBooks.filter((book) => {
        const authors = book.author.split(",").map((a) => a.trim().toLowerCase());
        return authors.includes(query);
      });
    }

    if (selectedThemes.value.length > 0) {
      filteredBooks = filteredBooks.filter((book) => {
        if (!book.categories) return false;
        const bookCategories = book.categories.toLowerCase();
        return selectedThemes.value.every((theme) =>
          bookCategories.includes(theme.toLowerCase())
        );
      });
    }

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

/**
 * Berechnet fuer jede Kategorie und jedes Item die Anzahl verfuegbarer Buecher
 * unter Beruecksichtigung aller aktiven Filter
 */
const allCategoriesWithCounts = computed<Category[]>(() => {
  const categoryMap = new Map<string, Map<string, number>>();

  defaultCategories.forEach((category) => {
    categoryMap.set(category.title, new Map());
    category.items.forEach((item) => {
      categoryMap.get(category.title)!.set(item, 0);
    });
  });

  defaultCategories.forEach((category) => {
    category.items.forEach((item) => {
      let filtered = books.value;

      if (searchQuery.value && filterType.value === "general") {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(
          (book) =>
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            book.categories.toLowerCase().includes(query) ||
          (book.description && book.description.toLowerCase().includes(query))
        );
      }

      if (searchQuery.value && filterType.value === "author") {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter((book) => {
          const authors = book.author.split(",").map((a) => a.trim().toLowerCase());
          return authors.includes(query);
        });
      }

      if (selectedFormats.value.length > 0) {
        console.log('Vor Format-Filter:', filtered.length);
        
        filtered = filtered.filter((book) => {
          if (!book.format) return false;
          const bookFormats = book.format.toLowerCase();
          return selectedFormats.value.every((format) =>
            bookFormats.includes(format.toLowerCase())
          );
        });
      }

      const otherSelectedThemes = selectedThemes.value.filter(
        (theme) => theme !== item
      );
      if (otherSelectedThemes.length > 0) {
        filtered = filtered.filter((book) => {
          if (!book.categories) return false;
          const bookCategories = book.categories.toLowerCase();
          return otherSelectedThemes.every((theme) =>
            bookCategories.includes(theme.toLowerCase())
          );
        });
      }

      const count = filtered.filter(
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

/**
 * Filtert die Buecher basierend auf Suchanfrage und ausgewaehltern Filtern 
 * Sortiert Ergebnisse nach Relevanz bei Suchanfragen
 */
const filteredBooks = computed(() => {
  console.log('Filtering:', {
    searchQuery: searchQuery.value,
    filterType: filterType.value,
    selectedFormats: selectedFormats.value,
    selectedThemes: selectedThemes.value
  });
  let filtered = books.value;

  if (searchQuery.value && filterType.value === "general") {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.categories.toLowerCase().includes(query) ||
        book.format.toLowerCase().includes(query) ||
        (book.description && book.description.toLowerCase().includes(query))
    );
  }

  if (searchQuery.value && filterType.value === "author") {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((book) => {
      const authors = book.author.split(",").map((a) => a.trim().toLowerCase());
      return authors.includes(query);
    });
  }

  if (selectedFormats.value.length > 0) {
    filtered = filtered.filter((book) => {
      if (!book.format) return false;
      const bookFormats = book.format.toLowerCase();
      const matches = selectedFormats.value.every((format) =>
        bookFormats.includes(format.toLowerCase())
      );
      return matches;
    });
  }

  if (selectedThemes.value.length > 0) {
    filtered = filtered.filter((book) => {
      if (!book.categories) return false;

      const bookCategories = book.categories.toLowerCase();
      return selectedThemes.value.every((theme) =>
        bookCategories.includes(theme.toLowerCase())
      );
    });
  }

  // Bei Suchanfrage nach Relevanz sortieren
  if (searchQuery.value) {
    filtered = filtered.sort(
      (a, b) =>
        getRelevanceScore(b, searchQuery.value) -
        getRelevanceScore(a, searchQuery.value)
    );
  }
  return filtered;
});

// Gibt nur die aktuell anzuzeigeneden Buecher zurueck (begrenzt durch displayLimit fuer Pagination)
const displayedBooks = computed(() => {
  return filteredBooks.value.slice(0, displayLimit.value);
});

// Prueft ob weitere Buecher zum Laden verfuegbar sind
const hasMoreBooks = computed(() => {
  return filteredBooks.value.length > displayLimit.value;
});

// Berechnet die Anzahl der noch nicht angezeigten Buecher
const remainingBooksCount = computed(() => {
  return filteredBooks.value.length - displayLimit.value;
});

// Kombiniert alle aktiven Filter in einem Array
// Wird fuer die Anzeige der Filter-Tags verwendet
const allActiveFilters = computed(() => {
  return [...selectedFormats.value, ...selectedThemes.value];
});

/**
 * Prueft ob die Scroll-Position der Filter-Tags
 * Aktualisiert die Sichtbarkeit der Scroll-Pfeile
 * @returns {void}
 */
const checkScrollPosition = () => {
  if (!filtersScrollRef.value) return;
  
  const element = filtersScrollRef.value;
  canScrollLeft.value = element.scrollLeft > 0;
  canScrollRight.value = element.scrollLeft < (element.scrollWidth - element.clientWidth - 1);
};

/**
 * Scrollt die Filter-Tags nach links
 * @returns {void}
 */
const scrollFiltersLeft = () => {
  if (!filtersScrollRef.value) return;
  filtersScrollRef.value.scrollBy({ left: -200, behavior: 'smooth' });
};

/**
 * Scrollt die Filter-Tags nach rechts
 * @returns {void}
 */
const scrollFiltersRight = () => {
  if (!filtersScrollRef.value) return;
  filtersScrollRef.value.scrollBy({ left: 200, behavior: 'smooth' });
};

/**
 * Klappt eine Kategorie auf oder zu
 * @param {string} categoryTitle Der Titel der zu toggelnden Kategorie
 * @returns {void}
 */
const toggleCategory = (categoryTitle: string) => {
  const index = expandedCategories.value.indexOf(categoryTitle);
  if (index > -1) {
    expandedCategories.value.splice(index, 1);
  } else {
    expandedCategories.value.push(categoryTitle);
  }
};

/**
 * Berechnet die Gesamtzahl der Buecher fuer eine Kategorie
 * Beruecksichtigt alle aktiven Filter
 * @returns {Function} Funktion die die Anzahl fuer eine Kategorie berechnet
 */
const getCategoryTotal = computed(() => {
  // Diese Funktion wird bei jeder Aenderung von selectedFormats/selectedThemes neu erstellt
  return (category: Category): number => {
    let filtered = books.value;

    // Suchfilter
    if (searchQuery.value && filterType.value === "general") {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.categories.toLowerCase().includes(query) ||
          book.format.toLowerCase().includes(query) ||
          (book.description && book.description.toLowerCase().includes(query))
      );
    }

    if (searchQuery.value && filterType.value === "author") {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter((book) => {
        const authors = book.author.split(",").map((a) => a.trim().toLowerCase());
        return authors.includes(query);
      });
    }

    // Format-Filter
    if (selectedFormats.value.length > 0) {
      filtered = filtered.filter((book) => {
        if (!book.format) return false;
        const bookFormats = book.format.toLowerCase();
        return selectedFormats.value.every((format) =>
          bookFormats.includes(format.toLowerCase())
        );
      });
    }

    // Themen-Filter anwenden
    if (selectedThemes.value.length > 0) {
      filtered = filtered.filter((book) => {
        if (!book.categories) return false;
        const bookCategories = book.categories.toLowerCase();
        return selectedThemes.value.every((theme) =>
          bookCategories.includes(theme.toLowerCase())
        );
      });
    }

    // Zaehle unique Buecher mit Themen aus dieser Kategorie
    const uniqueBooks = new Set<string>();
    category.items.forEach((item) => {
      filtered.forEach((book) => {
        if (book.categories && 
            book.categories.toLowerCase().includes(item.name.toLowerCase())) {
          uniqueBooks.add(book.slug || book.title);
        }
      });
    });

    return uniqueBooks.size;
  };
});

/**
 * Setze alle Filter zurueck und resettet die Pagination
 * @returns {void}
 */
const clearAllFilters = () => {
  selectedFormats.value = [];
  selectedThemes.value = [];
  displayLimit.value = 20;
};

/**
 * Entfernt einen einzelnen Filter
 * Sucht in Formaten und Themen und entfernt ersten Treffer
 * @param {string} filterName Der Name des zu entfernenden Filters
 * @returns {void}
 */
const removeFilter = (filterName: string) => {
  // Erst in Formaten suchen
  const formatIndex = selectedFormats.value.indexOf(filterName);
  if (formatIndex > -1) {
    selectedFormats.value.splice(formatIndex, 1);
    return;
  }

  // Dann in Themen suchen
  const themeIndex = selectedThemes.value.indexOf(filterName);
  if (themeIndex > -1) {
    selectedThemes.value.splice(themeIndex, 1);
  }
};

/**
 * Laedt weitere 20 Buecher durch Erhoehung des Display-Limits
 * @returns {void}
 */
const loadMoreBooks = () => {
  displayLimit.value += 20;
};

/**
 * Oeffnet oder schliesst das mobile Filter-Overlay
 * Verhindert Body-Scrolling wenn geoeffnet
 * @returns {void}
 */
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

/**
 * Schliesst das mobile Filter-Overlay 
 * Reaktiviert Body-Scrolling
 * @returns {void}
 */
const closeMobileFilter = () => {
  isMobileFilterOpen.value = false;
  document.documentElement.classList.remove("overlay-open");
  document.body.classList.remove("overlay-open");
};

/**
 * Wendet die ausgewaehlten Filter an und schliesst das mobile Overlay
 * @returns {void}
 */
const applyMobileFilters = () => {
  closeMobileFilter();
};

/**
 * Navigiert zur Detailseite eines Buches
 * Generiert Slug aus Buchtitel wenn noetig
 * @param {BookData} book Das Buch zu dem navigiert werden soll
 * @returns {void} 
 */
const navigateToBook = (book: BookData) => {
  console.log("Navigate to book:", book.title);
  const slug = book.title
      .toLowerCase()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "")
    navigateTo(`/book/${slug}`)
};

/**
 * Beobachtet Parameter Aenderungen
 */
watch(
  [searchQuery, filterType],
  () => {
    applyFiltersFromRoute();
  },
  { immediate: true }
);

/**
 * Beobachet Filter Aenderungen
 */
watch(
  [selectedFormats, selectedThemes],
  () => {
    writeFiltersToQuery();
  },
  { deep: true }
);



/**
 * Wird beim Mounten der Komponente ausgefuehrt 
 * Laedt Buecher-Daten und initialisiert Scroll-Position
 */
onMounted(() => {
  console.log("BookResults Slice geladen");
  console.log("Initial URL params:", route.query);

  readFiltersFromQuery();
  loadBooksData();
  
  setTimeout(() => {
    checkScrollPosition();
  }, 100);
});

/**
 * Wird beim Unmounten der Komponente ausgefuehrt
 * Stellt sicher, dass Body-Scrolling reaktiviert wird
 */
onUnmounted(() => {
  document.documentElement.classList.remove("overlay-open");
  document.body.classList.remove("overlay-open");
});

/**
 * Beobachtet Aenderungn der aktiven Filter
 * Aktualisiert die Scroll-Position nach kurzer Verzoegerung
 */
watch(allActiveFilters, () => {
  setTimeout(() => {
    checkScrollPosition();
  }, 100);
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
  margin-bottom: 1rem;
}

.active-filters {
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.desktop-only {
  display: flex;
}

.active-filters-scroll {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.active-filters-scroll::-webkit-scrollbar {
  display: none;
}

.active-filters-list {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  white-space: nowrap;
}

.scroll-arrow {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #fff;
  border: 2px solid #004b5a;
  border-radius: 50%;
  cursor: pointer;
  color: #004b5a;
  transition: all 0.2s ease;
  z-index: 2;
}

.scroll-arrow:hover {
  background: #004b5a;
  color: #fff;
}

.scroll-arrow-left {
  margin-right: 0.25rem;
}

.scroll-arrow-right {
  margin-left: 0.25rem;
}

.active-filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  background: #004b5a;
  color: #fff;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.active-filter-tag:hover {
  background: #003a47;
}

.remove-filter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: #fff;
  transition: opacity 0.2s ease;
}

.remove-filter-btn:hover {
  opacity: 0.7;
}

.more-filters-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 0.75rem;
  background: #e0e0e0;
  color: #333;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  flex-shrink: 0;
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

.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
}

.load-more-btn {
  padding: 0.2rem 0;
  background: transparent;
  color: #000;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 400;
  text-decoration: none;
  position: relative;
  display: inline-block;
}

.load-more-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 1px;
  background: #000;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.load-more-btn:hover::after {
  width: 100%;
}

@media (min-width: 1024px) {
  .mobile-filter-btn {
    display: none !important;
  }

  .mobile-overlay {
    display: none !important;
  }
}

@media (max-width: 1023px) {
  .desktop-only {
    display: none !important;
  }

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
}

@media (min-width: 481px) and (max-width: 1023px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .mobile-filter-btn {
    align-self: flex-start;
  }

  .mobile-overlay-body {
    padding: 3rem 1rem 2rem 1rem;
  }
}

@media (max-width: 480px) {
  .header-content {
    flex-wrap: wrap;
  }

  .mobile-overlay-body {
    padding: 3rem 1rem 2rem 1rem;
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
}
</style>