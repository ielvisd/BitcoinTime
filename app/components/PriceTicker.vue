<template>
  <div class="text-center text-sm neon-cyan mt-3">
    <span v-if="loading" class="opacity-50">Loading BSV price...</span>
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
