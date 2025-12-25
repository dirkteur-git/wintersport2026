<template>
  <div class="map-page">
    <div class="container">
      <header class="page-header">
        <div>
          <h1>Skigebieden & Vliegvelden</h1>
          <p class="subtitle">Ontdek de beste locaties voor Wintersport 2026</p>
        </div>
        <div class="filters">
          <button
            :class="['filter-btn', { active: activeFilter === 'all' }]"
            @click="activeFilter = 'all'"
          >
            <Globe :size="18" :stroke-width="2" />
            Alles
          </button>
          <button
            :class="['filter-btn', { active: activeFilter === 'resorts' }]"
            @click="activeFilter = 'resorts'"
          >
            <Mountain :size="18" :stroke-width="2" />
            Skigebieden
          </button>
          <button
            :class="['filter-btn', { active: activeFilter === 'airports' }]"
            @click="activeFilter = 'airports'"
          >
            <Plane :size="18" :stroke-width="2" />
            Vliegvelden
          </button>
        </div>
      </header>

      <div class="map-container">
        <div class="map-placeholder">
          <div class="map-grid">
            <div
              v-for="location in filteredLocations"
              :key="location.name"
              class="location-card"
              :class="{ 'is-resort': location.type === 'resort', 'is-airport': location.type === 'airport' }"
              @mouseenter="hoveredLocation = location"
              @mouseleave="hoveredLocation = null"
            >
              <div class="location-icon">
                <Mountain v-if="location.type === 'resort'" :size="24" :stroke-width="2" />
                <Plane v-else :size="24" :stroke-width="2" />
              </div>
              <div class="location-name">{{ location.name }}</div>
              <div class="location-country">{{ location.country }}</div>
            </div>
          </div>
        </div>

        <Transition name="slide-up">
          <div v-if="hoveredLocation" class="detail-panel">
            <div class="detail-header">
              <div class="detail-icon">
                <Mountain v-if="hoveredLocation.type === 'resort'" :size="32" :stroke-width="1.5" />
                <Plane v-else :size="32" :stroke-width="1.5" />
              </div>
              <div>
                <h2>{{ hoveredLocation.name }}</h2>
                <p class="detail-location">{{ hoveredLocation.city }}, {{ hoveredLocation.country }}</p>
              </div>
            </div>

            <div v-if="hoveredLocation.type === 'resort'" class="detail-content">
              <div class="detail-grid">
                <div class="detail-item">
                  <MapPin :size="16" :stroke-width="2" />
                  <span>{{ hoveredLocation.pistes }} km pistes</span>
                </div>
                <div class="detail-item">
                  <Mountain :size="16" :stroke-width="2" />
                  <span>{{ hoveredLocation.altitude }}</span>
                </div>
                <div class="detail-item">
                  <TrendingUp :size="16" :stroke-width="2" />
                  <span>{{ hoveredLocation.level }}</span>
                </div>
                <div class="detail-item">
                  <Plane :size="16" :stroke-width="2" />
                  <span>{{ hoveredLocation.nearestAirport }}</span>
                </div>
              </div>
              <p class="detail-description">{{ hoveredLocation.description }}</p>
              <div class="detail-rating">
                <Star :size="16" :stroke-width="2" fill="currentColor" />
                <span>{{ hoveredLocation.rating }}/5</span>
              </div>
            </div>

            <div v-else class="detail-content">
              <div class="detail-grid">
                <div class="detail-item full-width">
                  <MapPin :size="16" :stroke-width="2" />
                  <span>{{ hoveredLocation.code }}</span>
                </div>
              </div>
              <div class="nearby-resorts">
                <h3>Nabije skigebieden</h3>
                <div class="resort-list">
                  <div v-for="resort in hoveredLocation.nearbyResorts.slice(0, 3)" :key="resort.name" class="resort-item">
                    <span class="resort-name">{{ resort.name }}</span>
                    <span class="resort-distance">{{ resort.distance }}</span>
                  </div>
                </div>
              </div>
              <div class="flights-info">
                <Plane :size="16" :stroke-width="2" />
                <span>{{ hoveredLocation.dutchConnections }}</span>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Mountain, Plane, Globe, MapPin, TrendingUp, Star } from 'lucide-vue-next'

const activeFilter = ref('all')
const hoveredLocation = ref(null)

