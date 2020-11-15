<template>
  <v-dialog v-model="showDialog" width="400" persistent>
    <v-card>
      <v-card-text>
        <v-row justify="center" align="center">
          <v-col align-self="center">
            <p class="primary--text text-h5 text-center font-weight-bold">
              ADD NEW SNIP
            </p>
          </v-col>
        </v-row>
        <v-form @submit.prevent="addNewSnip">
          <v-row>
            <v-col>
              <v-text-field
                v-model="snip.name"
                :rules="formRules.snipNameRules"
                label="Name"
                counter="30"
                outlined
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="snip.price"
                :rules="formRules.snipPriceRules"
                counter="30"
                type="number"
                label="Price"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                v-model="snip.description"
                :rules="formRules.snipDescRules"
                counter="250"
                label="Description"
                auto-grow
                outlined
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row align="center" justify="center" class="mb-4 text-center">
            <v-col cols="12">
              <v-btn
                :loading="loading"
                outlined
                rounded
                color="primary"
                type="submit"
                :disabled="disabled"
              >
                Add Snip
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
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
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      disabled: false,
      loading: false,
      snip: {
        name: '',
        price: '',
        description: '',
      },
      formRules: {
        snipNameRules: [
          (v) => !!v || 'Name is required',
          (v) => v.length <= 30 || 'Maximum length is 30',
        ],
        snipPriceRules: [
          (v) => !!v || 'Price is required',
          (v) => /\d{3,30}/.test(v) || 'Please enter a valid price',
        ],
        snipDescRules: [
          (v) => !!v || 'Description is required',
          (v) => v.length <= 250 || 'Maximum length is 250',
        ],
      },
    }
  },
  computed: {},
  mounted() {
    this.socket = this.$nuxtSocket({
      channel: '/admin',
    })
  },
  methods: {
    clearFormFields() {
      this.snip.name = ''
      this.snip.price = ''
      this.snip.description = ''
    },
    closeDialog() {
      this.clearFormFields()
      this.$emit('closeSnipDialog')
    },
    async addNewSnip() {
      this.loading = true
      const resp = await this.$axios.post('admin/add/snip/', {
        snip: this.snip,
      })
      if (resp.data.success) {
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: resp.data.msg,
          color: 'success',
        })
        this.$emit('refreshData')
        this.socket.emit('updateSnips')
      } else {
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: resp.data.msg,
          color: 'red',
        })
      }
      this.loading = false
      this.closeDialog()
    },
  },
}
</script>

<style scoped></style>
