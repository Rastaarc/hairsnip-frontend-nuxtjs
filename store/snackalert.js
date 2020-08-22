export const state = () => ({
  snackbar: false,
  color: 'primary',
  text: 'text',
})

export const mutations = {
  updateSnackbar(state, payload) {
    state.snackbar = payload
  },
  updateColor(state, payload) {
    state.color = payload
  },
  updateText(state, payload) {
    state.text = payload
  },
}

export const getters = {
  getSnackbar(state) {
    return state.snackbar
  },
  getColor(state) {
    return state.color
  },
  getText(state) {
    return state.text
  },
}

export const actions = {
  showSnackbar({ commit }, { msg, color }) {
    commit('updateSnackbar', true)
    commit('updateText', msg)
    commit('updateColor', color)
  },
}
