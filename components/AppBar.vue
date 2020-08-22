<template>
  <span>
    <v-navigation-drawer
      v-if="showNavDrawer"
      v-model="drawer"
      :permanent="showDesktop"
      :mini-variant="mini"
      fixed
      app
    >
      <NavigationDrawerList v-if="$auth.loggedIn" />
      <template v-if="userLoggedIn" v-slot:append>
        <v-col cols="6" class="mb-4 mx-auto pa-2">
          <v-btn color="primary" @click="logout"
            ><v-icon>mdi-power</v-icon> Logout</v-btn
          >
        </v-col>
      </template>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      :color="appBarColor"
      flat
      elevation="2"
      light
    >
      <v-app-bar-nav-icon
        v-if="showMobileNav"
        :color="mainColor"
        @click.stop="drawer = !drawer"
      />
      <!--
      <v-btn v-else @click="mini = !mini">
        mini
      </v-btn>
      -->
      <v-toolbar-title>
        <nuxt-link to="/">
          <v-img :src="logo" height="25px" width="96px" />
        </nuxt-link>
      </v-toolbar-title>
      <v-spacer />
      <!--
      <div v-if="userLoading">
        <v-btn loading text></v-btn>
      </div>
      -->
      <div>
        <div v-if="!userLoggedIn" d-flex>
          <v-btn
            outlined
            :color="mainColor"
            :small="smallBtn"
            :x-small="xSmallScreen"
            @click="openSignupDialog"
          >
            Signup
          </v-btn>
          <v-btn
            outlined
            :color="mainColor"
            :small="smallBtn"
            @click="openLoginDialog"
          >
            Login
          </v-btn>
        </div>
        <div v-else>
          <v-btn
            v-if="$auth.user.type === 'Client'"
            text
            color="primary"
            to="/request"
            :x-small="xSmall"
            >Request</v-btn
          >
          <v-badge
            dot
            offset-x="20"
            offset-y="18"
            color="red"
            overlap
            :value="showNotificationBadge"
          >
            <v-btn color="primary" icon :x-small="xSmall">
              <v-icon>mdi-bell</v-icon>
            </v-btn>
          </v-badge>
        </div>
      </div>
    </v-app-bar>
  </span>
</template>

<script>
import NavigationDrawerList from '~/components/NavigationDrawerList'
export default {
  components: {
    NavigationDrawerList,
  },
  props: {
    mainColor: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      loadingUser: true,
      mini: false,
      clipped: false,
      fixed: false,
      miniVariant: false,
      title: 'HairSnip',
      appBarColor: '#fff',
      logo: '/hairsnip_logo.png',
      smallBtn: true,
      mobile: this.$vuetify.breakpoint.width <= 700,
      xSmallScreen: this.$vuetify.breakpoint.name === 'xs',
      registerDialog: false,
      drawer: false,
    }
  },
  computed: {
    xSmall() {
      return this.$vuetify.breakpoint.width <= 400
    },
    showDesktop() {
      return this.$vuetify.breakpoint.width > 700
    },
    showNavDrawer() {
      if (this.mobile1 || this.$auth.loggedIn) {
        return true
      } else {
        return false
      }
    },
    showNotificationBadge() {
      return true
    },
    userLoggedIn() {
      return this.$auth.loggedIn
    },
    mobile1() {
      return this.$vuetify.breakpoint.width <= 700
    },
    showMobileNav() {
      if (this.mobile1 && this.userLoggedIn) {
        return true
      } else {
        return false
      }
    },
  },
  mounted() {},
  methods: {
    /*
    async userLoading() {
      const user = await this.$auth.user
      if (user) return false
    },
    */
    openLoginDialog() {
      this.$store.commit('dialog/updateLoginDialog', {
        dState: true,
      })
    },
    openSignupDialog() {
      this.$store.commit('dialog/updateSignupDialog', {
        dState: true,
      })
    },
    updateMobile() {
      this.mobile = this.$vuetify.breakpoint.width <= 700
    },
    async logout() {
      try {
        const response = await this.$auth.logout()
        // eslint-disable-next-line no-console
        console.log(response)
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: 'Logout successfully',
          color: 'success',
        })
      } catch (error) {
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: error,
          color: 'red',
        })
      }
    },
  },
}
</script>

<style scoped></style>