const resorts = [
  {
    type: 'resort',
    name: 'Les Trois Vallées',
    country: 'Frankrijk',
    city: 'Courchevel',
    pistes: 600,
    altitude: '1300m - 3230m',
    level: 'Alle niveaus',
    nearestAirport: 'Geneva (2u)',
    rating: 4.9,
    description: 'Het grootste skigebied ter wereld met 600km piste. Perfect voor grote groepen met verschillende niveaus.'
  },
  {
    type: 'resort',
    name: 'Ischgl',
    country: 'Oostenrijk',
    city: 'Ischgl',
    pistes: 238,
    altitude: '1400m - 2872m',
    level: 'Gevorderd - Expert',
    nearestAirport: 'Innsbruck (1.5u)',
    rating: 4.8,
    description: 'Bekend om het levendige après-ski en uitstekende sneeuwzekerheid.'
  },
  {
    type: 'resort',
    name: 'Verbier',
    country: 'Zwitserland',
    city: 'Verbier',
    pistes: 410,
    altitude: '1500m - 3330m',
    level: 'Alle niveaus',
    nearestAirport: 'Geneva (2.5u)',
    rating: 4.7,
    description: 'Onderdeel van de 4 Vallées. Fantastisch off-piste skiën.'
  },
  {
    type: 'resort',
    name: 'Val di Fassa',
    country: 'Italië',
    city: 'Canazei',
    pistes: 120,
    altitude: '1320m - 2625m',
    level: 'Beginner - Gemiddeld',
    nearestAirport: 'Verona (2.5u)',
    rating: 4.5,
    description: 'In de prachtige Dolomieten. Geweldig Italiaans eten.'
  },
  {
    type: 'resort',
    name: 'Sölden',
    country: 'Oostenrijk',
    city: 'Sölden',
    pistes: 144,
    altitude: '1350m - 3340m',
    level: 'Alle niveaus',
    nearestAirport: 'Innsbruck (1.5u)',
    rating: 4.6,
    description: '2 gletsjers voor gegarandeerde sneeuw.'
  },
  {
    type: 'resort',
    name: 'Alpe d\'Huez',
    country: 'Frankrijk',
    city: 'Alpe d\'Huez',
    pistes: 249,
    altitude: '1125m - 3330m',
    level: 'Alle niveaus',
    nearestAirport: 'Grenoble (1.5u)',
    rating: 4.4,
    description: 'Zeer zonnig gebied met iconische Sarenne afdaling.'
  },
  {
    type: 'resort',
    name: 'Zell am See',
    country: 'Oostenrijk',
    city: 'Zell am See',
    pistes: 408,
    altitude: '750m - 3029m',
    level: 'Alle niveaus',
    nearestAirport: 'Salzburg (1.5u)',
    rating: 4.7,
    description: 'Combinatie van gletsjer en traditioneel skigebied.'
  },
  {
    type: 'resort',
    name: 'Tignes',
    country: 'Frankrijk',
    city: 'Tignes',
    pistes: 300,
    altitude: '1550m - 3456m',
    level: 'Gevorderd - Expert',
    nearestAirport: 'Geneva (2.5u)',
    rating: 4.8,
    description: 'Top sneeuwzekerheid door gletsjer.'
  }
]

