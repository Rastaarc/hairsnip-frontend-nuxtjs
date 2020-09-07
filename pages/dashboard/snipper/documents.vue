<template>
  <div>
    <DataTableCard
      callee="documents"
      :datatable="datatable"
      :title="title"
      :loading="loadingData"
    >
      <template v-slot:actionBtn>
        <div>
          <v-btn text outlined color="primary" @click="showNewDocumentDialog"
            ><v-icon small left>mdi-plus</v-icon> Add New</v-btn
          >
        </div>
      </template>
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
    const { data } = await $axios.get('user/get/documents/')
    return {
      dt: data.data,
    }
  },
  data() {
    return {
      title: 'Documents Management',
      showDocumentDialog: false,
      loadingData: false,
      datatable: {
        headers: [
          { text: 'ID', value: 'id' },
          { text: 'Purpose', value: 'purpose' },
          { text: 'Verification Status', value: 'doc_status' },
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
            purpose: d.purpose,
            doc_status: d.doc_status,
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
    async updateDatatable() {
      this.loadingData = true
      const { data } = await this.$axios.get('user/get/documents/')
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
    showNewDocumentDialog() {
      this.showDocumentDialog = true
    },
    closeDialog() {
      this.showDocumentDialog = false
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
