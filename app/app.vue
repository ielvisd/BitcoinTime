<!-- src/App.vue -->
<template>
  <ClientOnly>
    <div class="min-h-screen flex items-center justify-center futuristic-bg">
      <div class="w-full max-w-md p-6 glass-card">
        <h1 class="text-3xl font-orbitron font-bold text-center mb-6 neon-pink">Bitcoin Time</h1>

        <div class="text-center font-mono font-semibold cursor-pointer hover:bg-gray-900 p-3 rounded-lg transition-all glow-border" @click="cycleDisplayMode">
          <div class="text-xl neon-cyan">{{ formattedDate }}</div>
          <div class="text-xl neon-pink pulse-text">{{ bitcoinTimeText }}</div>
          <div v-if="displayBlockHeight !== null" class="text-lg neon-green">at block {{ displayBlockHeight.toLocaleString() }}</div>
          <div v-else class="text-lg neon-green">at block Unavailable</div>
          <div class="text-sm mt-1 neon-magenta">Since Bitcoin Genesis (Jan 3, 2009, 18:15:05 UTC)</div>
        </div>

        <div class="mt-6 input-group">
          <label class="block text-lg font-orbitron neon-pink mb-2">Select Date for Bitcoin Time</label>
          <div class="glass-card mb-4">
            <UCalendar v-model="selectedDate" class="futuristic-calendar" @update:model-value="updateBitcoinTime" />
          </div>
          <div class="glass-card">
            <div class="flex gap-4">
              <div class="w-24">
                <label class="block text-sm neon-pink mb-1">Hour</label>
                <UInputNumber
                  v-model="selectedHour"
                  :min="0"
                  :max="23"
                  :step="1"
                  placeholder="Hour"
                  class="futuristic-input"
                  @update:model-value="updateBitcoinTime"
                />
              </div>
              <div class="w-24">
                <label class="block text-sm neon-pink mb-1">Minute</label>
                <UInputNumber
                  v-model="selectedMinute"
                  :min="0"
                  :max="59"
                  :step="1"
                  placeholder="Minute"
                  class="futuristic-input"
                  @update:model-value="updateBitcoinTime"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <button class="neon-button" @click="shareToX">{{ shareButtonText }}</button>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date'

// Genesis block timestamp (January 3, 2009, 18:15:05 UTC)
const genesisTimestamp = 1231006505 // Unix timestamp in seconds
const displayModes = ['breakdown', 'years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds']
const currentModeIndex = ref(0)
const currentBlockHeight = ref(null) // Initialize as null
const selectedBlockHeight = ref(null)
const currentTime = ref(Date.now()) // Static for SSR

// Initialize date and time
const now = new Date()
const selectedDate = ref(null) // Initialize as null to use currentBlockHeight on load
const selectedHour = ref(now.getHours())
const selectedMinute = ref(now.getMinutes())

// Watch for changes to currentBlockHeight to debug reactivity
watch(currentBlockHeight, (newValue) => {
  console.log('currentBlockHeight changed:', newValue)
})

// Only update currentTime and fetch block height on client
onMounted(() => {
  if (import.meta.client) {
    const updateTime = () => {
      if (!selectedDate.value) { // Only update if no date is selected
        currentTime.value = Date.now()
      }
      requestAnimationFrame(updateTime)
    }
    updateTime()
    fetchCurrentBlockHeight()
  }
})

// Fetch current block height with retry using $fetch
async function fetchCurrentBlockHeight(retryCount = 0) {
  try {
    const response = await $fetch('https://api.whatsonchain.com/v1/bsv/main/chain/info', { timeout: 5000 })
    console.log('API Response:', response) // Debug log
    currentBlockHeight.value = response.blocks
    console.log('Updated currentBlockHeight:', currentBlockHeight.value) // Confirm update
  } catch (error) {
    console.error(`Error fetching block height (attempt ${retryCount + 1}):`, error)
    if (retryCount < 5) {
      setTimeout(() => fetchCurrentBlockHeight(retryCount + 1), 2000)
    } else {
      currentBlockHeight.value = null // No fallback block height
      console.warn('Failed to fetch block height after retries')
    }
  }
}

// Estimate and fetch block height for a given timestamp
async function getBlockHeightForTimestamp(targetTimestamp) {
  if (!targetTimestamp || targetTimestamp < genesisTimestamp) return null

  // Step 1: Approximate using 10-minute block interval (600 seconds)
  const secondsFromGenesis = targetTimestamp - genesisTimestamp
  const estimatedHeight = Math.floor(secondsFromGenesis / 600)

  // Step 2: Binary search refinement
  let low = Math.max(0, estimatedHeight - 1000)
  let high = estimatedHeight + 1000
  let closestHeight = estimatedHeight
  let closestDiff = Infinity
  let iteration = 0

  while (low <= high && iteration < 20) {
    const mid = Math.floor((low + high) / 2)
    try {
      const response = await $fetch(`https://api.whatsonchain.com/v1/bsv/main/block/height/${mid}`)
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
    } catch (error) {
      console.error('Error fetching block:', error)
      high = mid - 1
    }
    iteration++
  }

  try {
    const response = await $fetch(`https://api.whatsonchain.com/v1/bsv/main/block/height/${closestHeight}`)
    return closestHeight
  } catch (error) {
    console.error('Error verifying block:', error)
    return estimatedHeight
  }
}

