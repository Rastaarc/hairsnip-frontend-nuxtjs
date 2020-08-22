<template>
  <v-bottom-navigation :color="mainColor" light grow app>
    <v-btn nuxt to="/" exact>
      <span>Home</span>
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-btn nuxt to="/dashboard" exact>
      <span>Dashboard</span>
      <v-icon>mdi-wrap</v-icon>
    </v-btn>
    <v-btn
      v-if="$auth.user.type === 'Snipper'"
      nuxt
      exact
      to="/dashboard/snipper/jobs"
    >
      <span>Jobs</span>
      <v-icon>mdi-bag-personal-outline</v-icon>
    </v-btn>
    <v-btn
      v-else-if="$auth.user.type === 'Client'"
      nuxt
      exact
      to="/dashboard/client/orders"
    >
      <span>My Orders</span>
      <v-icon>mdi-shopping</v-icon>
    </v-btn>
    <v-btn nuxt :to="user" exact>
      <span>Profile</span>
      <v-icon>mdi-account</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  props: {
    mainColor: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      user: '/profile',
    }
  },
}
</script>

<style scoped></style>
