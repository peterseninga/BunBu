<script setup lang="ts">
const settings = useSettings();
const filternav = useFilternav();

// Event Handler für MegaDropdown
const handleFormatSelection = (format: { name: string; count: number }) => {
  console.log("Format gewählt:", format);

  // Navigation zu Filterseite mit Format
  navigateTo({
    path: "/filter",
    query: { format: format.name.toLowerCase() },
  });
};

const handleThemeSelection = (selection: {
  item: string;
  category: string;
}) => {
  console.log("Thema gewählt:", selection);

  // Navigation zu Filterseite mit Thema
  const slug = selection.item
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
  navigateTo({
    path: "/filter",
    query: {
      theme: slug,
      category: selection.category
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, ""),
    },
  });
};

// Optional: Custom Daten aus Prismic/CMS laden
const customFormats = computed(() => {
  // Falls du die Formate aus Prismic laden willst:
  return (
    filternav.value?.data.format || [
      { name: "Buch", count: 6 },
      { name: "Hörbuch", count: 2 },
      { name: "Braille", count: 0 },
      { name: "E-Book", count: 0 },
    ]
  );
});

const customCategories = computed(() => {
  // Falls du die Kategorien aus Prismic laden willst:
  return filternav.value?.data.themen || null;
});
</script>

<template>
  <Bounded as="header" class="!py-4 md:!py-6 lg:!py-8 bg-[#004b5a] text-white">
    <div class="flex flex-col items-center justify-between sm:flex-row gap-4">
      <NuxtLink to="/">
        <Logo class="order-1 sm:order-1" />
      </NuxtLink>

      <!-- MegaDropdown centered -->
      <div class="flex-row flex flex-1 justify-center mt-0">
        <MegaDropdown
          @format-selected="handleFormatSelection"
          @theme-selected="handleThemeSelection"
          :custom-format="customFormats"
          :custom-themen="customCategories"
        />
      </div>
      <div class="w-xl sm:w-auto sm:ml-auto order-2 sm:order-3 mt-2">
        <SearchBar />
      </div>
    </div>
  </Bounded>
</template>
