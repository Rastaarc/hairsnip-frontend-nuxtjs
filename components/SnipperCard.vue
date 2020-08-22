<template>
  <div>
    <div v-if="!horizontal">
      <UserCard :user-data="userData">
        <template v-slot:body>
          <v-row justify="center" align="center">
            <v-col cols="12" align-self="center">
              <v-rating :value="rating" half-increments> </v-rating>
            </v-col>
          </v-row>
        </template>
      </UserCard>
    </div>
    <div v-else>
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="3" lg="2">
              <v-avatar :size="avatarSize">
                <v-img :src="userData.image_url"></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="9" lg="10">
              <v-row>
                <v-col>
                  <div>
                    <p class="text-h5 primary--text">
                      {{ userData.username }}
                    </p>
                    <div class="rating">
                      <v-rating :value="rating" x-small dense></v-rating>
                    </div>
                  </div>
                  <p class="about">{{ userData.about }}</p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            target="_blank"
            :to="`/profile/${username}`"
            >View Profile</v-btn
          >
          <v-btn text color="primary" @click="hire(userData.id)">Hire</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import UserCard from '@/components/UserCard'
export default {
  component: {
    UserCard,
  },
  props: {
    userData: {
      type: Object,
      default: () => {},
    },
    horizontal: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    avatarSize() {
      if (this.$vuetify.breakpoint.width <= 400) {
        return '70px'
      } else if (this.$vuetify.breakpoint.width >= 1264) {
        return '120px'
      } else {
        return '100px'
      }
    },
    rating() {
      return 4
    },
    username() {
      return this.userData.username.toLowerCase()
    },
  },
  methods: {
    hire(userId) {
      // eslint-disable-next-line no-console
      console.log(userId)
    },
  },
}
</script>

<style scoped>
.rating {
  margin-top: -55px;
  float: right;
}
.about {
  margin-top: -10px;
}
</style>
