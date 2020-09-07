<template>
  <div class="d-flex flex-column">
    <v-row>
      <v-col cols="12">
        <Slider :items="items" />
      </v-col>
    </v-row>
    <v-row class="text-center mt-5">
      <v-col cols="12" sm="10" md="8" class="mx-auto">
        <p class="font-weight-bold text-h4 text-capitalize">
          Out of the box, find a trusted Snipper in your area
        </p>
        <p class="mb-4">
          HairSnip Snippers(Barber) are well trained and good with their work
        </p>
        <v-row align="center">
          <v-col md="9" class="mx-auto">
            <v-form v-model="valid" @submit.prevent="showData">
              <v-text-field
                v-model="location"
                :rules="locationRules"
                label="Enter your location"
                prepend-inner-icon="mdi-map-marker-radius"
                required
              >
              </v-text-field>
              <v-btn
                :disabled="disabled"
                color="primary"
                type="submit"
                :loading="loadingData"
                rounded
              >
                Get Started
              </v-btn>
            </v-form>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        sm="5"
        md="4"
        justify="center"
        align="center"
        class="mb-1 d-sm-none"
      >
        <v-img
          :src="clientImg"
          width="300"
          height="200"
          class="mx-auto"
        ></v-img>
      </v-col>
      <v-col cols="12" sm="7" md="8" class="text-center text-sm-left">
        <p class="text-h3 text-sm-h4 font-weight-bold text-capitalize">
          Get more done with <span class="primary--text">HairSnip</span>
        </p>
        <p>
          With HairSnip, your hair is safe with our professional snippers. Join
          Us Today for a perfect livestyle, we are the best.
        </p>
      </v-col>
      <v-col sm="5" md="4" class="mb-4 d-none d-sm-flex flex-column">
        <v-img
          :src="clientImg"
          width="300"
          height="200"
          class="mx-auto"
        ></v-img>
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col sm="5" md="4" justify="center" align="center" class="d-sm-none">
        <v-img
          :src="snippersImg"
          width="300"
          height="200"
          class="mx-auto"
        ></v-img>
      </v-col>
      <v-col sm="5" md="4" class="mb-4 d-none d-sm-flex flex-column">
        <v-img
          :src="snippersImg"
          width="300"
          height="200"
          class="mx-auto"
        ></v-img>
      </v-col>
      <v-col cols="12" sm="7" md="8" class="text-center text-sm-left">
        <p class="text-h3 text-sm-h4 font-weight-bold text-capitalize">
          Become a great snipper on <span class="primary--text">HairSnip</span>
        </p>
        <p>
          With HairSnip, your hair is safe with our professional snippers. Join
          Us Today for a perfect livestyle, we are the best.
        </p>
        <v-btn
          class="mt-3 mb-3"
          color="primary"
          type="submit"
          rounded
          @click="openSnipperSignup"
        >
          Join Us
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" align="center" class="mt-5">
      <v-col sm="5" md="4">
        <v-img
          :src="howItWorksImg"
          width="300"
          height="250"
          class="mx-auto"
        ></v-img>
      </v-col>
      <v-col cols="12" sm="7" md="9" class="text-center mx-auto">
        <p class="text-h4 font-weight-bold text-capitalize">
          How it works
        </p>
        <p>
          <span class="primary--text">HairSnip</span> gives you the great
          opportunity to make the right hair with peace of mind
        </p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Slider from '~/components/Slider'
export default {
  components: {
    Slider,
  },
  data() {
    return {
      loadingData: false,
      valid: false,
      snippersImg: '/snippers.png',
      clientImg: '/sniper_client.jpg',
      howItWorksImg: '/howItWorks.png',
      location: '',
      items: [2, 4, 8, 10],
      imgWidth: 400,
      mobile: this.$vuetify.breakpoint.width <= 700,
      locationRules: [(v) => !!v || 'Location is required'],
    }
  },
  computed: {
    displayImgWidth() {
      return 300
    },
    disabled() {
      return !this.location
    },
  },
  mounted() {
    if (this.$auth.loggedIn) {
      this.$router.push('/dashboard')
    }
  },
  methods: {
    openSnipperSignup() {
      this.$store.commit('dialog/updateSignupDialog', {
        dState: true,
        signupTab: 'snipperTab',
      })
    },
    async showData() {
      // eslint-disable-next-line no-console
      console.log(this.location)
      this.loadingData = true
      const res = await this.$axios.get('admin/get/snippers')
      // eslint-disable-next-line no-console
      console.log(res)
      this.loadingData = false
    },
  },
  head() {
    return {
      title: 'Home',
    }
  },
}
</script>
