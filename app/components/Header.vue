<script setup lang="ts">
const settings = useSettings();
</script>

<template>
    <Bounded as="header" class="!py-4 md:!py-6 lg:!py-8 bg-[#004b5a] text-white">
        <div class="flex flex-col items-center justify-between sm:flex-row gap-4">
            <NuxtLink to="/">
                <Logo />
            </NuxtLink>
            <div class="w-xl sm:w-auto sm:ml-auto">
                <SearchBar />
            </div>
        </div>
    </Bounded>
</template>