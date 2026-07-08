# 10X Limitless Intelligence
### "Where Real Traders Are Made"

A production-grade, institutional-level crypto market intelligence SaaS platform built with Next.js 14, TailwindCSS, Framer Motion, and CCXT.

---

## 🏗️ Architecture Overview

```
platform/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Landing page
│   │   ├── layout.tsx                # Root layout
│   │   ├── globals.css               # Global styles (Tailwind + custom)
│   │   ├── auth/
│   │   │   ├── login/page.tsx        # Login page
│   │   │   └── register/page.tsx     # Registration page
│   │   ├── dashboard/page.tsx        # Main dashboard
│   │   ├── scanner/page.tsx          # Market scanner
│   │   ├── signals/page.tsx          # Signal feed
│   │   ├── journal/page.tsx          # Trading journal
│   │   ├── vip/page.tsx              # VIP upgrade page
│   │   ├── settings/page.tsx         # User settings
│   │   ├── admin/page.tsx            # Admin dashboard
│   │   └── api/
│   │       ├── auth/                 # Auth routes
│   │       ├── market/tickers/       # Live ticker data
│   │       ├── signals/              # Signal feed
│   │       ├── scanner/run/          # Scanner engine API
│   │       ├── journal/              # Trading journal CRUD
│   │       ├── user/                 # User profile & API keys
│   │       └── admin/                # Admin management
│   ├── lib/
│   │   ├── auth.ts                   # JWT auth utilities
│   │   ├── prisma.ts                 # Prisma client
│   │   ├── encryption.ts             # AES-256 encryption
│   │   ├── utils.ts                  # Shared utilities
│   │   └── scanner/
│   │       ├── indicators.ts         # EMA, RSI, MACD, CPR
│   │       ├── confluence.ts         # Signal detection logic
│   │       ├── exchange.ts           # CCXT exchange layer
│   │       └── engine.ts             # Full scan orchestrator
│   ├── components/
│   │   └── layout/
│   │       └── DashboardLayout.tsx   # Sidebar + topbar layout
│   └── types/
│       └── index.ts                  # TypeScript interfaces
├── prisma/
│   └── schema.prisma                 # Database schema
├── .env.example                      # Environment variable template
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/your-org/10x-limitless-intelligence.git
cd 10x-limitless-intelligence/platform
npm install --legacy-peer-deps
```

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/limitless_db"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
ANTHROPIC_API_KEY="sk-ant-..."
TELEGRAM_BOT_TOKEN="your-bot-token"
ENCRYPTION_KEY="your-32-character-encryption-key!"
```

### 3. Database Setup

```bash
# Requires PostgreSQL running
npx prisma db push
npx prisma generate
```

### 4. Run Development Server

```bash
npm run dev
# Opens at http://localhost:3000
```

---

## 🔧 Core Features

### Scanner Engine
The scanner (`src/lib/scanner/`) uses pure mathematical implementations of:
- **EMA 9/21/200** — Trend direction and crossover detection
- **RSI (14-period)** — Momentum and divergence
- **MACD (12/26/9)** — Momentum confirmation
- **Volume ratio** — Institutional participation validation
- **CPR levels** — Central Pivot Range for intraday levels

### Signal Types
| Signal | Description |
|--------|-------------|
| `BULLISH_CROSSOVER` | EMA9 crosses above EMA21 with confluence |
| `BEARISH_CROSSOVER` | EMA9 crosses below EMA21 with confluence |
| `BREAKOUT` | Price breaks key resistance with volume |
| `PULLBACK` | Price pulls back to EMA21 in uptrend |
| `RSI_DIVERGENCE` | Price/RSI divergence detected |
| `TREND_CONTINUATION` | All trend indicators aligned |

### Confidence Scoring
Every signal generates a score from 0–100 based on how many conditions align:
- Base score: 30–45 (primary condition met)
- Supporting conditions: +5 to +25 each
- Counter-conditions: -5 to -10 each

Signals below `minConfidence` threshold are suppressed.

---

## 📡 API Reference

### Authentication
```
POST /api/auth/register   — Create account
POST /api/auth/login      — Login, returns JWT
GET  /api/auth/me         — Get current user (requires Bearer token)
```

### Market Data
```
GET /api/market/tickers?symbols=BTC/USDT&symbols=ETH/USDT
```

### Signals
```
GET /api/signals?direction=BULLISH&timeframe=4h&limit=20
```

### Scanner
```
POST /api/scanner/run
Body: { exchanges, symbols, timeframes, minConfidence }
```

### Journal
```
GET  /api/journal        — List trades with stats
POST /api/journal        — Log new trade
```

---

## 🗄️ Database Schema

Core tables:
- `users` — User accounts with plan/role management
- `market_signals` — All detected signals with full indicator data
- `trades` — Trading journal entries
- `watchlist_items` — User watchlists
- `alert_configs` — Alert preferences
- `announcements` — Admin broadcasts
- `exchange_api_keys` — Encrypted exchange credentials

---

## 🔐 Security

- **JWT auth** with 7-day expiry + refresh tokens
- **AES-256 encryption** for all stored API keys via `crypto-js`
- **bcrypt (12 rounds)** for password hashing
- **Input validation** via Zod on all API routes
- **Role-based access** (USER / VIP / ADMIN)
- **Rate limiting** recommended via Vercel/Railway config

---

## 🌐 Deployment

### Vercel (Frontend + API Routes)

```bash
npm install -g vercel
vercel --prod
```

Set environment variables in Vercel dashboard.

### Railway (Database + Redis)

1. Create a PostgreSQL service in Railway
2. Add `DATABASE_URL` to Vercel env vars
3. Run migrations: `npx prisma db push`

### Optional: Redis for Caching

```bash
# Railway → Add Redis service
REDIS_URL="redis://..."
```

---

## 📱 Supported Exchanges

| Exchange | Spot | Derivatives | OHLCV |
|----------|------|-------------|-------|
| Binance  | ✓    | ✓           | ✓     |
| Bybit    | ✓    | ✓           | ✓     |
| Kraken   | ✓    | -           | ✓     |
| Bitget   | ✓    | ✓           | ✓     |
| MEXC     | ✓    | ✓           | ✓     |
| KuCoin   | ✓    | ✓           | ✓     |

---

## ⚠️ Disclaimer

This platform is for educational purposes. It does not constitute financial advice.
Past signal performance does not guarantee future results.
Always use proper risk management. Never invest more than you can afford to lose.

---

Built by **10X Limitless** · "Where Real Traders Are Made"
