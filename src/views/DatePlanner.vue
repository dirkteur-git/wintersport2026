<template>
  <div class="date-planner">
    <div class="container">
      <header class="planner-header">
        <div>
          <h1>Datumplanner</h1>
          <p class="subtitle">Plan je wintersport 2026</p>
        </div>
        <div class="header-actions">
          <button @click="loadAvailability" class="btn-icon" title="Herladen">
            <RefreshCw :size="20" :stroke-width="2" />
          </button>
          <button @click="saveAvailability" class="btn-save">
            <Save :size="20" :stroke-width="2" />
            <span>Opslaan</span>
          </button>
        </div>
      </header>

      <div v-if="saveMessage" class="message">
        <CheckCircle :size="16" :stroke-width="2" />
        {{ saveMessage }}
      </div>

      <div class="participants">
        <div
          v-for="participant in participants"
          :key="participant"
          class="participant-section"
        >
          <div class="participant-header">
            <div class="participant-info">
              <User :size="20" :stroke-width="2" />
              <h2>{{ participant }}</h2>
            </div>
            <div class="participant-stats">
              {{ getParticipantAvailableCount(participant) }} van {{ totalWeeks }} weken beschikbaar
            </div>
          </div>

          <div class="calendar-container">
            <div class="month-labels">
              <div v-for="month in months" :key="month.name" :style="{ gridColumn: `span ${month.weeks}` }">
                {{ month.name }}
              </div>
            </div>

            <div class="calendar-grid">
              <div
                v-for="(week, index) in weeks"
                :key="index"
                class="week-cell"
                :class="getWeekClass(week, participant)"
                :title="getWeekTooltip(week, participant)"
                @click="toggleWeek(week, participant)"
              >
                <div class="week-number">{{ week.weekNumber }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="best-weeks">
        <h2>Beste weken</h2>
        <p class="section-subtitle">Weken waar iedereen kan</p>
        <div class="weeks-list">
          <div
            v-for="summary in weekSummary"
            :key="summary.week.start"
            class="week-summary"
            :class="{ 'week-perfect': summary.available === 4 }"
          >
            <div class="week-info">
              <div class="week-label">Week {{ summary.week.weekNumber }}</div>
              <div class="week-dates">{{ formatWeekRange(summary.week) }}</div>
            </div>
            <div class="week-availability">
              <div class="availability-bar">
                <div
                  class="availability-fill"
                  :style="{ width: `${(summary.available / 4) * 100}%` }"
                ></div>
              </div>
              <div class="availability-text">
                {{ summary.available }}/4
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { User, Save, RefreshCw, CheckCircle } from 'lucide-vue-next'

const participants = ['Guus', 'Rene', 'Harm', 'Dirk']
const availability = ref({})
const saveMessage = ref('')

// Generate weeks for 2026 (Jan - Apr)
const weeks = computed(() => {
  const weeksList = []
  const startDate = new Date('2026-01-05') // First Monday
  const endDate = new Date('2026-04-27') // Last week of April

  let currentDate = new Date(startDate)
  let weekNum = 1

  while (currentDate <= endDate) {
    const weekStart = new Date(currentDate)
    const weekEnd = new Date(currentDate)
    weekEnd.setDate(weekEnd.getDate() + 6)

    weeksList.push({
      weekNumber: weekNum,
      start: weekStart.toISOString().split('T')[0],
      end: weekEnd.toISOString().split('T')[0],
      month: weekStart.getMonth()
    })

    currentDate.setDate(currentDate.getDate() + 7)
    weekNum++
  }

  return weeksList
})

const months = computed(() => {
  const monthNames = ['Jan', 'Feb', 'Mrt', 'Apr']
  const monthWeeks = [0, 0, 0, 0]

  weeks.value.forEach(week => {
    monthWeeks[week.month]++
  })

  return monthNames.map((name, index) => ({
    name,
    weeks: monthWeeks[index]
  })).filter(m => m.weeks > 0)
})

const totalWeeks = computed(() => weeks.value.length)

const weekSummary = computed(() => {
  return weeks.value.map(week => {
    const available = participants.filter(p =>
      !availability.value[week.start]?.[p]
    ).length

    return { week, available }
  }).filter(s => s.available > 0).sort((a, b) => b.available - a.available).slice(0, 10)
})

function getParticipantAvailableCount(participant) {
  return weeks.value.filter(week =>
    !availability.value[week.start]?.[participant]
  ).length
}

function toggleWeek(week, participant) {
  if (!availability.value[week.start]) {
    availability.value[week.start] = {}
  }
  availability.value[week.start][participant] = !availability.value[week.start][participant]
}

function getWeekClass(week, participant) {
  const notAvailable = availability.value[week.start]?.[participant]
  return notAvailable ? 'not-available' : 'available'
}

function getWeekTooltip(week, participant) {
  const notAvailable = availability.value[week.start]?.[participant]
  const status = notAvailable ? 'Niet beschikbaar' : 'Beschikbaar'
  return `Week ${week.weekNumber} (${formatWeekRange(week)}): ${status}`
}

function formatWeekRange(week) {
  const start = new Date(week.start)
  const end = new Date(week.end)
  return `${start.getDate()} ${start.toLocaleDateString('nl-NL', { month: 'short' })} - ${end.getDate()} ${end.toLocaleDateString('nl-NL', { month: 'short' })}`
}

async function saveAvailability() {
  try {
    localStorage.setItem('wintersport2026-availability', JSON.stringify(availability.value))
    saveMessage.value = 'Opgeslagen'
    setTimeout(() => saveMessage.value = '', 3000)
  } catch (error) {
    saveMessage.value = 'Fout bij opslaan'
  }
}

function loadAvailability() {
  try {
    const saved = localStorage.getItem('wintersport2026-availability')
    if (saved) {
      availability.value = JSON.parse(saved)
      saveMessage.value = 'Geladen'
      setTimeout(() => saveMessage.value = '', 3000)
    }
  } catch (error) {
    saveMessage.value = 'Fout bij laden'
  }
}

onMounted(() => {
  loadAvailability()
})
</script>

<style scoped>
.date-planner {
  min-height: 100vh;
  padding: 3rem 0;
  background: var(--color-bg);
}

.container {
  max-width: 1200px;
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

.btn-save {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-text);
  color: var(--color-bg);
  border-color: var(--color-text);
}

.btn-save:hover {
  opacity: 0.9;
}

.message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: var(--color-gray-100);
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  margin-bottom: 2rem;
  font-weight: 500;
}

