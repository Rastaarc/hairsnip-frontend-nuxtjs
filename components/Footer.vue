<template>
  <v-footer fixed="fixed" class="primary" color="grey lighten-5" absolute app>
    <v-col>
      <span
        >&copy; {{ new Date().getFullYear() }} HairSnip. All Right Reserved.
      </span>
      <span>
        <nuxt-link to="/termsandprivacy">Privacy and Terms</nuxt-link></span
      >,
      <span>
        <nuxt-link to="/cookies"> Cookies</nuxt-link>
      </span>
    </v-col>
    <!--<v-col></v-col>-->
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      fixed: false,
    }
  },
}
</script>

<style scoped></style>
