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
      <div class="flex gap-6 justify-center items-end">
        <div class="text-center">
          <label class="block text-sm neon-pink mb-2 font-orbitron">Hour</label>
          <input
            type="number"
            :value="hour"
            min="0"
            max="23"
            step="1"
            class="neon-time-input"
            @input="$emit('update:hour', Math.min(23, Math.max(0, Number(($event.target as HTMLInputElement).value))))"
          />
        </div>
        <div class="text-2xl neon-pink font-bold pb-1">:</div>
        <div class="text-center">
          <label class="block text-sm neon-pink mb-2 font-orbitron">Minute</label>
          <input
            type="number"
            :value="minute"
            min="0"
            max="59"
            step="1"
            class="neon-time-input"
            @input="$emit('update:minute', Math.min(59, Math.max(0, Number(($event.target as HTMLInputElement).value))))"
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
