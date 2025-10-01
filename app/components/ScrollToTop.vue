<template>
  <transition name="fade">
    <button
      v-if="isVisible"
      @click="scrollToTop"
      class="scroll-to-top"
      :style="{ bottom: bottomOffset }"
      aria-label="Nach oben scrollen"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="18,15 12,9 6,15"></polyline>
      </svg>
    </button>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)
const scrollThreshold = 300 // Pixel ab wann der Button erscheint
const bottomOffset = ref('2rem') // Dynamischer Abstand vom unteren Rand
const footerRef = ref<HTMLElement | null>(null)

const updateButtonPosition = () => {
  const footer = footerRef.value
  const footerTop = footer?.getBoundingClientRect().top ?? Infinity
  const windowHeight = window.innerHeight

  // Wenn Footer im Viewport ist, Button höher setzen
  if (footerTop < windowHeight) {
    const overlap = windowHeight - footerTop + 20 // 20px Puffer
    bottomOffset.value = `${overlap}px`
  } else {
    bottomOffset.value = '2rem'
  }

  isVisible.value = window.scrollY > scrollThreshold
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', updateButtonPosition)

  // Footer-Element holen
  footerRef.value = document.querySelector('footer')
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateButtonPosition)
})
</script>

<style scoped>
.scroll-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: #fff;
  border: 2px solid #004b5a;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 75, 90, 0.1);
  color: #004b5a;
}

.scroll-to-top:hover {
  background: #004b5a;
  color: #fff;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 75, 90, 0.2);
}

.scroll-to-top svg {
  transition: stroke 0.3s ease;
  stroke: #004b5a;
}

.scroll-to-top:hover svg {
  stroke: #fff;
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (min-width: 1254px) {
  .scroll-to-top {
    right: calc(50% - 650px + 2rem);
  }
}

@media (min-width: 769px) and (max-width: 976px) {
  .scroll-to-top {
    right: calc(50% - 400px + 2rem);
  }
}

@media (max-width: 768px) {
  .scroll-to-top {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 45px;
    height: 45px;
  }
}
</style>