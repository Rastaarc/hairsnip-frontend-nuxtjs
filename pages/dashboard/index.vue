<template>
  <div>Dashboard</div>
</template>

<script>
export default {
  middleware: ['authenticate'],
  mounted() {
    if (this.$auth.user.type === 'Admin') {
      this.$router.push('/dashboard/admin')
    }
  },
  head() {
    return {
      title: 'Dashboard',
    }
  },
}
</script>

<style scoped></style>
