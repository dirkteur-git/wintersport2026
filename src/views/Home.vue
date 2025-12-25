<template>
  <div class="home">
    <section class="hero">
      <div class="video-container">
        <video
          autoplay
          loop
          muted
          playsinline
          class="hero-video"
        >
          <source src="https://videos.pexels.com/video-files/4615429/4615429-uhd_2560_1440_24fps.mp4" type="video/mp4">
        </video>
        <div class="video-overlay"></div>
        <div class="snow-overlay"></div>
      </div>

      <div class="hero-content">
        <h1 class="hero-title">Wintersport 2026</h1>
        <p class="hero-subtitle">Guus · Rene · Harm · Dirk</p>
        <div class="hero-actions">
          <router-link to="/planner" class="btn-primary">
            <Calendar :size="20" :stroke-width="2" />
            Naar Planner
          </router-link>
          <router-link to="/kaart" class="btn-secondary">
            <MapPin :size="20" :stroke-width="2" />
            Ontdek gebieden
          </router-link>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <div class="feature-grid">
          <router-link to="/planner" class="feature-card">
            <div class="feature-icon">
              <Calendar :size="32" :stroke-width="1.5" />
            </div>
            <h3>Datumplanner</h3>
            <p>Vind de perfecte data voor jullie wintersport trip</p>
            <div class="feature-arrow">
              <ArrowRight :size="20" :stroke-width="2" />
            </div>
          </router-link>

          <router-link to="/kaart" class="feature-card">
            <div class="feature-icon">
              <MapPin :size="32" :stroke-width="1.5" />
            </div>
            <h3>Skigebieden</h3>
            <p>De beste skigebieden in de Alpen op een kaart</p>
            <div class="feature-arrow">
              <ArrowRight :size="20" :stroke-width="2" />
            </div>
          </router-link>

          <router-link to="/kaart" class="feature-card">
            <div class="feature-icon">
              <Plane :size="32" :stroke-width="1.5" />
            </div>
            <h3>Vliegvelden</h3>
            <p>Vind het dichtstbijzijnde vliegveld en transfers</p>
            <div class="feature-arrow">
              <ArrowRight :size="20" :stroke-width="2" />
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <section class="stats">
      <div class="container">
        <div class="stats-grid">
          <div class="stat">
            <Mountain :size="40" :stroke-width="1.5" />
            <div class="stat-number">8</div>
            <div class="stat-label">Skigebieden</div>
          </div>
          <div class="stat">
            <Plane :size="40" :stroke-width="1.5" />
            <div class="stat-number">8</div>
            <div class="stat-label">Vliegvelden</div>
          </div>
          <div class="stat">
            <Users :size="40" :stroke-width="1.5" />
            <div class="stat-number">4</div>
            <div class="stat-label">Deelnemers</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Calendar, MapPin, ArrowRight, Plane, Mountain, Users } from 'lucide-vue-next'
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  position: relative;
  height: 85vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.video-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.hero-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(59, 130, 246, 0.2), rgba(15, 23, 42, 0.7));
}

.snow-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(2px 2px at 20% 30%, white, transparent),
    radial-gradient(2px 2px at 60% 70%, white, transparent),
    radial-gradient(1px 1px at 50% 50%, white, transparent),
    radial-gradient(1px 1px at 80% 10%, white, transparent),
    radial-gradient(2px 2px at 90% 60%, white, transparent),
    radial-gradient(1px 1px at 33% 80%, white, transparent);
  background-size: 200% 200%;
  animation: snowfall 20s linear infinite;
  opacity: 0.4;
  pointer-events: none;
}

@keyframes snowfall {
  0% {
    background-position: 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%, 0% 0%;
  }
  100% {
    background-position: 0% 100%, 0% 100%, 0% 100%, 0% 100%, 0% 100%, 0% 100%;
  }
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: white;
  padding: 2rem;
}

.hero-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: -0.03em;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.hero-subtitle {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 300;
  margin-bottom: 3rem;
  letter-spacing: 0.05em;
  opacity: 0.95;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.0625rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.6);
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(255, 255, 255, 0.3);
}

.features {
  padding: 6rem 0;
  background: var(--color-bg);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  position: relative;
  padding: 2.5rem 2rem;
  border: 1px solid var(--color-gray-200);
  border-radius: 16px;
  text-decoration: none;
  color: var(--color-text);
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.05);
}

.feature-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
  background: linear-gradient(135deg, white, var(--color-snow));
}

.feature-card:hover .feature-arrow {
  transform: translateX(4px);
  color: var(--color-primary);
}

.feature-icon {
  margin-bottom: 1.5rem;
  color: var(--color-primary);
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.feature-card p {
  color: var(--color-gray-500);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.feature-arrow {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  transition: transform 0.3s ease;
}

.stats {
  padding: 6rem 0;
  background: linear-gradient(135deg, var(--color-ice), var(--color-snow));
  border-top: 1px solid var(--color-frost);
  border-bottom: 1px solid var(--color-frost);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 4rem;
}

.stat {
  text-align: center;
  color: var(--color-primary);
}

.stat-number {
  font-size: 3.5rem;
  font-weight: 700;
  margin: 1rem 0 0.5rem;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  color: var(--color-gray-600);
  font-size: 1.0625rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .hero {
    height: 70vh;
    min-height: 500px;
  }

  .hero-title {
    font-size: 3rem;
  }

  .hero-subtitle {
    font-size: 1.25rem;
  }

  .features,
  .stats {
    padding: 4rem 0;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    gap: 3rem;
  }
}
</style>
