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
              :loading-text="loadingText"
            >
              <template v-slot:item.actions="{ item }">
                <v-menu bottom left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon color="primary">
                        mdi-dots-vertical
                      </v-icon></v-btn
                    >
                  </template>
                  <v-list>
                    <v-list-item v-for="(mItem, i) in menuItems" :key="i">
                      <!-- <v-list-item-icon>
                        <v-icon small color="primary">{{ mItem.icon }}</v-icon>
                      </v-list-item-icon> -->
                      <v-list-item-content>
                        <v-list-item-title>
                          <v-btn
                            text
                            small
                            color="primary"
                            @click="action(item, mItem.text.toLowerCase())"
                            ><v-icon left dark>{{ mItem.icon }}</v-icon
                            >{{ mItem.text }}
                          </v-btn></v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
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
    loadingText: {
      type: String,
      default: 'Loading...... Please wait',
    },
  },
  data() {
    return {
      search: '',
      usersMenuItem: [
        { text: 'Map', icon: 'mdi-map' },
        { text: 'Details', icon: 'mdi-pencil' },
        { text: 'Delete', icon: 'mdi-delete' },
      ],
      adminMenuItem: [
        { text: 'Details', icon: 'mdi-pencil' },
        { text: 'Edit', icon: 'mdi-pencil' },
        { text: 'Delete', icon: 'mdi-delete' },
      ],
    }
  },
  computed: {
    menuItems() {
      if (
        !['clients', 'snippers', 'snips', 'jobs-admin'].includes(this.callee)
      ) {
        return this.usersMenuItem
      } else {
        return this.adminMenuItem
      }
    },
  },
  methods: {
    action(item, name) {
      const actionData = {
        callee: this.callee,
        data: item,
        owner: this.$auth.user.username,
      }
      switch (name) {
        case 'map':
          this.$emit('showMap', actionData)
          break

        default:
          break
      }
    },
  },
}
</script>

<style scoped>
.v-list-item__content {
  padding: 0;
}
.v-list-item {
  min-height: 38px;
}
</style>
