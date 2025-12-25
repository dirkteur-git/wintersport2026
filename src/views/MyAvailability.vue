<template>
  <div class="my-availability">
    <div class="container">
      <header class="page-header">
        <div>
          <h1>Hallo {{ userName }}!</h1>
          <p class="subtitle">Klik op dagen om aan te geven wanneer je NIET kunt</p>
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

      <div class="calendar-section">
        <div class="calendar-header">
          <h2>Januari - April 2026</h2>
          <div class="legend">
            <div class="legend-item">
              <div class="legend-box available"></div>
              <span>Beschikbaar</span>
            </div>
            <div class="legend-item">
              <div class="legend-box not-available"></div>
              <span>Niet beschikbaar</span>
            </div>
          </div>
        </div>

        <div class="calendar-scroll">
          <div class="calendar-horizontal">
            <div class="month-section" v-for="month in months" :key="month.name">
              <div class="month-header">{{ month.name }} {{ month.year }}</div>
              <div class="days-grid">
                <div class="weekday-labels">
                  <div class="weekday-label">Ma</div>
                  <div class="weekday-label">Di</div>
                  <div class="weekday-label">Wo</div>
                  <div class="weekday-label">Do</div>
                  <div class="weekday-label">Vr</div>
                  <div class="weekday-label">Za</div>
                  <div class="weekday-label">Zo</div>
                </div>
                <div class="days-container">
                  <div
                    v-for="day in month.days"
                    :key="day.date"
                    :class="['day-cell', {
                      'not-available': isNotAvailable(day.date),
                      'other-month': !day.currentMonth,
                      'today': isToday(day.date)
                    }]"
                    @click="day.currentMonth && toggleDay(day.date)"
                  >
                    <span class="day-number">{{ day.day }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stat-card">
          <Calendar :size="24" :stroke-width="1.5" />
          <div class="stat-content">
            <div class="stat-number">{{ availableDays }}</div>
            <div class="stat-label">Dagen beschikbaar</div>
          </div>
        </div>
        <div class="stat-card">
          <XCircle :size="24" :stroke-width="1.5" />
          <div class="stat-content">
            <div class="stat-number">{{ notAvailableDays }}</div>
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
import { Save, LogOut, CheckCircle, Calendar, XCircle } from 'lucide-vue-next'

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

const months = computed(() => {
  const monthsData = []
  const monthNames = ['Januari', 'Februari', 'Maart', 'April']

  for (let m = 0; m < 4; m++) {
    const year = 2026
    const month = m
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // Start from Monday of the week containing the 1st
    const startDate = new Date(firstDay)
    const dayOfWeek = startDate.getDay()
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    startDate.setDate(startDate.getDate() - daysToSubtract)

    // End on Sunday of the week containing the last day
    const endDate = new Date(lastDay)
    const endDayOfWeek = endDate.getDay()
    const daysToAdd = endDayOfWeek === 0 ? 0 : 7 - endDayOfWeek
    endDate.setDate(endDate.getDate() + daysToAdd)

    const days = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      days.push({
        date: currentDate.toISOString().split('T')[0],
        day: currentDate.getDate(),
        currentMonth: currentDate.getMonth() === month
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    monthsData.push({
      name: monthNames[m],
      year: year,
      days: days
    })
  }

  return monthsData
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
  return allDaysInPeriod.value.length - unavailableDates.value.size
})

const notAvailableDays = computed(() => {
  return unavailableDates.value.size
})

function isNotAvailable(date) {
  return unavailableDates.value.has(date)
}

function isToday(date) {
  const today = new Date().toISOString().split('T')[0]
  return date === today
}

function toggleDay(date) {
  if (unavailableDates.value.has(date)) {
    unavailableDates.value.delete(date)
  } else {
    unavailableDates.value.add(date)
  }
  // Force reactivity
  unavailableDates.value = new Set(unavailableDates.value)
}

function saveAvailability() {
  try {
    const allData = JSON.parse(localStorage.getItem('wintersport2026-availability') || '{}')

    // Convert unavailable dates to the format expected
    const userAvailability = {}
    unavailableDates.value.forEach(date => {
      userAvailability[date] = true
    })

    // Save for this user
    allData[userId.value] = userAvailability

    localStorage.setItem('wintersport2026-availability', JSON.stringify(allData))
    saveMessage.value = 'Beschikbaarheid opgeslagen!'
    setTimeout(() => saveMessage.value = '', 3000)
  } catch (error) {
    saveMessage.value = 'Fout bij opslaan'
  }
}

function loadAvailability() {
  try {
    const allData = JSON.parse(localStorage.getItem('wintersport2026-availability') || '{}')
    const userAvailability = allData[userId.value] || {}

    // Convert to Set of dates
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
  background: var(--color-snow);
  border: 1px solid var(--color-frost);
  border-radius: 12px;
  margin-bottom: 2rem;
  font-weight: 500;
  color: var(--color-primary);
}

.calendar-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
  margin-bottom: 2rem;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.calendar-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
}

.legend {
  display: flex;
  gap: 1.5rem;
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

.legend-box.available {
  background: var(--color-snow);
}

.legend-box.not-available {
  background: var(--color-primary);
}

.calendar-scroll {
  overflow-x: auto;
  margin: 0 -2rem;
  padding: 0 2rem;
}

.calendar-horizontal {
  display: flex;
  gap: 2rem;
  min-width: min-content;
}

.month-section {
  flex-shrink: 0;
}

.month-header {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-primary);
}

.days-grid {
  display: flex;
  flex-direction: column;
}

.weekday-labels {
  display: grid;
  grid-template-columns: repeat(7, 40px);
  gap: 4px;
  margin-bottom: 4px;
}

.weekday-label {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-gray-500);
}

.days-container {
  display: grid;
  grid-template-columns: repeat(7, 40px);
  gap: 4px;
}

.day-cell {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--color-snow);
  border: 2px solid var(--color-gray-200);
  position: relative;
}

.day-cell:hover {
  transform: scale(1.1);
  z-index: 10;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.day-cell.not-available {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.day-cell.other-month {
  opacity: 0.3;
  cursor: default;
}

.day-cell.other-month:hover {
  transform: none;
  box-shadow: none;
}

.day-cell.today {
  border-color: var(--color-accent);
  border-width: 3px;
  font-weight: 700;
}

.day-number {
  font-size: 0.875rem;
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
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
}

.stat-card svg {
  color: var(--color-primary);
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.25rem;
}

.stat-label {
  color: var(--color-gray-500);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .calendar-section {
    padding: 1.5rem;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions button {
    flex: 1;
  }
}

@media (prefers-color-scheme: dark) {
  .calendar-section,
  .stat-card {
    background: var(--color-gray-800);
  }

  .legend-box {
    border-color: var(--color-gray-600);
  }

  .day-cell {
    background: var(--color-gray-700);
    border-color: var(--color-gray-600);
    color: var(--color-gray-100);
  }
}
</style>
