<script setup lang="ts">
const settings = useSettings();
</script>

<template>
    <Bounded as="header" class="!py-4 md:!py-6 lg:!py-8 bg-[#004b5a] text-white">
        <div class="flex gap-4 items-center justify-between flex-col sm:flex-row">
            <Logo />
        </div>
    </Bounded>
</template>