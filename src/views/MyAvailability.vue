<template>
  <div class="my-availability">
    <div class="container">
      <header class="page-header">
        <div>
          <h1>Hallo {{ userName }}!</h1>
          <p class="subtitle">Klik op vakjes om aan te geven wanneer je NIET kunt (rood = niet beschikbaar)</p>
        </div>
        <div class="header-actions">
          <button @click="logout" class="btn-secondary">
            <LogOut :size="20" :stroke-width="2" />
            <span>Uitloggen</span>
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

      <div class="legend-section">
        <div class="legend-item">
          <div class="legend-box available"></div>
          <span>Beschikbaar (groen)</span>
        </div>
        <div class="legend-item">
          <div class="legend-box not-available"></div>
          <span>Niet beschikbaar (rood)</span>
        </div>
      </div>

      <div class="github-calendar-section">
        <h2>Januari - April 2026</h2>

        <div class="calendar-wrapper">
          <div class="month-labels">
            <div v-for="month in months" :key="month.name" class="month-label" :style="{ width: `${month.weeks * 15}px` }">
              {{ month.name }}
            </div>
          </div>

          <div class="calendar-grid">
            <div class="weekday-labels">
              <div class="weekday-label">Ma</div>
              <div class="weekday-label">Di</div>
              <div class="weekday-label">Wo</div>
              <div class="weekday-label">Do</div>
              <div class="weekday-label">Vr</div>
              <div class="weekday-label">Za</div>
              <div class="weekday-label">Zo</div>
            </div>

            <div class="weeks-container">
              <div
                v-for="week in allWeeks"
                :key="week.start"
                class="week-column"
              >
                <div
                  v-for="day in week.days"
                  :key="day.date"
                  :class="['day-cell', {
                    'available': !isNotAvailable(day.date) && day.inPeriod,
                    'not-available': isNotAvailable(day.date) && day.inPeriod,
                    'out-of-period': !day.inPeriod,
                    'spring-break': isSpringBreak(day.date) && day.inPeriod
                  }]"
                  :title="getDayTooltip(day)"
                  @click="day.inPeriod && toggleDay(day.date)"
                >
                  <span v-if="day.inPeriod" class="day-number">{{ day.day }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="week-numbers">
            <div v-for="week in allWeeks" :key="week.start" class="week-number">
              W{{ week.weekNumber }}
            </div>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stat-card">
          <CheckCircle :size="24" :stroke-width="1.5" class="stat-icon-green" />
          <div class="stat-content">
            <div class="stat-number green">{{ availableDays }}</div>
            <div class="stat-label">Dagen beschikbaar</div>
          </div>
        </div>
        <div class="stat-card">
          <XCircle :size="24" :stroke-width="1.5" class="stat-icon-red" />
          <div class="stat-content">
            <div class="stat-number red">{{ notAvailableDays }}</div>
            <div class="stat-label">Dagen niet beschikbaar</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Save, LogOut, CheckCircle, XCircle } from 'lucide-vue-next'

const router = useRouter()
const userId = ref(null)
const userName = ref('')
const unavailableDates = ref(new Set())
const saveMessage = ref('')

const participantNames = {
  'guus': 'Guus',
  'rene': 'Rene',
  'harm': 'Harm',
  'dirk': 'Dirk'
}

// Generate all weeks from Jan to Apr 2026
const allWeeks = computed(() => {
  const weeks = []
  const startDate = new Date('2026-01-05') // Monday of first week
  const endDate = new Date('2026-04-26') // Last Sunday in April

  let currentMonday = new Date(startDate)
  let weekNumber = 1

  while (currentMonday <= endDate) {
    const week = {
      start: currentMonday.toISOString().split('T')[0],
      weekNumber: weekNumber,
      days: []
    }

    // Add 7 days for this week
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentMonday)
      day.setDate(day.getDate() + i)
      const dateStr = day.toISOString().split('T')[0]
      const inPeriod = day >= new Date('2026-01-01') && day <= new Date('2026-04-30')

      week.days.push({
        date: dateStr,
        day: day.getDate(),
        month: day.getMonth(),
        inPeriod: inPeriod
      })
    }

    weeks.push(week)
    currentMonday.setDate(currentMonday.getDate() + 7)
    weekNumber++
  }

  return weeks
})

const months = computed(() => {
  const monthData = []
  const monthNames = ['Jan', 'Feb', 'Mrt', 'Apr']

  // Calculate weeks per month based on which month has the most days in each week
  const monthWeeks = [0, 0, 0, 0] // Jan, Feb, Mrt, Apr

  allWeeks.value.forEach(week => {
    // Count days per month in this week
    const daysPerMonth = [0, 0, 0, 0]
    week.days.forEach(day => {
      if (day.inPeriod) {
        daysPerMonth[day.month]++
      }
    })

    // Assign week to the month with most days
    const maxMonth = daysPerMonth.indexOf(Math.max(...daysPerMonth))
    if (maxMonth >= 0 && maxMonth < 4) {
      monthWeeks[maxMonth]++
    }
  })

  monthNames.forEach((name, index) => {
    if (monthWeeks[index] > 0) {
      monthData.push({
        name: name,
        weeks: monthWeeks[index]
      })
    }
  })

  return monthData
})

