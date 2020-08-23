export const state = () => ({
  loginDialog: false,
  signupDialog: false,
  signupTab: 'clientTab',
})

export const mutations = {
  updateLoginDialog(state, payload) {
    state.loginDialog = payload.dState
  },
  updateSignupDialog(state, payload) {
    state.signupDialog = payload.dState
    if (payload.signupTab) {
      state.signupTab = payload.signupTab
    }
  },
  updateSignupType(state, payload) {
    state.signupTab = payload.dType
  },
}

export const getters = {
  loginDialogStatus(state) {
    return state.loginDialog
  },
  signupDialogStatus(state) {
    return state.signupDialog
  },
  signupType(state) {
    return state.signupTab
  },
}

export const actions = {}
