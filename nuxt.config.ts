// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['@/assets/css/main.css'],

  app: {
    head: {
      title: 'Bitcoin Time — Track Time Since Genesis',
      htmlAttrs: { lang: 'en' },
      link: [
        {
          rel: 'icon',
          type: 'image/jpeg',
          href: '/favicon.ico',
        },
        {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.jpg',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Orbitron:wght@400;500;600;700&display=swap',
        },
      ],

      meta: [
        { name: 'description', content: 'Track time elapsed since the Bitcoin Genesis Block (January 3, 2009). View Bitcoin time in years, months, days, and more. Live block height from the BSV blockchain.' },
        { name: 'theme-color', content: '#0a0a0f' },
        { property: 'og:title', content: 'Bitcoin Time — Track Time Since Genesis' },
        { property: 'og:description', content: 'Track time elapsed since the Bitcoin Genesis Block. Live block height, halving countdown, and BSV price ticker.' },
        { property: 'og:url', content: 'https://bitcointime.date' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Bitcoin Time' },
        { property: 'og:image', content: 'https://bitcointime.date/og-image.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://bitcointime.date/og-image.jpg' },
        { name: 'twitter:title', content: 'Bitcoin Time — Track Time Since Genesis' },
        { name: 'twitter:description', content: 'Track time elapsed since the Bitcoin Genesis Block. Live block height, halving countdown, and BSV price ticker.' },
      ],
    },
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@vite-pwa/nuxt',
  ],

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Bitcoin Time',
      short_name: 'BitcoinTime',
      description: 'Track time elapsed since the Bitcoin Genesis Block',
      theme_color: '#0a0a0f',
      background_color: '#0a0a0f',
      display: 'standalone',
      icons: [
        {
          src: '/icon-192.jpg',
          sizes: '192x192',
          type: 'image/jpeg',
        },
        {
          src: '/icon-512.jpg',
          sizes: '512x512',
          type: 'image/jpeg',
        },
        {
          src: '/icon-512.jpg',
          sizes: '512x512',
          type: 'image/jpeg',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: false,
    },
  },
})
