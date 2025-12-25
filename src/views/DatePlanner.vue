<template>
  <div class="date-planner">
    <div class="container">
      <header class="planner-header">
        <div>
          <h1>Beschikbaarheid Overzicht</h1>
          <p class="subtitle">Gezamenlijke beschikbaarheid van alle deelnemers</p>
        </div>
        <div class="header-actions">
          <button @click="loadAvailability" class="btn-icon" title="Herladen">
            <RefreshCw :size="20" :stroke-width="2" />
          </button>
        </div>
      </header>

      <div class="legend-section">
        <h3>Legenda</h3>
        <div class="legend-grid">
          <div class="legend-item">
            <div class="legend-box level-4"></div>
            <span>Iedereen beschikbaar (4/4)</span>
          </div>
          <div class="legend-item">
            <div class="legend-box level-3"></div>
            <span>3 personen beschikbaar</span>
          </div>
          <div class="legend-item">
            <div class="legend-box level-2"></div>
            <span>2 personen beschikbaar</span>
          </div>
          <div class="legend-item">
            <div class="legend-box level-1"></div>
            <span>1 persoon beschikbaar</span>
          </div>
          <div class="legend-item">
            <div class="legend-box level-0"></div>
            <span>Niemand beschikbaar</span>
          </div>
        </div>
      </div>

      <div class="participants-summary">
        <div
          v-for="participant in participants"
          :key="participant.id"
          class="participant-row"
        >
          <div class="participant-name">
            <User :size="18" :stroke-width="2" />
            {{ participant.name }}
          </div>
          <div class="participant-github-calendar">
            <div class="months-row">
              <div v-for="month in months" :key="month.name" class="month-label" :style="{ width: `${month.days * 14}px` }">
                {{ month.name }}
              </div>
            </div>
            <div class="days-row">
              <div
                v-for="day in allDays"
                :key="day"
                :class="['day-box', getDayClass(day, participant.id)]"
                :title="getDayTooltip(day, participant.id)"
              >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="combined-calendar">
        <h2>Gecombineerde Beschikbaarheid</h2>
        <p class="section-subtitle">Hoe meer mensen beschikbaar, hoe groener de dag</p>

        <div class="calendar-scroll">
          <div class="github-calendar">
            <div class="months-header">
              <div v-for="month in months" :key="month.name" class="month-header" :style="{ width: `${month.days * 14}px` }">
                {{ month.name }}
              </div>
            </div>
            <div class="days-container">
              <div
                v-for="day in allDays"
                :key="day"
                :class="['day-cell', getAvailabilityClass(day)]"
                :title="getAvailabilityTooltip(day)"
              >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="best-days">
        <h2>Beste Dagen</h2>
        <p class="section-subtitle">Dagen waar de meeste mensen kunnen</p>
        <div class="days-list">
          <div
            v-for="summary in topDays"
            :key="summary.date"
            :class="['day-summary', `level-${summary.available}`]"
          >
            <div class="day-info">
              <div class="day-date">{{ formatDate(summary.date) }}</div>
              <div class="day-weekday">{{ formatWeekday(summary.date) }}</div>
            </div>
            <div class="day-availability">
              <div class="availability-badges">
                <div
                  v-for="participant in participants"
                  :key="participant.id"
                  :class="['participant-badge', { available: isParticipantAvailable(summary.date, participant.id) }]"
                >
                  {{ participant.name.charAt(0) }}
                </div>
              </div>
              <div class="availability-count">{{ summary.available }}/4</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { User, RefreshCw } from 'lucide-vue-next'

const participants = [
  { id: 'guus', name: 'Guus' },
  { id: 'rene', name: 'Rene' },
  { id: 'harm', name: 'Harm' },
  { id: 'dirk', name: 'Dirk' }
]

const availability = ref({})

const allDays = computed(() => {
  const days = []
  const start = new Date('2026-01-01')
  const end = new Date('2026-04-30')
  const current = new Date(start)

  while (current <= end) {
    days.push(current.toISOString().split('T')[0])
    current.setDate(current.getDate() + 1)
  }

  return days
})

const months = computed(() => {
  const monthsData = []
  const monthNames = ['Jan', 'Feb', 'Mrt', 'Apr']

  for (let m = 0; m < 4; m++) {
    const year = 2026
    const firstDay = new Date(year, m, 1)
    const lastDay = new Date(year, m + 1, 0)
    const days = lastDay.getDate()

    monthsData.push({
      name: monthNames[m],
      days: days
    })
  }

  return monthsData
})

const topDays = computed(() => {
  return allDays.value.map(date => {
    const available = participants.filter(p =>
      !availability.value[p.id]?.[date]
    ).length

    return { date, available }
  }).filter(s => s.available > 0)
    .sort((a, b) => b.available - a.available)
    .slice(0, 20)
})

