<template>
  <div class="tip-jar">
    <button class="tip-btn" @click="showTip = !showTip">
      ⚡ Tip BSV
    </button>

    <div v-if="showTip" class="popup-overlay" @click.self="showTip = false">
      <div class="popup-card">
        <p class="tip-title">Support Bitcoin Time</p>
        <p class="tip-desc">Send a tip via BSV</p>

        <div v-if="paymail" class="tip-paymail">
          <p class="paymail-label">Paymail</p>
          <button class="paymail-value" @click="copyPaymail">
            {{ copied ? 'Copied!' : paymail }}
          </button>
        </div>

        <div v-if="bsvAddress" class="tip-address">
          <p class="paymail-label">Or send to address</p>
          <button class="address-value" @click="copyAddress">
            {{ addressCopied ? 'Copied!' : truncatedAddress }}
          </button>
        </div>

        <a
          v-if="handcashUrl"
          :href="handcashUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="handcash-btn"
        >
          Open in HandCash
        </a>

        <button class="close-btn" @click="showTip = false">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const showTip = ref(false)
const copied = ref(false)
const addressCopied = ref(false)

// TODO: Replace with your actual paymail and BSV address
const paymail = ''
const bsvAddress = '1HRFFQD1ATHZXiCkHhMu1K66aLcYeNPFmc'
const handcashUrl = ''

const truncatedAddress = computed(() => {
  if (!bsvAddress) return ''
  return `${bsvAddress.slice(0, 8)}...${bsvAddress.slice(-8)}`
})

async function copyPaymail() {
  await navigator.clipboard.writeText(paymail)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

async function copyAddress() {
  if (!bsvAddress) return
  await navigator.clipboard.writeText(bsvAddress)
  addressCopied.value = true
  setTimeout(() => { addressCopied.value = false }, 2000)
}
</script>

<style scoped>
.tip-jar {
  text-align: center;
}

.tip-btn {
  background: transparent;
  border: 1px solid rgba(200, 162, 255, 0.15);
  color: var(--text-secondary);
  padding: 0.4rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tip-btn:hover {
  border-color: rgba(200, 162, 255, 0.3);
  color: var(--accent);
}

.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.popup-card {
  background: var(--bg);
  border: 1px solid var(--surface-border);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 320px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.tip-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.tip-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.tip-paymail, .tip-address {
  width: 100%;
  text-align: center;
}

.paymail-label {
  font-size: 0.65rem;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.25rem;
}

.paymail-value, .address-value {
  background: var(--surface);
  border: 1px solid var(--surface-border);
  color: var(--accent);
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  width: 100%;
  transition: border-color 0.2s;
  font-family: 'Inter', monospace;
}

.paymail-value:hover, .address-value:hover {
  border-color: rgba(200, 162, 255, 0.3);
}

.handcash-btn {
  background: rgba(200, 162, 255, 0.08);
  border: 1px solid rgba(200, 162, 255, 0.25);
  color: var(--accent);
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  text-decoration: none;
  transition: all 0.2s;
  width: 100%;
  text-align: center;
}

.handcash-btn:hover {
  background: rgba(200, 162, 255, 0.15);
}

.close-btn {
  background: transparent;
  border: 1px solid var(--surface-border);
  color: var(--text-tertiary);
  padding: 0.4rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  margin-top: 0.5rem;
}
</style>
