import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/auth/Login.vue'
import User from "../views/admin/User.vue"
import History from "../views/admin/History.vue"
import Museum from "../views/admin/Museum.vue"
import Wanasuta from "../views/admin/Wanasuta.vue"
import Awards from "../views/admin/Awards.vue"
import Menu from "../views/admin/Menu.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/auth',
    name: 'Login',
    component: Login
  },
  {
    path: '/user',
    name: 'user',
    component: User
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/museum',
    name: 'Museum',
    component: Museum
  },
  {
    path: '/wanasuta',
    name: 'Wanasuta',
    component: Wanasuta
  },
  {
    path: '/sejarah',
    name: 'History',
    component: History
  },
  {
    path: '/prestasi',
    name: 'Prestasi',
    component: Awards
  },
  {
    path: '/menu',
    name: 'Menu',
    component: Menu
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router

