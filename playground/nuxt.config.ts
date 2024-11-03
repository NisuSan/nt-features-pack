import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineNuxtConfig({
  ssr: false,
  build: {
    transpile: [
      '@juggle/resize-observer',
      ...(process.env.NODE_ENV === 'production' ? [
        'naive-ui',
        'vueuc',
        '@css-render/vue3-ssr',
        '@hapi',
        '@sideway'
      ] : [])
    ]
  },
  vite: {
    optimizeDeps: {
      include: process.env.NODE_ENV === 'development' ? ['naive-ui', 'vueuc'] : [],
    },
    plugins: [
      Components({
        resolvers: [NaiveUiResolver()]
      }),
    ],
  },
  modules: ['../src/module'],
  ntFeaturesPack: {

  },
  devtools: { enabled: true },
  compatibilityDate: '2024-09-13',
})
