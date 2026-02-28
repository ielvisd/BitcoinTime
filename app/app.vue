<template>
  <Analytics />
  <ClientOnly>
    <div class="app-wrapper">
      <div class="app-container">
        <!-- Header -->
        <header class="app-header">
          <h1 class="title" @click="handleReset">Bitcoin Time</h1>
        </header>

        <!-- Main Display -->
        <section class="time-section">
          <!-- Date & Time row -->
          <div class="datetime-row">
            <span class="date-label clickable" @click="showCalendar = !showCalendar">
              {{ formattedDate.split(',').slice(0, -1).join(',') }}
            </span>
            <span class="datetime-sep">·</span>
            <span class="date-label clickable" @click="showTimePicker = !showTimePicker">
              {{ formattedTime }}
            </span>
          </div>

          <!-- Calendar popup -->
          <div v-if="showCalendar" class="popup-overlay" @click.self="showCalendar = false">
            <div class="popup-card">
              <UCalendar
                :model-value="selectedDate"
                aria-label="Select date"
                @update:model-value="onDateChange"
              />
              <button class="popup-close" @click="showCalendar = false">Done</button>
            </div>
          </div>

          <!-- Time popup -->
          <div v-if="showTimePicker" class="popup-overlay" @click.self="showTimePicker = false">
            <div class="popup-card popup-card-sm">
              <input
                type="time"
                :value="timeInputValue"
                class="time-input"
                @input="handleTimeInput"
              />
              <button class="popup-close" @click="showTimePicker = false">Done</button>
            </div>
          </div>

          <p class="time-value" @click="cycleDisplayMode">{{ bitcoinTimeText }}</p>

          <p class="block-info">
            <template v-if="displayBlockHeight !== null">
              Block {{ displayBlockHeight === 0 ? '0' : displayBlockHeight.toLocaleString() }}
            </template>
            <template v-else-if="bitcoinTime.isBeforeGenesis">No blocks yet</template>
            <template v-else>Block unavailable</template>
          </p>

          <p class="genesis-note">Since Genesis · Jan 3, 2009</p>
        </section>

        <!-- Halving -->
        <section v-if="currentBlockHeight !== null" class="halving-section">
          <div class="halving-row">
            <span class="halving-label">Next BSV Halving</span>
            <span class="halving-value">{{ (1050000 - (currentBlockHeight || 0)).toLocaleString() }} blocks</span>
          </div>
          <p class="halving-meta">~Apr 2028 · Block 1,050,000</p>
        </section>

        <!-- Footer -->
        <footer class="app-footer">
          <ShareButton
            :bitcoin-time="bitcoinTime"
            :display-block-height="displayBlockHeight"
            :has-selected-date="selectedDate !== null"
          />
          <div class="footer-meta">
            <span v-if="!priceLoading && price !== null" class="bsv-price">BSV ${{ price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
            <span class="powered-by">Powered by <a href="https://www.whatsonchain.com" target="_blank" rel="noopener noreferrer">Whatsonchain</a></span>
          </div>
        </footer>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Analytics } from '@vercel/analytics/nuxt'

import { useBitcoinTime } from '~/composables/useBitcoinTime'
import { useBlockHeight } from '~/composables/useBlockHeight'
import { useBtcPrice } from '~/composables/useBtcPrice'
import type { CalendarDate } from '@internationalized/date'

const showCalendar = ref(false)
const showTimePicker = ref(false)

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

const formattedTime = computed(() => {
  const h = selectedHour.value
  const m = selectedMinute.value
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
})

const timeInputValue = computed(() => {
  return `${String(selectedHour.value).padStart(2, '0')}:${String(selectedMinute.value).padStart(2, '0')}`
})

onMounted(() => {
  if (import.meta.client) {
    startLiveClock()
    fetchCurrentBlockHeight()
  }
})

function handleReset(): void {
  resetToCurrentTime()
  fetchCurrentBlockHeight()
  showCalendar.value = false
  showTimePicker.value = false
}

async function onDateChange(value: CalendarDate | null): Promise<void> {
  selectedDate.value = value
  if (!value) currentTime.value = Date.now()
  await updateBlockHeightForDate(value, selectedHour.value, selectedMinute.value)
  showCalendar.value = false
}

function handleTimeInput(event: Event): void {
  const val = (event.target as HTMLInputElement).value
  if (!val) return
  const [h, m] = val.split(':').map(Number)
  selectedHour.value = h
  selectedMinute.value = m
  if (selectedDate.value) {
    updateBlockHeightForDate(selectedDate.value, h, m)
  }
}
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.app-container {
  width: 100%;
  max-width: 400px;
}

/* Header */
.app-header {
  text-align: center;
  margin-bottom: 1.25rem;
}

.title {
  font-family: 'Orbitron', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  cursor: pointer;
  letter-spacing: 0.04em;
}

/* Time Display */
.time-section {
  text-align: center;
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid var(--surface-border);
  background: var(--surface);
  margin-bottom: 1.25rem;
  position: relative;
}

.datetime-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.datetime-sep {
  color: var(--text-tertiary);
  font-size: 0.75rem;
}

.date-label {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.clickable {
  cursor: pointer;
  transition: color 0.2s;
}

.clickable:hover {
  color: var(--accent);
}

.edit-hint {
  font-size: 0.6rem;
  opacity: 0.4;
  margin-left: 0.25rem;
}

.clickable:hover .edit-hint {
  opacity: 0.8;
}

.time-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--accent);
  text-shadow: 0 0 30px var(--accent-glow);
  margin-bottom: 0.5rem;
  line-height: 1.4;
  cursor: pointer;
}

.block-info {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.genesis-note {
  font-size: 0.7rem;
  color: var(--text-tertiary);
  letter-spacing: 0.05em;
}

/* Popup */
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.popup-card {
  background: var(--bg);
  border: 1px solid var(--surface-border);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.popup-card-sm {
  padding: 1.5rem 2rem;
}

.popup-close {
  background: transparent;
  border: 1px solid rgba(200, 162, 255, 0.25);
  color: var(--accent);
  padding: 0.4rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.2s;
}

.popup-close:hover {
  background: rgba(200, 162, 255, 0.08);
}

/* Time Input */
.time-input {
  background: var(--surface);
  border: 1px solid var(--surface-border);
  color: var(--text-primary);
  font-family: 'Orbitron', monospace;
  font-size: 1.5rem;
  font-weight: 500;
  text-align: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  color-scheme: dark;
}

.time-input::-webkit-calendar-picker-indicator {
  filter: invert(0.5);
  cursor: pointer;
}

.time-input:focus {
  outline: none;
  border-color: rgba(200, 162, 255, 0.3);
}

/* Halving */
.halving-section {
  text-align: center;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--surface-border);
  background: var(--surface);
  margin-bottom: 2rem;
}

.halving-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.halving-label {
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-tertiary);
}

.halving-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--accent);
}

.halving-meta {
  font-size: 0.7rem;
  color: var(--text-tertiary);
  text-align: right;
  margin-top: 0.25rem;
}

/* Footer */
.app-footer {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

.footer-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}

.bsv-price {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 0.05em;
}

.powered-by {
  font-size: 0.7rem;
  color: var(--text-tertiary);
}

.powered-by a {
  color: var(--text-secondary);
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* Responsive */
@media (max-width: 640px) {
  .title { font-size: 1.6rem; }
  .time-value { font-size: 1.15rem; }
}
</style>
