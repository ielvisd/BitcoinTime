<template>
  <ClientOnly>
    <Analytics />
    <div class="min-h-screen flex items-center justify-center futuristic-bg">
      <div class="w-full max-w-md p-4 sm:p-6 glass-card">
        <h1
          class="text-2xl sm:text-3xl font-orbitron font-bold text-center mb-6 neon-pink cursor-pointer"
          @click="handleReset"
        >
          Bitcoin Time
        </h1>

        <BitcoinTimeDisplay
          :formatted-date="formattedDate"
          :bitcoin-time-text="bitcoinTimeText"
          :display-block-height="displayBlockHeight"
          :is-before-genesis="bitcoinTime.isBeforeGenesis"
          @cycle="cycleDisplayMode"
        />

        <HalvingCountdown :current-block-height="currentBlockHeight" />

        <DateTimePicker
          v-model="selectedDate"
          :hour="selectedHour"
          :minute="selectedMinute"
          @update:hour="onHourChange"
          @update:minute="onMinuteChange"
          @update:model-value="onDateChange"
        />

        <ShareButton
          :bitcoin-time="bitcoinTime"
          :display-block-height="displayBlockHeight"
          :has-selected-date="selectedDate !== null"
        />

        <PriceTicker :price="price" :loading="priceLoading" />

        <div class="mt-4 text-center text-xs" style="color: var(--text-tertiary);">
          Powered by <a href="https://www.whatsonchain.com" target="_blank" rel="noopener noreferrer" class="underline" style="color: var(--text-secondary);">Whatsonchain</a>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Analytics } from '@vercel/analytics/vue'
import { useBitcoinTime } from '~/composables/useBitcoinTime'
import { useBlockHeight } from '~/composables/useBlockHeight'
import { useBtcPrice } from '~/composables/useBtcPrice'
import type { CalendarDate } from '@internationalized/date'

const {
  currentTime,
  selectedDate,
  selectedHour,
  selectedMinute,
  bitcoinTime,
  formattedDate,
  bitcoinTimeText,
  cycleDisplayMode,
  resetToCurrentTime,
  startLiveClock,
} = useBitcoinTime()

const {
  currentBlockHeight,
  displayBlockHeight,
  fetchCurrentBlockHeight,
  updateBlockHeightForDate,
} = useBlockHeight(bitcoinTime, selectedDate)

const { price, loading: priceLoading } = useBtcPrice()

onMounted(() => {
  if (import.meta.client) {
    startLiveClock()
    fetchCurrentBlockHeight()
  }
})

function handleReset(): void {
  resetToCurrentTime()
  fetchCurrentBlockHeight()
}

async function onDateChange(value: CalendarDate | null): Promise<void> {
  selectedDate.value = value
  if (!value) {
    currentTime.value = Date.now()
  }
  await updateBlockHeightForDate(value, selectedHour.value, selectedMinute.value)
}

async function onHourChange(value: number): Promise<void> {
  selectedHour.value = value
  if (selectedDate.value) {
    await updateBlockHeightForDate(selectedDate.value, value, selectedMinute.value)
  }
}

async function onMinuteChange(value: number): Promise<void> {
  selectedMinute.value = value
  if (selectedDate.value) {
    await updateBlockHeightForDate(selectedDate.value, selectedHour.value, value)
  }
}
</script>

<style scoped>
.font-orbitron {
  font-family: 'Orbitron', sans-serif;
}
</style>
