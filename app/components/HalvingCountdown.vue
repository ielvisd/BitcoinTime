<template>
  <div v-if="currentBlockHeight !== null" class="text-center mt-3 p-2 rounded-lg glow-border">
    <div class="text-xs neon-magenta uppercase tracking-wider mb-1">Next Halving</div>
    <div class="text-sm neon-cyan font-mono">
      <span class="neon-green font-bold">{{ blocksRemaining.toLocaleString() }}</span> blocks remaining
    </div>
    <div class="text-xs neon-magenta mt-1">
      ~{{ estimatedDate }} (Block {{ NEXT_HALVING_HEIGHT.toLocaleString() }})
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const NEXT_HALVING_HEIGHT = 1_050_000
const AVG_BLOCK_TIME_SECONDS = 600 // 10 minutes

const props = defineProps<{
  currentBlockHeight: number | null
}>()

const blocksRemaining = computed(() => {
  if (props.currentBlockHeight === null) return 0
  return Math.max(0, NEXT_HALVING_HEIGHT - props.currentBlockHeight)
})

const estimatedDate = computed(() => {
  if (props.currentBlockHeight === null) return '...'
  const secondsRemaining = blocksRemaining.value * AVG_BLOCK_TIME_SECONDS
  const estimatedMs = Date.now() + secondsRemaining * 1000
  return new Date(estimatedMs).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
})
</script>
