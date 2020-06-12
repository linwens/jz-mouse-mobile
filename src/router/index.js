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

  // 小鼠管理
  {
    path: '/mouseList',
    name: 'MouseList',
    component: () => import(/* webpackChunkName: "mouseList" */ '../views/Mouse/index.vue')
  },
  {
    path: '/mouseEdit',
    name: 'MouseEdit',
    component: () => import(/* webpackChunkName: "mouseEdit" */ '../views/Mouse/edit.vue')
  },
  {
    path: '/mouseCage',
    name: 'MouseCage',
    component: () => import(/* webpackChunkName: "mouseCage" */ '../views/Mouse/cage.vue')
  },
  {
    path: '/addMouse',
    name: 'MouseAddMouse',
    component: () => import(/* webpackChunkName: "mouseAddMouse" */ '../views/Mouse/addMouse.vue')
  },
  {
    path: '/addChild',
    name: 'MouseAddChild',
    component: () => import(/* webpackChunkName: "mouseAddChild" */ '../views/Mouse/addChild.vue')
  },

  // 实验管理
  {
    path: '/exptList',
    name: 'ExperimentList',
    component: () => import(/* webpackChunkName: "exptList" */ '../views/Experiment/index.vue')
  },
  {
    path: '/exptEdit',
    name: 'ExperimentEdit',
    component: () => import(/* webpackChunkName: "exptEdit" */ '../views/Experiment/edit.vue')
  },
  {
    path: '/exptAddMouse',
    name: 'ExptAddMouse',
    component: () => import(/* webpackChunkName: "exptAddMouse" */ '../views/Experiment/addMouse.vue')
  },

  // 删除小鼠列表
  {
    path: '/delList',
    name: 'DelList',
    component: () => import(/* webpackChunkName: "delList" */ '../views/DelList.vue')
  },

  // 繁育管理
  {
    path: '/breedList',
    name: 'BreedList',
    component: () => import(/* webpackChunkName: "breedList" */ '../views/Breed/index.vue')
  },
  {
    path: '/breedEdit',
    name: 'BreedEdit',
    component: () => import(/* webpackChunkName: "breedEdit" */ '../views/Breed/edit.vue')
  },
  {
    path: '/breedAddMouse',
    name: 'BreedAddMouse',
    component: () => import(/* webpackChunkName: "breedAddMouse" */ '../views/Breed/addMouse.vue')
  },

  // 品系管理
  {
    path: '/genesList',
    name: 'GenesList',
    component: () => import(/* webpackChunkName: "genesList" */ '../views/Variety/index.vue')
  },
  {
    path: '/varietyList',
    name: 'VarietyList',
    component: () => import(/* webpackChunkName: "varietyList" */ '../views/Variety/list.vue')
  },
  {
    path: '/varietyEdit',
    name: 'VarietyEdit',
    component: () => import(/* webpackChunkName: "varietyEdit" */ '../views/Variety/edit.vue')
  },

  // 登录
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },

  // 查看文件
  {
    path: '/viewFiles',
    name: 'ViewFiles',
    component: () => import(/* webpackChunkName: "viewFiles" */ '../components/ViewFiles/page.vue')
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
