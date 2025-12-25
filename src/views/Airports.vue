<template>
  <div class="airports">
    <h1>Vliegvelden voor Wintersport 2026</h1>
    <p class="subtitle">De belangrijkste vliegvelden voor jouw wintersportbestemming</p>

    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="🔍 Zoek vliegveld of land..."
        class="search-input"
      />
      <select v-model="regionFilter" class="filter-select">
        <option value="">Alle regio's</option>
        <option value="Frankrijk">Frankrijk</option>
        <option value="Oostenrijk">Oostenrijk</option>
        <option value="Zwitserland">Zwitserland</option>
        <option value="Italië">Italië</option>
      </select>
    </div>

    <div class="airports-grid">
      <div
        v-for="airport in filteredAirports"
        :key="airport.code"
        class="airport-card"
      >
        <div class="airport-header">
          <div>
            <h2>{{ airport.name }}</h2>
            <p class="airport-code">{{ airport.code }}</p>
          </div>
          <span class="region-badge">{{ airport.region }}</span>
        </div>

        <div class="airport-info">
          <div class="info-section">
            <h3>📍 Locatie</h3>
            <p>{{ airport.city }}, {{ airport.country }}</p>
          </div>

          <div class="info-section">
            <h3>⛷️ Nabije skigebieden</h3>
            <ul class="resort-list">
              <li v-for="(resort, index) in airport.nearbyResorts" :key="index">
                <strong>{{ resort.name }}</strong> - {{ resort.distance }}
              </li>
            </ul>
          </div>

          <div class="info-section">
            <h3>✈️ Vluchten vanuit Nederland</h3>
            <p>{{ airport.dutchConnections }}</p>
          </div>

          <div class="info-section" v-if="airport.transferOptions">
            <h3>🚗 Transfer opties</h3>
            <p>{{ airport.transferOptions }}</p>
          </div>
        </div>

        <div class="airport-tips" v-if="airport.tips">
          <strong>💡 Tip:</strong> {{ airport.tips }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const regionFilter = ref('')

const airports = ref([
  {
    code: 'GVA',
    name: 'Geneva Airport',
    city: 'Genève',
    country: 'Zwitserland',
    region: 'Zwitserland',
    nearbyResorts: [
      { name: 'Verbier', distance: '2.5u rijden' },
      { name: 'Les Trois Vallées', distance: '2u rijden' },
      { name: 'Chamonix', distance: '1.5u rijden' },
      { name: 'Tignes - Val d\'Isère', distance: '2.5u rijden' }
    ],
    dutchConnections: 'Directe vluchten vanuit Amsterdam (Schiphol) met easyJet, Transavia en KLM',
    transferOptions: 'Huurauto, gedeelde transfers, privé taxi. Autoverhuur direct bij aankomsthal.',
    tips: 'Boek transfers vooraf voor beste prijzen. Let op: Frans deel van luchthaven heeft goedkopere huurauto\'s!'
  },
  {
    code: 'INN',
    name: 'Innsbruck Airport',
    city: 'Innsbruck',
    country: 'Oostenrijk',
    region: 'Oostenrijk',
    nearbyResorts: [
      { name: 'Ischgl', distance: '1.5u rijden' },
      { name: 'Sölden', distance: '1.5u rijden' },
      { name: 'St. Anton', distance: '1u rijden' },
      { name: 'Zillertal', distance: '1u rijden' }
    ],
    dutchConnections: 'Directe vluchten vanuit Amsterdam met Transavia en easyJet (seizoensgebonden)',
    transferOptions: 'Uitstekende bus verbindingen naar skigebieden. Autoverhuur en taxi ook beschikbaar.',
    tips: 'Compacte luchthaven, vaak goedkoper dan München. Check ski-bus opties voor directe transfers!'
  },
  {
    code: 'SZG',
    name: 'Salzburg Airport',
    city: 'Salzburg',
    country: 'Oostenrijk',
    region: 'Oostenrijk',
    nearbyResorts: [
      { name: 'Zell am See - Kaprun', distance: '1.5u rijden' },
      { name: 'Saalbach-Hinterglemm', distance: '1.5u rijden' },
      { name: 'Bad Gastein', distance: '1.5u rijden' },
      { name: 'Obertauern', distance: '1.5u rijden' }
    ],
    dutchConnections: 'Directe vluchten vanuit Eindhoven met Transavia tijdens winterseizoen',
    transferOptions: 'Autoverhuur, gedeelde ski-bus, taxi. Goede verbindingen naar Oostenrijkse gebieden.',
    tips: 'Vaak rustiger dan Innsbruck. Ideaal voor Salzburger Land skigebieden.'
  },
  {
    code: 'GRZ',
    name: 'Grenoble Airport',
    city: 'Grenoble',
    country: 'Frankrijk',
    region: 'Frankrijk',
    nearbyResorts: [
      { name: 'Alpe d\'Huez', distance: '1.5u rijden' },
      { name: 'Les Deux Alpes', distance: '1.5u rijden' },
      { name: 'Serre Chevalier', distance: '2u rijden' }
    ],
    dutchConnections: 'Geen directe vluchten - meestal via Genève of Lyon',
    transferOptions: 'Autoverhuur aanbevolen. Gedeelde transfers beschikbaar naar populaire resorts.',
    tips: 'Kleinere luchthaven, dichtbij Franse Alpen resorts. Combineer eventueel met Lyon.'
  },
  {
    code: 'LYS',
    name: 'Lyon Airport',
    city: 'Lyon',
    country: 'Frankrijk',
    region: 'Frankrijk',
    nearbyResorts: [
      { name: 'Les Trois Vallées', distance: '2.5u rijden' },
      { name: 'Paradiski', distance: '2.5u rijden' },
      { name: 'Val d\'Isère', distance: '3u rijden' }
    ],
    dutchConnections: 'Directe vluchten vanuit Amsterdam met KLM en Transavia',
    transferOptions: 'Grote luchthaven met veel verhuurmogelijkheden. Ook ski-bus opties.',
    tips: 'Alternatief voor Genève, soms goedkopere vluchten. Iets verder rijden naar skigebieden.'
  },
  {
    code: 'VRN',
    name: 'Verona Airport',
    city: 'Verona',
    country: 'Italië',
    region: 'Italië',
    nearbyResorts: [
      { name: 'Val di Fassa', distance: '2.5u rijden' },
      { name: 'Madonna di Campiglio', distance: '2u rijden' },
      { name: 'Val Gardena', distance: '2.5u rijden' }
    ],
    dutchConnections: 'Directe vluchten vanuit Amsterdam en Eindhoven met Transavia',
    transferOptions: 'Autoverhuur aanbevolen voor Dolomieten. Privé transfers ook mogelijk.',
    tips: 'Perfecte uitvalsbasis voor de Dolomieten. Bezoek ook de prachtige stad Verona!'
  },
  {
    code: 'MUC',
    name: 'Munich Airport',
    city: 'München',
    country: 'Duitsland',
    region: 'Oostenrijk',
    nearbyResorts: [
      { name: 'Zillertal', distance: '2u rijden' },
      { name: 'Garmisch', distance: '1.5u rijden' },
      { name: 'Sölden', distance: '2.5u rijden' },
      { name: 'Ischgl', distance: '3u rijden' }
    ],
    dutchConnections: 'Meerdere dagelijkse directe vluchten vanuit Amsterdam (Schiphol) met KLM en Lufthansa',
    transferOptions: 'Grote internationale luchthaven. Uitstekende autoverhuur, ook trein opties naar Oostenrijk.',
    tips: 'Grote hub met veel flexibiliteit. Let op langere rijafstand naar sommige gebieden.'
  },
  {
    code: 'ZRH',
    name: 'Zurich Airport',
    city: 'Zürich',
    country: 'Zwitserland',
    region: 'Zwitserland',
    nearbyResorts: [
      { name: 'Davos', distance: '2u rijden' },
      { name: 'Flims-Laax', distance: '1.5u rijden' },
      { name: 'Verbier', distance: '3u rijden' },
      { name: 'St. Moritz', distance: '2.5u rijden' }
    ],
    dutchConnections: 'Vele directe vluchten vanuit Amsterdam (Schiphol) met KLM en Swiss',
    transferOptions: 'Uitstekend openbaar vervoer netwerk. Treinen naar veel skigebieden. Ook autoverhuur.',
    tips: 'Duurder dan Genève maar perfecte treinverbindingen. Swiss Travel Pass kan voordelig zijn!'
  }
])

const filteredAirports = computed(() => {
  let result = airports.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(airport =>
      airport.name.toLowerCase().includes(query) ||
      airport.city.toLowerCase().includes(query) ||
      airport.code.toLowerCase().includes(query) ||
      airport.country.toLowerCase().includes(query) ||
      airport.nearbyResorts.some(r => r.name.toLowerCase().includes(query))
    )
  }

  if (regionFilter.value) {
    result = result.filter(airport => airport.region === regionFilter.value)
  }

  return result
})
</script>

