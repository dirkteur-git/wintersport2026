<template>
  <div class="map-page">
    <div class="map-header">
      <div class="container">
        <h1>Skigebieden & Vliegvelden Kaart</h1>
        <p class="subtitle">Interactieve kaart van de Alpen</p>
        <div class="filters">
          <button
            :class="['filter-btn', { active: showResorts }]"
            @click="showResorts = !showResorts"
          >
            <Mountain :size="18" :stroke-width="2" />
            Skigebieden
          </button>
          <button
            :class="['filter-btn', { active: showAirports }]"
            @click="showAirports = !showAirports"
          >
            <Plane :size="18" :stroke-width="2" />
            Vliegvelden
          </button>
        </div>
      </div>
    </div>

    <div class="map-container">
      <div id="map" class="leaflet-map"></div>
    </div>

    <Transition name="slide-up">
      <div v-if="selectedLocation" class="detail-panel">
        <button class="close-btn" @click="selectedLocation = null">
          <X :size="20" :stroke-width="2" />
        </button>

        <div class="detail-header">
          <div class="detail-icon" :class="selectedLocation.type">
            <Mountain v-if="selectedLocation.type === 'resort'" :size="32" :stroke-width="1.5" />
            <Plane v-else :size="32" :stroke-width="1.5" />
          </div>
          <div>
            <h2>{{ selectedLocation.name }}</h2>
            <p class="detail-location">{{ selectedLocation.city }}, {{ selectedLocation.country }}</p>
          </div>
        </div>

        <div v-if="selectedLocation.type === 'resort'" class="detail-content">
          <div class="detail-grid">
            <div class="detail-item">
              <MapPin :size="16" :stroke-width="2" />
              <span>{{ selectedLocation.pistes }} km pistes</span>
            </div>
            <div class="detail-item">
              <Mountain :size="16" :stroke-width="2" />
              <span>{{ selectedLocation.altitude }}</span>
            </div>
            <div class="detail-item">
              <TrendingUp :size="16" :stroke-width="2" />
              <span>{{ selectedLocation.level }}</span>
            </div>
            <div class="detail-item">
              <Plane :size="16" :stroke-width="2" />
              <span>{{ selectedLocation.nearestAirport }}</span>
            </div>
          </div>
          <p class="detail-description">{{ selectedLocation.description }}</p>
          <div class="detail-rating">
            <Star :size="16" :stroke-width="2" fill="currentColor" />
            <span>{{ selectedLocation.rating }}/5</span>
          </div>
        </div>

        <div v-else class="detail-content">
          <div class="detail-grid">
            <div class="detail-item full-width">
              <Code :size="16" :stroke-width="2" />
              <span>{{ selectedLocation.code }}</span>
            </div>
          </div>
          <div class="nearby-resorts">
            <h3>Nabije skigebieden</h3>
            <div class="resort-list">
              <div v-for="resort in selectedLocation.nearbyResorts.slice(0, 4)" :key="resort.name" class="resort-item">
                <span class="resort-name">{{ resort.name }}</span>
                <span class="resort-distance">{{ resort.distance }}</span>
              </div>
            </div>
          </div>
          <div class="flights-info">
            <Plane :size="16" :stroke-width="2" />
            <span>{{ selectedLocation.dutchConnections }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Mountain, Plane, MapPin, TrendingUp, Star, X, Code } from 'lucide-vue-next'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const showResorts = ref(true)
const showAirports = ref(true)
const selectedLocation = ref(null)

let map = null
let resortMarkers = []
let airportMarkers = []

