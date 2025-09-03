import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Environment check',
    timestamp: new Date().toISOString(),
    environment: {
      GMAIL_USER: process.env.GMAIL_USER ? 'SET' : 'NOT SET',
      GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD ? 'SET' : 'NOT SET',
      APPS_SCRIPT_WEBHOOK_URL: process.env.APPS_SCRIPT_WEBHOOK_URL ? 'SET' : 'NOT SET',
      APPS_SCRIPT_SECRET: process.env.APPS_SCRIPT_SECRET ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  })
}


