<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <Mountain :size="48" :stroke-width="1.5" class="logo-icon" />
          <h1>Wintersport 2026</h1>
          <p>Selecteer je naam om door te gaan</p>
        </div>

        <div class="participants-grid">
          <button
            v-for="participant in participants"
            :key="participant.name"
            class="participant-btn"
            @click="selectParticipant(participant)"
          >
            <User :size="32" :stroke-width="1.5" />
            <span>{{ participant.name }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Mountain, User } from 'lucide-vue-next'

const router = useRouter()

const participants = [
  { name: 'Guus', id: 'guus' },
  { name: 'Rene', id: 'rene' },
  { name: 'Harm', id: 'harm' },
  { name: 'Dirk', id: 'dirk' }
]

function selectParticipant(participant) {
  localStorage.setItem('wintersport2026-current-user', participant.id)
  router.push('/mijn-beschikbaarheid')
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 65px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, var(--color-ice), var(--color-snow));
}

.login-container {
  width: 100%;
  max-width: 600px;
}

.login-card {
  background: white;
  border-radius: 24px;
  padding: 3rem 2rem;
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.15);
  border: 1px solid var(--color-gray-200);
}

.login-header {
  text-align: center;
  margin-bottom: 3rem;
}

.logo-icon {
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.login-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: var(--color-gray-500);
  font-size: 1.0625rem;
}

.participants-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.participant-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem 1.5rem;
  background: var(--color-snow);
  border: 2px solid var(--color-gray-200);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--color-primary);
  font-size: 1.125rem;
  font-weight: 600;
}

.participant-btn:hover {
  border-color: var(--color-primary);
  background: white;
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(59, 130, 246, 0.2);
}

.participant-btn:active {
  transform: translateY(-2px);
}

@media (max-width: 640px) {
  .participants-grid {
    grid-template-columns: 1fr;
  }

  .login-card {
    padding: 2rem 1.5rem;
  }
}

@media (prefers-color-scheme: dark) {
  .login-card {
    background: var(--color-gray-800);
    border-color: var(--color-gray-700);
  }

  .participant-btn {
    background: var(--color-gray-700);
    color: var(--color-gray-100);
    border-color: var(--color-gray-600);
  }

  .participant-btn:hover {
    background: var(--color-gray-600);
  }
}
</style>
