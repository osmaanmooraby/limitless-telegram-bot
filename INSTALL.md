# Crypto Scanner — Installation Guide

Scans the top 100 Binance USDT pairs every 15 minutes and sends a Telegram alert whenever all three conditions fire on the same closed candle:

- **EMA25 reclaim** — price closes above the 25-period EMA after being below it
- **MACD bullish crossover** — MACD line crosses above the Signal line
- **Volume above 20-period average** — current candle volume > 20-bar rolling average

---

## Prerequisites

| Requirement | Minimum version |
|---|---|
| Python | 3.11 |
| pip | any recent |
| Internet access | Binance public API (no key needed) |
| Telegram bot token | see step 2 |
| Telegram chat/channel ID | see step 3 |

---

## Step 1 — Clone the repository

```bash
git clone https://github.com/osmaanmooraby/limitless-telegram-bot.git
cd limitless-telegram-bot
```

---

## Step 2 — Create a Telegram bot and get the token

1. Open Telegram and search for **@BotFather**.
2. Send `/newbot` and follow the prompts (pick a name and a username ending in `bot`).
3. BotFather will reply with a token that looks like:

   ```
   1234567890:ABCDefGhIJKlmNoPQRsTUVwxyZ
   ```

4. Copy and keep that token — you will need it in step 5.

---

## Step 3 — Get the target chat ID

The scanner needs to know *where* to send alerts (a private chat, a group, or a channel).

### Option A — Private chat (alerts go to you directly)

1. Start a conversation with your new bot (search its username in Telegram and press **Start**).
2. Send any message to the bot.
3. Open this URL in a browser (replace `<TOKEN>` with your bot token):

   ```
   https://api.telegram.org/bot<TOKEN>/getUpdates
   ```

4. Look for `"chat":{"id":` in the JSON response. That number is your chat ID.

### Option B — Group chat

1. Add your bot to the group and make it an admin.
2. Send a message in the group.
3. Fetch `getUpdates` as above — the group chat ID will be a **negative** number (e.g. `-1001234567890`).

### Option C — Telegram channel

1. Add your bot as an admin of the channel with permission to post messages.
2. Forward any channel post to **@userinfobot** — it will show the channel ID (negative number starting with `-100`).

---

## Step 4 — Install Python dependencies

```bash
python3 -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

pip install --upgrade pip
pip install -r requirements.txt
```

---

## Step 5 — Set environment variables

The scanner reads two environment variables at startup. Set them in your shell before running:

```bash
export BOT_TOKEN="1234567890:ABCDefGhIJKlmNoPQRsTUVwxyZ"
export CHAT_ID="-1001234567890"
```

> **Windows (Command Prompt)**
> ```cmd
> set BOT_TOKEN=1234567890:ABCDefGhIJKlmNoPQRsTUVwxyZ
> set CHAT_ID=-1001234567890
> ```

> **Windows (PowerShell)**
> ```powershell
> $Env:BOT_TOKEN = "1234567890:ABCDefGhIJKlmNoPQRsTUVwxyZ"
> $Env:CHAT_ID   = "-1001234567890"
> ```

---

## Step 6 — Run the scanner

```bash
python scanner.py
```

On startup you will see:

```
2025-05-30 12:00:00  INFO      Crypto scanner initialising…
2025-05-30 12:00:01  INFO      Bot connected: @YourBotUsername
2025-05-30 12:00:01  INFO      Scanning every 15 minutes. Press Ctrl+C to stop.
2025-05-30 12:00:01  INFO      Scan started
2025-05-30 12:00:12  INFO      Scanning 100 USDT pairs across 2 timeframes
2025-05-30 12:00:45  INFO      Alert sent  →  SOLUSDT  1H
2025-05-30 12:00:58  INFO      Scan complete — 1 alert(s) fired
2025-05-30 12:00:58  INFO      Next scan in 860 s
```

When a setup is found, your Telegram chat receives:

```
🚀 Setup Alert — SOLUSDT

📊 Timeframe: 1H
💰 Current Price: 175.3200 USDT
📈 EMA Status: Reclaimed EMA25 ✅ (EMA: 172.8100)
⚡ MACD Status: Bullish crossover ✅ (MACD: 0.000123 > Sig: -0.000045)
📦 Volume Status: Above 20-period avg ✅ (Vol: 1,234,567 | MA20: 987,654)

🧠 10x Limitless Analysis by Osmaan Mooraby
```

---

## Step 7 — Run continuously (Linux server)

### Option A — screen (quick and simple)

```bash
screen -S scanner
source venv/bin/activate
export BOT_TOKEN="..."
export CHAT_ID="..."
python scanner.py
# Detach with Ctrl+A then D
# Reattach later: screen -r scanner
```

### Option B — systemd service (recommended for VPS)

Create `/etc/systemd/system/crypto-scanner.service`:

```ini
[Unit]
Description=Limitless Crypto Scanner
After=network.target

[Service]
Type=simple
User=YOUR_LINUX_USER
WorkingDirectory=/path/to/limitless-telegram-bot
Environment="BOT_TOKEN=1234567890:ABCDefGhIJKlmNoPQRsTUVwxyZ"
Environment="CHAT_ID=-1001234567890"
ExecStart=/path/to/limitless-telegram-bot/venv/bin/python scanner.py
Restart=on-failure
RestartSec=30

[Install]
WantedBy=multi-user.target
```

Then enable and start it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable crypto-scanner
sudo systemctl start crypto-scanner
sudo systemctl status crypto-scanner
```

View live logs:

```bash
sudo journalctl -u crypto-scanner -f
```

---

## Running the command bot alongside the scanner

`main.py` is an interactive Telegram bot (commands: `/start`, `/setcpr`, `/analyse`).  
It uses the same `BOT_TOKEN` but is a separate process — run it in a second terminal or a second systemd service:

```bash
python main.py
```

---

## Alert deduplication

Sent alerts are stored in `alerts.json` in the project directory, keyed by `SYMBOL_TIMEFRAME_CANDLE_OPEN_TIME`. The scanner will never send the same alert twice for the same closed candle. Entries older than 7 days are pruned automatically.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `KeyError: 'BOT_TOKEN'` | Export the environment variable before running |
| `telegram.error.Unauthorized` | Double-check the token from BotFather |
| No alerts after several scans | Conditions are genuinely strict — check logs for errors; consider lowering the EMA or MACD threshold |
| `binance.exceptions.BinanceAPIException` | Binance may be temporarily unavailable; the scanner retries on the next cycle |
| High CPU on Raspberry Pi | Reduce `TOP_N` in `scanner.py` (e.g. `TOP_N = 50`) |
