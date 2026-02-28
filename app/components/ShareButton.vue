<template>
  <div class="mt-6 flex justify-center">
    <UButton
      :label="shareButtonText"
      icon="i-lucide-share-2"
      size="lg"
      variant="outline"
      class="neon-button-ui"
      @click="share"
    />
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
    const dateText = jsDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    text = `On ${dateText}, it was Year ${decimalYears} before Bitcoin, no blocks yet #bitcointime www.bitcointime.date`
  } else {
    const timeText = isNegative ? `Year ${decimalYears} before Bitcoin` : `Year ${decimalYears} in Bitcoin time`
    const block = props.displayBlockHeight !== null && props.displayBlockHeight !== undefined
      ? props.displayBlockHeight.toLocaleString()
      : 'N/A'

    if (props.hasSelectedDate) {
      const dateText = jsDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
      text = `On ${dateText}, it was ${timeText} at block ${block} #bitcointime www.bitcointime.date`
    } else {
      text = `It is currently ${timeText} at block ${block} #bitcointime www.bitcointime.date`
    }
  }

  if (navigator.share) {
    navigator.share({ text }).catch(() => {
      openTwitter(text)
    })
  } else {
    openTwitter(text)
  }
}

function openTwitter(text: string): void {
  const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`
  window.open(tweetUrl, '_blank', 'noopener,noreferrer')
}
</script>

<style scoped>
.neon-button-ui {
  border-color: var(--neon-pink) !important;
  color: var(--neon-pink) !important;
  font-family: 'Orbitron', sans-serif;
  text-shadow: 0 0 5px var(--neon-pink);
  transition: all 0.3s ease;
}

.neon-button-ui:hover {
  background: rgba(255, 0, 128, 0.2) !important;
  box-shadow: 0 0 15px var(--neon-pink);
  transform: scale(1.05);
}
</style>
