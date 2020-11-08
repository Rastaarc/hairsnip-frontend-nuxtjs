<template>
  <div>
    <DataTableCard
      callee="orders"
      :datatable="datatable"
      :title="title"
      :loading="loadingData"
      @updateClient="updateClient($event)"
    >
    </DataTableCard>
    <PaymentViewDialog
      :open-dialog="openPaymentDialog"
      :payment-data="paymentData"
      @closePaymentModeViewDialog="closePaymentModeViewDialog"
    >
    </PaymentViewDialog>
  </div>
</template>

<script>
import DataTableCard from '@/components/DataTableCard'
import PaymentViewDialog from '@/components/PaymentViewDialog'

export default {
  middleware: 'auth-client',
  components: {
    DataTableCard,
    PaymentViewDialog,
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
      datatable: {
        headers: [
          { text: 'ID', value: 'id' },
          { text: 'Snipper', value: 'snipper' },
          { text: 'Detail', value: 'details' },
          { text: 'Created On', value: 'created_on' },
          { text: 'Actions', value: 'actions' },
        ],
        items: this.fillDatatable,
      },
      paymentData: null,
    }
  },
  computed: {
    fillDatatable() {
      const dataHolder = []
      if (this.dt) {
        for (const d of this.dt) {
          dataHolder.push({
            id: d.id,
            details: d.purpose,
            snipper: d.snipper,
            created_on: d.created_on,
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
  },
  head() {
    return {
      title: this.title,
    }
  },
}
</script>

<style scoped></style>
