import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    defaults: {
      VBtn: {
        rounded: 'sm'
      },
      VCard: {
        rounded: 'sm'
      },
      VTextField: {
        color: 'primary',
        variant: 'outlined'
      }
    },
    theme: {
      defaultTheme: 'sesLight',
      themes: {
        sesLight: {
          dark: false,
          colors: {
            primary: '#009b77',
            secondary: '#249464',
            accent: '#d58b28',
            error: '#c2413f',
            info: '#346fb7',
            success: '#249464',
            warning: '#d58b28',
            background: '#f7f8fb',
            surface: '#ffffff'
          }
        }
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
