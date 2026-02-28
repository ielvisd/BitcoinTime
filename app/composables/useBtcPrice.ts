import { ref, onMounted, onUnmounted, type Ref } from 'vue'

interface CoinGeckoResponse {
  'bitcoin-cash-sv': {
    usd: number
  }
}

export interface UseBsvPriceReturn {
  price: Ref<number | null>
  loading: Ref<boolean>
}

export function useBtcPrice(): UseBsvPriceReturn {
  const price = ref<number | null>(null)
  const loading = ref(true)
  let intervalId: ReturnType<typeof setInterval> | null = null

  async function fetchPrice(): Promise<void> {
    try {
      const data = await $fetch<CoinGeckoResponse>(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin-cash-sv&vs_currencies=usd',
        { timeout: 5000 },
      )
      price.value = data['bitcoin-cash-sv'].usd
    } catch (error) {
      console.error('Error fetching BSV price:', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    if (import.meta.client) {
      fetchPrice()
      intervalId = setInterval(fetchPrice, 60000) // Refresh every 60s
    }
  })

  onUnmounted(() => {
    if (intervalId) clearInterval(intervalId)
  })

  return { price, loading }
}
