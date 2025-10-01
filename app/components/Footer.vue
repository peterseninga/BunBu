<script setup lang="ts">
const settings = useSettings();
</script>

<template>
    <Bounded as="footer" ref="footerRef" class="!py-4 md:!py-6 lg:!py-8 bg-[#004b5a] text-white">
        <div class="flex flex-col items-center justify-between sm:flex-row gap-4">   
        <NuxtLink to="/home">
            <Logo class="order-1 sm:order-1"/>
        </NuxtLink>
        
        <nav class="order-2 sm:order-3">
            <ul class="flex flex-wrap sm:flex-col sm:items-start items-center gap-2">
                <li v-for="item of settings?.data.navigation"
                    :key="item.label ?? ''">
                 <PrismicLink :field="item.link" class="p-2 sm:p-4 hover:underline">
                    {{ item.label }}
                 </PrismicLink> 
                </li> 
            </ul>
        </nav>
        
        <p class="text-xs order-3 sm:order-2">
            © {{ new Date().getFullYear() }} {{ settings?.data.site_title }}
        </p>
       </div>
    </Bounded>
</template>