const allDaysInPeriod = computed(() => {
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

const availableDays = computed(() => {
  return allDaysInPeriod.value.filter(d => !unavailableDates.value.has(d)).length
})

const notAvailableDays = computed(() => {
  return allDaysInPeriod.value.filter(d => unavailableDates.value.has(d)).length
})

function isNotAvailable(date) {
  return unavailableDates.value.has(date)
}

function toggleDay(date) {
  if (unavailableDates.value.has(date)) {
    unavailableDates.value.delete(date)
  } else {
    unavailableDates.value.add(date)
  }
  unavailableDates.value = new Set(unavailableDates.value)
}

function getDayTooltip(day) {
  if (!day.inPeriod) return 'Buiten periode'
  const date = new Date(day.date)
  const dateStr = date.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })
  const status = isNotAvailable(day.date) ? 'Niet beschikbaar' : 'Beschikbaar'
  const springBreak = isSpringBreak(day.date) ? ' (Voorjaarsvakantie)' : ''
  return `${dateStr}: ${status}${springBreak}`
}

function isSpringBreak(date) {
  // Voorjaarsvakantie 2026: 21 feb - 1 maart (week 8-9)
  const d = new Date(date)
  return d >= new Date('2026-02-21') && d <= new Date('2026-03-01')
}

function saveAvailability() {
  try {
    const allData = JSON.parse(localStorage.getItem('wintersport2026-availability') || '{}')
    const userAvailability = {}
    unavailableDates.value.forEach(date => {
      userAvailability[date] = true
    })
    allData[userId.value] = userAvailability
    localStorage.setItem('wintersport2026-availability', JSON.stringify(allData))
    saveMessage.value = 'Opgeslagen!'
    setTimeout(() => saveMessage.value = '', 3000)
  } catch (error) {
    saveMessage.value = 'Fout bij opslaan'
  }
}

function loadAvailability() {
  try {
    const allData = JSON.parse(localStorage.getItem('wintersport2026-availability') || '{}')
    const userAvailability = allData[userId.value] || {}
    const dates = new Set()
    Object.keys(userAvailability).forEach(date => {
      if (userAvailability[date]) {
        dates.add(date)
      }
    })
    unavailableDates.value = dates
  } catch (error) {
    console.error('Error loading availability:', error)
  }
}

function logout() {
  localStorage.removeItem('wintersport2026-current-user')
  router.push('/login')
}

onMounted(() => {
  userId.value = localStorage.getItem('wintersport2026-current-user')
  if (!userId.value) {
    router.push('/login')
    return
  }
  userName.value = participantNames[userId.value] || userId.value
  loadAvailability()
})
</script>

<style scoped>
.my-availability {
  min-height: calc(100vh - 65px);
  padding: 3rem 0;
  background: var(--color-bg);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  color: var(--color-gray-500);
  font-size: 1.0625rem;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-save {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.btn-save:hover {
  background: var(--color-primary-dark);
}

.message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: #d1fae5;
  border: 1px solid #34d399;
  border-radius: 12px;
  margin-bottom: 2rem;
  font-weight: 500;
  color: #065f46;
}

.legend-section {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-gray-600);
  font-weight: 500;
}

.legend-box {
  width: 24px;
  height: 24px;
  border-radius: 3px;
  border: 1px solid var(--color-gray-300);
}

.legend-box.available {
  background: #22c55e;
  border-color: #16a34a;
}

.legend-box.not-available {
  background: #ef4444;
  border-color: #dc2626;
}

.github-calendar-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.github-calendar-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.calendar-wrapper {
  overflow-x: auto;
}

.month-labels {
  display: flex;
  gap: 3px;
  margin-bottom: 8px;
  padding-left: 40px;
}

.month-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
}

.calendar-grid {
  display: flex;
  gap: 3px;
}

.weekday-labels {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-right: 8px;
  justify-content: space-around;
}

.weekday-label {
  height: 11px;
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--color-gray-500);
  display: flex;
  align-items: center;
  width: 30px;
}

.weeks-container {
  display: flex;
  gap: 3px;
}

.week-column {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.day-cell {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.day-number {
  font-size: 0.6875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  pointer-events: none;
}

.day-cell.available {
  background: #22c55e;
  border: 1px solid #16a34a;
}

.day-cell.not-available {
  background: #ef4444;
  border: 1px solid #dc2626;
}

.day-cell.out-of-period {
  background: var(--color-gray-100);
  border: 1px solid var(--color-gray-200);
  cursor: not-allowed;
  opacity: 0.4;
}

.day-cell.spring-break {
  border: 2px solid #fbbf24;
  box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.3);
}

.day-cell:not(.out-of-period):hover {
  transform: scale(1.2);
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.week-numbers {
  display: flex;
  gap: 3px;
  margin-top: 4px;
  padding-left: 40px;
}

.week-number {
  width: 28px;
  font-size: 0.625rem;
  color: var(--color-gray-400);
  text-align: center;
  font-weight: 500;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stat-icon-green {
  color: #22c55e;
  flex-shrink: 0;
}

.stat-icon-red {
  color: #ef4444;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-number.green {
  color: #22c55e;
}

.stat-number.red {
  color: #ef4444;
}

.stat-label {
  color: var(--color-gray-500);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions button {
    flex: 1;
  }

  .legend-section {
    flex-direction: column;
    gap: 0.75rem;
  }
}

@media (prefers-color-scheme: dark) {
  .github-calendar-section,
  .stat-card,
  .legend-section {
    background: var(--color-gray-800);
  }

  .message {
    background: #065f46;
    border-color: #059669;
    color: #d1fae5;
  }

  .day-cell.out-of-period {
    background: var(--color-gray-700);
    border-color: var(--color-gray-600);
  }
}
</style>
