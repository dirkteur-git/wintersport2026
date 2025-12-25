<template>
  <div>
    <nav class="navbar">
      <h1>⛷️ Wintersport 2026</h1>
      <div class="nav-links">
        <router-link to="/">Home</router-link>
        <router-link to="/datumplanner">Datumplanner</router-link>
        <router-link to="/skigebieden">Skigebieden</router-link>
        <router-link to="/vliegvelden">Vliegvelden</router-link>
      </div>
    </nav>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.navbar h1 {
  margin-bottom: 1rem;
  color: white;
  font-size: 2rem;
}

.nav-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-links a.router-link-active {
  background: rgba(255, 255, 255, 0.3);
  font-weight: bold;
}

main {
  padding: 0 1rem;
}
</style>
