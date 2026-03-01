export default defineNuxtPlugin(() => {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Bitcoin Time',
    url: 'https://bitcointime.date',
    description: 'Track time elapsed since the Bitcoin Genesis Block. Live BSV block height, halving countdown, and price.',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  })
  document.head.appendChild(script)
})
