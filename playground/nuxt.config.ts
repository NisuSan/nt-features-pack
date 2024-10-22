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
    joi: { messages: {
      base: {
        'any.required': 'Це поле є обов\'язковим для заповнення',
        'string.pattern.base': 'Це поле повинно містити лише літери, пробіли та апостроф',
        'string.empty': 'Це поле є обов\'язковим для заповнення',
        'number.base': 'Це поле повинно містити лише цифри',
        'number.positive': 'Це поле повинно містити лише числа більше за нуль',
      },
      validators: {
        'string-cyrillic': { 'string.pattern.base': 'Це поле повинно міститити лише кириличні літери, пробіли та апостроф' },
        'string-latin': { 'string.pattern.base': 'Це поле повинно містити лише латинські літери та пробіли' },
      }
    }}
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-09-13',
})
