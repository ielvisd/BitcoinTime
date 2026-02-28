<template>
  <div v-if="currentBlockHeight !== null" class="text-center mt-4 py-3 px-4 rounded-xl glow-border">
    <div class="text-xs uppercase tracking-[0.2em]" style="color: var(--text-tertiary);">Next BSV Halving</div>
    <div class="text-lg font-orbitron font-semibold mt-1" style="color: var(--accent);">
      {{ blocksRemaining.toLocaleString() }}
      <span class="text-sm font-normal" style="color: var(--text-secondary);">blocks</span>
    </div>
    <div class="text-xs mt-1" style="color: var(--text-tertiary);">
      ~{{ estimatedDate }} · Block {{ NEXT_HALVING_HEIGHT.toLocaleString() }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const NEXT_HALVING_HEIGHT = 1_050_000
const AVG_BLOCK_TIME_SECONDS = 600

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
  return new Date(estimatedMs).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
})
</script>
