#!/usr/bin/env python3
"""
Crypto Scanner — top 100 Binance USDT pairs.
Conditions: EMA25 reclaim + MACD bullish crossover + volume > 20-period average.
Runs every 15 minutes and sends Telegram alerts (no duplicates per candle).
"""

import asyncio
import json
import logging
import os
import time
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd
import pandas_ta as ta
from binance.client import Client
from telegram import Bot
from telegram.error import TelegramError

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger(__name__)

# ── Configuration ────────────────────────────────────────────────────────────
BOT_TOKEN = os.environ["BOT_TOKEN"]
CHAT_ID = os.environ["CHAT_ID"]

ALERTS_FILE = Path("alerts.json")
SCAN_INTERVAL = 15 * 60          # seconds
TOP_N = 100
EMA_PERIOD = 25
VOL_MA_PERIOD = 20
KLINE_LIMIT = 120                 # candles fetched per symbol/timeframe

TIMEFRAMES = [
    ("1H", Client.KLINE_INTERVAL_1HOUR),
    ("4H", Client.KLINE_INTERVAL_4HOUR),
]

# Symbols to skip (stablecoins, leveraged tokens)
_SKIP_SUFFIXES = ("DOWNUSDT", "UPUSDT", "BULLUSDT", "BEARUSDT")
_SKIP_SYMBOLS = {"BUSDUSDT", "USDCUSDT", "TUSDUSDT", "USDPUSDT", "DAIUSDT", "FRAXUSDT"}

BRAND = "🧠 10x Limitless Analysis by Osmaan Mooraby"


# ── Alert storage ─────────────────────────────────────────────────────────────

def _load_alerts() -> dict:
    if ALERTS_FILE.exists():
        try:
            return json.loads(ALERTS_FILE.read_text())
        except json.JSONDecodeError:
            return {}
    return {}


def _save_alerts(alerts: dict) -> None:
    ALERTS_FILE.write_text(json.dumps(alerts, indent=2))


def _prune_old_alerts(alerts: dict, max_age_days: int = 7) -> dict:
    cutoff = datetime.now(timezone.utc).timestamp() - max_age_days * 86400
    return {
        k: v for k, v in alerts.items()
        if datetime.fromisoformat(v).timestamp() > cutoff
    }


# ── Binance helpers ───────────────────────────────────────────────────────────

def _get_top_usdt_pairs(client: Client) -> list:
    tickers = client.get_ticker()
    filtered = [
        t for t in tickers
        if t["symbol"].endswith("USDT")
        and not any(t["symbol"].endswith(s) for s in _SKIP_SUFFIXES)
        and t["symbol"] not in _SKIP_SYMBOLS
    ]
    filtered.sort(key=lambda x: float(x["quoteVolume"]), reverse=True)
    return [t["symbol"] for t in filtered[:TOP_N]]


def _fetch_ohlcv(client: Client, symbol: str, interval: str) -> pd.DataFrame:
    raw = client.get_klines(symbol=symbol, interval=interval, limit=KLINE_LIMIT)
    df = pd.DataFrame(raw, columns=[
        "open_time", "open", "high", "low", "close", "volume",
        "close_time", "quote_vol", "trades",
        "taker_base", "taker_quote", "ignore",
    ])
    for col in ("open", "high", "low", "close", "volume"):
        df[col] = pd.to_numeric(df[col])
    df["open_time"] = pd.to_datetime(df["open_time"], unit="ms", utc=True)
    return df


# ── Signal detection ──────────────────────────────────────────────────────────

def _check_conditions(df: pd.DataFrame) -> dict | None:
    """
    Returns a dict of signal data when all three conditions fire on the last
    CLOSED candle, otherwise returns None.

    We deliberately ignore the last row (index -1) because it is the current
    in-progress candle whose volume is incomplete.
    """
    df = df.copy()
    df["ema25"] = ta.ema(df["close"], length=EMA_PERIOD)

    macd_df = ta.macd(df["close"], fast=12, slow=26, signal=9)
    df["macd"] = macd_df["MACD_12_26_9"]
    df["macd_sig"] = macd_df["MACDs_12_26_9"]

    df["vol_ma"] = df["volume"].rolling(VOL_MA_PERIOD).mean()

    df.dropna(inplace=True)
    df.reset_index(drop=True, inplace=True)

    if len(df) < 3:
        return None

    # last CLOSED candle = -2 (index -1 is still forming)
    prev = df.iloc[-3]
    curr = df.iloc[-2]

    # Condition 1 — EMA25 reclaim: previous close below, current close above
    ema_reclaim = (prev["close"] < prev["ema25"]) and (curr["close"] > curr["ema25"])

    # Condition 2 — MACD bullish crossover: MACD crosses above Signal line
    macd_cross = (prev["macd"] < prev["macd_sig"]) and (curr["macd"] > curr["macd_sig"])

    # Condition 3 — Volume above 20-period average
    vol_above = curr["volume"] > curr["vol_ma"]

    if not (ema_reclaim and macd_cross and vol_above):
        return None

    return {
        "candle_time": curr["open_time"].isoformat(),
        "price":       curr["close"],
        "ema25":       curr["ema25"],
        "macd":        curr["macd"],
        "macd_sig":    curr["macd_sig"],
        "volume":      curr["volume"],
        "vol_ma":      curr["vol_ma"],
    }


