<template>
  <v-dialog v-model="showDialog" width="400" persistent>
    <v-card>
      <v-card-text>
        <v-row justify="center" align="center">
          <v-col align-self="center">
            <p class="primary--text text-h5 text-center font-weight-bold">
              ADD NEW {{ caller }}
            </p>
          </v-col>
        </v-row>
        <v-form @submit.prevent="addNewData">
          <v-row>
            <v-col>
              <v-text-field
                v-model="regData.type"
                :rules="formRules.usertypeRules"
                label="User Type"
                disabled
                outlined
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="regData.name"
                :rules="formRules.fullNameRules"
                label="Name"
                counter="30"
                outlined
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="regData.username"
                :rules="formRules.usernameRules"
                counter="15"
                label="Username"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="regData.email"
                label="Email"
                :rules="formRules.emailRules"
                type="email"
                required
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="regData.phone"
                label="Phone Number"
                :rules="formRules.phoneRules"
                counter="11"
                type="number"
                required
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="regData.password"
                label="Password"
                counter="32"
                :rules="formRules.passwordRules"
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
                Add {{ callee }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="red acent-3" @click.stop="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    callee: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showPass: false,
      disabled: false,
      loading: false,
      regData: {
        type: this.callee,
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
      },
      formRules: {
        usertypeRules: [(v) => !!v || 'User Type is required'],
        fullNameRules: [
          (v) => !!v || 'Full name is required',
          (v) => v.length <= 60 || 'Maximum length is 50',
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
        ],
        passwordRules: [
          (v) => !!v || 'Password is required',
          (v) => v.length <= 32 || 'Maximum length is 32',
        ],
        passwordRules2: [(v) => v.length <= 32 || 'Maximum length is 32'],
        aboutRules: [(v) => v.length <= 250 || 'Maximum length is 250'],
      },
    }
  },
  computed: {
    caller() {
      return this.callee.toUpperCase()
    },
  },
  methods: {
    clearFormData() {
      for (const key in this.regData) {
        if (Object.prototype.hasOwnProperty.call(this.regData, key)) {
          this.regData[key] = ''
        }
      }
    },
    closeDialog() {
      this.clearFormFields()
      if (this.callee === 'Snipper') {
        this.$emit('closeSnipperDialog')
      } else if (this.callee === 'Client') {
        this.$emit('closeClientDialog')
      } else {
        this.$emit('closeDialog')
      }
    },
    async addNewData() {
      this.loading = true
      const resp = await this.$axios.post('admin/add/user/', {
        regData: this.regData,
      })
      if (resp.data.success) {
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: resp.data.msg,
          color: 'success',
        })
        this.$emit('refreshData')
        this.clearFormData()
        this.closeDialog()
      } else {
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: resp.data.msg,
          color: 'red',
        })
      }
      this.loading = false
    },
  },
}
</script>

<style scoped></style>
