<template>
  <div class="mt-6 input-group">
    <label class="block text-lg font-orbitron neon-pink mb-2">Select Date &amp; Time</label>
    <div class="glass-card mb-4">
      <UCalendar
        :model-value="modelValue"
        class="futuristic-calendar"
        aria-label="Select date for Bitcoin Time"
        @update:model-value="$emit('update:modelValue', $event)"
      />
    </div>
    <div class="glass-card">
      <div class="flex justify-center items-center gap-3">
        <span class="neon-pink font-orbitron text-sm">Time</span>
        <input
          type="time"
          :value="timeValue"
          class="neon-time-input"
          @input="handleTimeInput"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CalendarDate } from '@internationalized/date'

const props = defineProps<{
  modelValue: CalendarDate | null
  hour: number
  minute: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CalendarDate | null]
  'update:hour': [value: number]
  'update:minute': [value: number]
}>()

const timeValue = computed(() => {
  const h = String(props.hour).padStart(2, '0')
  const m = String(props.minute).padStart(2, '0')
  return `${h}:${m}`
})

function handleTimeInput(event: Event) {
  const val = (event.target as HTMLInputElement).value
  if (!val) return
  const [h, m] = val.split(':').map(Number)
  emit('update:hour', h)
  emit('update:minute', m)
}
</script>
