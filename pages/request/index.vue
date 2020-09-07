<template>
  <div>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" align-self="center">
        <v-card>
          <v-card-text>
            <v-form ref="requestForm" @submit.prevent="showData">
              <p class="text-h5 text-center">Choose Your Hair Style</p>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="clientData.clientHairStyle"
                    placeholder="Try 'Low Cut'"
                    :rules="rules.style"
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
                    id="userAddress"
                    v-model="clientData.clientLocation"
                    placeholder="Enter your location"
                    :rules="rules.address"
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
      autocomplete: null,
      clientData: {
        clientLocation: this.$auth.user.address || null,
        clientHairStyle: null,
      },
      loadingData: false,
      snippers: [],
      dataAvailable: false,
      rules: {
        style: [(v) => !!v || 'Please enter the hair style'],
        address: [(v) => !!v || 'Please enter your location'],
      },
    }
  },
  computed: {
    skill() {
      return this.clientData.clientHairStyle.toUpperCase()
    },
    disableButton() {
      if (!this.clientLocation || !this.clientHairStyle) {
        return false
      } else {
        return true
      }
    },
  },
  mounted() {
    try {
      const options = {
        // types: ['cities'],
        // eslint-disable-next-line no-undef
        bounds: new google.maps.LatLngBounds(
          // eslint-disable-next-line no-undef
          new google.maps.LatLng(9.081999, 8.675277)
        ),
        componentRestrictions: {
          country: 'NG',
        },
      }
      // eslint-disable-next-line no-undef
      const googleAPI = new google.maps.places.Autocomplete(
        document.getElementById('userAddress'),
        // this.$refs.address,
        options
      )
      if (typeof googleAPI !== 'undefined') {
        this.autocomplete = googleAPI
      }
      // eslint-disable-next-line no-console
      console.log(this.autocomplete)
      this.autocomplete.setFields(['formatted_address', 'name', 'geometry'])
      this.autocomplete.addListener('place_changed', () => {
        const place = this.autocomplete.getPlace()
        // eslint-disable-next-line no-console
        console.log(place)
        if (place.formatted_address) {
          this.edit.address = place.formatted_address
        }
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      this.$store.dispatch('snackalert/showSnackbar', {
        msg:
          'Error occurred while loading google autocomplete API, please check your network connection',
        color: 'red',
      })
    }
  },
  methods: {
    async showData() {
      this.dataAvailable = false
      const valid = this.$refs.requestForm.validate()
      if (!valid) {
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: 'Please fix all the errors in your form first',
          color: 'red',
        })
        return
      }
      this.loadingData = true
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
