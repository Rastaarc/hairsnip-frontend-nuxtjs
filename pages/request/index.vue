<template>
  <div>
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" align-self="center">
        <v-card>
          <v-card-text>
            <v-form ref="requestForm" @submit.prevent="showSnipper">
              <p class="text-h5 text-center">Choose Your Hair Style</p>
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="clientData.clientHairStyle"
                    placeholder="Pick an hairstyle"
                    :rules="rules.style"
                    :items="snipsList"
                    auto-complete
                    outlined
                    required
                  >
                  </v-select>
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
    <SnipperViewDialog
      v-if="dataAvailable"
      :open-dialog="showSnipperDialog"
      :snipper-data="snipper"
      :snip-data="snip"
      :dialog-options="snipperViewDialogOptions"
      :other-data="snipperOthersData"
      @closeSnipperViewDialog="closeDialog"
      @switchSnipper="loadAnotherSnipper($event)"
      @makingRequest="makingRequest"
    />
  </div>
</template>

<script>
import SnipperViewDialog from '@/components/SnipperViewDialog'
export default {
  components: {
    SnipperViewDialog,
  },
  middleware: 'auth-client',
  asyncData({
    isDev,
    route,
    store,
    env,
    params,
    query,
    req,
    res,
    redirect,
    error,
    $axios,
  }) {
    return $axios
      .get('user/load/snips_name/')
      .then((res) => {
        const snipsData = res.data.data
        return { snipsList: snipsData }
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.log(e)
        store.dispatch('snackalert/showSnackbar', {
          msg: 'Error occurred while retrieving snips list',
          color: 'red',
        })
      })
  },
  data() {
    return {
      socket: null,
      showSnipperDialog: false,
      autocomplete: null,
      snipperViewDialogOptions: {
        disableCloseBtn: true,
        disableRequestBtn: true,
        disableSwitchBtn: true,
        switchColor: 'grey lighten-2',
        requestBtnLoading: false,
      },
      clientData: {
        clientLocation: this.$auth.user.address || null,
        clientHairStyle: null,
        // snipsList: [],
        nextDataIndex: 0,
      },
      loadingData: false,
      snipper: null,
      snip: null,
      dataAvailable: false,
      snipperOthersData: {
        totalSnippers: null,
        nextDataIndex: null,
        switchSnipperLoading: false,
      },
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
    this.socket = this.$nuxtSocket({
      name: 'main',
      persist: 'true',
    })
    this.socket.emit('user_connected', { user: this.$auth.user.username })

    this.socket.on('snipper_accept_job_offer', (msg, cb) => {
      if (
        this.$auth.user.type === 'Client' &&
        this.$auth.user.username === msg.to.username
      ) {
        this.requestStop()
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: msg.message,
          color: 'success',
        })
        this.snipperViewDialogOptions.disableCloseBtn = false
        this.snipperViewDialogOptions.disableRequestBtn = false
        this.snipperViewDialogOptions.disableSwitchBtn = false

        this.showSnipperDialog = false
        this.dataAvailable = false
        this.$router.push('/dashboard/client/orders')
      }
    })
    this.socket.on('snipper_reject_job_offer', (msg, cb) => {
      if (
        this.$auth.user.type === 'Client' &&
        this.$auth.user.username === msg.to.username
      ) {
        this.requestStop()
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: msg.message,
          color: 'red',
        })
        this.snipperViewDialogOptions.disableCloseBtn = false
        this.snipperViewDialogOptions.disableRequestBtn = false
        this.snipperViewDialogOptions.disableSwitchBtn = false

        this.snipperViewDialogOptions.switchColor = 'blue-grey lighten-1'
      }
    })
    this.socket.on('no_respond_from_snipper', (msg, cb) => {
      if (
        this.$auth.user.type === 'Client' &&
        this.$auth.user.username === msg.to.username
      ) {
        this.requestStop()
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: msg.message,
          color: 'red',
        })
        this.snipperViewDialogOptions.disableCloseBtn = false
        this.snipperViewDialogOptions.disableRequestBtn = false
        this.snipperViewDialogOptions.disableSwitchBtn = false
        this.snipperViewDialogOptions.switchColor = 'blue-grey lighten-1'
      }
    })
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
    makingRequest() {
      this.snipperViewDialogOptions.requestBtnLoading = true
      this.snipperViewDialogOptions.disableCloseBtn = true
      this.snipperViewDialogOptions.disableRequestBtn = true
      this.snipperViewDialogOptions.disableSwitchBtn = true
      /* setTimeout(() => {
        if (!this.noRespond) {
          this.requestStop()
        }
      }, 35000) */
    },
    requestStop() {
      this.snipperViewDialogOptions.requestBtnLoading = false
      this.snipperViewDialogOptions.disableCloseBtn = false
      this.snipperViewDialogOptions.disableRequestBtn = false
      this.snipperViewDialogOptions.disableSwitchBtn = false
    },
    closeDialog() {
      this.snipperOthersData.switchSnipperLoading = false
      this.snipperViewDialogOptions.switchColor = null
      this.showSnipperDialog = false
    },
    async loadAnotherSnipper(data) {
      this.snipperViewDialogOptions.disableCloseBtn = true
      this.snipperViewDialogOptions.disableRequestBtn = true
      this.snipperViewDialogOptions.disableSwitchBtn = true
      this.snipperViewDialogOptions.switchColor = 'blue-grey lighten-1'
      this.snipperOthersData.switchSnipperLoading = true

      this.clientData.nextDataIndex = data.data
      const valid = this.$refs.requestForm.validate()
      if (!valid) {
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: 'Please fix all the errors in your form first',
          color: 'red',
        })
      }
      try {
        const { data } = await this.$axios.post('user/load/snipper/', {
          data: this.clientData,
        })
        if (data.error) {
          this.$store.dispatch('snackalert/showSnackbar', {
            msg: data.msg,
            color: 'red',
          })
        } else {
          this.snipperOthersData.switchSnipperLoading = false
          this.snipper = data.snipper
          this.snip = data.snip
          this.snipperOthersData.totalSnippers = data.totalSnippers
          this.snipperOthersData.nextDataIndex = data.nextDataIndex
          this.snipperViewDialogOptions.disableCloseBtn = false
          this.snipperViewDialogOptions.disableRequestBtn = false
          this.snipperViewDialogOptions.disableSwitchBtn = false
        }
      } catch (error) {
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: 'Error occurred while processing your request. Please try again',
          color: 'red',
        })
      }
    },
    async showSnipper() {
      // eslint-disable-next-line no-console
      console.log(this.snipperViewDialogOptions)
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
        this.clientData.nextDataIndex = 0
        const { data } = await this.$axios.post('user/load/snipper/', {
          data: this.clientData,
        })
        if (data.error) {
          this.$store.dispatch('snackalert/showSnackbar', {
            msg: data.msg,
            color: 'red',
          })
        } else {
          this.showSnipperDialog = true
          this.dataAvailable = true
          this.snipper = data.snipper
          this.snip = data.snip
          this.snipperOthersData.totalSnippers = data.totalSnippers
          this.snipperOthersData.nextDataIndex = data.nextDataIndex
        }
      } catch (error) {
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: 'Error occurred while processing your request. Please try again',
          color: 'red',
        })
      }
      // eslint-disable-next-line no-console
      console.log(this.snipperViewDialogOptions)
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
