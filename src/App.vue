<template>
  <div class="app">
    <header class="header">
      <div class="header-content">
        <router-link to="/" class="logo">
          <Mountain :size="24" :stroke-width="2" />
          <span>Wintersport 2026</span>
        </router-link>

        <button
          class="hamburger"
          @click="mobileMenuOpen = !mobileMenuOpen"
          :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
        >
          <Menu v-if="!mobileMenuOpen" :size="24" :stroke-width="2" />
          <X v-else :size="24" :stroke-width="2" />
        </button>

        <nav class="desktop-nav">
          <router-link to="/">Home</router-link>
          <router-link to="/datumplanner">Planner</router-link>
          <router-link to="/kaart">Kaart</router-link>
        </nav>
      </div>
    </header>

    <Transition name="slide">
      <nav v-if="mobileMenuOpen" class="mobile-nav">
        <router-link to="/" @click="mobileMenuOpen = false">
          <Home :size="20" :stroke-width="2" />
          <span>Home</span>
        </router-link>
        <router-link to="/datumplanner" @click="mobileMenuOpen = false">
          <Calendar :size="20" :stroke-width="2" />
          <span>Planner</span>
        </router-link>
        <router-link to="/kaart" @click="mobileMenuOpen = false">
          <MapPin :size="20" :stroke-width="2" />
          <span>Kaart</span>
        </router-link>
      </nav>
    </Transition>

    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Menu, X, Mountain, Home, Calendar, MapPin } from 'lucide-vue-next'

const mobileMenuOpen = ref(false)
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-gray-200);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.8);
}

@media (prefers-color-scheme: dark) {
  .header {
    background: rgba(0, 0, 0, 0.8);
  }
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--color-text);
  font-weight: 600;
  font-size: 1.125rem;
  letter-spacing: -0.01em;
  transition: opacity 0.2s;
}

.logo:hover {
  opacity: 0.7;
}

.hamburger {
  display: none;
  background: transparent;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.desktop-nav {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }
}

.desktop-nav a {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: var(--color-text);
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s;
  font-size: 0.9375rem;
}

.desktop-nav a:hover {
  background: var(--color-gray-100);
}

.desktop-nav a.router-link-active {
  background: var(--color-text);
  color: var(--color-bg);
}

.mobile-nav {
  position: fixed;
  top: 65px;
  left: 0;
  right: 0;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-gray-200);
  padding: 1rem;
  z-index: 99;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-nav a {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  text-decoration: none;
  color: var(--color-text);
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s;
}

.mobile-nav a:hover {
  background: var(--color-gray-100);
}

.mobile-nav a.router-link-active {
  background: var(--color-text);
  color: var(--color-bg);
}

.main {
  flex: 1;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