// Calculate Bitcoin time
const bitcoinTime = computed(() => {
  let inputTime
  let jsDate
  if (selectedDate.value) {
    jsDate = selectedDate.value.toDate(getLocalTimeZone())
    jsDate.setHours(selectedHour.value || 0, selectedMinute.value || 0, 0)
    inputTime = jsDate.getTime() / 1000
  } else {
    jsDate = new Date(currentTime.value)
    inputTime = currentTime.value / 1000
  }
  const diffSeconds = inputTime - genesisTimestamp
  const isBeforeGenesis = diffSeconds < 0
  const absDiff = Math.abs(diffSeconds)
  const years = Math.floor(absDiff / (365.25 * 24 * 60 * 60))
  const months = Math.floor(absDiff / (30.42 * 24 * 60 * 60))
  const weeks = Math.floor(absDiff / (7 * 24 * 60 * 60))
  const days = Math.floor(absDiff / (24 * 60 * 60))
  const hours = Math.floor(absDiff / (60 * 60))
  const minutes = Math.floor(absDiff / 60)
  const seconds = Math.floor(absDiff)
  const decimalYears = (absDiff / (365.25 * 24 * 60 * 60)).toFixed(2)
  return { years, months, weeks, days, hours, minutes, seconds, decimalYears, isNegative: diffSeconds < 0, isBeforeGenesis, jsDate }
})

// Formatted date for display
const formattedDate = computed(() => {
  const { jsDate } = bitcoinTime.value
  return jsDate.toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
})

// Block height for display
const displayBlockHeight = computed(() => {
  console.log('Computing displayBlockHeight:', {
    selectedDate: !!selectedDate.value,
    selectedBlockHeight: selectedBlockHeight.value,
    currentBlockHeight: currentBlockHeight.value,
  })
  return selectedDate.value && selectedBlockHeight.value !== null ? selectedBlockHeight.value : currentBlockHeight.value
})

// Bitcoin Time Text (excludes block height)
const bitcoinTimeText = computed(() => {
  const { years, months, weeks, days, hours, minutes, seconds, decimalYears, isNegative, isBeforeGenesis } = bitcoinTime.value
  const mode = displayModes[currentModeIndex.value]
  const prefix = isNegative ? '-' : ''
  let timeStr
  if (mode === 'breakdown') {
    const remMonths = months % 12
    const remWeeks = weeks % 4
    const remDays = days % 7
    const remHours = hours % 24
    const remMinutes = minutes % 60
    const remSeconds = seconds % 60
    timeStr = `${prefix}${years}y ${remMonths}m ${remWeeks}w ${remDays}d ${remHours}h ${remMinutes}m ${remSeconds}s`
  } else if (mode === 'years') {
    timeStr = `${prefix}${decimalYears} years`
  } else if (mode === 'months') {
    timeStr = `${prefix}${months} months`
  } else if (mode === 'weeks') {
    timeStr = `${prefix}${weeks} weeks`
  } else if (mode === 'days') {
    timeStr = `${prefix}${days} days`
  } else if (mode === 'hours') {
    timeStr = `${prefix}${hours} hours`
  } else if (mode === 'minutes') {
    timeStr = `${prefix}${minutes} minutes`
  } else {
    timeStr = `${prefix}${seconds} seconds`
  }
  return timeStr
})

// Cycle display modes
function cycleDisplayMode() {
  currentModeIndex.value = (currentModeIndex.value + 1) % displayModes.length
}

// Update Bitcoin time on date/hour/minute change
async function updateBitcoinTime() {
  if (!selectedDate.value) {
    currentTime.value = Date.now() // Reset to current time
    selectedBlockHeight.value = null
    await fetchCurrentBlockHeight() // Ensure current block height
    return
  }
  const jsDate = selectedDate.value.toDate(getLocalTimeZone())
  jsDate.setHours(selectedHour.value || 0, selectedMinute.value || 0, 0)
  currentTime.value = jsDate.getTime() // Update to selected date
  const targetTimestamp = Math.floor(jsDate.getTime() / 1000)
  if (targetTimestamp < genesisTimestamp) {
    selectedBlockHeight.value = null
    return
  }
  selectedBlockHeight.value = await getBlockHeightForTimestamp(targetTimestamp)
}

// Share to X
function shareToX() {
  const { decimalYears, isNegative, isBeforeGenesis, jsDate } = bitcoinTime.value
  let text
  if (isBeforeGenesis) {
    const dateText = jsDate.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    text = `on ${dateText} it was Year ${decimalYears} before Bitcoin, no blocks exist #bitcointime www.bitcointime.date`
  } else {
    const timeText = isNegative ? `Year ${decimalYears} before Bitcoin` : `Year ${decimalYears} in bitcoin time`
    const block = displayBlockHeight.value !== null && displayBlockHeight.value !== undefined ? displayBlockHeight.value.toLocaleString() : 'N/A'
    if (selectedDate.value) {
      const dateText = jsDate.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
      text = `on ${dateText} it was ${timeText} and the block was ${block} #bitcointime www.bitcointime.date`
    } else {
      text = `It is currently ${timeText} at block ${block} #bitcointime www.bitcointime.date`
    }
  }
  console.log('Prefilled tweet text:', text) // Debug log
  if (navigator.share) {
    navigator.share({ text }).catch((err) => {
      console.error('Web Share failed:', err)
      alert(`Share failed. Copy this text:\n\n${text}`)
    })
  } else {
    const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(tweetUrl, '_blank', 'noopener,noreferrer')
  }
}

// Share button text
const shareButtonText = computed(() => {
  return navigator.share ? 'Share' : 'Share to X'
})
</script>

<style scoped>
/* Minimal scoped styles; most styles are in main.css */
.font-orbitron {
  font-family: 'Orbitron', sans-serif;
}
</style>
