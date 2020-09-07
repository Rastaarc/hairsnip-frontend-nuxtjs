import colors from 'vuetify/es5/util/colors'

export default {
  publicRuntimeConfig: {
    GMAP_API_KEY:
      process.env.GMAP_API_KEY ||
      'AIzaSyAbop4UCMioFxvy3C1sPreT8BpCQvZfsb0AIzaSyB2Cp-EadvDthMRaOcM2vszEMz9kiDa1MM',
  },
  privateRuntimeConfig: {},
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    titleTemplate: '%s - ' + 'Hairsnip',
    title: 'Hairsnip' || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src:
          'https://maps.googleapis.com/maps/api/js?key=AIzaSyB2Cp-EadvDthMRaOcM2vszEMz9kiDa1MM&libraries=places',
        defer: true,
      },
    ],
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt/content
    '@nuxt/content',
    '@nuxtjs/auth',
    'nuxt-socket-io',
  ],
  io: {
    sockets: [
      {
        name: 'main',
        url: process.env.SOCKET_URL || 'http://localhost:5000',
      },
    ],
  },
  /*
   *
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   *
   */
  axios: {
    baseURL: process.env.BASE_URL || 'http://localhost:5000/api/',
  },
  /*
   ** Content module configuration
   ** See https://content.nuxtjs.org/configuration
   */
  content: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      light: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        light: {
          primary: colors.lightBlue.darken3,
          accent: colors.lightBlue.darken3,
          secondary: colors.lightBlue.lighten4,
          info: colors.lightBlue.lighten2,
          warning: colors.yellow.lighten1,
          error: colors.red.accent3,
          success: colors.green.accent3,
        },
      },
    },
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},

  loading: {
    color: colors.blue.darken2,
    height: '6px',
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: 'auth/login/', method: 'post', propertyName: 'token' },
          logout: { url: 'auth/logout/', method: 'post' },
          user: { url: 'user/profile/', method: 'get', propertyName: 'user' },
        },
      },
    },
    redirect: {
      login: '/',
      logout: '/',
      callback: '/dashboard',
      home: '/',
    },
  },
}
