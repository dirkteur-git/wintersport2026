<template>
  <div class="ski-resorts">
    <h1>Skigebieden voor Wintersport 2026</h1>
    <p class="subtitle">Ontdek de beste wintersportbestemmingen in de Alpen</p>

    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="🔍 Zoek skigebied..."
        class="search-input"
      />
      <select v-model="countryFilter" class="filter-select">
        <option value="">Alle landen</option>
        <option value="Frankrijk">Frankrijk</option>
        <option value="Oostenrijk">Oostenrijk</option>
        <option value="Zwitserland">Zwitserland</option>
        <option value="Italië">Italië</option>
      </select>
    </div>

    <div class="resorts-grid">
      <div
        v-for="resort in filteredResorts"
        :key="resort.name"
        class="resort-card"
      >
        <div class="resort-header">
          <h2>{{ resort.name }}</h2>
          <span class="country-badge">{{ resort.country }}</span>
        </div>
        <div class="resort-info">
          <div class="info-item">
            <span class="label">📏 Pistes:</span>
            <span class="value">{{ resort.pistes }} km</span>
          </div>
          <div class="info-item">
            <span class="label">⛰️ Hoogte:</span>
            <span class="value">{{ resort.altitude }}</span>
          </div>
          <div class="info-item">
            <span class="label">🎿 Niveau:</span>
            <span class="value">{{ resort.level }}</span>
          </div>
          <div class="info-item">
            <span class="label">✈️ Vliegveld:</span>
            <span class="value">{{ resort.nearestAirport }}</span>
          </div>
        </div>
        <div class="resort-description">
          {{ resort.description }}
        </div>
        <div class="resort-rating">
          ⭐ {{ resort.rating }}/5
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const countryFilter = ref('')

const resorts = ref([
  {
    name: 'Les Trois Vallées',
    country: 'Frankrijk',
    pistes: 600,
    altitude: '1300m - 3230m',
    level: 'Alle niveaus',
    nearestAirport: 'Geneva (2u)',
    rating: 4.9,
    description: 'Het grootste skigebied ter wereld met 600km piste. Perfect voor grote groepen met verschillende niveaus.'
  },
  {
    name: 'Ischgl',
    country: 'Oostenrijk',
    pistes: 238,
    altitude: '1400m - 2872m',
    level: 'Gevorderd - Expert',
    nearestAirport: 'Innsbruck (1.5u)',
    rating: 4.8,
    description: 'Bekend om het levendige après-ski en uitstekende sneeuwzekerheid. Top duty-free shopping!'
  },
  {
    name: 'Verbier',
    country: 'Zwitserland',
    pistes: 410,
    altitude: '1500m - 3330m',
    level: 'Alle niveaus',
    nearestAirport: 'Geneva (2.5u)',
    rating: 4.7,
    description: 'Onderdeel van de 4 Vallées. Fantastisch off-piste skiën en prachtige berglandschappen.'
  },
  {
    name: 'Val di Fassa',
    country: 'Italië',
    pistes: 120,
    altitude: '1320m - 2625m',
    level: 'Beginner - Gemiddeld',
    nearestAirport: 'Verona (2.5u)',
    rating: 4.5,
    description: 'In de prachtige Dolomieten. Geweldig Italiaans eten en vriendelijke sfeer.'
  },
  {
    name: 'Sölden',
    country: 'Oostenrijk',
    pistes: 144,
    altitude: '1350m - 3340m',
    level: 'Alle niveaus',
    nearestAirport: 'Innsbruck (1.5u)',
    rating: 4.6,
    description: '2 gletsjers voor gegarandeerde sneeuw. Bekend van James Bond film Spectre.'
  },
  {
    name: 'Alpe d\'Huez',
    country: 'Frankrijk',
    pistes: 249,
    altitude: '1125m - 3330m',
    level: 'Alle niveaus',
    nearestAirport: 'Grenoble (1.5u)',
    rating: 4.4,
    description: 'Zeer zonnig gebied met iconische Sarenne afdaling (16km langste zwarte piste).'
  },
  {
    name: 'Zell am See - Kaprun',
    country: 'Oostenrijk',
    pistes: 408,
    altitude: '750m - 3029m',
    level: 'Alle niveaus',
    nearestAirport: 'Salzburg (1.5u)',
    rating: 4.7,
    description: 'Combinatie van gletsjer en traditioneel skigebied. Prachtig uitzicht op het meer.'
  },
  {
    name: 'Tignes - Val d\'Isère',
    country: 'Frankrijk',
    pistes: 300,
    altitude: '1550m - 3456m',
    level: 'Gevorderd - Expert',
    nearestAirport: 'Geneva (2.5u)',
    rating: 4.8,
    description: 'L\'Espace Killy - top sneeuwzekerheid door gletsjer. Geweldige off-piste mogelijkheden.'
  }
])

const filteredResorts = computed(() => {
  let result = resorts.value

  if (searchQuery.value) {
    result = result.filter(resort =>
      resort.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      resort.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (countryFilter.value) {
    result = result.filter(resort => resort.country === countryFilter.value)
  }

  return result
})
</script>

<style scoped>
.ski-resorts {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-input,
.filter-select {
  flex: 1;
  min-width: 200px;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.resorts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.resort-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.resort-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.resort-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.resort-header h2 {
  font-size: 1.5rem;
  color: #2d3748;
  margin: 0;
}

.country-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  white-space: nowrap;
}

.resort-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item .label {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
}

.info-item .value {
  font-weight: 600;
  color: #2d3748;
}

.resort-description {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.resort-rating {
  font-size: 1.125rem;
  font-weight: 600;
  color: #f59e0b;
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

@media (max-width: 768px) {
  .resorts-grid {
    grid-template-columns: 1fr;
  }

  .resort-info {
    grid-template-columns: 1fr;
  }
}

@media (prefers-color-scheme: dark) {
  .search-input,
  .filter-select {
    background: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
  }

  .resort-card {
    background: #2d3748;
  }

  .resort-header h2 {
    color: #e2e8f0;
  }

  .resort-info {
    background: #1a202c;
  }

  .info-item .value {
    color: #e2e8f0;
  }

  .resort-description {
    color: #cbd5e0;
  }

  .resort-rating {
    border-top-color: #4a5568;
  }
}
</style>