const resorts = [
  { type: 'resort', name: 'Les Trois Vallées', lat: 45.4, lng: 6.6, country: 'Frankrijk', city: 'Courchevel', pistes: 600, altitude: '1300m - 3230m', level: 'Alle niveaus', nearestAirport: 'Geneva (2u)', rating: 4.9, description: 'Het grootste skigebied ter wereld met 600km piste.' },
  { type: 'resort', name: 'Ischgl', lat: 47.01, lng: 10.3, country: 'Oostenrijk', city: 'Ischgl', pistes: 238, altitude: '1400m - 2872m', level: 'Gevorderd', nearestAirport: 'Innsbruck (1.5u)', rating: 4.8, description: 'Bekend om après-ski en sneeuwzekerheid.' },
  { type: 'resort', name: 'Verbier', lat: 46.1, lng: 7.2, country: 'Zwitserland', city: 'Verbier', pistes: 410, altitude: '1500m - 3330m', level: 'Alle niveaus', nearestAirport: 'Geneva (2.5u)', rating: 4.7, description: 'Fantastisch off-piste skiën.' },
  { type: 'resort', name: 'Val di Fassa', lat: 46.47, lng: 11.77, country: 'Italië', city: 'Canazei', pistes: 120, altitude: '1320m - 2625m', level: 'Beginner', nearestAirport: 'Verona (2.5u)', rating: 4.5, description: 'Prachtige Dolomieten.' },
  { type: 'resort', name: 'Sölden', lat: 46.97, lng: 11, country: 'Oostenrijk', city: 'Sölden', pistes: 144, altitude: '1350m - 3340m', level: 'Alle niveaus', nearestAirport: 'Innsbruck (1.5u)', rating: 4.6, description: '2 gletsjers voor sneeuwzekerheid.' },
  { type: 'resort', name: 'Alpe d\'Huez', lat: 45.09, lng: 6.07, country: 'Frankrijk', city: 'Alpe d\'Huez', pistes: 249, altitude: '1125m - 3330m', level: 'Alle niveaus', nearestAirport: 'Grenoble (1.5u)', rating: 4.4, description: 'Zeer zonnig gebied.' },
  { type: 'resort', name: 'Zell am See', lat: 47.33, lng: 12.8, country: 'Oostenrijk', city: 'Zell am See', pistes: 408, altitude: '750m - 3029m', level: 'Alle niveaus', nearestAirport: 'Salzburg (1.5u)', rating: 4.7, description: 'Gletsjer combinatie.' },
  { type: 'resort', name: 'Tignes', lat: 45.47, lng: 6.9, country: 'Frankrijk', city: 'Tignes', pistes: 300, altitude: '1550m - 3456m', level: 'Gevorderd', nearestAirport: 'Geneva (2.5u)', rating: 4.8, description: 'Top sneeuwzekerheid.' }
]

const airports = [
  { type: 'airport', code: 'GVA', name: 'Geneva Airport', lat: 46.23, lng: 6.11, city: 'Genève', country: 'Zwitserland', nearbyResorts: [{ name: 'Verbier', distance: '2.5u' }, { name: 'Les Trois Vallées', distance: '2u' }, { name: 'Chamonix', distance: '1.5u' }, { name: 'Tignes', distance: '2.5u' }], dutchConnections: 'Directe vluchten vanuit Amsterdam met easyJet, Transavia en KLM' },
  { type: 'airport', code: 'INN', name: 'Innsbruck Airport', lat: 47.26, lng: 11.35, city: 'Innsbruck', country: 'Oostenrijk', nearbyResorts: [{ name: 'Ischgl', distance: '1.5u' }, { name: 'Sölden', distance: '1.5u' }, { name: 'St. Anton', distance: '1u' }], dutchConnections: 'Directe vluchten vanuit Amsterdam met Transavia' },
  { type: 'airport', code: 'SZG', name: 'Salzburg Airport', lat: 47.79, lng: 13.0, city: 'Salzburg', country: 'Oostenrijk', nearbyResorts: [{ name: 'Zell am See', distance: '1.5u' }, { name: 'Saalbach', distance: '1.5u' }, { name: 'Bad Gastein', distance: '1.5u' }], dutchConnections: 'Directe vluchten vanuit Eindhoven met Transavia' },
  { type: 'airport', code: 'VRN', name: 'Verona Airport', lat: 45.39, lng: 10.89, city: 'Verona', country: 'Italië', nearbyResorts: [{ name: 'Val di Fassa', distance: '2.5u' }, { name: 'Madonna di Campiglio', distance: '2u' }], dutchConnections: 'Directe vluchten vanuit Amsterdam en Eindhoven' },
  { type: 'airport', code: 'LYS', name: 'Lyon Airport', lat: 45.73, lng: 5.09, city: 'Lyon', country: 'Frankrijk', nearbyResorts: [{ name: 'Les Trois Vallées', distance: '2.5u' }, { name: 'Paradiski', distance: '2.5u' }], dutchConnections: 'Directe vluchten vanuit Amsterdam met KLM' },
  { type: 'airport', code: 'MUC', name: 'Munich Airport', lat: 48.35, lng: 11.79, city: 'München', country: 'Duitsland', nearbyResorts: [{ name: 'Zillertal', distance: '2u' }, { name: 'Garmisch', distance: '1.5u' }], dutchConnections: 'Meerdere dagelijkse vluchten vanuit Amsterdam' },
  { type: 'airport', code: 'ZRH', name: 'Zurich Airport', lat: 47.45, lng: 8.56, city: 'Zürich', country: 'Zwitserland', nearbyResorts: [{ name: 'Davos', distance: '2u' }, { name: 'Flims-Laax', distance: '1.5u' }], dutchConnections: 'Vele directe vluchten vanuit Amsterdam' },
  { type: 'airport', code: 'GRZ', name: 'Grenoble Airport', lat: 45.36, lng: 5.33, city: 'Grenoble', country: 'Frankrijk', nearbyResorts: [{ name: 'Alpe d\'Huez', distance: '1.5u' }, { name: 'Les Deux Alpes', distance: '1.5u' }], dutchConnections: 'Geen directe vluchten - via Genève' }
]