function getAvailabilityClass(date) {
  const available = participants.filter(p =>
    !availability.value[p.id]?.[date]
  ).length

  return `level-${available}`
}

function getAvailabilityTooltip(date) {
  const available = participants.filter(p =>
    !availability.value[p.id]?.[date]
  ).length

  const names = participants
    .filter(p => !availability.value[p.id]?.[date])
    .map(p => p.name)
    .join(', ')

  return `${formatDate(date)}: ${available}/4 beschikbaar${names ? ` (${names})` : ''}`
}

function getDayClass(date, participantId) {
  return availability.value[participantId]?.[date] ? 'not-available' : 'available'
}

function getDayTooltip(date, participantId) {
  const status = availability.value[participantId]?.[date] ? 'Niet beschikbaar' : 'Beschikbaar'
  return `${formatDate(date)}: ${status}`
}

function isParticipantAvailable(date, participantId) {
  return !availability.value[participantId]?.[date]
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function formatWeekday(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('nl-NL', { weekday: 'long' })
}

function loadAvailability() {
  try {
    const allData = JSON.parse(localStorage.getItem('wintersport2026-availability') || '{}')
    availability.value = allData
  } catch (error) {
    console.error('Error loading availability:', error)
  }
}

onMounted(() => {
  loadAvailability()
})
</script>

<style scoped>
.date-planner {
  min-height: calc(100vh - 65px);
  padding: 3rem 0;
  background: var(--color-bg);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.planner-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.planner-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--color-gray-500);
  font-size: 1.0625rem;
}

.section-subtitle {
  color: var(--color-gray-500);
  margin-bottom: 1.5rem;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-icon {
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.legend-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
}

.legend-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.legend-grid {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-gray-600);
}

.legend-box {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid var(--color-gray-300);
}

.participants-summary {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
}

.participant-row {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-gray-200);
}

.participant-row:last-child {
  border-bottom: none;
}

.participant-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  min-width: 100px;
  color: var(--color-primary);
}

.participant-github-calendar {
  flex: 1;
  overflow-x: auto;
}

.months-row, .months-header {
  display: flex;
  gap: 2px;
  margin-bottom: 4px;
}

.month-label, .month-header {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.days-row, .days-container {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
}

.day-box, .day-cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  border: 1px solid var(--color-gray-200);
}

.day-box.available {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.day-box.not-available {
  background: var(--color-gray-200);
  border-color: var(--color-gray-300);
}

.combined-calendar {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
}

.combined-calendar h2 {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.calendar-scroll {
  overflow-x: auto;
  margin: 0 -2rem;
  padding: 0 2rem;
}

.github-calendar {
  min-width: min-content;
}

.level-0 { background: var(--color-gray-100); border-color: var(--color-gray-200); }
.level-1 { background: #bfdbfe; border-color: #93c5fd; }
.level-2 { background: #60a5fa; border-color: #3b82f6; }
.level-3 { background: #3b82f6; border-color: #2563eb; }
.level-4 { background: #1d4ed8; border-color: #1e40af; }

.best-days {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
}

.best-days h2 {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.days-list {
  display: grid;
  gap: 1rem;
}

.day-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  border: 2px solid var(--color-gray-200);
  transition: all 0.2s;
}

.day-summary:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.day-summary.level-4 {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border-color: var(--color-primary);
}

.day-info {
  flex: 1;
}

.day-date {
  font-weight: 600;
  font-size: 1.0625rem;
  margin-bottom: 0.25rem;
}

.day-weekday {
  color: var(--color-gray-500);
  font-size: 0.875rem;
}

.day-availability {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.availability-badges {
  display: flex;
  gap: 0.5rem;
}

.participant-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  background: var(--color-gray-200);
  color: var(--color-gray-500);
  transition: all 0.2s;
}

.participant-badge.available {
  background: var(--color-primary);
  color: white;
}

.availability-count {
  font-weight: 600;
  font-size: 1.125rem;
  color: var(--color-primary);
  min-width: 50px;
  text-align: right;
}

@media (max-width: 768px) {
  .planner-header h1 {
    font-size: 2rem;
  }

  .legend-grid {
    flex-direction: column;
    gap: 0.75rem;
  }

  .participant-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .day-summary {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .day-availability {
    width: 100%;
    justify-content: space-between;
  }
}

@media (prefers-color-scheme: dark) {
  .legend-section,
  .participants-summary,
  .combined-calendar,
  .best-days {
    background: var(--color-gray-800);
  }

  .participant-row {
    border-bottom-color: var(--color-gray-700);
  }

  .day-summary {
    border-color: var(--color-gray-700);
  }

  .day-summary.level-4 {
    background: linear-gradient(135deg, #1e293b, #334155);
  }
}
</style>
