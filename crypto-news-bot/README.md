# 🪙 Crypto News Automation Bot

A fully automated daily crypto news system that fetches the latest articles from
**Cointelegraph**, rewrites them with **Claude AI**, generates platform-specific captions
and images, and manages publishing across **5 social platforms** through an
**admin approval dashboard**.

---

## ✨ Features

| Feature | Details |
|---|---|
| 📡 RSS Scraper | Fetches latest articles from Cointelegraph RSS |
| 🔁 Duplicate Checker | GUID-based dedup — never posts the same story twice |
| 🤖 AI Rewrite Engine | Claude rewrites articles in simple, educational English |
| 📱 Platform Generator | Tailored captions for all 5 platforms |
| 🎨 Image Prompts | Custom DALL-E 3 prompt per platform |
| 🖼 Image Generation | DALL-E 3 integration (optional — skipped if no key) |
| ✅ Approval Dashboard | Next.js admin UI — review, approve, reject, publish |
| ⏰ Daily Scheduler | node-cron — runs at 09:00 AM by default |
| 📋 Logging | Full audit trail of every automation step |
| 🔐 Env Config | All secrets in `.env.local` — never hardcoded |

---

## 🗂 Project Structure

```
crypto-news-bot/
├── prisma/
│   └── schema.prisma          ← SQLite database schema
├── src/
│   ├── app/                   ← Next.js App Router (dashboard)
│   │   ├── page.tsx           ← Dashboard overview
│   │   ├── posts/page.tsx     ← Post approval queue
│   │   ├── articles/page.tsx  ← Fetched articles list
│   │   ├── logs/page.tsx      ← Automation logs viewer
│   │   └── api/               ← REST API routes
│   ├── components/
│   │   └── Sidebar.tsx        ← Navigation sidebar
│   └── lib/
│       ├── db.ts              ← Prisma client singleton
│       ├── rss.ts             ← RSS feed fetcher
│       ├── duplicate-checker.ts ← Deduplication logic
│       ├── ai-rewrite.ts      ← Claude AI rewrite engine
│       ├── content-generator.ts ← Platform-specific content
│       ├── image-generator.ts ← DALL-E 3 image generation
│       ├── social-poster.ts   ← API poster (X, FB, LinkedIn)
│       ├── logger.ts          ← Structured logger
│       └── automation.ts      ← Main pipeline orchestrator
├── automation/
│   ├── scheduler.ts           ← Cron scheduler (runs as daemon)
│   └── run.ts                 ← Manual one-shot trigger
├── .env.example               ← Template for your secrets
└── README.md
```

---

## 🚀 Local Setup

### 1. Prerequisites

- Node.js 18+ (`node -v`)
- npm 9+ (`npm -v`)

### 2. Install

```bash
cd crypto-news-bot
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

| Variable | Required | Where to get it |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ Required | [console.anthropic.com](https://console.anthropic.com) |
| `OPENAI_API_KEY` | Optional | [platform.openai.com](https://platform.openai.com) — for image generation |
| `TWITTER_API_KEY` + 3 others | Optional | [developer.twitter.com](https://developer.twitter.com) |
| `FACEBOOK_PAGE_ID` + token | Optional | [developers.facebook.com](https://developers.facebook.com) |
| `LINKEDIN_ACCESS_TOKEN` + URN | Optional | [linkedin.com/developers](https://linkedin.com/developers) |

> 💡 The bot works with just `ANTHROPIC_API_KEY`. Social posting is skipped if the
> platform keys are absent — posts stay in the dashboard for manual copy-paste.

### 4. Set up the database

```bash
npm run setup
```

This generates the Prisma client and creates `prisma/dev.db` (SQLite file).

### 5. Start the dashboard

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll see the admin dashboard.

### 6. Run automation manually

In a separate terminal:

```bash
npm run run-now
```

This runs the full pipeline immediately:
1. Fetches Cointelegraph RSS
2. Deduplicates
3. Rewrites with Claude
4. Generates all 5 platform posts
5. Generates images (if OPENAI_API_KEY set)
6. Saves to DB with status "pending"

Then refresh the dashboard to approve posts.

### 7. Start the daily scheduler

```bash
npm run scheduler
```

This starts the cron daemon. It runs the pipeline every day at 09:00 AM
(configurable via `CRON_SCHEDULE` in `.env.local`).

---

## 📱 Platform Guide

### ✅ Auto-posting platforms (official APIs)

| Platform | Setup | API |
|---|---|---|
| **X / Twitter** | Set 4 Twitter env vars | twitter-api-v2 |
| **Facebook Page** | Set `FACEBOOK_PAGE_ID` + token | Meta Graph API v19 |
| **LinkedIn** | Set `LINKEDIN_ACCESS_TOKEN` + URN | LinkedIn UGC API v2 |

### ⚠️ Manual platforms (copy-paste only)

| Platform | Reason |
|---|---|
| **WhatsApp Group** | No official API to post to groups |
| **Facebook Profile** | Meta does not allow bot posting to personal profiles |

For manual platforms, the dashboard shows a **"Copy Content"** button. The content is
already formatted and ready to paste.

---

## 🔧 Configuration

### Change posting schedule

Edit `CRON_SCHEDULE` in `.env.local`:

```env
# Every day at 9 AM (default)
CRON_SCHEDULE=0 9 * * *

