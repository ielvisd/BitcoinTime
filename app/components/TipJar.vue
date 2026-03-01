<template>
  <div class="tip-jar">
    <button class="tip-btn" @click="showTip = !showTip">
      ⚡ Tip BSV
    </button>

    <div v-if="showTip" class="popup-overlay" @click.self="showTip = false">
      <div class="popup-card">
        <p class="tip-title">Support Bitcoin Time</p>
        <p class="tip-desc">Scan with any BSV wallet</p>

        <!-- QR Code -->
        <div class="qr-container">
          <img
            :src="qrUrl"
            alt="BSV tip address QR code"
            width="180"
            height="180"
            class="qr-image"
          />
        </div>

        <!-- Tap to copy address -->
        <button class="address-btn" @click="copyAddress">
          {{ addressCopied ? '✓ Copied!' : truncatedAddress }}
        </button>

        <!-- Open in wallet (mobile) -->
        <a :href="walletUri" class="wallet-btn">
          Open in Wallet
        </a>

        <button class="close-btn" @click="showTip = false">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const showTip = ref(false)
const addressCopied = ref(false)

const bsvAddress = '1HRFFQD1ATHZXiCkHhMu1K66aLcYeNPFmc'

// QR code via free API — encodes a bitcoin: URI
const walletUri = `bitcoin:${bsvAddress}?sv&label=BitcoinTime%20Tip`
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(walletUri)}&bgcolor=0a0a0f&color=c8a2ff&format=png`

const truncatedAddress = computed(() => {
  return `${bsvAddress.slice(0, 10)}...${bsvAddress.slice(-8)}`
})

async function copyAddress() {
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
  background: rgba(0, 0, 0, 0.75);
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
  max-width: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.tip-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}

.tip-desc {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.qr-container {
  background: white;
  border-radius: 0.75rem;
  padding: 0.75rem;
  margin: 0.25rem 0;
}

.qr-image {
  display: block;
  border-radius: 0.25rem;
}

.address-btn {
  background: var(--surface);
  border: 1px solid var(--surface-border);
  color: var(--accent);
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  width: 100%;
  transition: border-color 0.2s;
  font-family: 'Inter', monospace;
}

.address-btn:hover {
  border-color: rgba(200, 162, 255, 0.3);
}

.wallet-btn {
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

.wallet-btn:hover {
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
  margin-top: 0.25rem;
}
</style>
