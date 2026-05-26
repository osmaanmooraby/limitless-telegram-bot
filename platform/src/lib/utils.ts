import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, decimals: number = 2): string {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } else if (price >= 1) {
    return price.toFixed(decimals)
  } else {
    return price.toFixed(6)
  }
}

export function formatPercent(value: number, includeSign: boolean = true): string {
  const formatted = Math.abs(value).toFixed(2) + '%'
  if (!includeSign) return formatted
  return value >= 0 ? '+' + formatted : '-' + formatted
}

export function formatVolume(volume: number): string {
  if (volume >= 1e9) return (volume / 1e9).toFixed(2) + 'B'
  if (volume >= 1e6) return (volume / 1e6).toFixed(2) + 'M'
  if (volume >= 1e3) return (volume / 1e3).toFixed(2) + 'K'
  return volume.toFixed(2)
}

export function timeAgo(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}

export function getSignalColor(direction: string): string {
  switch (direction?.toUpperCase()) {
    case 'BULLISH': return 'text-green-400'
    case 'BEARISH': return 'text-red-400'
    default: return 'text-yellow-400'
  }
}

export function getSignalBgColor(direction: string): string {
  switch (direction?.toUpperCase()) {
    case 'BULLISH': return 'bg-green-500/20 border-green-500/30'
    case 'BEARISH': return 'bg-red-500/20 border-red-500/30'
    default: return 'bg-yellow-500/20 border-yellow-500/30'
  }
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return 'text-green-400'
  if (confidence >= 60) return 'text-yellow-400'
  if (confidence >= 40) return 'text-orange-400'
  return 'text-red-400'
}

export function getStrengthLabel(strength: string): string {
  switch (strength) {
    case 'VERY_STRONG': return 'Very Strong'
    case 'STRONG': return 'Strong'
    case 'MODERATE': return 'Moderate'
    case 'WEAK': return 'Weak'
    default: return strength
  }
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.substr(0, n - 1) + '...' : str
}
