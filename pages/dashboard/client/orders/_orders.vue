<template>
  <div>
    <DataTableCard
      callee="orders"
      :datatable="datatable"
      :title="title"
      :loading="loadingData"
      @updateClient="updateClient($event)"
      @showMap="showMap($event)"
    >
    </DataTableCard>
    <PaymentViewDialog
      :open-dialog="openPaymentDialog"
      :payment-data="paymentData"
      @closePaymentModeViewDialog="closePaymentModeViewDialog"
    >
    </PaymentViewDialog>
    <MapViewDialog
      :open-dialog="openMapViewDialog"
      :map-data="mapData"
      @closeMapViewDialog="closeMapViewDialog"
    />
  </div>
</template>

<script>
import DataTableCard from '@/components/DataTableCard'
import PaymentViewDialog from '@/components/PaymentViewDialog'
import MapViewDialog from '@/components/MapViewDialog'

export default {
  middleware: 'auth-client',
  components: {
    DataTableCard,
    PaymentViewDialog,
    MapViewDialog,
  },
  async asyncData({
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
    const { data } = await $axios.get('user/get/jobs/')
    return {
      dt: data.data,
    }
  },
  data() {
    return {
      title: 'My Orders',
      loadingData: false,
      openPaymentDialog: false,
      openMapViewDialog: false,
      datatable: {
        headers: [
          { text: 'ID', value: 'id' },
          { text: 'Snipper', value: 'snipper' },
          { text: 'Snip', value: 'snip' },
          { text: 'Created On', value: 'created_on' },
          { text: 'Actions', value: 'actions' },
        ],
        items: this.fillDatatable,
      },
      paymentData: null,
      mapData: null,
    }
  },
  computed: {
    fillDatatable() {
      const dataHolder = []
      if (this.dt) {
        for (const d of this.dt) {
          dataHolder.push({
            id: d.id,
            snip: d.snip_data.name,
            snipper: d.snipper,
            created_on: d.created_on,
            others: {
              snip: d.snip_data,
              client: d.client_data,
              snipper: d.snipper_data,
            },
          })
        }
      }

      return dataHolder
    },
  },
  mounted() {
    this.datatable.items = this.fillDatatable

    if (this.$route.params.data) {
      this.paymentData = this.$route.params.data
      this.openPaymentDialog = true
    }
  },
  methods: {
    closeMapViewDialog() {
      this.openMapViewDialog = false
    },
    closePaymentModeViewDialog() {
      this.openPaymentDialog = false
    },
    updateClient(item) {
      // eslint-disable-next-line no-console
      console.log(item)
    },
    async updateDataTable() {
      this.loadingData = true
      const { data } = await this.$axios.get('user/get/jobs/')
      const dataHolder = []
      if (data.data) {
        for (const d of data.data) {
          dataHolder.push({
            id: d.id,
            purpose: d.purpose,
            doc_status: d.doc_status,
            created_on: d.created_on,
          })
        }
      }
      this.loadingData = false
      this.datatable.items = dataHolder
    },
    showMap(data) {
      // eslint-disable-next-line no-console
      console.log("You're asking me to show map for orders")
      // eslint-disable-next-line no-console
      console.log(data)
      // eslint-disable-next-line no-console
      console.log(this.$auth.user.username)
      if (this.$auth.user.username === data.owner) {
        this.mapData = data
        this.openMapViewDialog = true
      }
    },
  },
  head() {
    return {
      title: this.title,
    }
  },
}
</script>

<style scoped></style>
