<template>
  <div
    class="text-center cursor-pointer p-4 rounded-xl transition-all glow-border"
    @click="$emit('cycle')"
  >
    <div class="text-sm tracking-widest uppercase" style="color: var(--text-secondary);">{{ formattedDate }}</div>
    <div class="text-xl sm:text-2xl font-orbitron font-bold mt-3 mb-2 pulse-text" style="color: var(--accent); text-shadow: 0 0 30px var(--accent-glow);">
      {{ bitcoinTimeText }}
    </div>
    <div v-if="displayBlockHeight !== null" class="text-base font-mono" style="color: var(--text-secondary);">
      block <span style="color: var(--text-primary);">{{ displayBlockHeight === 0 ? '0' : displayBlockHeight.toLocaleString() }}</span>
    </div>
    <div v-else-if="isBeforeGenesis" class="text-base font-mono" style="color: var(--text-secondary);">no blocks yet</div>
    <div v-else class="text-base font-mono" style="color: var(--text-secondary);">block unavailable</div>
    <div class="text-xs mt-3" style="color: var(--text-tertiary);">Since Genesis · Jan 3, 2009 · 18:15:05 UTC</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  formattedDate: string
  bitcoinTimeText: string
  displayBlockHeight: number | null
  isBeforeGenesis: boolean
}>()

defineEmits<{
  cycle: []
}>()
</script>
