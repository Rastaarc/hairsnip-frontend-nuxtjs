<template>
  <div>
    <DataTableCard
      callee="jobs"
      :datatable="datatable"
      :title="title"
      :loading="loadingData"
      @updateSnipper="updateSnipper($event)"
    >
    </DataTableCard>
  </div>
</template>

<script>
import DataTableCard from '@/components/DataTableCard'

export default {
  middleware: 'auth-snipper',
  components: {
    DataTableCard,
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
      datatable: {
        headers: [
          { text: 'ID', value: 'id' },
          { text: 'Client', value: 'client' },
          { text: 'Details', value: 'details' },
          { text: 'Created On', value: 'created_on' },
          { text: 'Actions', value: 'actions' },
        ],
        items: this.fillDatatable,
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
  },
  head() {
    return {
      title: this.title,
    }
  },
}
</script>

<style scoped></style>
