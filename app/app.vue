<template>
  <ClientOnly>
    <Analytics />
    <div class="app-wrapper">
      <div class="app-container">
        <!-- Header -->
        <header class="app-header">
          <h1 class="title" @click="handleReset">Bitcoin Time</h1>
        </header>

        <!-- Main Display -->
        <section class="time-section" @click="cycleDisplayMode">
          <p class="date-label">{{ formattedDate }}</p>
          <p class="time-value">{{ bitcoinTimeText }}</p>
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

        <!-- Divider -->
        <div class="divider" />

        <!-- Date & Time Picker -->
        <section class="picker-section">
          <p class="picker-label">Select Date & Time</p>
          <div class="calendar-wrapper">
            <UCalendar
              :model-value="selectedDate"
              aria-label="Select date for Bitcoin Time"
              @update:model-value="onDateChange"
            />
          </div>
          <div class="time-wrapper">
            <input
              type="time"
              :value="timeValue"
              class="time-input"
              @input="handleTimeInput"
            />
          </div>
        </section>

        <!-- Divider -->
        <div class="divider" />

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
import { computed, onMounted } from 'vue'
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

const timeValue = computed(() => {
  const h = String(selectedHour.value).padStart(2, '0')
  const m = String(selectedMinute.value).padStart(2, '0')
  return `${h}:${m}`
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
}

async function onDateChange(value: CalendarDate | null): Promise<void> {
  selectedDate.value = value
  if (!value) currentTime.value = Date.now()
  await updateBlockHeightForDate(value, selectedHour.value, selectedMinute.value)
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
  margin-bottom: 2.5rem;
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
  cursor: pointer;
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid var(--surface-border);
  background: var(--surface);
  margin-bottom: 1.5rem;
  transition: border-color 0.3s;
}

.time-section:hover {
  border-color: rgba(200, 162, 255, 0.15);
}

.date-label {
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.time-value {
  font-family: 'Orbitron', sans-serif;
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--accent);
  text-shadow: 0 0 30px var(--accent-glow);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.block-info {
  font-family: 'Inter', monospace;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.genesis-note {
  font-size: 0.7rem;
  color: var(--text-tertiary);
  letter-spacing: 0.05em;
}

/* Halving */
.halving-section {
  text-align: center;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--surface-border);
  background: var(--surface);
  margin-bottom: 1.5rem;
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

/* Divider */
.divider {
  height: 1px;
  background: var(--surface-border);
  margin: 1.5rem 0;
}

/* Picker */
.picker-section {
  text-align: center;
}

.picker-label {
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin-bottom: 1rem;
}

.calendar-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid var(--surface-border);
  background: var(--surface);
}

.time-wrapper {
  display: flex;
  justify-content: center;
}

.time-input {
  background: var(--surface);
  border: 1px solid var(--surface-border);
  color: var(--text-primary);
  font-family: 'Orbitron', monospace;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  padding: 0.6rem 1.5rem;
  border-radius: 0.5rem;
  transition: border-color 0.3s;
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
  .title {
    font-size: 1.6rem;
  }

  .time-value {
    font-size: 1.15rem;
  }
}
</style>
