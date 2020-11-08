<template>
  <v-dialog v-model="openDialog" :width="width" persistent>
    <v-card>
      <v-card-title></v-card-title>
      <v-card-text>
        <h4 class="text-h4 mt-4 text-center primary--text mt-n1 mb-n4">
          Login
        </h4>
        <v-row justify="center" align="center" class="mt-0">
          <v-col color="primary" cols="4" class="mx-auto">
            <v-divider></v-divider>
          </v-col>
        </v-row>
        <v-form ref="form" @submit.prevent="submit">
          <v-row>
            <v-col cols="12" md="9" lg="7" class="mx-auto mt-n4">
              <v-text-field
                v-model="username"
                :rules="usernameRules"
                label="Username"
                prepend-inner-icon="mdi-account"
                required
                clearable
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row class="pb-0 mb-1">
            <v-col cols="12" md="9" lg="7" class="mx-auto mt-n7">
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Password"
                prepend-inner-icon="mdi-key"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                required
                @click:append="showPass = !showPass"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row align="center" justify="center" class="text-center">
            <v-col cols="12" class="mt-n6">
              <v-btn
                :loading="loading"
                outlined
                color="primary"
                type="submit"
                fab
              >
                <v-icon>mdi-play-circle</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row align="center" justify="center" class="text-center">
            <v-col cols="12 mt-n4 mb-n6">
              Don't have an account?
              <v-btn
                class="pl-0"
                small
                text
                color="primary"
                @click="openSignupDialog"
                >Sign up</v-btn
              >
              <br />
              <v-btn small color="primary" text to="/forgotpassword">
                Forgot Password?
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="red acent-3" @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 500,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      socket: null,
      showDialog: false,
      username: '',
      usernameRules: [(v) => !!v || 'Username is required'],
      password: '',
      passwordRules: [(v) => !!v || 'Password is required'],
      valid: true,
      showPass: false,
      loading: false,
    }
  },
  computed: {
    openDialog() {
      return this.$store.getters['dialog/loginDialogStatus']
    },
  },
  mounted() {
    // this.socket = this.$nuxtSocket({
    //   name: 'main',
    //   persist: 'true',
    // })
  },
  methods: {
    clearFormData() {
      this.username = null
      this.password = null
    },
    closeDialog() {
      this.$store.commit('dialog/updateLoginDialog', {
        dState: false,
      })
      // this.clearFormData()
    },
    openSignupDialog() {
      this.clearFormData()
      this.$store.commit('dialog/updateLoginDialog', {
        dState: false,
      })
      this.$store.commit('dialog/updateSignupDialog', {
        dState: true,
      })
    },
    async submit() {
      const valid = this.$refs.form.validate()
      if (!valid) return

      this.loading = true
      try {
        const { data } = await this.$auth.loginWith('local', {
          data: {
            user: this.username,
            pass: this.password,
          },
        })
        // this.clearFormData()
        this.loading = false
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: data.msg,
          color: 'success',
        })
        this.$store.commit('dialog/updateLoginDialog', {
          dState: false,
        })
        // this.socket.emit('user_connected', { user: this.username })
        // this.socket.emit('login', { username: this.username })
        this.$router.push('/dashboard')
      } catch (e) {
        this.loading = false
        let msg
        const color = 'red'
        if (e.response) {
          msg = e.response.data.msg
        } else {
          msg = 'Error occured while processing your form. Please try again'
        }
        this.$store.dispatch('snackalert/showSnackbar', {
          msg,
          color,
        })
      }
    },
  },
}
</script>

<style scoped>
.theme--light.v-divider {
  border-color: #5fabf678;
}
</style>
