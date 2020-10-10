export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'jobsity_exercise',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://unpkg.com/ionicons@4.5.10-0/dist/css/ionicons.min.css'
      }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/buefy
    'nuxt-buefy',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://www.npmjs.com/package/nuxt-vuex-localstorage
    [
      'nuxt-vuex-localstorage',
      {
        // We want to save only the reminders store into localStorage
        localStorage: ['reminders']
      }
    ]
  ],

  buefy: {
    materialDesignIcons: false,
    defaultIconPack: 'ionicons',
    customIconPacks: {
      ionicons: {
        sizes: {
          default: 'is-size-5',
          'is-small': '',
          'is-medium': 'is-size-3',
          'is-large': 'is-size-1'
        },
        iconPrefix: 'ion-md-',
        internalIcons: {
          check: 'checkmark',
          information: 'information',
          'check-circle': 'checkmark-circle-outline',
          alert: 'alert',
          'alert-circle': 'alert',
          'arrow-up': 'arrow-up',
          'chevron-right': 'arrow-forward',
          'chevron-left': 'arrow-back',
          'chevron-down': 'arrow-down',
          eye: 'eye',
          'eye-off': 'eye-off',
          'menu-down': 'arrow-dropdown',
          'menu-up': 'arrow-dropup',
          'close-circle': 'close-circle-outline'
        }
      }
    }
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {}
}
