<template>
  <div class="home">
    <h1>Welkom bij Wintersport 2026!</h1>
    <p class="intro">Plan jullie wintersport avontuur met Guus, Rene, Harm en Dirk</p>

    <div class="features">
      <div class="feature-card">
        <h2>📅 Datumplanner</h2>
        <p>Geef aan wanneer je wel of niet kunt</p>
        <router-link to="/datumplanner" class="btn">Naar planner</router-link>
      </div>

      <div class="feature-card">
        <h2>⛷️ Skigebieden</h2>
        <p>Ontdek de beste wintersportbestemmingen</p>
        <router-link to="/skigebieden" class="btn">Bekijk gebieden</router-link>
      </div>

      <div class="feature-card">
        <h2>✈️ Vliegvelden</h2>
        <p>Vind het dichtstbijzijnde vliegveld</p>
        <router-link to="/vliegvelden" class="btn">Bekijk vliegvelden</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
}

.intro {
  font-size: 1.2rem;
  color: #666;
  margin: 1rem 0 3rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.feature-card h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
}

.feature-card p {
  color: #666;
  margin-bottom: 1.5rem;
}

.btn {
  display: inline-block;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s;
}

.btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

@media (prefers-color-scheme: dark) {
  .feature-card {
    background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  }

  .feature-card h2 {
    color: #fff;
  }

  .feature-card p {
    color: #cbd5e0;
  }
}
</style>
