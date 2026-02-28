<template>
  <div class="text-center text-xs mt-3" style="color: var(--text-tertiary);">
    <span v-if="loading" class="opacity-50">···</span>
    <span v-else-if="price !== null">
      BSV ${{ price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  price: number | null
  loading: boolean
}>()
</script>
