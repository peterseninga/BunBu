import { repositoryName, apiEndpoint } from './slicemachine.config.json';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  components: [
    '~/components',
    '~/slices'
  ],

  app: {
    head: {
      title: 'Prismic + Nuxt Minimal Starter',
      htmlAttrs: {
        lang: 'de',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-favicon.png' }
      ],
    }
  },

  css: ['@fontsource-variable/mulish', '@fontsource/marcellus', '~/assets/style.css'],

  modules: ['@nuxt/eslint', '@nuxtjs/prismic', '@nuxtjs/tailwindcss'],
  
  prismic: {
    endpoint: apiEndpoint || repositoryName,
    preview: '/api/preview',
    clientConfig: {
      routes: [
        {
          type: 'page',
          path: '/:uid',
        },
        {
          type: 'page',
          uid: 'home',
          path: '/',
        },
      ]
    }
  },

  compatibilityDate: '2025-07-16',
})