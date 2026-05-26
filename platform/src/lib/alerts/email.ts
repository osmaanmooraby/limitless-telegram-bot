/**
 * Email Alert Service using Nodemailer
 */

import type { MarketSignal } from '@/types'

interface EmailConfig {
  to: string
  subject: string
  html: string
}

export async function sendEmail(config: EmailConfig): Promise<boolean> {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return false

  try {
    const nodemailer = await import('nodemailer')
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })

    await transporter.sendMail({
      from: process.env.SMTP_FROM || '10X Limitless <alerts@10xlimitless.com>',
      to: config.to,
      subject: config.subject,
      html: config.html,
    })
    return true
  } catch (err) {
    console.error('Email send error:', err)
    return false
  }
}

export function buildSignalEmailHtml(signal: MarketSignal): string {
  const directionColor = signal.direction === 'BULLISH' ? '#22c55e' : signal.direction === 'BEARISH' ? '#ef4444' : '#eab308'
  const confidenceColor = signal.confidence >= 80 ? '#22c55e' : signal.confidence >= 65 ? '#eab308' : '#f97316'
  const formatPrice = (p: number) => p >= 1000 ? p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : p >= 1 ? p.toFixed(2) : p.toFixed(6)

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080808;font-family:Inter,system-ui,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:24px;">
      <div style="background:linear-gradient(135deg,#D4AF37,#F5E47E);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:22px;font-weight:900;letter-spacing:-0.5px;">10X LIMITLESS</div>
      <div style="color:#6b7280;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-top:4px;">Intelligence Platform</div>
    </div>

    <!-- Signal Card -->
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:24px;margin-bottom:16px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <div>
          <div style="font-size:24px;font-weight:900;color:#ffffff;">${signal.symbol}</div>
          <div style="color:#6b7280;font-size:13px;">${signal.exchange} · ${signal.timeframe}</div>
        </div>
        <div style="background:${directionColor}22;border:1px solid ${directionColor}44;border-radius:8px;padding:6px 14px;color:${directionColor};font-weight:700;font-size:14px;">${signal.direction}</div>
      </div>

      <div style="color:#D4AF37;font-size:36px;font-weight:900;margin-bottom:4px;">$${formatPrice(signal.currentPrice)}</div>
      <div style="color:${confidenceColor};font-size:14px;font-weight:600;margin-bottom:20px;">${signal.confidence.toFixed(0)}% Confidence · ${signal.signalType.replace(/_/g, ' ')}</div>

      ${signal.targetPrice || signal.stopLoss ? `
      <div style="display:flex;gap:12px;margin-bottom:20px;">
        ${signal.targetPrice ? `<div style="flex:1;background:#22c55e18;border:1px solid #22c55e33;border-radius:8px;padding:12px;text-align:center;"><div style="color:#6b7280;font-size:11px;margin-bottom:4px;">TARGET</div><div style="color:#22c55e;font-weight:700;">$${formatPrice(signal.targetPrice)}</div></div>` : ''}
        ${signal.stopLoss ? `<div style="flex:1;background:#ef444418;border:1px solid #ef444433;border-radius:8px;padding:12px;text-align:center;"><div style="color:#6b7280;font-size:11px;margin-bottom:4px;">STOP LOSS</div><div style="color:#ef4444;font-weight:700;">$${formatPrice(signal.stopLoss)}</div></div>` : ''}
        ${signal.riskRewardRatio ? `<div style="flex:1;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:12px;text-align:center;"><div style="color:#6b7280;font-size:11px;margin-bottom:4px;">R:R RATIO</div><div style="color:#ffffff;font-weight:700;">${signal.riskRewardRatio.toFixed(1)}:1</div></div>` : ''}
      </div>` : ''}

      <!-- Explanation -->
      <div style="background:rgba(212,175,55,0.05);border:1px solid rgba(212,175,55,0.15);border-radius:10px;padding:16px;">
        <div style="color:#D4AF37;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Signal Explanation</div>
        <div style="color:#9ca3af;font-size:14px;line-height:1.6;">${signal.explanation}</div>
      </div>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:24px;">
      <a href="https://10xlimitless.com/signals" style="background:linear-gradient(135deg,#D4AF37,#F5E47E);color:#000000;font-weight:700;font-size:14px;padding:14px 32px;border-radius:10px;text-decoration:none;display:inline-block;">View Full Analysis →</a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;color:#374151;font-size:12px;">
      <p>You received this because you have email alerts enabled.</p>
      <p>10X Limitless · Where Real Traders Are Made</p>
      <p style="color:#1f2937;">Not financial advice. Trade responsibly.</p>
    </div>
  </div>
</body>
</html>`
}

export async function sendSignalEmail(email: string, signal: MarketSignal): Promise<boolean> {
  const directionIcon = signal.direction === 'BULLISH' ? '🟢' : '🔴'
  return sendEmail({
    to: email,
    subject: `${directionIcon} ${signal.symbol} ${signal.direction} Signal — ${signal.confidence.toFixed(0)}% Confidence | 10X Limitless`,
    html: buildSignalEmailHtml(signal),
  })
}
