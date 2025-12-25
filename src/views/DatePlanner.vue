<template>
  <div class="date-planner">
    <h1>Datumplanner Wintersport 2026</h1>
    <p class="subtitle">Geef aan wanneer je niet kunt ❌ (groen = beschikbaar, rood = niet beschikbaar)</p>

    <div class="planner-container">
      <table class="availability-table">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Guus</th>
            <th>Rene</th>
            <th>Harm</th>
            <th>Dirk</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="date in dates" :key="date">
            <td class="date-cell">{{ formatDate(date) }}</td>
            <td
              v-for="participant in participants"
              :key="participant"
              :class="['availability-cell', getCellClass(date, participant)]"
              @click="toggleAvailability(date, participant)"
            >
              {{ getAvailabilityText(date, participant) }}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="actions">
        <button @click="saveAvailability" class="save-btn">💾 Opslaan</button>
        <button @click="loadAvailability" class="load-btn">🔄 Herladen</button>
      </div>

      <div v-if="saveMessage" class="message">{{ saveMessage }}</div>
    </div>

    <div class="summary">
      <h2>Beste data</h2>
      <div class="best-dates">
        <div v-for="summary in dateSummary" :key="summary.date" class="date-summary">
          <strong>{{ formatDate(summary.date) }}</strong>:
          {{ summary.available }} beschikbaar
          <span v-if="summary.available === 4" class="badge">✅ Iedereen!</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const participants = ['Guus', 'Rene', 'Harm', 'Dirk']
const availability = ref({})
const saveMessage = ref('')

const dates = computed(() => {
  const dateList = []
  const start = new Date('2026-01-01')
  const end = new Date('2026-04-30')

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dateList.push(new Date(d).toISOString().split('T')[0])
  }

  return dateList
})

const dateSummary = computed(() => {
  return dates.value.map(date => {
    const available = participants.filter(p =>
      !availability.value[date]?.[p]
    ).length

    return { date, available }
  }).filter(s => s.available > 0).sort((a, b) => b.available - a.available).slice(0, 10)
})

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('nl-NL', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function toggleAvailability(date, participant) {
  if (!availability.value[date]) {
    availability.value[date] = {}
  }
  availability.value[date][participant] = !availability.value[date][participant]
}

function getCellClass(date, participant) {
  const notAvailable = availability.value[date]?.[participant]
  return notAvailable ? 'not-available' : 'available'
}

function getAvailabilityText(date, participant) {
  const notAvailable = availability.value[date]?.[participant]
  return notAvailable ? '❌' : '✅'
}

async function saveAvailability() {
  try {
    localStorage.setItem('wintersport2026-availability', JSON.stringify(availability.value))
    saveMessage.value = '✅ Beschikbaarheid opgeslagen!'
    setTimeout(() => saveMessage.value = '', 3000)
  } catch (error) {
    saveMessage.value = '❌ Fout bij opslaan: ' + error.message
  }
}

function loadAvailability() {
  try {
    const saved = localStorage.getItem('wintersport2026-availability')
    if (saved) {
      availability.value = JSON.parse(saved)
      saveMessage.value = '✅ Beschikbaarheid geladen!'
      setTimeout(() => saveMessage.value = '', 3000)
    }
  } catch (error) {
    saveMessage.value = '❌ Fout bij laden: ' + error.message
  }
}

onMounted(() => {
  loadAvailability()
})
</script>

<style scoped>
.date-planner {
  padding: 2rem;
  max-width: 1200px;
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

.planner-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.availability-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

.availability-table th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 10;
}

.availability-table td {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  text-align: center;
}

.date-cell {
  font-weight: 500;
  background: #f7fafc;
  white-space: nowrap;
}

.availability-cell {
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1.5rem;
}

.availability-cell:hover {
  transform: scale(1.1);
}

.available {
  background-color: #c6f6d5;
}

.not-available {
  background-color: #fed7d7;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.save-btn,
.load-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.save-btn {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
}

.load-btn {
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  color: white;
}

.load-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

.message {
  text-align: center;
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: #e6fffa;
  color: #234e52;
  font-weight: 500;
}

.summary {
  margin-top: 3rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.summary h2 {
  margin-bottom: 1rem;
  color: #2d3748;
}

.best-dates {
  display: grid;
  gap: 0.75rem;
}

.date-summary {
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.badge {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border-radius: 12px;
  font-size: 0.875rem;
}

@media (prefers-color-scheme: dark) {
  .planner-container,
  .summary {
    background: #2d3748;
  }

  .date-cell {
    background: #1a202c;
    color: #e2e8f0;
  }

  .availability-table td {
    border-color: #4a5568;
  }

  .summary h2 {
    color: #e2e8f0;
  }

  .date-summary {
    background: #1a202c;
    color: #e2e8f0;
  }
}
</style>