function initMap() {
  map = L.map('map').setView([46.5, 9.5], 7)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 19
  }).addTo(map)

  createMarkers()
}

function createMarkers() {
  // Resort markers (blue)
  resorts.forEach(resort => {
    const icon = L.divIcon({
      className: 'custom-marker resort-marker',
      html: `<div class="marker-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    })

    const marker = L.marker([resort.lat, resort.lng], { icon })
      .bindTooltip(resort.name, { permanent: false, direction: 'top' })
      .on('click', () => selectLocation(resort))
      .addTo(map)

    resortMarkers.push(marker)
  })

  // Airport markers (orange)
  airports.forEach(airport => {
    const icon = L.divIcon({
      className: 'custom-marker airport-marker',
      html: `<div class="marker-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    })

    const marker = L.marker([airport.lat, airport.lng], { icon })
      .bindTooltip(`${airport.name} (${airport.code})`, { permanent: false, direction: 'top' })
      .on('click', () => selectLocation(airport))
      .addTo(map)

    airportMarkers.push(marker)
  })
}

function selectLocation(location) {
  selectedLocation.value = location
  map.flyTo([location.lat, location.lng], 10, { duration: 1 })
}

watch(showResorts, (show) => {
  resortMarkers.forEach(marker => {
    if (show) {
      map.addLayer(marker)
    } else {
      map.removeLayer(marker)
    }
  })
})

watch(showAirports, (show) => {
  airportMarkers.forEach(marker => {
    if (show) {
      map.addLayer(marker)
    } else {
      map.removeLayer(marker)
    }
  })
})

onMounted(() => {
  initMap()
})
</script>

<style>
.leaflet-map {
  height: 100%;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.custom-marker {
  background: transparent;
  border: none;
}

.marker-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
}

.marker-icon:hover {
  transform: rotate(-45deg) scale(1.1);
}

.marker-icon svg {
  transform: rotate(45deg);
  width: 20px;
  height: 20px;
}

.resort-marker .marker-icon {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.airport-marker .marker-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}
</style>

<style scoped>
.map-page {
  min-height: calc(100vh - 65px);
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}

.map-header {
  padding: 2rem 0 1.5rem;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-gray-200);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.map-header h1 {
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
  background: white;
  border: 2px solid var(--color-gray-200);
  border-radius: 12px;
  color: var(--color-text);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.filter-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.map-container {
  flex: 1;
  padding: 2rem;
  height: calc(100vh - 200px);
  min-height: 600px;
}

.detail-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 3px solid var(--color-primary);
  padding: 2rem;
  max-height: 60vh;
  overflow-y: auto;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  padding: 0.5rem;
  background: var(--color-gray-100);
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
}

.close-btn:hover {
  background: var(--color-gray-200);
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
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
}

.detail-icon.resort {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
}

.detail-icon.airport {
  background: linear-gradient(135deg, #f59e0b, #d97706);
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
  background: var(--color-snow);
  border-radius: 8px;
  font-size: 0.9375rem;
  color: var(--color-primary);
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
  color: #f59e0b;
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
  display: grid;
  gap: 0.5rem;
}

.resort-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: var(--color-snow);
  border-radius: 8px;
}

.resort-name {
  font-weight: 500;
  color: var(--color-primary);
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
  background: var(--color-snow);
  border-radius: 8px;
  color: var(--color-gray-600);
  line-height: 1.6;
}

.flights-info svg {
  flex-shrink: 0;
  color: var(--color-primary);
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
  .map-header h1 {
    font-size: 2rem;
  }

  .map-container {
    padding: 1rem;
    min-height: 400px;
  }

  .detail-panel {
    padding: 1.5rem;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-color-scheme: dark) {
  .detail-panel {
    background: var(--color-gray-800);
    border-top-color: var(--color-primary);
  }

  .filter-btn {
    background: var(--color-gray-800);
    color: var(--color-gray-100);
  }

  .close-btn {
    background: var(--color-gray-700);
    border-color: var(--color-gray-600);
  }
}
</style>
