<template>
  <v-dialog v-model="openDialog" :width="width" persistent>
    <v-card>
      <v-card-text class="mt-5">
        <v-row align="center" justify="center" align-content="center">
          <v-col align-self="center" cols="12">
            <h3 class="mt-5 text-center text-h5 primary--text">
              New Job Alert
            </h3>
          </v-col>
          <v-col align-self="center" cols="12" class="text-center">
            <v-avatar size="150">
              <v-img :src="clientData.image_url" />
            </v-avatar>
          </v-col>
          <v-col align-self="center" cols="12" class="text-center">
            <div class="text-center">
              <p class="primary--text text-h5">{{ clientData.username }}</p>
              <p class="text-caption-2 text-center" style="margin-top: -15px;">
                <v-icon small>mdi-map-marker-radius</v-icon>
                {{ clientData.address }}
              </p>
            </div>
          </v-col>
          <v-col align-self="center" cols="12" class="text-center">
            <p>Snip: {{ snipData.name }}</p>
            <p>Charges: {{ snipData.price }}</p>
          </v-col>
          <v-col align-self="center" cols="12" class="text-center">
            <v-btn
              color="green"
              text
              rounded
              outlined
              small
              @click="acceptRequest"
              >ACCCEPT</v-btn
            >
            <v-btn
              color="red acent-3"
              text
              rounded
              outlined
              small
              @click="rejectRequest"
              >REJECT</v-btn
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
          :to="`/profile/${clientData.username.toLowerCase()}`"
          >View Profile</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    socketClientId: {
      type: String,
      default: '',
    },
    openDialog: {
      type: Boolean,
      default: false,
    },
    clientData: {
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
      socket: null,
    }
  },
  computed: {},
  mounted() {
    this.socket = this.$nuxtSocket({
      name: 'main',
      persist: 'true',
    })
    // eslint-disable-next-line no-console
    console.log(this.socketClientId)
  },
  methods: {
    acceptRequest() {
      this.socket.emit('new_job_alert_accepted', {
        to: this.clientData,
        from: this.$auth.user,
        snip: this.snipData,
        sid: this.socketClientId,
      })
      this.closeDialog()
    },
    rejectRequest() {
      this.socket.emit('new_job_alert_rejected', {
        to: this.clientData,
        from: this.$auth.user,
        snip: this.snipData,
      })
      this.closeDialog()
    },
    closeDialog() {
      this.$emit('closeClientViewDialog')
    },
  },
}
</script>

<style scoped></style>
