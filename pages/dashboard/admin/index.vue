<template>
  <div>Admin</div>
</template>

<script>
export default {
  middleware: 'auth-admin',
  data() {
    return {
      socket: null,
    }
  },
  mounted() {
    this.socket = this.$nuxtSocket({})
    this.socket.on('check', (data) => {
      // eslint-disable-next-line no-console
      console.log(data)
    })
  },
  head() {
    return {
      title: 'Admin Dashboard',
    }
  },
}
</script>

<style scoped></style>
