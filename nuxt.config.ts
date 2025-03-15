const baseURL = process.env.BASE_URL || '/'
const docsUrl = 'https://elevista.github.io/n-divide/'
export default defineNuxtConfig({
  ssr: false,
  dev: true,
  app: {
    baseURL,
    buildAssetsDir: '/nuxt/',
    head: {
      htmlAttrs: { lang: 'ko-KR' },
      title: 'N분',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover' },
        { hid: 'description', name: 'description', content: '복잡한 N분의1 정산 계산기' },
        { hid: 'og:title', property: 'og:title', content: 'N분' },
        { hid: 'og:description', property: 'og:description', content: '복잡한 N분의1 정산 계산기' },
        { hid: 'og:image', property: 'og:image', content: `${docsUrl}/icons/icon-512-maskable.png` },
        { hid: 'og:url', property: 'og:url', content: docsUrl },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: `${baseURL}icons/icon-192.png`, sizes: '192x192' },
        { rel: 'icon', type: 'image/png', href: `${baseURL}icons/icon-512.png`, sizes: '512x512' },
        { rel: 'shortcut icon', href: `${baseURL}favicon.ico` },
        { rel: 'apple-touch-icon', sizes: '180x180', href: `${baseURL}icons/apple-touch-icon.png` },
        { rel: 'manifest', href: `${baseURL}${baseURL === '/' ? 'site.webmanifest' : 'docs.webmanifest'}` },
      ],
    },
  },

  alias: {
    utils: '/utils',
  },

  vite: {
    css: {
      preprocessorOptions: {
        less: {
          additionalData: '@import "assets/variables.less";',
        },
      },
    },
  },

  quasar: {
    plugins: ['Notify'],
  },

  modules: ['@unocss/nuxt', 'nuxt-quasar-ui'],
  compatibilityDate: '2024-11-30',

  devtools: {
    enabled: true,
  },

  typescript: {
    typeCheck: true,
  },
})
