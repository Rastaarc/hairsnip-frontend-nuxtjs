<template>
  <v-dialog v-model="openDialog" :width="width" persistent>
    <v-card>
      <v-card-title></v-card-title>
      <v-card-text>
        <h4 class="text-h4 mt-4 text-center primary--text">
          Just One Step Away
        </h4>
        <v-row justify="center" align="center" class="mt-0">
          <v-col color="primary" cols="5" class="mx-auto">
            <v-divider></v-divider>
          </v-col>
        </v-row>
        <v-form ref="form" @submit.prevent="submit">
          <v-row>
            <v-col cols="12" md="8" lg="6" class="mx-auto">
              <v-select
                v-model="signup.usertype"
                :rules="rules.usertypeRules"
                label="User Type"
                :items="usertypes"
                required
              >
              </v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="8" lg="6" class="mx-auto">
              <v-text-field
                v-model="signup.fullName"
                label="Full Name"
                :rules="rules.fullNameRules"
                counter="50"
                prepend-inner-icon="mdi-account"
                required
                clearable
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="8" lg="6" class="mx-auto">
              <v-text-field
                v-model="signup.username"
                :rules="rules.usernameRules"
                label="Username"
                counter="15"
                prepend-inner-icon="mdi-account"
                required
                clearable
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="8" lg="6" class="mx-auto">
              <v-text-field
                v-model="signup.email"
                label="Email"
                :rules="rules.emailRules"
                prepend-inner-icon="mdi-email"
                type="email"
                required
                clearable
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="8" lg="6" class="mx-auto">
              <v-text-field
                v-model="signup.phone"
                label="Phone Number"
                :rules="rules.phoneRules"
                counter="11"
                prepend-inner-icon="mdi-phone"
                type="number"
                required
                clearable
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row class="pb-0 mb-1">
            <v-col cols="12" md="8" lg="6" class="mx-auto">
              <v-text-field
                v-model="signup.password"
                label="Password"
                counter="32"
                :rules="rules.passwordRules"
                prepend-inner-icon="mdi-key"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                required
                @click:append="showPass = !showPass"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row align="center" justify="center" class="mb-4 text-center">
            <v-col cols="12">
              <v-btn
                :loading="loading"
                outlined
                rounded
                color="primary"
                type="submit"
                :disabled="disabled"
              >
                Continue
              </v-btn>
            </v-col>
          </v-row>
          <v-row align="center" justify="center" class="mt-5 text-center">
            <v-col cols="12">
              Have an account?
              <v-btn
                class="pl-0"
                small
                text
                color="primary"
                @click="openLoginDialog"
                >Login In!</v-btn
              >
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
      showDialog: false,
      signup: {
        fullName: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        usertype: '',
      },
      rules: {
        usertypeRules: [(v) => !!v || 'Please select one the user type'],
        fullNameRules: [
          (v) => !!v || 'Full name is required',
          (v) => v.length <= 50 || 'Maximum length is 50',
        ],
        emailRules: [
          (v) => !!v || 'Email is required',
          (v) => /.+@.+/.test(v) || 'Email must be valid',
        ],
        phoneRules: [
          (v) => !!v || 'Phone number is required',
          (v) =>
            /0[789][01]\d{8}/.test(v) || 'Please enter a valid Nigeria mobile',
          (v) => v.length <= 11 || 'Please enter a valid Nigeria mobile',
        ],
        usernameRules: [
          (v) => !!v || 'Username is required',
          (v) => v.length <= 15 || 'Maximum length is 15',
          (v) => /^\w{1,15}$/.test(v) || 'Only A-Z,a-z and 0-9 are allowed',
        ],
        passwordRules: [
          (v) => !!v || 'Password is required',
          (v) => v.length <= 32 || 'Maximum length is 32',
        ],
      },
      usertypes: ['Client', 'Snipper'],
      valid: true,
      showPass: false,
      loading: false,
    }
  },
  computed: {
    disabled() {
      const data = Object.values(this.signup)
      const valid = data.every((val) => val)
      if (!valid) {
        return true
      } else {
        return false
      }
    },
    openDialog() {
      return this.$store.getters['dialog/signupDialogStatus']
    },
  },
  methods: {
    closeDialog() {
      this.$store.commit('dialog/updateSignupDialog', {
        dState: false,
      })
    },
    openLoginDialog() {
      this.$store.commit('dialog/updateSignupDialog', {
        dState: false,
      })
      this.$store.commit('dialog/updateLoginDialog', {
        dState: true,
      })
    },
    async submit() {
      const valid = this.$refs.form.validate()
      if (!valid) return
      this.loading = true
      try {
        const { data } = await this.$axios.post('auth/register/', {
          data: this.signup,
        })
        this.loading = false
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: data.msg,
          color: 'success',
        })
        this.openLoginDialog()
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
