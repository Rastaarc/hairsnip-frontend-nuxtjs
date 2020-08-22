<template>
  <div>
    <DataTableCard
      callee="snippers"
      :datatable="datatable"
      :title="title"
      :loading="loadingData"
    >
      <template v-slot:actionBtn>
        <div>
          <v-btn text outlined color="primary" @click="showNewSnipperDialog"
            ><v-icon small left>mdi-plus</v-icon> Add New</v-btn
          >
        </div>
      </template>
    </DataTableCard>
    <NewUserDialog
      callee="Snipper"
      :show-dialog="showSnipperDialog"
      @closeSnipperDialog="closeDialog"
      @refreshData="updateSnippersTable"
    />
    {{ dt }}
  </div>
</template>

<script>
import DataTableCard from '@/components/DataTableCard'
import NewUserDialog from '@/components/NewUserDialog'
export default {
  middleware: 'auth-admin',
  components: {
    DataTableCard,
    NewUserDialog,
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
    const { data } = await $axios.get('admin/get/snippers/')
    return {
      dt: data.data,
    }
  },
  data() {
    return {
      title: 'Snippers Management',
      showSnipperDialog: false,
      loadingData: false,
      datatable: {
        headers: [
          { text: 'ID', value: 'id' },
          { text: 'Snippers', value: 'username' },
          { text: 'Email', value: 'email' },
          { text: 'Contact Phone', value: 'phone' },
          { text: 'Email Verification', value: 'e_verify' },
          { text: 'Documents Verification', value: 'docs_verify' },
          { text: 'Actions', value: 'actions' },
        ],
        items: this.fillDatatable,
      },
    }
  },
  computed: {
    fillDatatable() {
      const dataHolder = []
      for (const d of this.dt) {
        dataHolder.push({
          id: d.id,
          username: d.username,
          email: d.email,
          phone: d.phone,
          e_verify: d.verified1,
          docs_verify: d.verified2,
        })
      }
      return dataHolder
    },
  },
  mounted() {
    this.datatable.items = this.fillDatatable
  },
  methods: {
    async updateSnippersTable() {
      this.loadingData = true
      const { data } = await this.$axios.get('admin/get/snippers/')
      const dataHolder = []
      for (const d of data.data) {
        dataHolder.push({
          id: d.id,
          username: d.username,
          email: d.email,
          phone: d.phone,
          e_verify: d.verified1,
          docs_verify: d.verified2,
        })
      }
      this.loadingData = false
      this.datatable.items = dataHolder
    },
    showNewSnipperDialog() {
      this.showSnipperDialog = true
    },
    closeDialog() {
      this.showSnipperDialog = false
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
