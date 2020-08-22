<template>
  <div>
    <DataTableCard
      callee="clients"
      :datatable="datatable"
      :title="title"
      :loading="loadingData"
    >
      <template v-slot:actionBtn>
        <div>
          <v-btn text outlined color="primary" @click="showNewClientDialog"
            ><v-icon small left>mdi-plus</v-icon> Add New</v-btn
          >
        </div>
      </template>
    </DataTableCard>
    <NewUserDialog
      callee="Client"
      :show-dialog="showClientDialog"
      @closeClientDialog="closeDialog"
      @refreshData="updateClientsTable"
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
    const { data } = await $axios.get('admin/get/clients/')
    return {
      dt: data.data,
    }
  },
  data() {
    return {
      title: 'Clients Management',
      showClientDialog: false,
      loadingData: false,
      datatable: {
        headers: [
          { text: 'ID', value: 'id' },
          { text: 'Clients', value: 'username' },
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
    async updateClientsTable() {
      this.loadingData = true
      const { data } = await this.$axios.get('admin/get/clients/')
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
    showNewClientDialog() {
      this.showClientDialog = true
    },
    closeDialog() {
      this.showClientDialog = false
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
