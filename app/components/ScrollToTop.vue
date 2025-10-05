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
const scrollThreshold = 300
const bottomOffset = ref('2rem')

const updateButtonPosition = () => {
  const scrollY = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  
  // Button erscheinen lassen
  isVisible.value = scrollY > scrollThreshold
  
  // Footer-Position berechnen
  const footer = document.querySelector('footer')
  if (footer) {
    const footerRect = footer.getBoundingClientRect()
    const footerTop = footerRect.top + scrollY
    const distanceToFooter = documentHeight - scrollY - windowHeight
    
    // Wenn näher als 100px am Footer, Button nach oben verschieben
    if (footerRect.top < windowHeight) {
      const overlap = windowHeight - footerRect.top + 20
      bottomOffset.value = `${overlap}px`
    } else {
      bottomOffset.value = '2rem'
    }
  }
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', updateButtonPosition)
  updateButtonPosition() // Initial check
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateButtonPosition)
})
</script>

<style scoped>
.scroll-to-top {
  position: fixed; /* ← WICHTIG: fixed statt absolute */
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
}

.scroll-to-top:hover svg {
  stroke: #fff;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (min-width: 1454px) {
  .scroll-to-top {
    right: calc(50% - 700px + 2rem);
  }
}

@media (min-width: 1252px) and (max-width: 1453px) {
  .scroll-to-top {
    right: calc(50% - 650px + 2rem);
  }
}

@media (min-width: 1025px) and (max-width: 1251px) {
  .scroll-to-top {
    right: calc(50% - 530px + 2rem);
  }
}

@media (min-width: 977px) and (max-width: 1024px) {
  .scroll-to-top {
    right: calc(50% - 500px + 2rem);
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