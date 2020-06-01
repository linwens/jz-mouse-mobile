import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },


  {
    path: '/delList',
    name: 'DelList',
    component: () => import(/* webpackChunkName: "about" */ '../views/DelList.vue')
  },


  {
    path: '/breedList',
    name: 'BreedList',
    component: () => import(/* webpackChunkName: "about" */ '../views/Breed/index.vue')
  },
  {
    path: '/breedEdit',
    name: 'BreedEdit',
    component: () => import(/* webpackChunkName: "about" */ '../views/Breed/edit.vue')
  },


  {
    path: '/genesList',
    name: 'GenesList',
    component: () => import(/* webpackChunkName: "about" */ '../views/Variety/index.vue')
  },
  {
    path: '/varietyList',
    name: 'VarietyList',
    component: () => import(/* webpackChunkName: "about" */ '../views/Variety/list.vue')
  },
  {
    path: '/varietyEdit',
    name: 'VarietyEdit',
    component: () => import(/* webpackChunkName: "about" */ '../views/Variety/edit.vue')
  },


  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404' }
]

const createRouter = () => new VueRouter({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
