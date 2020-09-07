<template>
  <div>
    <DataTableCard
      callee="jobs"
      :datatable="datatable"
      :title="title"
      :loading="loadingData"
    >
      <template v-slot:actionBtn>
        <div>
          <v-btn text outlined color="primary" @click="showNewSnipDialog">
            <v-icon small left>mdi-plus</v-icon> Add New
          </v-btn>
        </div>
      </template>
    </DataTableCard>
  </div>
</template>

<script>
import DataTableCard from '@/components/DataTableCard'

export default {
  middleware: 'auth-admin',
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
    const { data } = await $axios.get('admin/get/jobs/')
    // eslint-disable-next-line no-console
    console.log(data)
    // eslint-disable-next-line no-console
    console.log(data.data)
    return {
      dt: data.data,
    }
  },
  data() {
    return {
      title: 'Requests Management',
      loadingData: false,
      datatable: {
        headers: [
          { text: 'ID', value: 'id' },
          { text: 'Client', value: 'client' },
          { text: 'Snipper', value: 'snipper' },
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
            snipper: d.snipper,
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
    async updateDataTable() {
      this.loadingData = true
      const { data } = await this.$axios.get('admin/get/jobs/')
      const dataHolder = []
      if (data.data) {
        for (const d of data.data) {
          dataHolder.push({
            id: d.id,
            details: d.purpose,
            snipper: d.snipper,
            client: d.client,
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
