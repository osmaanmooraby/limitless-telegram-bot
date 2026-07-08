import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'fallback-32-char-key-change-prod!'

export function encryptApiKey(text: string): string {
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString()
}

export function decryptApiKey(cipherText: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch {
    return ''
  }
}

export function encryptData(data: unknown): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString()
}

export function decryptData(cipherText: string): unknown {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, ENCRYPTION_KEY)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
  } catch {
    return null
  }
}
