<template>
  <div>
    <v-carousel cycle :height="height" :width="width">
      <v-carousel-item
        v-for="(item, i) in items"
        :key="i"
        src="/img_d.jpg"
      ></v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    height: {
      type: Number,
      default: 300,
    },
    width: {
      type: Number,
      default: 100,
    },
  },
}
</script>

<style scoped></style>
