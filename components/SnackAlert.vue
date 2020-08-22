<template>
  <v-snackbar v-model="snackbar" multi-line :color="color">
    {{ text }}
  </v-snackbar>
</template>

<script>
export default {
  computed: {
    snackbar: {
      get() {
        return this.$store.getters['snackalert/getSnackbar']
      },
      set() {
        this.$store.commit('snackalert/updateSnackbar', false)
      },
    },
    color() {
      return this.$store.getters['snackalert/getColor']
    },
    text() {
      return this.$store.getters['snackalert/getText']
    },
  },
}
</script>

<style scoped></style>