# ── Telegram message ──────────────────────────────────────────────────────────

def _build_message(symbol: str, tf_label: str, sig: dict) -> str:
    price    = sig["price"]
    ema25    = sig["ema25"]
    macd     = sig["macd"]
    macd_sig = sig["macd_sig"]
    volume   = sig["volume"]
    vol_ma   = sig["vol_ma"]

    # Choose decimal places based on price magnitude
    if price >= 100:
        price_fmt = f"{price:,.2f}"
        ema_fmt   = f"{ema25:,.2f}"
    elif price >= 1:
        price_fmt = f"{price:,.4f}"
        ema_fmt   = f"{ema25:,.4f}"
    else:
        price_fmt = f"{price:.8f}"
        ema_fmt   = f"{ema25:.8f}"

    return (
        f"🚀 *Setup Alert — {symbol}*\n\n"
        f"📊 *Timeframe:* `{tf_label}`\n"
        f"💰 *Current Price:* `{price_fmt} USDT`\n"
        f"📈 *EMA Status:* Reclaimed EMA25 ✅ _(EMA: {ema_fmt})_\n"
        f"⚡ *MACD Status:* Bullish crossover ✅ "
        f"_(MACD: {macd:.6f} > Sig: {macd_sig:.6f})_\n"
        f"📦 *Volume Status:* Above 20‑period avg ✅ "
        f"_(Vol: {volume:,.0f} | MA20: {vol_ma:,.0f})_\n\n"
        f"_{BRAND}_"
    )


async def _send(bot: Bot, text: str) -> None:
    await bot.send_message(chat_id=CHAT_ID, text=text, parse_mode="Markdown")


# ── Main scan loop ────────────────────────────────────────────────────────────

async def run_scan(client: Client, bot: Bot) -> None:
    log.info("Scan started")
    alerts = _load_alerts()

    try:
        symbols = _get_top_usdt_pairs(client)
    except Exception as exc:
        log.error("Failed to fetch top pairs: %s", exc)
        return

    log.info("Scanning %d USDT pairs across %d timeframes", len(symbols), len(TIMEFRAMES))
    fired = 0

    for symbol in symbols:
        for tf_label, tf_interval in TIMEFRAMES:
            try:
                df = _fetch_ohlcv(client, symbol, tf_interval)
                sig = _check_conditions(df)
                if sig is None:
                    continue

                alert_key = f"{symbol}_{tf_label}_{sig['candle_time']}"
                if alert_key in alerts:
                    continue  # already alerted for this candle

                msg = _build_message(symbol, tf_label, sig)
                await _send(bot, msg)
                alerts[alert_key] = datetime.now(timezone.utc).isoformat()
                _save_alerts(alerts)

                log.info("Alert sent  →  %s  %s", symbol, tf_label)
                fired += 1
                await asyncio.sleep(0.3)   # stay within Telegram rate limit

            except TelegramError as exc:
                log.error("Telegram error [%s %s]: %s", symbol, tf_label, exc)
            except Exception as exc:
                log.error("Error [%s %s]: %s", symbol, tf_label, exc)

    # Prune stale alert entries
    alerts = _prune_old_alerts(alerts)
    _save_alerts(alerts)

    log.info("Scan complete — %d alert(s) fired", fired)


async def main() -> None:
    log.info("Crypto scanner initialising…")
    client = Client()          # public endpoints — no API key required
    bot    = Bot(token=BOT_TOKEN)

    # Verify bot token immediately
    me = await bot.get_me()
    log.info("Bot connected: @%s", me.username)

    log.info("Scanning every %d minutes. Press Ctrl+C to stop.", SCAN_INTERVAL // 60)

    while True:
        start = time.monotonic()
        try:
            await run_scan(client, bot)
        except Exception as exc:
            log.error("Unhandled scan error: %s", exc)

        elapsed = time.monotonic() - start
        sleep_for = max(0, SCAN_INTERVAL - elapsed)
        log.info("Next scan in %.0f s", sleep_for)
        await asyncio.sleep(sleep_for)


if __name__ == "__main__":
    asyncio.run(main())
