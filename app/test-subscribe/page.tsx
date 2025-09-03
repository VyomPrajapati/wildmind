'use client'

import { useState } from 'react'

export default function TestSubscribePage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [response, setResponse] = useState('')

  const testGet = async () => {
    try {
      setStatus('Testing GET...')
      const res = await fetch('/api/comingsoon/subscribe')
      const data = await res.json()
      setResponse(JSON.stringify(data, null, 2))
      setStatus(`GET Status: ${res.status}`)
    } catch (error) {
      setStatus(`GET Error: ${error}`)
    }
  }

  const testPost = async () => {
    try {
      setStatus('Testing POST...')
      const res = await fetch('/api/comingsoon/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, hp: '' })
      })
      const data = await res.json()
      setResponse(JSON.stringify(data, null, 2))
      setStatus(`POST Status: ${res.status}`)
    } catch (error) {
      setStatus(`POST Error: ${error}`)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Subscribe API Test</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="test@example.com"
          />
        </div>

        <div className="space-x-4">
          <button
            onClick={testGet}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test GET
          </button>
          <button
            onClick={testPost}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Test POST
          </button>
        </div>

        <div>
          <h3 className="font-medium mb-2">Status:</h3>
          <p className="text-sm text-gray-600">{status}</p>
        </div>

        <div>
          <h3 className="font-medium mb-2">Response:</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {response || 'No response yet'}
          </pre>
        </div>
      </div>
    </div>
  )
}