<style scoped>
.airports {
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

.airports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
}

.airport-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.airport-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.airport-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.airport-header h2 {
  font-size: 1.5rem;
  color: #2d3748;
  margin: 0 0 0.25rem 0;
}

.airport-code {
  font-family: monospace;
  font-size: 1.125rem;
  font-weight: 700;
  color: #667eea;
  margin: 0;
}

.region-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  white-space: nowrap;
}

.airport-info {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.info-section h3 {
  font-size: 1rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-section p {
  color: #2d3748;
  line-height: 1.6;
  margin: 0;
}

.resort-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.resort-list li {
  padding: 0.5rem 0;
  color: #2d3748;
  border-bottom: 1px solid #e2e8f0;
}

.resort-list li:last-child {
  border-bottom: none;
}

.resort-list strong {
  color: #667eea;
}

.airport-tips {
  margin-top: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 8px;
  color: #78350f;
  line-height: 1.6;
  font-size: 0.95rem;
}

.airport-tips strong {
  color: #92400e;
}

@media (max-width: 768px) {
  .airports-grid {
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

  .airport-card {
    background: #2d3748;
  }

  .airport-header {
    border-bottom-color: #4a5568;
  }

  .airport-header h2 {
    color: #e2e8f0;
  }

  .info-section h3 {
    color: #cbd5e0;
  }

  .info-section p,
  .resort-list li {
    color: #e2e8f0;
    border-bottom-color: #4a5568;
  }

  .airport-tips {
    background: linear-gradient(135deg, #78350f 0%, #92400e 100%);
    color: #fef3c7;
  }

  .airport-tips strong {
    color: #fde68a;
  }
}
</style>
