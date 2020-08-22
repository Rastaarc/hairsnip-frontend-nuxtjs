<template>
  <div>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" align-self="center">
        <v-card>
          <v-card-text>
            <v-form @submit.prevent="showData">
              <p class="text-h5 text-center">Choose Your Hair Style</p>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="clientData.clientHairStyle"
                    placeholder="Try 'Low Cut'"
                    outlined
                    required
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <p class="text-h5 text-center">Where Are You?</p>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="clientData.clientLocation"
                    placeholder="Enter your location"
                    outlined
                    required
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row
                class="text-center"
                align="center"
                justify="center"
                align-items="center"
              >
                <v-col cols="12" align-self="center">
                  <v-btn
                    :loading="loadingData"
                    rounded
                    :disabled="disableButton"
                    outlined
                    type="submit"
                    color="primary"
                    >Search</v-btn
                  >
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="dataAvailable">
      <v-col cols="12">
        <p class="text-center text-h4 font-weight-bold primary--text">
          Snippers in your Area <br />
          <span class="text-h5 red--text text-lighten-2"
            >with {{ skill }} skill
          </span>
        </p>
      </v-col>
      <v-col v-for="snipper in snippers" :key="snipper.id" cols="12">
        <SnipperCard :user-data="snipper" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import SnipperCard from '@/components/SnipperCard'
export default {
  components: {
    SnipperCard,
  },
  middleware: 'auth-client',
  data() {
    return {
      clientData: {
        clientLocation: null,
        clientHairStyle: null,
      },
      loadingData: false,
      snippers: [],
      dataAvailable: false,
    }
  },
  computed: {
    skill() {
      return this.clientData.clientHairStyle.toUpperCase()
    },
    disableButton() {
      if (!this.clientLocation && !this.clientHairStyle) {
        return false
      } else {
        return true
      }
    },
  },
  methods: {
    async showData() {
      this.loadingData = true
      this.dataAvailable = false
      try {
        const { data } = await this.$axios.post('user/load/snippers/', {
          data: this.clientData,
        })
        // eslint-disable-next-line no-console
        console.log(data)
        if (data.error) {
          this.$store.dispatch('snackalert/showSnackbar', {
            msg: data.msg,
            color: 'red',
          })
        } else {
          this.dataAvailable = true
          this.snippers = data.snippers
        }
      } catch (error) {
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: 'Error occurred while processing your request. Please try again',
          color: 'red',
        })
      }
      this.loadingData = false
    },
  },
  head() {
    return {
      title: 'Request',
    }
  },
}
</script>

<style scoped></style>
