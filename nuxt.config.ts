// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/ui",
    "@nuxtjs/supabase",
    "@nuxtjs/device",
    "@nuxtjs/seo",
    'nuxt-resend'
  ],
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      include: ["/admin(/*)?"],
      exclude: [],
      saveRedirectToCookie: false,
    },
  },

  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
  },

  site: {
    url: "https://bowofade.com",
    name: "My Supanuxt",
  },

  ui: {
    colorMode: false,
  },
});
