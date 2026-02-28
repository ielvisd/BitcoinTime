<template>
  <div class="mt-6 input-group">
    <label class="block text-lg font-orbitron neon-pink mb-2">Select Date for Bitcoin Time</label>
    <div class="glass-card mb-4">
      <UCalendar
        :model-value="modelValue"
        class="futuristic-calendar"
        aria-label="Select date for Bitcoin Time"
        @update:model-value="$emit('update:modelValue', $event)"
      />
    </div>
    <div class="glass-card">
      <div class="flex gap-4 justify-center">
        <div class="w-24">
          <label class="block text-sm neon-pink mb-1">Hour</label>
          <UInputNumber
            :model-value="hour"
            :min="0"
            :max="23"
            :step="1"
            placeholder="Hour"
            class="futuristic-input"
            @update:model-value="$emit('update:hour', $event)"
          />
        </div>
        <div class="w-24">
          <label class="block text-sm neon-pink mb-1">Minute</label>
          <UInputNumber
            :model-value="minute"
            :min="0"
            :max="59"
            :step="1"
            placeholder="Minute"
            class="futuristic-input"
            @update:model-value="$emit('update:minute', $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'

defineProps<{
  modelValue: CalendarDate | null
  hour: number
  minute: number
}>()

defineEmits<{
  'update:modelValue': [value: CalendarDate | null]
  'update:hour': [value: number]
  'update:minute': [value: number]
}>()
</script>
