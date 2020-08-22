<template>
  <div>
    <DataTableCard
      callee="snips"
      :datatable="datatable"
      :title="title"
      :loading="loadingData"
      @updateSnip="updateSnip($event)"
      @deleteSnip="deleteSnip($event)"
    >
      <template v-slot:actionBtn>
        <div>
          <v-btn text outlined color="primary" @click="showNewSnipDialog">
            <v-icon small left>mdi-plus</v-icon> Add New
          </v-btn>
        </div>
      </template>
    </DataTableCard>
    <NewSnipDialog
      :show-dialog="showSnipDialog"
      @closeSnipDialog="closeDialog"
      @refreshData="updateSnipsTable"
    />
  </div>
</template>

<script>
import DataTableCard from '@/components/DataTableCard'
import NewSnipDialog from '@/components/NewSnipDialog'
export default {
  middleware: 'auth-admin',
  components: {
    DataTableCard,
    NewSnipDialog,
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
    const { data } = await $axios.get('admin/get/snips/')
    return {
      dt: data.data,
    }
  },
  data() {
    return {
      title: 'Snips Management',
      showSnipDialog: false,
      loadingData: false,
      datatable: {
        headers: [
          {
            text: 'ID',
            value: 'id',
          },
          {
            text: 'Snips',
            value: 'name',
          },
          {
            text: 'Price',
            value: 'price',
          },
          {
            text: 'Description',
            value: 'description',
          },
          {
            text: 'Created On',
            value: 'created',
          },
          {
            text: 'Actions',
            value: 'actions',
          },
        ],
        items: this.fillDatatable,
      },
    }
  },
  computed: {
    fillDatatable() {
      const datatableSnip = []
      for (const d of this.dt) {
        datatableSnip.push({
          id: d.id,
          name: d.name,
          price: d.price,
          description: d.description,
          created: d.created,
        })
      }
      return datatableSnip
    },
  },
  mounted() {
    this.datatable.items = this.fillDatatable
    this.socket = this.$nuxtSocket({
      channel: '/admin',
    })
    this.socket.on('updateSnipsUI', () => {
      // eslint-disable-next-line no-console
      console.log('update snip')
      this.updateSnipsTable()
    })
  },
  methods: {
    async updateSnip(item) {
      const resp = await this.$axios.post('admin/update/snip/', {
        item: item.item.id,
      })
      // eslint-disable-next-line no-console
      console.log(resp)
    },
    deleteSnip(item) {
      // eslint-disable-next-line no-console
      console.log(item)
    },
    async updateSnipsTable() {
      this.loadingData = true
      const { data } = await this.$axios.get('admin/get/snips/')
      const datatableSnip = []
      for (const d of data.data) {
        datatableSnip.push({
          id: d.id,
          name: d.name,
          price: d.price,
          description: d.description,
          created: d.created,
          action: '',
        })
      }
      this.loadingData = false
      this.datatable.items = datatableSnip
    },
    showNewSnipDialog() {
      this.showSnipDialog = true
    },
    closeDialog() {
      this.showSnipDialog = false
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
