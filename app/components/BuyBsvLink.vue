<template>
  <div class="buy-bsv">
    <a
      :href="affiliateUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="buy-link"
    >
      Buy BSV →
    </a>
  </div>
</template>

<script setup lang="ts">
// ChangeNOW affiliate link — replace YOUR_REFERRAL_ID with actual ID after signup
// Sign up at: https://changenow.io/affiliate
const affiliateUrl = 'https://changenow.io/exchange?to=bsv&link_id=YOUR_REFERRAL_ID'
</script>

<style scoped>
.buy-bsv {
  text-align: center;
}

.buy-link {
  font-size: 0.7rem;
  color: var(--text-tertiary);
  text-decoration: none;
  letter-spacing: 0.05em;
  transition: color 0.2s;
}

.buy-link:hover {
  color: var(--accent);
}
</style>
