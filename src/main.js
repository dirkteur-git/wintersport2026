import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Home from './views/Home.vue'
import DatePlanner from './views/DatePlanner.vue'
import SkiResorts from './views/SkiResorts.vue'
import Airports from './views/Airports.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/datumplanner', component: DatePlanner },
    { path: '/skigebieden', component: SkiResorts },
    { path: '/vliegvelden', component: Airports },
  ]
})

createApp(App)
  .use(router)
  .mount('#app')
