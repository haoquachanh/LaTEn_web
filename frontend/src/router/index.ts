import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ContactVue from '../views/Contact.vue'
import DictionaryVue from '../views/Dictionary.vue'
import GameVue from '../views/Game.vue'
import Tips from '../views/Tips.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/dictionary',
      name: 'dictionary',
      component: DictionaryVue
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactVue
    },
    {
      path: '/tips',
      name: 'tips',
      component: Tips
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('../views/Game.vue')
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/Account.vue')

    }
  ]
})

export default router
