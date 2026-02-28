export default defineNuxtPlugin(() => {
  // Vercel Web Analytics - inject script tag directly
  const script = document.createElement('script')
  script.defer = true
  script.dataset.sdkn = '@vercel/analytics'
  script.dataset.sdkv = '1.6.1'
  script.src = '/_vercel/insights/script.js'
  document.head.appendChild(script)
})