const airports = [
  {
    type: 'airport',
    code: 'GVA',
    name: 'Geneva Airport',
    city: 'Genève',
    country: 'Zwitserland',
    nearbyResorts: [
      { name: 'Verbier', distance: '2.5u' },
      { name: 'Les Trois Vallées', distance: '2u' },
      { name: 'Chamonix', distance: '1.5u' },
      { name: 'Tignes', distance: '2.5u' }
    ],
    dutchConnections: 'Directe vluchten vanuit Amsterdam met easyJet, Transavia en KLM'
  },
  {
    type: 'airport',
    code: 'INN',
    name: 'Innsbruck Airport',
    city: 'Innsbruck',
    country: 'Oostenrijk',
    nearbyResorts: [
      { name: 'Ischgl', distance: '1.5u' },
      { name: 'Sölden', distance: '1.5u' },
      { name: 'St. Anton', distance: '1u' }
    ],
    dutchConnections: 'Directe vluchten vanuit Amsterdam met Transavia'
  },
  {
    type: 'airport',
    code: 'SZG',
    name: 'Salzburg Airport',
    city: 'Salzburg',
    country: 'Oostenrijk',
    nearbyResorts: [
      { name: 'Zell am See', distance: '1.5u' },
      { name: 'Saalbach', distance: '1.5u' },
      { name: 'Bad Gastein', distance: '1.5u' }
    ],
    dutchConnections: 'Directe vluchten vanuit Eindhoven met Transavia'
  },
  {
    type: 'airport',
    code: 'VRN',
    name: 'Verona Airport',
    city: 'Verona',
    country: 'Italië',
    nearbyResorts: [
      { name: 'Val di Fassa', distance: '2.5u' },
      { name: 'Madonna di Campiglio', distance: '2u' },
      { name: 'Val Gardena', distance: '2.5u' }
    ],
    dutchConnections: 'Directe vluchten vanuit Amsterdam en Eindhoven'
  },
  {
    type: 'airport',
    code: 'LYS',
    name: 'Lyon Airport',
    city: 'Lyon',
    country: 'Frankrijk',
    nearbyResorts: [
      { name: 'Les Trois Vallées', distance: '2.5u' },
      { name: 'Paradiski', distance: '2.5u' },
      { name: 'Val d\'Isère', distance: '3u' }
    ],
    dutchConnections: 'Directe vluchten vanuit Amsterdam met KLM'
  },
  {
    type: 'airport',
    code: 'MUC',
    name: 'Munich Airport',
    city: 'München',
    country: 'Duitsland',
    nearbyResorts: [
      { name: 'Zillertal', distance: '2u' },
      { name: 'Garmisch', distance: '1.5u' },
      { name: 'Sölden', distance: '2.5u' }
    ],
    dutchConnections: 'Meerdere dagelijkse directe vluchten vanuit Amsterdam'
  },
  {
    type: 'airport',
    code: 'ZRH',
    name: 'Zurich Airport',
    city: 'Zürich',
    country: 'Zwitserland',
    nearbyResorts: [
      { name: 'Davos', distance: '2u' },
      { name: 'Flims-Laax', distance: '1.5u' },
      { name: 'St. Moritz', distance: '2.5u' }
    ],
    dutchConnections: 'Vele directe vluchten vanuit Amsterdam'
  },
  {
    type: 'airport',
    code: 'GRZ',
    name: 'Grenoble Airport',
    city: 'Grenoble',
    country: 'Frankrijk',
    nearbyResorts: [
      { name: 'Alpe d\'Huez', distance: '1.5u' },
      { name: 'Les Deux Alpes', distance: '1.5u' },
      { name: 'Serre Chevalier', distance: '2u' }
    ],
    dutchConnections: 'Geen directe vluchten - via Genève of Lyon'
  }
]

const allLocations = [...resorts, ...airports]

const filteredLocations = computed(() => {
  if (activeFilter.value === 'resorts') return resorts
  if (activeFilter.value === 'airports') return airports
  return allLocations
})
</script>

<style scoped>
.map-page {
  min-height: 100vh;
  padding: 3rem 0;
  background: var(--color-bg);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-header {
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--color-gray-500);
  font-size: 1.0625rem;
  margin-bottom: 1.5rem;
}

.filters {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--color-bg);
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
  color: var(--color-text);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: var(--color-text);
  background: var(--color-gray-100);
}

.filter-btn.active {
  background: var(--color-text);
  color: var(--color-bg);
  border-color: var(--color-text);
}

.map-container {
  position: relative;
  min-height: 600px;
}

.map-placeholder {
  background: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  border-radius: 12px;
  padding: 2rem;
  min-height: 600px;
}

.map-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.location-card {
  padding: 1.5rem 1.25rem;
  background: var(--color-bg);
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.location-card:hover {
  border-color: var(--color-text);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.location-card.is-resort .location-icon {
  color: var(--color-text);
}

.location-card.is-airport .location-icon {
  color: var(--color-gray-500);
}

.location-icon {
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: center;
}

.location-name {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.location-country {
  font-size: 0.875rem;
  color: var(--color-gray-500);
}

.detail-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-bg);
  border-top: 2px solid var(--color-text);
  padding: 2rem;
  max-height: 50vh;
  overflow-y: auto;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.detail-icon {
  width: 56px;
  height: 56px;
  background: var(--color-gray-100);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.detail-header h2 {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.detail-location {
  color: var(--color-gray-500);
  font-size: 0.9375rem;
}

.detail-content {
  max-width: 900px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-gray-50);
  border-radius: 6px;
  font-size: 0.9375rem;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-description {
  color: var(--color-gray-600);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.detail-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--color-text);
}

.nearby-resorts {
  margin-bottom: 1.5rem;
}

.nearby-resorts h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.resort-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.resort-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: var(--color-gray-50);
  border-radius: 6px;
}

.resort-name {
  font-weight: 500;
}

.resort-distance {
  color: var(--color-gray-500);
  font-size: 0.875rem;
}

.flights-info {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--color-gray-50);
  border-radius: 6px;
  color: var(--color-gray-600);
  line-height: 1.6;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .map-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .detail-panel {
    padding: 1.5rem;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
