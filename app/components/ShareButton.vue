<template>
  <div class="share-wrapper">
    <button class="share-btn" @click="share">
      {{ shareButtonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BitcoinTimeData } from '~/composables/useBitcoinTime'

const props = defineProps<{
  bitcoinTime: BitcoinTimeData
  displayBlockHeight: number | null
  hasSelectedDate: boolean
}>()

const shareButtonText = computed(() => {
  if (import.meta.server) return 'Share'
  return navigator.share ? 'Share' : 'Share to X'
})

function share(): void {
  const { decimalYears, isNegative, isBeforeGenesis, jsDate } = props.bitcoinTime
  let text: string

  if (isBeforeGenesis) {
    const dateText = jsDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    text = `On ${dateText}, it was Year ${decimalYears} before Bitcoin, no blocks yet #bitcointime www.bitcointime.date`
  } else {
    const timeText = isNegative ? `Year ${decimalYears} before Bitcoin` : `Year ${decimalYears} in Bitcoin time`
    const block = props.displayBlockHeight !== null && props.displayBlockHeight !== undefined
      ? props.displayBlockHeight.toLocaleString()
      : 'N/A'

    if (props.hasSelectedDate) {
      const dateText = jsDate.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      text = `On ${dateText}, it was ${timeText} at block ${block} #bitcointime www.bitcointime.date`
    } else {
      text = `It is currently ${timeText} at block ${block} #bitcointime www.bitcointime.date`
    }
  }

  if (navigator.share) {
    navigator.share({ text }).catch(() => openTwitter(text))
  } else {
    openTwitter(text)
  }
}

function openTwitter(text: string): void {
  window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
}
</script>

<style scoped>
.share-wrapper {
  width: 100%;
}

.share-btn {
  background: transparent;
  border: 1px solid rgba(255, 79, 254, 0.15);
  color: var(--text-secondary);
  padding: 0.4rem 0;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.share-btn:hover {
  border-color: rgba(255, 79, 254, 0.3);
  color: var(--accent);
}
</style>
