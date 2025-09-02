import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
export const runtime = 'nodejs'

// Try to load .env.local similarly to the subscribe route
try {
  dotenv.config({ path: process.cwd() + '/.env.local' })
} catch {}

function loadEnvFromFile() {
  if ((process.env as any).__ENV_LOADED_MANUAL__) return
  const guessPaths = [
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), '..', '.env.local'),
    path.join(process.cwd(), 'wildmind', 'aryanresponsivearyan', '.env.local'),
  ]
  for (const p of guessPaths) {
    try {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8')
        for (const line of content.split(/\r?\n/)) {
          if (!line || line.trim().startsWith('#')) continue
          const idx = line.indexOf('=')
          if (idx === -1) continue
          const key = line.slice(0, idx).trim()
          const val = line.slice(idx + 1).trim()
          if (!process.env[key]) process.env[key] = val
        }
        ;(process.env as any).__ENV_LOADED_MANUAL__ = '1'
        break
      }
    } catch {}
  }
}
loadEnvFromFile()

export async function GET() {
  const v = (name: string) => (process.env[name] || '').toString().trim()
  const mask = (s: string) => (s ? s[0] + '***' + s.slice(-3) : '')
  return NextResponse.json({
    has_GMAIL_USER: !!v('GMAIL_USER'),
    has_GMAIL_APP_PASSWORD: !!v('GMAIL_APP_PASSWORD'),
    has_APPS_SCRIPT_WEBHOOK_URL: !!v('APPS_SCRIPT_WEBHOOK_URL'),
    has_APPS_SCRIPT_SECRET: !!v('APPS_SCRIPT_SECRET'),
    sample: {
      GMAIL_USER: mask(v('GMAIL_USER')),
      GMAIL_APP_PASSWORD: mask(v('GMAIL_APP_PASSWORD')),
      APPS_SCRIPT_WEBHOOK_URL: v('APPS_SCRIPT_WEBHOOK_URL') ? 'set' : '',
    },
  })
}


