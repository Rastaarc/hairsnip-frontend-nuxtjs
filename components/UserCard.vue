<template>
  <div>
    <v-row align="center" justify="center" align-items="center">
      <v-col cols="12" md="5" class="mx-auto">
        <v-card elevation="4">
          <v-sheet color="primary" elevation="0" height="150" tile> </v-sheet>
          <div style="margin-top: -65px;">
            <v-col align-self="center" cols="6" class="mx-auto text-center">
              <v-avatar size="106px">
                <v-img :src="userData.image_url"></v-img>
              </v-avatar>
            </v-col>
          </div>
          <div class="text-center">
            <v-row justify="center" align="center">
              <v-col cols="12" align-self="center">
                <p class="primary--text font-weight-bold text-h5">
                  {{ userData.username }}
                </p>
                <p
                  class="text-caption text--secondary font-weight-light"
                  style="margin-top: -15px;"
                >
                  {{ userData.email }}
                </p>
              </v-col>
            </v-row>
            <slot name="body"></slot>
            <v-row justify="center" align="center">
              <v-col cols="12" align-self="center" class="text--secondary">
                <v-icon small>mdi-map-marker-radius</v-icon>
                <span v-if="userData.address" class="text-caption"
                  >{{ userData.address }}
                </span>
                <span v-else class="text-caption">Unkown </span>
              </v-col>
            </v-row>
            <slot name="action"></slot>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    userData: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style scoped></style>
