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
                <p
                  class="text-center primary--text font-weight-bold text-uppercase"
                >
                  Snips Details
                </p>
                <p class="primary--text">
                  Snip: <span class="font-weight-bold"> {{ snipName }} </span>
                </p>
                <p class="primary--text">
                  Price: <span class="font-weight-bold"> {{ snipPrice }} </span>
                </p>
                <p class="primary--text">
                  Description:
                  <span class="font-weight-bold"> {{ snipDescription }} </span>
                </p>
              </v-col>
              <v-col md="6" align-self="center">
                <template v-if="ordersPage">
                  <div>
                    <p
                      class="text-center primary--text font-weight-bold text-uppercase"
                    >
                      snipper data
                    </p>

                    <p class="primary--text">
                      Username:
                      <span class="font-weight-bold">
                        {{ snipperUsername }}
                      </span>
                    </p>
                    <p class="primary--text">
                      Phone:
                      <span class="font-weight-bold">
                        {{ snipperPhone }}
                      </span>
                    </p>
                    <p class="primary--text">
                      Address:
                      <span class="font-weight-bold">
                        {{ snipperAddress }}
                      </span>
                    </p>
                  </div>
                </template>
                <template v-else>
                  <div>
                    <p
                      class="text-center primary--text font-weight-bold text-uppercase"
                    >
                      client data
                    </p>
                    <p class="primary--text">
                      Username:
                      <span class="font-weight-bold">
                        {{ clientUsername }}
                      </span>
                    </p>
                    <p class="primary--text">
                      Phone:
                      <span class="font-weight-bold">
                        {{ clientPhone }}
                      </span>
                    </p>
                    <p class="primary--text">
                      Address:
                      <span class="font-weight-bold">
                        {{ clientAddress }}
                      </span>
                    </p>
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
      locMarker: null,
      geoL: null,
    }
  },
  computed: {
    snipData() {
      try {
        return this.mapData.data.others.snip
      } catch (error) {
        return null
      }
    },
    snipName() {
      try {
        return this.mapData.data.others.snip.name
      } catch (error) {
        return null
      }
    },
    snipPrice() {
      try {
        return this.mapData.data.others.snip.price
      } catch (error) {
        return null
      }
    },
    snipDescription() {
      try {
        return this.mapData.data.others.snip.description
      } catch (error) {
        return null
      }
    },
    clientUsername() {
      try {
        return this.mapData.data.others.client.username
      } catch (error) {
        return null
      }
    },
    clientPhone() {
      try {
        return this.mapData.data.others.client.phone
      } catch (error) {
        return null
      }
    },
    clientAddress() {
      try {
        return this.mapData.data.others.client.address
      } catch (error) {
        return null
      }
    },
    snipperUsername() {
      try {
        return this.mapData.data.others.snipper.username
      } catch (error) {
        return null
      }
    },
    snipperPhone() {
      try {
        return this.mapData.data.others.snipper.phone
      } catch (error) {
        return null
      }
    },
    snipperAddress() {
      try {
        return this.mapData.data.others.snipper.address
      } catch (error) {
        return null
      }
    },
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
      try {
        const mapHolder = document.getElementById('mapHolder')
        // const mapHolder2 = this.$refs.map
        // eslint-disable-next-line no-console
        // console.log(mapHolder)
        // eslint-disable-next-line no-console
        // console.log(mapHolder2)
        let mapCenter = null
        let address = null

        if (this.ordersPage) {
          address = this.snipperAddress // snipper location
        } else {
          address = this.$auth.user.address // client location
        }

        // eslint-disable-next-line no-undef
        this.geoL = new google.maps.Geocoder()
        this.geoL.geocode({ address }, (res, status) => {
          if (status === 'OK') {
            mapCenter = res[0].geometry.location
            // eslint-disable-next-line no-undef
            this.gMap = new google.maps.Map(mapHolder, {
              center: mapCenter,
              zoom: 19,
            })
            // eslint-disable-next-line no-undef
            this.locMarker = new google.maps.Marker({
              position: mapCenter,
              map: this.gMap,
            })
          } else {
            this.$store.dispatch('snackalert/showSnackbar', {
              msg:
                'Failed to load Google Geocoding API correctly. Please try again',
              color: 'red',
            })
          }
        })

        // if (this.ordersPage) {
        //   // eslint-disable-next-line no-undef
        //   this.snipperGMarker = new google.maps.Marker({
        //     position: mapCenter,
        //     map: this.gMap,
        //   })
        // } else {
        //   // eslint-disable-next-line no-undef
        //   this.clientGMarker = new google.maps.Marker({
        //     position: mapCenter,
        //     map: this.gMap,
        //   })
        // }
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
  height: 300px;
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
