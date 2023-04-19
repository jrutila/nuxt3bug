// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  hooks: {
    "vite:extendConfig": (config, { isClient }) => {
      // @ts-ignore
      if (isClient) config.resolve.alias.vue = "vue/dist/vue.esm-bundler.js"
    },
  },
})
