import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
// Ensure Node.js runtime so we can read environment and perform network IO reliably
export const runtime = 'nodejs'
// As a safety net (esp. in dev on Windows), explicitly load .env.local if Next.js
// hasn't already populated process.env. This is a no-op if vars are present.
try {
  dotenv.config({ path: process.cwd() + '/.env.local' })
} catch {}

// Extra fallback: manually read .env.local if still missing at runtime
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

// OPTIONS method for CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

// GET method for testing if the endpoint is accessible
export async function GET() {
  console.log('[Subscribe] GET endpoint called - testing accessibility')
  return NextResponse.json({ 
    message: 'Subscribe endpoint is accessible',
    timestamp: new Date().toISOString(),
    env: {
      gmailUser: process.env.GMAIL_USER ? 'SET' : 'NOT SET',
      gmailPass: process.env.GMAIL_APP_PASSWORD ? 'SET' : 'NOT SET'
    }
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  })
}

// POST /api/comingsoon/subscribe
export async function POST(request: Request) {
  console.log('[Subscribe] API endpoint called')
  console.log('[Subscribe] Environment variables check:')
  console.log('[Subscribe] GMAIL_USER:', process.env.GMAIL_USER ? 'SET' : 'NOT SET')
  console.log('[Subscribe] GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? 'SET' : 'NOT SET')
  console.log('[Subscribe] APPS_SCRIPT_WEBHOOK_URL:', process.env.APPS_SCRIPT_WEBHOOK_URL ? 'SET' : 'NOT SET')
  
  try {
    const { email, hp } = await request.json()
    console.log('[Subscribe] Request body received:', { email: email ? 'PROVIDED' : 'NOT PROVIDED', hp: hp ? 'PROVIDED' : 'NOT PROVIDED' })

    // 0) Bot defenses
    // Honeypot: if provided, assume bot
    if (typeof hp === 'string' && hp.trim().length > 0) {
      return NextResponse.json({ ok: true }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      })
    }
    // Basic rate-limiting per IP (very light, in-memory best-effort for dev)
    const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'local'
    ;(global as any).__SUBMIT_WINDOW__ = (global as any).__SUBMIT_WINDOW__ || {}
    const nowMs = Date.now()
    const windowMs = 10_000
    const maxPerWindow = 3
    const bucket = (global as any).__SUBMIT_WINDOW__
    bucket[ip] = (bucket[ip] || []).filter((t: number) => nowMs - t < windowMs)
    if (bucket[ip].length >= maxPerWindow) {
      return NextResponse.json({ error: 'RATE_LIMITED' }, { 
        status: 429,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      })
    }
    bucket[ip].push(nowMs)

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      })
    }

    // Email sending functionality is commented out - keeping for future use
    // Currently only collecting emails in Google Sheets

    // Log signup without Google Cloud using Google Apps Script Web App (optional)
    // If you set APPS_SCRIPT_WEBHOOK_URL to a deployed Apps Script Web App URL,
    // we will POST { email, timestamp } to it. The script can append rows to a Google Sheet.
    try {
      const webhookRaw = process.env.APPS_SCRIPT_WEBHOOK_URL || ''
      const webhook = webhookRaw.trim()
      if (!webhook) {
        console.error('[Subscribe] Missing APPS_SCRIPT_WEBHOOK_URL at runtime')
      }
      if (webhook) {
        const now = new Date().toISOString()
        const webhookRes = await fetch(webhook, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ email, timestamp: now, secret: process.env.APPS_SCRIPT_SECRET || '' })
        })
        const text = await webhookRes.text()
        // Try to parse JSON if possible
        let parsed: any = undefined
        try { parsed = JSON.parse(text) } catch {}

        if (!webhookRes.ok || (parsed && parsed.ok === false)) {
          console.error('[Subscribe] Apps Script webhook non-OK:', webhookRes.status, text)
          return NextResponse.json({ ok: false, error: 'WEBHOOK_FAILED', details: parsed || text }, { 
            status: 502,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
          })
        }
      }
    } catch (e) {
      console.error('[Subscribe] Apps Script webhook failed:', e)
      return NextResponse.json({ ok: false, error: 'WEBHOOK_ERROR' }, { 
        status: 502,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      })
    }

    return NextResponse.json({ ok: true }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })
  } catch (err) {
    console.error('[Subscribe] Unhandled error:', err)
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    })
  }
}


