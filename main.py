import logging
import pandas as pd
import pandas_ta as ta
from binance.client import Client
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

# 10x Limitless Branding
BRAND = "🧠 10x Limitless Analysis by Osmaan Mooraby"

# Store CPR data here
CPR_LEVELS = {}

def parse_setcpr(args):
    sym = args[0].upper()
    pivot, s1, r1 = map(float, args[1:4])
    CPR_LEVELS[sym] = {"pivot": pivot, "s1": s1, "r1": r1}
    return sym

def fetch_ohlc(symbol, interval, limit=100):
    client = Client()
    kl = client.get_klines(symbol=symbol, interval=interval, limit=limit)
    df = pd.DataFrame(kl, columns=[
        "open_time","o","h","l","c","v",
        "close_time","q","n","taker","ignore"
    ])
    df[['h','l','c']] = df[['h','l','c']].astype(float)
    return df

def prev_high_low(symbol):
    df = fetch_ohlc(symbol, "1d", limit=2)
    return df["h"].iloc[-2], df["l"].iloc[-2]

def analyse(symbol):
    results = {}
    for tf, iv in [("1H","1h"), ("4H","4h"), ("1D","1d")]:
        df = fetch_ohlc(symbol, iv, limit=200)
        df["macd_line"], df["macd_signal"], _ = ta.macd(df["c"], fast=12, slow=26, signal=9)
        df["rsi"] = ta.rsi(df["c"], length=14)
        df["ema25"] = ta.ema(df["c"], length=25)
        latest = df.iloc[-1]
        macd = latest["macd_line"] - latest["macd_signal"]
        macd_status = "Bullish" if macd > 0 else "Bearish" if macd < 0 else "Neutral"
        rsi_num = latest["rsi"]
        rsi_status = "Overbought" if rsi_num > 70 else "Oversold" if rsi_num < 30 else "Neutral"
        ema_bias = "✅" if latest["c"] > latest["ema25"] else "❌"
        results[tf] = {
            "macd": macd_status,
            "rsi": f"{rsi_num:.1f}",
            "rsi_stat": rsi_status,
            "ema_bias": ema_bias
        }
    return results

async def start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(f"{BRAND}\nUse /setcpr and /analyse <SYMBOL> to get sniper reports.")

async def setcpr(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    try:
        sym = parse_setcpr(ctx.args)
        await update.message.reply_text(f"✅ Stored CPR for {sym}")
    except Exception:
        await update.message.reply_text("❗ Usage: /setcpr BTCUSDT PIVOT S1 R1")

async def analyse_cmd(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not ctx.args:
        await update.message.reply_text("❗ Usage: /analyse BTCUSDT")
        return
    sym = ctx.args[0].upper()
    if sym not in CPR_LEVELS:
        await update.message.reply_text("❗ Use /setcpr first to set your CPR levels.")
        return
    pivot, s1, r1 = CPR_LEVELS[sym]["pivot"], CPR_LEVELS[sym]["s1"], CPR_LEVELS[sym]["r1"]
    ph, pl = prev_high_low(sym)
    indicators = analyse(sym)
    msg = [f"{BRAND}\nSymbol: {sym}\n"]
    msg.append(f"📊 CPR Levels:\nPivot: {pivot} | S1: {s1} | R1: {r1}")
    msg.append(f"⏪ Prev High/Low (1D): {ph:.2f} / {pl:.2f}\n")
    for tf, v in indicators.items():
        msg.append(f"📉 {tf} MACD: {v['macd']} | RSI: {v['rsi']} ({v['rsi_stat']}) | EMA25 Bias: {v['ema_bias']}")
    tf4 = indicators["4H"]
    trend = "🔺 Bullish Bias" if tf4["macd"]=="Bullish" and tf4["ema_bias"]=="✅" else "🔻 Bearish Bias"
    msg.append(f"\n📌 4H Trend Summary: {trend}")
    await update.message.reply_text("\n".join(msg))

if __name__ == "__main__":
    import os
    import asyncio
    from telegram.ext import ApplicationBuilder, CommandHandler

    logging.basicConfig(level=logging.INFO)
    TOKEN = os.environ.get("BOT_TOKEN")
    app = ApplicationBuilder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("setcpr", setcpr))
    app.add_handler(CommandHandler("analyse", analyse_cmd))
    logging.info("Bot is live 🚀")
    asyncio.run(app.run_polling())