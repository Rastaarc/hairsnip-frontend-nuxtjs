<template>
  <v-row align="center" justify="center" align-items="center">
    <v-col cols="12" md="8" align-self="center">
      <v-card elevation="3">
        <v-card-text class="text-center text-h6 text-md-h5 primary--text">
          EDIT PROFILE
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text>
          <v-form ref="updateForm" @submit.prevent="updateProfile">
            <v-row>
              <v-col cols="12">
                <div class="text-h5 font-weight-bold">
                  BASIC INFORMATION
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="edit.fullname"
                  outlined
                  :rules="formRules.fullNameRules"
                  counter="60"
                  label="Full Name"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="edit.phone"
                  label="Phone Number"
                  :rules="formRules.phoneRules"
                  counter="11"
                  outlined
                  type="number"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field v-model="edit.address" label="Address" outlined>
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-textarea
                  v-model="edit.about"
                  auto-grow
                  :rules="formRules.aboutRules"
                  outlined
                  counter="250"
                  label="Overview"
                >
                </v-textarea>
              </v-col>
            </v-row>
            <div v-if="user_data.type === 'Snipper'">
              <v-row>
                <v-col cols="12">
                  <div class="text-h5 font-weight-bold">
                    WORK INFORMATION
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-select
                    v-model="edit.skills"
                    :items="skillsItems"
                    auto-grow
                    outlined
                    multiple
                    auto-complete
                    label="Skills"
                  >
                  </v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-select
                    v-model="edit.workingDays"
                    :items="workingDaysItems"
                    auto-grow
                    outlined
                    multiple
                    auto-complete
                    label="Working Days"
                  >
                  </v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-select
                    v-model="edit.workingHours"
                    :items="workingHoursItems"
                    auto-grow
                    outlined
                    multiple
                    auto-complete
                    label="Working Hours"
                  >
                  </v-select>
                </v-col>
              </v-row>
            </div>
            <v-row>
              <v-col cols="12">
                <div class="text-h5 font-weight-bold">
                  CHANGE PASSWORD
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="edit.password"
                  :rules="formRules.passwordRules2"
                  label="Old Password"
                  counter="32"
                  :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPass ? 'text' : 'password'"
                  outlined
                  @click:append="showPass = !showPass"
                  @change="validateNewPass"
                  @blur="validateNewPass"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="edit.newPassword"
                  :error="newPassError.error"
                  :error-messages="newPassError.msgs"
                  label="New Password"
                  counter="32"
                  :append-icon="showPass1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPass1 ? 'text' : 'password'"
                  outlined
                  @change="validateNewPass"
                  @blur="validateNewPass"
                  @click:append="showPass1 = !showPass1"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center" align="center" align-items="center">
              <v-col cols="6" class="mx-auto text-center" align-self="center">
                <v-btn :loading="loading" color="primary" outlined type="submit"
                  >Update</v-btn
                >
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
export default {
  middleware: 'authenticate',
  data() {
    return {
      user_data: this.$auth.user,
      showPass: false,
      showPass1: false,
      loading: false,
      newPassError: {
        error: false,
        msgs: [],
      },
      goodToGo: true,
      edit: {
        fullname: this.$auth.user.name,
        phone: this.$auth.user.phone,
        about: this.$auth.user.about || '',
        password: '',
        newPassword: '',
        skills: this.$auth.user.snipper ? this.$auth.user.snipper.skills : '',
        workingDays: this.$auth.user.snipper
          ? this.$auth.user.snipper.working_days
          : '',
        workingHours: this.$auth.user.snipper
          ? this.$auth.user.snipper.working_hours
          : '',
        address: this.$auth.user.address || '',
      },
      skillsItems: ['Afro', 'Low Cut', 'Gallas'],
      workingDaysItems: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
      workingHoursItems: [
        '8:00am',
        '9:00am',
        'Wed',
        'Thur',
        'Fri',
        'Sat',
        'Sun',
      ],
    }
  },
  computed: {
    ...mapState('rules', ['formRules']),
    ex() {
      return this.edit.skills
    },
  },
  methods: {
    validateNewPass() {
      if (!this.edit.password && this.edit.newPassword) {
        this.newPassError.error = true
        this.newPassError.msgs.push('Old password is required')
        this.goodToGo = false
      } else if (this.edit.newPassword.length > 32) {
        this.newPassError.error = true
        this.newPassError.msgs.splice(0, this.newPassError.msgs.length)
        this.newPassError.msgs.push('Maximum length is 32')
        this.goodToGo = false
      } else {
        this.newPassError.error = false
        this.newPassError.msgs.splice(0, this.newPassError.msgs.length)
        this.goodToGo = true
      }
    },
    async updateProfile() {
      const valid = this.$refs.updateForm.validate()
      if (!valid || !this.goodToGo) {
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: 'Please fix all the errors in your form first',
          color: 'red',
        })
        return
      }
      this.loading = true
      const response = await this.$axios.post('user/update/profile/', {
        data: this.edit,
      })
      this.loading = false
      if (response.status === 200) {
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: response.data.msg,
          color: 'success',
        })
      } else {
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: response.data.msg,
          color: 'red',
        })
      }
      this.$auth.fetchUser()
    },
  },
  head() {
    return {
      title: 'Edit Profile',
    }
  },
}
</script>

<style scoped></style>
