<template>
  <v-dialog v-model="openDialog" :width="width" persistent>
    <v-card>
      <v-card-text class="mt-5">
        <v-row align="center" justify="center" align-content="center">
          <v-col align-self="center" cols="12">
            <h3 class="text-center text-h5 primary--text">
              Snippers in your Area
            </h3>
          </v-col>
          <v-col align-self="center" cols="12" class="text-center">
            <v-avatar size="150">
              <v-img :src="snipperData.image_url" />
            </v-avatar>
          </v-col>
          <v-col align-self="center" cols="12" class="text-center">
            <div class="text-center">
              <p class="primary--text text-h5">{{ snipperData.username }}</p>
              <p class="text-caption-2 text-center" style="margin-top: -15px;">
                <v-icon small>mdi-map-marker-radius</v-icon>
                {{ snipperData.address }}
              </p>
            </div>
          </v-col>
          <v-col align-self="center" cols="12" class="text-center">
            <v-btn
              color="primary"
              text
              rounded
              outlined
              small
              :loading="waitingForSnipperRespond"
              @click="sendRequestToSnipper"
              >MAKE REQUEST</v-btn
            ><br /><br />
            <v-btn
              color="grey lighten-2"
              text
              rounded
              outlined
              x-small
              :loading="loadingNewSnipper"
              @click="closeDialog"
              >SWITCH SNIPPER</v-btn
            >
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          color="primary acent-3"
          target="_blank"
          :to="`/profile/${snipperData.username.toLowerCase()}`"
          >View Profile</v-btn
        >
        <v-btn text color="red acent-3" @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    openDialog: {
      type: Boolean,
      default: false,
    },
    snipperData: {
      type: Object,
      default: () => {},
    },
    snipData: {
      type: Object,
      default: () => {},
    },
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
      waitingForSnipperRespond: false,
      loadingNewSnipper: false,
    }
  },
  computed: {},
  mounted() {
    this.socket = this.$nuxtSocket({})
    this.socket.on('snipper_accept_job_offer', (msg, cb) => {
      // eslint-disable-next-line no-console
      console.log(msg)
    })
    this.socket.on('snipper_reject_job_offer', (msg, cb) => {
      // eslint-disable-next-line no-console
      console.log(msg)
    })
  },
  methods: {
    closeDialog() {
      this.$emit('closeSnipperViewDialog')
    },
    sendRequestToSnipper() {
      this.waitingForSnipperRespond = true
      this.socket.emit('new_job_alert', {
        client: this.$auth.user,
        snip: this.snipData,
        to: this.snipperData.id,
      })
    },
  },
}
</script>

<style scoped></style>
