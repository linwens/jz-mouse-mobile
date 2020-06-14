import Cookies from 'js-cookie'
import { setStorageItem, getStorageItem, removeStorageItem } from '@/utils/storage'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'mobile',
  cacheMouseInfo: getStorageItem('m-info') || '',
  addingMouses: getStorageItem('adding-mouse') || '',
  addingChildMouse: getStorageItem('adding-child') || '', // 新增子鼠
  addingExpt: getStorageItem('adding-expt') || '',
  addingBreed: getStorageItem('adding-breed') || { miceIds: null }
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_M_INFO: (state, info) => {
    state.cacheMouseInfo = info
    setStorageItem('m-info', JSON.stringify(info))
  },
  CLEAR_M_INFO: (state) => {
    state.cacheMouseInfo = {}
    removeStorageItem('m-info')
  },
  CACHE_MOUSES: (state, arr) => {
    state.addingMouses = arr
    setStorageItem('adding-mouse', JSON.stringify(arr))
  },
  CLEAR_MOUSES: (state) => {
    state.addingMouses = []
    removeStorageItem('adding-mouse')
  },
  CACHE_CHILD_MOUSES: (state, obj) => {
    state.addingChildMouse = obj
    setStorageItem('adding-child', JSON.stringify(obj))
  },
  CLEAR_CHILD_MOUSES: (state) => {
    state.addingChildMouse = {}
    removeStorageItem('adding-child')
  },
  CACHE_EXPTS: (state, obj) => {
    state.addingExpt = obj
    setStorageItem('adding-expt', JSON.stringify(obj))
  },
  CLEAR_EXPTS: (state) => {
    state.addingExpt = {}
    removeStorageItem('adding-expt')
  },
  CACHE_BREED: (state, obj) => {
    state.addingBreed = obj
    setStorageItem('adding-breed', JSON.stringify(obj))
  },
  CLEAR_BREED: (state) => {
    state.addingBreed = {}
    removeStorageItem('adding-breed')
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  cacheMouseInfo({ commit }, info) {
    commit('SET_M_INFO', info)
  },
  clearMouseInfo({ commit }) {
    commit('CLEAR_M_INFO')
  },
  cacheChoosedMouse({ commit }, arr) {
    commit('CACHE_MOUSES', arr)
  },
  clearMouses({ commit }) {
    commit('CLEAR_MOUSES')
  },
  cacheChildMouse({ commit }, obj) {
    commit('CACHE_CHILD_MOUSES', obj)
  },
  clearChildMouses({ commit }) {
    commit('CLEAR_CHILD_MOUSES')
  },
  cacheExpts({ commit }, obj) {
    commit('CACHE_EXPTS', obj)
  },
  clearExpts({ commit }) {
    commit('CLEAR_EXPTS')
  },
  cacheBreed({ commit }, obj) {
    commit('CACHE_BREED', obj)
  },
  clearBreed({ commit }) {
    commit('CLEAR_BREED')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
