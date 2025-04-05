// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura';
import tailwindcss from "@tailwindcss/vite";
const primeui = require('tailwindcss-primeui');

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['@/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: [
    '@nuxtjs/supabase',
    '@primevue/nuxt-module',
    '@nuxtjs/i18n',
    '@morev/vue-transitions/nuxt',
    '@nuxt/content',
    '@i2d/nuxt-pdf-frame'
  ],
  nitro: {
    replace: {
      // replace the browser detection in a server lib
      'globalThis.navigator': 'node',
      "global.navigator": 'node',
    },
  },
  content: {
    build: {
      markdown: {
        highlight: {
          // Theme used in all color schemes.
          // theme: 'github-light',
          // OR
          theme: {
            // Default theme (same as single string)
            default: 'github-light',
            // Theme used if `html.dark`
            dark: 'github-dark',
            // Theme used if `html.sepia`
            sepia: 'monokai'
          }
        }
      }
    }
  },
  supabase: {
    redirectOptions: {
      login: '/',
      callback: '/confirm',
      exclude: ['*'],
      saveRedirectToCookie: false,
    },
  },
  i18n: {
    locales: [
      {
        code: 'pt',
        name: 'Português (BR)',
        file: 'pt.json'
      },
    ],
    lazy: true,
    defaultLocale: 'pt',
  },
  primevue: {
    options: {  
      ripple: true,
      inputVariant: 'filled',
      theme: {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: '.p-dark',
          cssLayer: false
        },
      }
    },
    components: {
      include: '*', // Include all components
    },
    directives: {
      include: '*', // Include all directives
    }
  },
  runtimeConfig: {
    public: {
      url: process.env.URL,
      databaseID: process.env.DATABASE,
      npcCollectionID: process.env.NPCS,
      itemsCollectionID: process.env.ITEMS,
      combatsCollectionID: process.env.COMBATS,
      initiativeCollectionID: process.env.INITIATIVE,
      USER_ID: process.env.USER_ID
    },
    deepseekUrl: process.env.DEEPSEEK_URL,
    deepseekKey: process.env.DEEPSEEK_API_KEY,
  },
});