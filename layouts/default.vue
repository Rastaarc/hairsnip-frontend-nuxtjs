<template>
  <v-app light>
    <AppBar :main-color="mainColor" />
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <LoginDialog />
    <SignupDialog />
    <SnackAlert />
    <BottomNavBar v-if="showBottomNavbar" :main-color="mainColor" />
    <Footer />
  </v-app>
</template>

<script>
import LoginDialog from '~/components/LoginDialog'
import BottomNavBar from '~/components/BottomNavBar'
import AppBar from '~/components/AppBar'
import Footer from '~/components/Footer'
import SignupDialog from '~/components/SignupDialog'
import SnackAlert from '~/components/SnackAlert'

export default {
  components: {
    LoginDialog,
    BottomNavBar,
    AppBar,
    Footer,
    SignupDialog,
    SnackAlert,
  },
  data() {
    return {
      mainColor: 'primary',
      mobile: this.$vuetify.breakpoint.width <= 700,
    }
  },
  computed: {
    serverMode() {
      if (process.server) {
        return true
      } else {
        return false
      }
    },
    isMobile() {
      return this.$vuetify.breakpoint.width <= 700
    },
    showBottomNavbar() {
      if (this.isMobile && this.$auth.loggedIn) {
        return true
      } else {
        return false
      }
    },
    xSmall() {
      return this.$vuetify.breakpoint.width <= 400
    },
  },
  methods: {},
}
</script>

<style>
a {
  text-decoration: none;
}
.v-application .elevation-2 {
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.13),
    0px 2px 2px 0px rgba(0, 0, 0, 0.05), 0px 1px 5px 0px rgba(0, 0, 0, 0.03) !important;
}
@media only screen and (max-width: 600px) {
  html {
    font-size: 12px;
  }
}
</style>
