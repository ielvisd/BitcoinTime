<template>
  <div
    class="text-center font-mono font-semibold cursor-pointer hover:bg-gray-900 p-3 rounded-lg transition-all glow-border"
    @click="$emit('cycle')"
  >
    <div class="text-lg neon-cyan">{{ formattedDate }}</div>
    <div class="text-2xl neon-pink pulse-text font-bold">{{ bitcoinTimeText }}</div>
    <div v-if="displayBlockHeight !== null" class="text-lg neon-green">
      at block {{ displayBlockHeight === 0 ? '0' : displayBlockHeight.toLocaleString() }}
    </div>
    <div v-else-if="isBeforeGenesis" class="text-lg neon-green">no blocks yet</div>
    <div v-else class="text-lg neon-green">at block Unavailable</div>
    <div class="text-sm mt-1 neon-magenta">Since Bitcoin Genesis (Jan 3, 2009, 18:15:05 UTC)</div>
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
