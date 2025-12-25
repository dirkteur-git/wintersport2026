<template>
  <div class="date-planner">
    <div class="container">
      <header class="planner-header">
        <div>
          <h1>Wintersport 2026 Planner</h1>
          <p class="subtitle">Plan je beschikbaarheid en bekijk wanneer iedereen kan</p>
        </div>
        <div class="header-actions">
          <router-link to="/login" class="btn-login">
            <User :size="20" :stroke-width="2" />
            <span>Mijn Beschikbaarheid</span>
          </router-link>
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
            <span>Iedereen beschikbaar (4/4) - Donkergroen</span>
          </div>
          <div class="legend-item">
            <div class="legend-box level-3"></div>
            <span>3 personen beschikbaar - Groen</span>
          </div>
          <div class="legend-item">
            <div class="legend-box level-2"></div>
            <span>2 personen beschikbaar - Lichtgroen</span>
          </div>
          <div class="legend-item">
            <div class="legend-box level-1"></div>
            <span>1 persoon beschikbaar - Lichtrood</span>
          </div>
          <div class="legend-item">
            <div class="legend-box level-0"></div>
            <span>Niemand beschikbaar - Rood</span>
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
            <div class="calendar-wrapper">
              <div class="month-labels">
                <div v-for="month in months" :key="month.name" class="month-label" :style="{ width: `${month.weeks * 31}px` }">
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
                      :class="['day-box', {
                        'available': !availability[participant.id]?.[day.date] && day.inPeriod,
                        'not-available': availability[participant.id]?.[day.date] && day.inPeriod,
                        'out-of-period': !day.inPeriod,
                        'spring-break': isSpringBreak(day.date) && day.inPeriod
                      }]"
                      :title="getDayTooltip(day, participant.id)"
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
        </div>
      </div>

      <div class="combined-calendar">
        <h2>Gecombineerde Beschikbaarheid</h2>
        <p class="section-subtitle">Groen = meer mensen beschikbaar, Rood = minder mensen beschikbaar</p>

        <div class="calendar-wrapper">
          <div class="month-labels">
            <div v-for="month in months" :key="month.name" class="month-label" :style="{ width: `${month.weeks * 31}px` }">
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
                  :class="['day-cell', getAvailabilityClass(day), {
                    'out-of-period': !day.inPeriod,
                    'spring-break': isSpringBreak(day.date) && day.inPeriod
                  }]"
                  :title="getAvailabilityTooltip(day)"
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

function getAvailabilityClass(day) {
  if (!day.inPeriod) return ''

  const available = participants.filter(p =>
    !availability.value[p.id]?.[day.date]
  ).length

  return `level-${available}`
}

function getAvailabilityTooltip(day) {
  if (!day.inPeriod) return 'Buiten periode'

  const available = participants.filter(p =>
    !availability.value[p.id]?.[day.date]
  ).length

  const names = participants
    .filter(p => !availability.value[p.id]?.[day.date])
    .map(p => p.name)
    .join(', ')

  const springBreak = isSpringBreak(day.date) ? ' (Voorjaarsvakantie)' : ''
  return `${formatDate(day.date)}: ${available}/4 beschikbaar${names ? ` (${names})` : ''}${springBreak}`
}

function getDayTooltip(day, participantId) {
  if (!day.inPeriod) return 'Buiten periode'
  const status = availability.value[participantId]?.[day.date] ? 'Niet beschikbaar' : 'Beschikbaar'
  const springBreak = isSpringBreak(day.date) ? ' (Voorjaarsvakantie)' : ''
  return `${formatDate(day.date)}: ${status}${springBreak}`
}

function isSpringBreak(date) {
  // Voorjaarsvakantie 2026: 21 feb - 1 maart (week 8-9)
  const d = new Date(date)
  return d >= new Date('2026-02-21') && d <= new Date('2026-03-01')
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
  align-items: center;
}

.btn-login {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-login:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-icon {
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid var(--color-gray-300);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: var(--color-gray-50);
  border-color: var(--color-primary);
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
  height: 28px;
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

.day-box, .day-cell {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: 1px solid var(--color-gray-200);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.15s ease;
  user-select: none;
}

.day-number {
  font-size: 0.6875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  pointer-events: none;
}

.day-box.available, .day-cell.available {
  background: #22c55e;
  border-color: #16a34a;
}

.day-box.not-available, .day-cell.not-available {
  background: #ef4444;
  border-color: #dc2626;
}

.day-box.out-of-period, .day-cell.out-of-period {
  background: var(--color-gray-100);
  border-color: var(--color-gray-200);
  opacity: 0.4;
}

.day-box.spring-break, .day-cell.spring-break {
  border: 2px solid #fbbf24;
  box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.3);
}

.day-cell:hover:not(.out-of-period) {
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

.level-0.day-cell { background: #ef4444; border-color: #dc2626; }
.level-1.day-cell { background: #fca5a5; border-color: #f87171; }
.level-2.day-cell { background: #86efac; border-color: #4ade80; }
.level-3.day-cell { background: #22c55e; border-color: #16a34a; }
.level-4.day-cell { background: #15803d; border-color: #166534; }

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
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  border-color: #22c55e;
}

.day-summary.level-3 {
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border-color: #86efac;
}

.day-summary.level-2 {
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border-color: #fca5a5;
}

.day-summary.level-1 {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  border-color: #f87171;
}

.day-summary.level-0 {
  background: linear-gradient(135deg, #fecaca, #fca5a5);
  border-color: #ef4444;
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
  background: #22c55e;
  color: white;
}

.availability-count {
  font-weight: 600;
  font-size: 1.125rem;
  color: #22c55e;
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
    background: linear-gradient(135deg, #064e3b, #065f46);
  }

  .day-summary.level-3 {
    background: linear-gradient(135deg, #065f46, #047857);
  }

  .day-summary.level-2 {
    background: linear-gradient(135deg, #7f1d1d, #991b1b);
  }

  .day-summary.level-1 {
    background: linear-gradient(135deg, #991b1b, #b91c1c);
  }

  .day-summary.level-0 {
    background: linear-gradient(135deg, #b91c1c, #dc2626);
  }
}
</style>
