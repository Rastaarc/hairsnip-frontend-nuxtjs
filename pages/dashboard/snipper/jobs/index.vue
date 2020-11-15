<template>
  <div>
    <DataTableCard
      callee="jobs"
      :datatable="datatable"
      :title="title"
      :loading="loadingData"
      @updateSnipper="updateSnipper($event)"
      @showMap="showMap($event)"
    >
    </DataTableCard>
    <MapViewDialog
      :open-dialog="openMapViewDialog"
      :map-data="mapData"
      @closeMapViewDialog="closeMapViewDialog"
    />
  </div>
</template>

<script>
import DataTableCard from '@/components/DataTableCard'
import MapViewDialog from '@/components/MapViewDialog'

export default {
  middleware: 'auth-snipper',
  components: {
    DataTableCard,
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
    // eslint-disable-next-line no-console
    // console.log(data)
    // eslint-disable-next-line no-console
    // console.log(data.data)
    return {
      dt: data.data,
    }
  },
  data() {
    return {
      title: 'My Jobs',
      loadingData: false,
      openMapViewDialog: false,
      datatable: {
        headers: [
          { text: 'ID', value: 'id' },
          { text: 'Client', value: 'client' },
          { text: 'Details', value: 'details' },
          { text: 'Created On', value: 'created_on' },
          { text: 'Actions', value: 'actions' },
        ],
        items: this.fillDatatable,
        mapData: null,
      },
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
            client: d.client,
            created_on: d.created_on,
          })
        }
      }

      return dataHolder
    },
  },
  mounted() {
    this.datatable.items = this.fillDatatable
  },
  methods: {
    closeMapViewDialog() {
      this.openMapViewDialog = false
    },
    updateSnipper(item) {
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
      console.log("You're asking me to show map for jobs")
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
