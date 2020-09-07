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
    <ClientViewDialog
      v-if="newJobAlert"
      :snip-data="snip"
      :client-data="client"
      :socket-client-id="socketClientId"
      :open-dialog="showNewJobAlert"
      @closeClientViewDialog="removeNewJobAlert"
    />
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
import ClientViewDialog from '~/components/ClientViewDialog'

export default {
  components: {
    LoginDialog,
    BottomNavBar,
    AppBar,
    Footer,
    SignupDialog,
    SnackAlert,
    ClientViewDialog,
  },
  data() {
    return {
      socketClientId: null,
      socket: null,
      mainColor: 'primary',
      mobile: this.$vuetify.breakpoint.width <= 700,
      user: 'guest-user-io',
      snip: null,
      client: null,
      newJobAlert: false,
      showNewJobAlert: false,
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
  mounted() {
    this.socket = this.$nuxtSocket({
      name: 'main',
      persist: 'true',
    })
    if (this.$auth.loggedIn) {
      this.user = this.$auth.user.username
    }
    this.socket.on('connect', (msg, cb) => {
      // eslint-disable-next-line no-console
      console.log(`I'm connected to SocketIO with ID ${this.socket.id}`)
      // this.socket.emit('user_connected', { user: this.user })
    })
    // this.socket.emit('user_connected', { user: this.user })
    this.socket.on('disconnect', (msg, cb) => {
      // eslint-disable-next-line no-console
      console.log(`I'm disconnected from SocketIO`)
      // this.socket.emit('user_disconnected', { user: this.user })
      this.socket.open()
    })
    this.socket.on('job_alert', (msg, cb) => {
      if (
        this.$auth.user.type === 'Snipper' &&
        this.$auth.user.username === msg.to.username
      ) {
        // eslint-disable-next-line no-console
        console.log(`Job Alert`)
        // eslint-disable-next-line no-console
        console.log(msg)
        this.snip = msg.snip
        this.client = msg.client
        this.socketClientId = msg.id
        this.showNewJobAlert = true
        this.newJobAlert = true
      }
    })
    this.socket.on('accept_job_offer', (msg, cb) => {
      if (
        this.$auth.user.type === 'Snipper' &&
        this.$auth.user.username === msg.from.username
      ) {
        // eslint-disable-next-line no-console
        console.log(`Job Accepted by you`)
        // eslint-disable-next-line no-console
        console.log(msg)
        this.$store.dispatch('snackalert/showSnackbar', {
          msg: 'Job Accepted by you successfully',
          color: 'success',
        })
        this.showNewJobAlert = false
        this.newJobAlert = false
        this.$router.push('/dashboard/snipper/jobs')
      }
    })
  },
  methods: {
    removeNewJobAlert() {
      this.newJobAlert = false
      this.showNewJobAlert = false
      this.socket.emit('new_job_alert_reject', { for: 'client' })
    },
  },
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
