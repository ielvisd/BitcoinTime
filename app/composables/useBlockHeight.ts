import { ref, type Ref, type ComputedRef, computed } from 'vue'
import { getLocalTimeZone } from '@internationalized/date'
import { GENESIS_TIMESTAMP, type BitcoinTimeData } from './useBitcoinTime'
import type { CalendarDate } from '@internationalized/date'

interface ChainInfo {
  blocks: number
  headers: number
  bestblockhash: string
  chain: string
}

interface BlockHeader {
  time: number
  height: number
  hash: string
}

export interface UseBlockHeightReturn {
  currentBlockHeight: Ref<number | null>
  selectedBlockHeight: Ref<number | null>
  displayBlockHeight: ComputedRef<number | null>
  fetchCurrentBlockHeight: (retryCount?: number) => Promise<void>
  getBlockHeightForTimestamp: (targetTimestamp: number) => Promise<number>
  updateBlockHeightForDate: (selectedDate: CalendarDate | null, hour: number, minute: number) => Promise<void>
}

export function useBlockHeight(
  bitcoinTime: ComputedRef<BitcoinTimeData>,
  selectedDate: Ref<CalendarDate | null>,
): UseBlockHeightReturn {
  const currentBlockHeight = ref<number | null>(null)
  const selectedBlockHeight = ref<number | null>(null)

  const displayBlockHeight = computed<number | null>(() => {
    if (bitcoinTime.value.isBeforeGenesis) return 0
    if (selectedDate.value && selectedBlockHeight.value !== null) return selectedBlockHeight.value
    return currentBlockHeight.value
  })

  async function fetchCurrentBlockHeight(retryCount = 0): Promise<void> {
    try {
      const response = await $fetch<ChainInfo>(
        'https://api.whatsonchain.com/v1/bsv/main/chain/info',
        { timeout: 5000 },
      )
      currentBlockHeight.value = response.blocks
    } catch (error) {
      console.error(`Error fetching block height (attempt ${retryCount + 1}):`, error)
      if (retryCount < 5) {
        setTimeout(() => fetchCurrentBlockHeight(retryCount + 1), 2000)
      } else {
        currentBlockHeight.value = null
        console.warn('Failed to fetch block height after retries')
      }
    }
  }

  async function getBlockHeightForTimestamp(targetTimestamp: number): Promise<number> {
    if (!targetTimestamp || targetTimestamp < GENESIS_TIMESTAMP) return 0

    const secondsFromGenesis = targetTimestamp - GENESIS_TIMESTAMP
    const estimatedHeight = Math.floor(secondsFromGenesis / 600)

    let low = Math.max(0, estimatedHeight - 1000)
    let high = estimatedHeight + 1000
    let closestHeight = estimatedHeight
    let closestDiff = Infinity
    let iteration = 0

    while (low <= high && iteration < 20) {
      const mid = Math.floor((low + high) / 2)
      try {
        const response = await $fetch<BlockHeader>(
          `https://api.whatsonchain.com/v1/bsv/main/block/height/${mid}`,
        )
        const blockTimestamp = response.time
        const diff = Math.abs(blockTimestamp - targetTimestamp)

        if (diff < closestDiff) {
          closestDiff = diff
          closestHeight = mid
        }

        if (blockTimestamp < targetTimestamp) {
          low = mid + 1
        } else {
          high = mid - 1
        }
      } catch {
        high = mid - 1
      }
      iteration++
    }

    try {
      await $fetch<BlockHeader>(
        `https://api.whatsonchain.com/v1/bsv/main/block/height/${closestHeight}`,
      )
      return closestHeight
    } catch {
      return estimatedHeight
    }
  }

  async function updateBlockHeightForDate(
    date: CalendarDate | null,
    hour: number,
    minute: number,
  ): Promise<void> {
    if (!date) {
      selectedBlockHeight.value = null
      await fetchCurrentBlockHeight()
      return
    }

    const jsDate = date.toDate(getLocalTimeZone())
    jsDate.setHours(hour || 0, minute || 0, 0)
    const targetTimestamp = Math.floor(jsDate.getTime() / 1000)
    selectedBlockHeight.value = await getBlockHeightForTimestamp(targetTimestamp)
  }

  return {
    currentBlockHeight,
    selectedBlockHeight,
    displayBlockHeight,
    fetchCurrentBlockHeight,
    getBlockHeightForTimestamp,
    updateBlockHeightForDate,
  }
}
