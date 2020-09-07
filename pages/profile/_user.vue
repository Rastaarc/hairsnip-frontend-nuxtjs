<template>
  <div>
    <v-row dense>
      <v-col cols="12" md="5" class="mx-auto">
        <v-card elevation="4">
          <v-sheet color="primary" elevation="0" height="150" tile> </v-sheet>
          <div style="margin-top: -65px;">
            <v-col align-self="center" cols="6" class="mx-auto text-center">
              <v-badge
                v-if="userAccount"
                avatar
                overlap
                offset-y="87"
                offset-x="20"
              >
                <template v-slot:badge>
                  <v-avatar ref="uploadIcon" size="60px">
                    <v-icon @click="showFileUpload">mdi-pencil-outline</v-icon>
                  </v-avatar>
                </template>
                <v-avatar size="106px">
                  <v-overlay absolute :value="overlay">
                    <v-progress-circular
                      indeterminate
                      size="40"
                    ></v-progress-circular>
                  </v-overlay>
                  <v-img :src="profilePix"></v-img>
                </v-avatar>
              </v-badge>
              <v-avatar v-else size="106px">
                <v-img :src="profilePix"></v-img>
              </v-avatar>
            </v-col>
            <div class="d-none">
              <input
                ref="dpFileUpload"
                type="file"
                accept=".jpeg, .jpg, .png"
                @change="uploadDp($event)"
              />
            </div>
          </div>
          <div class="text-center">
            <v-row justify="center" align="center">
              <v-col cols="12" align-self="center">
                <p class="primary--text font-weight-bold text-h5">
                  {{ user_data.username }}
                </p>
                <p
                  class="text-caption text--secondary font-weight-light"
                  style="margin-top: -15px;"
                >
                  {{ user_data.email }}
                </p>
              </v-col>
            </v-row>
            <v-row
              v-if="user_data.type === 'Snipper'"
              justify="center"
              align="center"
            >
              <v-col cols="12" align-self="center">
                <v-rating :value="rating" half-increments> </v-rating>
              </v-col>
            </v-row>
            <v-row justify="center" align="center">
              <v-col cols="12" align-self="center" class="text--secondary">
                <v-icon small>mdi-map-marker-radius</v-icon>
                <span v-if="user_data.address" class="text-caption"
                  >{{ user_data.address }}
                </span>
                <span v-else class="text-caption">Unkown </span>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="7" class="mx-auto mt-4 mt-md-0">
        <v-card elevation="4">
          <v-container>
            <div class="text-md-h6 font-weight-medium">Full Name</div>
            <v-divider></v-divider>
            <p>{{ user_data.name }}</p>
            <div class="text-md-h6 font-weight-medium">Contact Number</div>
            <v-divider></v-divider>
            <p>{{ user_data.phone }}</p>
            <div class="text-md-h6 font-weight-medium">Overview</div>
            <v-divider></v-divider>
            <p v-if="user_data.about">
              {{ user_data.about }}
            </p>
            <p v-else>No Overview Yet</p>
            <div v-if="user_data.type !== 'Admin'">
              <div class="text-md-h6 font-weight-medium">Verification</div>
              <v-divider></v-divider>
              <p v-if="user_data.verified2" class="success--text">Verified</p>
              <p v-else class="red--text">Pending</p>
            </div>
            <div v-if="user_data.type === 'Snipper'">
              <div class="text-md-h6 font-weight-medium">Skills</div>
              <v-divider></v-divider>
              <div v-if="user_data.snipper.skills">
                <p>{{ user_data.snipper.skills.join(', ') }}</p>
              </div>
              <div v-else>
                <p>No Skills attached</p>
              </div>
              <div class="text-md-h6 font-weight-medium">Working Days</div>
              <v-divider></v-divider>
              <div v-if="user_data.snipper.working_days">
                <p>{{ user_data.snipper.working_days.join(', ') }}</p>
              </div>
              <div v-else>
                <p>No Working Days attached</p>
              </div>
              <div class="text-md-h6 font-weight-medium">Working Hours</div>
              <v-divider></v-divider>
              <div v-if="user_data.snipper.working_hours">
                <p>{{ user_data.snipper.working_hours }}</p>
              </div>
              <div v-else>
                <p>No Working Hours attached</p>
              </div>
            </div>
            <div v-else-if="user_data.type === 'Client'">
              Client
            </div>
            <div v-else>Admin</div>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                v-if="userAccount"
                color="primary"
                text
                to="profile/edit"
                exact
                >Update</v-btn
              >
            </v-card-actions>
          </v-container>
        </v-card>
        <div v-if="!userAccount" class="mt-4">
          <SafetyTipsCard />
        </div>
      </v-col>
    </v-row>
    <v-row v-if="user_data.type === 'Snipper'">
      <v-col cols="12">
        <v-card elevation="4">
          <v-card-text>
            <v-subheader>Review</v-subheader>
            <v-divider></v-divider>
            <div v-if="user_data.review">
              User Review {{ user_data.review }}
            </div>
            <div v-else>No review yet</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import SafetyTipsCard from '@/components/SafetyTipsCard'
