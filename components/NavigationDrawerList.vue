<template>
  <div>
    <v-sheet color="primary">
      <v-row align="center" justify="center" class="pt-3">
        <v-col cols="9" class="mx-auto text-center">
          <v-avatar size="130px">
            <v-img :src="avatar"></v-img>
          </v-avatar>
        </v-col>
        <v-col cols="12" class="mt-0">
          <div class="white--text text-center">
            <span class="text-h5 font-weight-bold">
              {{ user }} <br />
              <span class="subtitle-2">{{ userType }}</span>
            </span>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
    <v-divider></v-divider>
    <v-list class="primary--text">
      <v-list-item
        v-for="(item, i) in itemToDisplay"
        :key="i"
        :to="item.to"
        router
        exact
      >
        <v-list-item-action>
          <v-icon color="primary">{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title class="primary--text" v-text="item.title" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      items: [
        {
          icon: 'mdi-wrap',
          title: 'Dashboard',
          to: '/dashboard',
          for: 'all',
        },
        {
          icon: 'mdi-tag',
          title: 'Snips',
          to: '/dashboard/admin/snips',
          for: 'admin',
        },
        {
          icon: 'mdi-card-account-details',
          title: 'Snippers',
          to: '/dashboard/admin/snippers',
          for: 'admin',
        },
        {
          icon: 'mdi-card-account-details-star',
          title: 'Clients',
          to: '/dashboard/admin/clients',
          for: 'admin',
        },
        {
          icon: 'mdi-shopping',
          title: 'Requests',
          to: '/dashboard/admin/requests',
          for: 'admin',
        },
        {
          icon:
            this.$auth.user.type === 'Admin'
              ? 'mdi-shield-account'
              : 'mdi-account',
          title: 'Profile',
          to: `/profile`,
          for: 'all',
        },
        {
          icon: 'mdi-shopping',
          title: 'My Orders',
          to: '/dashboard/client/orders',
          for: 'client',
        },
        {
          icon: 'mdi-bag-personal-outline',
          title: 'My Jobs',
          to: '/dashboard/snipper/jobs',
          for: 'snipper',
        },
        {
          icon: 'mdi-file-compare',
          title: 'Documents',
          to: '/dashboard/snipper/documents',
          for: 'snipper',
        },
        {
          icon: 'mdi-card-bulleted',
          title: 'Payments',
          to: '/payments',
          for: 'client-snipper',
        },
        {
          icon: 'mdi-cog',
          title: 'Settings',
          to: '/settings',
          for: 'all',
        },
        {
          icon: 'mdi-help-circle',
          title: 'Get Help',
          to: '/howto',
          for: 'client-snipper',
        },
      ],
    }
  },
  computed: {
    avatar() {
      return this.$auth.user.image_url
    },
    user() {
      return this.$auth.user.username.toUpperCase()
    },
    userType() {
      return this.$auth.user.type
    },
    itemToDisplay() {
      if (this.userType === 'Client') {
        return this.items.filter(
          (v) =>
            v.for === 'client' || v.for === 'client-snipper' || v.for === 'all'
        )
      } else if (this.userType === 'Snipper') {
        return this.items.filter(
          (v) =>
            v.for === 'snipper' || v.for === 'client-snipper' || v.for === 'all'
        )
      } else if (this.userType === 'Admin') {
        return this.items.filter((v) => v.for === 'admin' || v.for === 'all')
      } else {
        return this.items
      }
    },
  },
}
</script>

<style scoped>
.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  color: #f5f5f5db !important;
}
</style>
