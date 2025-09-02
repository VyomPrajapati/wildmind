import { google } from 'googleapis'

export type AppendRowInput = {
  spreadsheetId: string
  sheetName: string
  values: (string | number | boolean | null)[]
}

function getGoogleAuth() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  let privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY

  if (!clientEmail || !privateKey) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL/KEY not configured')
  }

  // Support escaped newlines stored in env vars
  privateKey = privateKey.replace(/\\n/g, '\n')

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

export async function appendRow({ spreadsheetId, sheetName, values }: AppendRowInput) {
  const auth = getGoogleAuth()
  const sheets = google.sheets({ version: 'v4', auth })

  const range = `${sheetName}!A1`
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [values],
    },
  })
}


