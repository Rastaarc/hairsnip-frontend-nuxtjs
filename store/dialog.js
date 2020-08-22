export const state = () => ({
  loginDialog: false,
  signupDialog: false,
})

export const mutations = {
  updateLoginDialog(state, payload) {
    state.loginDialog = payload.dState
  },
  updateSignupDialog(state, payload) {
    state.signupDialog = payload.dState
  },
}

export const getters = {
  loginDialogStatus(state) {
    return state.loginDialog
  },
  signupDialogStatus(state) {
    return state.signupDialog
  },
}

export const actions = {}