export default {
  components: {
    SafetyTipsCard,
  },
  middleware: ['authenticate'],
  async asyncData({
    isDev,
    route,
    store,
    env,
    params,
    query,
    req,
    res,
    $axios,
    redirect,
    error,
  }) {
    if (!params.user) {
      const user = await store.$auth.user
      return { user_data: user }
    } else {
      const resp = await $axios.get('/user/profile/others/' + params.user + '/')
      const user = resp.data.user
      if (user.username === -1) {
        store.dispatch('snackalert/showSnackbar', {
          msg: 'Invalid request. No user with that username',
          color: 'red',
        })
        redirect('/profile')
      }
      return { user_data: user }
    }
  },
  data() {
    return {
      overlay: false,
    }
  },
  computed: {
    isOwner() {
      if (!this.$route.params.user) {
        return true
      } else {
        return false
      }
    },
    userAccount() {
      if (!this.isOwner) {
        if (this.$route.params.user === this.$auth.user.username) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
    avatar() {
      return '/dp/rasta.jpg'
    },
    rating() {
      return 3.3
    },
    profilePix: {
      get() {
        if (this.userAccount) {
          return this.$auth.user.image_url
        } else {
          return this.user_data.image_url
        }
      },
      set(val) {
        this.user_data.image_url = val
      },
    },
    userType() {
      return this.$auth.user.type
    },
  },
  methods: {
    showFileUpload(e) {
      this.$refs.dpFileUpload.click()
    },
    async uploadDp(e) {
      const dpSize = e.target.files[0].size
      const ALLOWED_SIZE = 1024 * 50 // 50kb
      const ALLOWED_EXT = ['jpeg', 'jpg', 'png']
      const dpFile = e.target.files[0]
      const dpEx = dpFile.name.split('.').pop().toLowerCase()
      if (dpSize > ALLOWED_SIZE) {
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: 'Maximum file size is ' + ALLOWED_SIZE / 1024 + 'kb',
          color: 'red',
        })
        return
      }
      if (!ALLOWED_EXT.includes(dpEx)) {
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: 'Only JPG, JPEG and PNG are allowed',
          color: 'red',
        })
        return
      }
      this.overlay = true
      const formData = new FormData()
      formData.append('photo', dpFile)
      const { data } = await this.$axios.post('user/upload/dp/', formData)
      // eslint-disable-next-line no-console
      if (data.error) {
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: data.msg,
          color: 'red',
        })
      } else {
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: data.msg,
          color: 'success',
        })
        if (this.userAccount) {
          this.$auth.fetchUser()
        }
      }
      this.overlay = false
    },
  },
  head() {
    return {
      title: `${this.user_data.username}'s Profile`,
    }
  },
}
</script>

<style scoped></style>
