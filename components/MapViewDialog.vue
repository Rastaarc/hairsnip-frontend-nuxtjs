<template>
  <v-dialog v-model="openDialog" :width="dialogWidth" persistent eager>
    <v-card>
      <v-card-text>
        <v-row align="center" align-items="center">
          <v-col align-self="center" cols="12">
            <div id="mapHolder" ref="map" class="map"></div>
          </v-col>
          <v-col align-self="center" cols="12">
            <v-row>
              <v-col md="6" align-self="center">
                Snips Details
              </v-col>
              <v-col md="6" align-self="center">
                <template v-if="ordersPage">
                  <div>
                    snipper data
                  </div>
                </template>
                <template v-else>
                  <div>
                    client data
                  </div>
                </template>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
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
    openDialog: {
      type: Boolean,
      default: false,
    },
    dialogWidth: {
      type: Number,
      default: 500,
    },
    mapData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      gMap: null,
      clientGMarker: null,
      snipperGMarker: null,
    }
  },
  computed: {
    ordersPage() {
      try {
        if (this.mapData.callee === 'orders') {
          return true
        }
      } catch (error) {
        return false
      }
      return false
    },
    userOpenDialog() {
      return this.openDialog
    },
  },
  watch: {
    openDialog(n, o) {
      // eslint-disable-next-line no-console
      console.log(`Value of Open Dialog changed: OLD: ${o}, NEW: ${n}`)
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.userOpenDialog) {
        // eslint-disable-next-line no-console
        console.log('dialog is opened')
      } else {
        // eslint-disable-next-line no-console
        console.log('dialog not yet opened')
      }
      try {
        const mapHolder = document.getElementById('mapHolder')
        const mapHolder2 = this.$refs.map
        // eslint-disable-next-line no-console
        console.log(mapHolder)
        // eslint-disable-next-line no-console
        console.log(mapHolder2)
        let mapCenter = null
        const snipperLoc = { lat: -34.397, lng: 150.644 }
        const clientLoc = { lat: -50.397, lng: 150.644 }
        if (this.ordersPage) {
          mapCenter = snipperLoc // snipper location
        } else {
          mapCenter = clientLoc // client location
        }
        // eslint-disable-next-line no-undef
        this.gMap = new google.maps.Map(mapHolder, {
          center: mapCenter,
          zoom: 17,
        })

        // eslint-disable-next-line no-undef
        this.clientGMarker = new google.maps.Marker({
          position: clientLoc,
          map: this.gMap,
        })
        // eslint-disable-next-line no-undef
        this.snipperGMarker = new google.maps.Marker({
          position: snipperLoc,
          map: this.gMap,
        })
        // eslint-disable-next-line no-console
        console.log(this.snipperGMarker)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
        this.$store.dispatch('snackalert/showSnackbar', {
          msg:
            'Failed to load Google Map API correctly. Please try again by reloading the page',
          color: 'red',
        })
      }
    })
  },
  methods: {
    closeDialog() {
      this.$emit('closeMapViewDialog')
    },
  },
}
</script>

<style scoped>
.map {
  height: 350px;
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
