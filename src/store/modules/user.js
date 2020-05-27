import { login, tokenLogin, loginUser, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { setStorageItem, getStorageItem, removeStorageItem, setLocalStorageItem, getLocalStorageItem } from '@/utils/storage'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    info: getStorageItem('u-info') || {},
    inputHistory: getLocalStorageItem('u-history') || {}
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INFO: (state, info) => {
    state.info = info
    setStorageItem('u-info', JSON.stringify(info))
  },
  REMOVE_INFO: (state) => {
    state.info = {}
    removeStorageItem('u-info')
  },
  SET_INPUT_HISTORY: (state, obj) => {
    console.log(obj)
    const oldAll = state.inputHistory // 大对象
    // 筛选是否存在
    function valIsExist(arr, value) {
      const rslt = arr.filter((el) => {
        return el.value === value
      })
      return rslt.length > 0
    }
    for (const [key, value] of Object.entries(obj)) {
      const oldValue = oldAll[key] ? oldAll[key] : [] // 每个key下是一个字符串数组
      if (value && !valIsExist(oldValue, value)) {
        if (oldValue.length >= 8) { // 缓存的数据大于8条删除最旧的一条
          oldValue.shift()
          oldValue.push({
            'value': value
          })
        } else {
          oldValue.push({
            'value': value
          })
        }
      }
      oldAll[key] = oldValue
    }
    setLocalStorageItem('u-history', JSON.stringify(oldAll))
    state.inputHistory = oldAll
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // 用于测试***********************************************
      if (username === 'admin') { // 模拟管理员登录
        login({ username: username.trim(), password: password }).then(response => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          commit('SET_INFO', data)
          setToken(data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      } else { // 普通用户登录
        loginUser({ username: username.trim(), password: password }).then(response => {
          const { data } = response
          commit('SET_TOKEN', data.token)
          commit('SET_INFO', data)
          setToken(data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      }
    })
  },

  // get user info
  /* getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }, */

  // 获取url的token
  urlSetToken({ commit }, token) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', token)
      setToken(token)
      resolve()
    })
  },

  // 登录获取用户信息
  tokenLogin({ commit }) {
    return new Promise((resolve, reject) => {
      tokenLogin().then(response => {
        const { data } = response
        commit('SET_INFO', data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('REMOVE_INFO')
      commit('RESET_STATE')
      resolve()
    })
  },

  // 添加输入框记录
  setInputHistory({ commit, state }, obj) {
    commit('SET_INPUT_HISTORY', obj)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

