<script setup lang="ts">
const settings = useSettings();


const { asImageSrc } = usePrismic();

useSeoMeta({
  title: settings.value?.data.site_title,
  description: settings.value?.data.meta_discription,
  ogImage: asImageSrc(settings.value?.data.og_image),
});

</script>

<template>
  <div class="scroll-button-wrapper">
    <Header />
    <slot />
    <ScrollToTop />
    <Footer />
    <div class="bg-white z-[-1]"/>
  </div>
</template>

<style scoped>
.scroll-button-wrapper {
  position: relative;
  min-height: 100px;
}
</style>