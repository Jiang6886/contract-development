export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
    '~/assets/styles/main.css'
  ],
  build: {
    transpile: ['vuetify']
  },
  modules: [],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'
    }
  },
  vite: {
    ssr: {
      noExternal: ['vuetify']
    }
  }
})
