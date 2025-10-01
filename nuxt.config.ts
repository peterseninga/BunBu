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
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
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

  runtimeConfig: {
    public: {
      WEBSITE_NAME_EN: process.env.WEBSITE_NAME_EN,
      WEBSITE_ADDRESS: process.env.WEBSITE_ADDRESS,
      API_BASE_URL: process.env.API_BASE_URL,
    },
  },

  ssr: true,
  nitro: {
    baseURL: "http://localhost:3000",
    prerender: {
      crawlLinks: true,
      failOnError: false, 
    },
  },
  routeRules: {
    "/**": { swr: true },
    "/dashboard/**": { ssr: false },
  },
})