# Twice daily — 9 AM and 6 PM
CRON_SCHEDULE=0 9,18 * * *

# Every weekday at 8 AM
CRON_SCHEDULE=0 8 * * 1-5
```

### Enable auto-publishing

By default, all posts need dashboard approval. To skip the approval step:

```env
AUTO_PUBLISH=true
```

> ⚠️ Only use `AUTO_PUBLISH=true` once you've tested the system and trust the
> AI output quality.

### Switch to Supabase (PostgreSQL)

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy the connection string
3. Update `.env.local`:
   ```env
   DATABASE_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"
   ```
4. Change `prisma/schema.prisma` provider: `"postgresql"`
5. Run: `npm run db:migrate`

---

## 🚢 Deployment

### Vercel (recommended for dashboard)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add all `.env.local` variables to Vercel's environment settings.

> ⚠️ Vercel serverless functions have a max execution time. For the automation
> pipeline, use a separate process (see below).

### Running the scheduler on a VPS / server

```bash
# Install PM2 process manager
npm i -g pm2

# Start the scheduler
pm2 start npm --name "crypto-scheduler" -- run scheduler

# Auto-restart on server reboot
pm2 startup
pm2 save
```

### Using cron on Linux/Mac (alternative)

```bash
# Edit crontab
crontab -e

# Add this line (runs at 9 AM daily)
0 9 * * * cd /path/to/crypto-news-bot && npm run run-now >> /var/log/crypto-bot.log 2>&1
```

---

## 🎨 Content Style Guide

The AI rewriter follows these rules (enforced in the Claude prompt):

- ✅ Simple English, beginner-friendly
- ✅ Educational and informative tone
- ✅ Calm, premium, crypto market update style
- ✅ Natural emoji use (not spammy)
- ✅ Source credit + link always included
- ✅ Standard financial disclaimer on every post
- ❌ No copy-paste from original article
- ❌ No hype or "to the moon" language
- ❌ No financial advice or trading signals
- ❌ No fake claims or exaggerated predictions

---

## 🛠 Scripts Reference

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dashboard in development mode |
| `npm run build` | Build dashboard for production |
| `npm run start` | Start production dashboard |
| `npm run run-now` | Trigger automation pipeline immediately |
| `npm run scheduler` | Start daily cron scheduler daemon |
| `npm run setup` | Generate Prisma client + create DB |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |
| `npm run db:push` | Push schema changes to DB |

---

## 🔐 Security Notes

- All API keys are stored in `.env.local` — never commit this file
- `.gitignore` is pre-configured to exclude all `.env*` files and `.db` files
- The dashboard has no authentication by default — **add NextAuth or password protection before deploying publicly**
- Facebook Page tokens expire — use a long-lived token and refresh before expiry

---

## 📄 Licence

MIT — free to use, modify, and distribute.

---

*Built with ❤️ using Next.js, Claude AI, Prisma, and node-cron.*
