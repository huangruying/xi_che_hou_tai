import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    // token: getToken(),
    name: '',
    avatar: '',
    data: {}
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    state.data = {}
    state.name = ''
    state.avatar = ''
    // Object.assign(state, getDefaultState())
  },
  // SET_TOKEN: (state, token) => {
  //   state.token = token
  // },
  SET_TOKEN: (state, data) => {
    state.data = data
    state.name = data.username
    state.avatar = data.pic
    console.log(state.name)
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  Acount({ commit }, view) {
    commit('SET_TOKEN', view)
  },
  // get user info
  getInfo({ commit, state }) {
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
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout({ username: state.name }).then(() => {
      // removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }

  // remove token
  // resetToken({ commit }) {
  //   return new Promise(resolve => {
  //     removeToken() // must remove  token  first
  //     commit('RESET_STATE')
  //     resolve()
  //   })
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