.participants {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  margin-bottom: 4rem;
}

.participant-section {
  border: 1px solid var(--color-gray-200);
  border-radius: 12px;
  padding: 2rem;
  background: var(--color-bg);
}

.participant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.participant-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.participant-info h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.participant-stats {
  color: var(--color-gray-500);
  font-size: 0.9375rem;
  font-weight: 500;
}

.calendar-container {
  overflow-x: auto;
}

.month-labels {
  display: grid;
  grid-template-columns: repeat(17, 1fr);
  gap: 4px;
  margin-bottom: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(17, 1fr);
  gap: 4px;
}

.week-cell {
  aspect-ratio: 1;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid transparent;
  min-width: 48px;
  min-height: 48px;
}

.week-number {
  opacity: 0;
  transition: opacity 0.2s;
}

.week-cell:hover .week-number {
  opacity: 1;
}

.week-cell.available {
  background: var(--color-gray-100);
  border-color: var(--color-gray-200);
}

.week-cell.available:hover {
  background: var(--color-gray-200);
  border-color: var(--color-gray-400);
  transform: scale(1.05);
}

.week-cell.not-available {
  background: var(--color-text);
  color: var(--color-bg);
  border-color: var(--color-text);
}

.week-cell.not-available:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

.best-weeks {
  margin-top: 4rem;
  padding: 2rem;
  border: 1px solid var(--color-gray-200);
  border-radius: 12px;
  background: var(--color-gray-50);
}

.best-weeks h2 {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: var(--color-gray-500);
  margin-bottom: 1.5rem;
}

.weeks-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.week-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: var(--color-bg);
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  transition: all 0.2s;
}

.week-summary:hover {
  border-color: var(--color-gray-400);
  transform: translateX(4px);
}

.week-summary.week-perfect {
  background: var(--color-text);
  color: var(--color-bg);
  border-color: var(--color-text);
}

.week-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.week-label {
  font-weight: 600;
  font-size: 1.0625rem;
}

.week-dates {
  font-size: 0.875rem;
  opacity: 0.7;
}

.week-availability {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 150px;
}

.availability-bar {
  flex: 1;
  height: 8px;
  background: var(--color-gray-200);
  border-radius: 4px;
  overflow: hidden;
}

.week-summary.week-perfect .availability-bar {
  background: rgba(255, 255, 255, 0.3);
}

.availability-fill {
  height: 100%;
  background: var(--color-text);
  transition: width 0.3s ease;
}

.week-summary.week-perfect .availability-fill {
  background: var(--color-bg);
}

.availability-text {
  font-weight: 600;
  font-size: 0.9375rem;
  min-width: 40px;
  text-align: right;
}

@media (max-width: 768px) {
  .planner-header h1 {
    font-size: 2rem;
  }

  .participant-section {
    padding: 1.5rem;
  }

  .calendar-grid,
  .month-labels {
    grid-template-columns: repeat(17, 40px);
  }

  .week-cell {
    min-width: 40px;
    min-height: 40px;
  }

  .week-summary {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .week-availability {
    width: 100%;
  }
}
</style>
