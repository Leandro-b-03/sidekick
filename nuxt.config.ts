// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura';
import tailwindcss from "@tailwindcss/vite";
const primeui = require('tailwindcss-primeui');

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: [
    'nuxt-appwrite',
    '@nuxtjs/supabase',
    '@primevue/nuxt-module',
    '@nuxtjs/i18n',
    '@morev/vue-transitions/nuxt',
  ],
  nitro: {
    replace: {
      // replace the browser detection in a server lib
      'globalThis.navigator': 'node',
      "global.navigator": 'node',
    },
  },
  appwrite: {
    endpoint: process.env.APPWRITE_URL,
    project: process.env.APPWRITE_PROJECT
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