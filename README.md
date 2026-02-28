# Bitcoin Time

Track the time elapsed since Bitcoin's Genesis Block (January 3, 2009, 18:15:05 UTC).

Live at [bitcointime.date](https://bitcointime.date)

![Bitcoin Time Screenshot](./public/screenshot.png)

## Features

- **Live Bitcoin Time** — Displays elapsed time since the Genesis Block in multiple formats (years, months, weeks, days, hours, minutes, seconds, or full breakdown)
- **Date Picker** — Select any date to see Bitcoin time and estimated block height at that moment
- **Block Height** — Live block height from the BSV blockchain via [Whatsonchain API](https://www.whatsonchain.com)
- **Halving Countdown** — Blocks remaining until the next halving (~block 1,050,000)
- **BTC Price Ticker** — Live Bitcoin price from CoinGecko
- **Share** — Share Bitcoin time to X (Twitter) or via Web Share API
- **PWA** — Installable as a Progressive Web App

## Tech Stack

- [Nuxt 4](https://nuxt.com) — Vue 3 meta-framework
- [Nuxt UI v3](https://ui.nuxt.com) — UI component library
- [Tailwind CSS v4](https://tailwindcss.com) — Utility-first CSS
- [TypeScript](https://www.typescriptlang.org) — Type-safe codebase
- [@vite-pwa/nuxt](https://vite-pwa-org.netlify.app/frameworks/nuxt) — PWA support
- [Whatsonchain API](https://www.whatsonchain.com) — BSV blockchain data
- [CoinGecko API](https://www.coingecko.com/en/api) — BTC price data

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project Structure

```
app/
├── app.vue                          # Main layout wrapper
├── assets/css/main.css              # Global styles (neon cyberpunk theme)
├── components/
│   ├── BitcoinTimeDisplay.vue       # Main time display (clickable to cycle modes)
│   ├── DateTimePicker.vue           # Calendar + hour/minute inputs
│   ├── HalvingCountdown.vue         # Next halving countdown
│   ├── PriceTicker.vue              # BTC price ticker
│   └── ShareButton.vue             # Share to X / Web Share API
└── composables/
    ├── useBitcoinTime.ts            # Time calculation logic
    ├── useBlockHeight.ts            # Block height fetching (Whatsonchain)
    └── useBtcPrice.ts               # BTC price fetching (CoinGecko)
```

## Deployment

Deploys to [Vercel](https://vercel.com) with zero configuration. Just connect the repo.

```bash
pnpm build
```

## License

MIT
