<template>
  <div>
    <v-card class="elevation-7">
      <v-card-text>
        <v-row>
          <v-col>
            <p>{{ title }}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="search"
              label="Search"
              append-icon="mdi-magnify"
              single-line
              hide-details
            ></v-text-field>
          </v-col>
          <v-spacer></v-spacer>
          <slot name="actionBtn"></slot>
        </v-row>
        <v-row>
          <v-col>
            <v-data-table
              :headers="datatable.headers"
              :items="datatable.items"
              :search="search"
              :loading="loading"
              show-expand
            >
              <template v-slot:item.actions="{ item }">
                <v-icon color="primary" @click="editItem(item)">
                  mdi-pencil
                </v-icon>
                <v-icon color="red" @click="deleteItem(item)">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    datatable: {
      type: Object,
      default: () => {},
    },
    title: {
      type: String,
      default: 'Data Table',
    },
    callee: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      search: '',
    }
  },
  methods: {
    editItem(item) {
      if (this.callee === 'snips') {
        this.$emit('updateSnip', { item })
      } else if (this.callee === 'clients') {
        this.$emit('updateClient', { item })
      } else if (this.callee === 'snippers') {
        this.$emit('updateSnipper', { item })
      }
    },
    deleteItem(item) {
      if (this.callee === 'snips') {
        this.$emit('deleteSnip', { item })
      } else if (this.callee === 'clients') {
        this.$emit('deleteClient', { item })
      } else if (this.callee === 'snippers') {
        this.$emit('deleteSnipper', { item })
      }
    },
  },
}
</script>

<style scoped></style>
