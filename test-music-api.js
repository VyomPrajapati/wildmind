// Test script for music generation API
const testMusicGeneration = async () => {
  console.log('🎵 Testing Music Generation API...')
  
  const testData = {
    model: "music-1.5",
    prompt: "Generate music based on the provided lyrics",
    lyrics: "This is a test song\nWith simple lyrics\nTo check if the API works\nPlease generate some music for us",
    audio_setting: {
      sample_rate: 44100,
      bitrate: 256000,
      format: "mp3"
    },
    output_format: "hex"
  }

  try {
    console.log('📤 Sending request to /api/generate-music...')
    console.log('Request data:', JSON.stringify(testData, null, 2))
    
    const startTime = Date.now()
    
    const response = await fetch('http://localhost:3000/api/generate-music', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })

    const endTime = Date.now()
    const duration = endTime - startTime
    
    console.log(`⏱️ Request took ${duration}ms`)
    console.log(`📥 Response status: ${response.status}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API Error:', errorText)
      return
    }

    const data = await response.json()
    console.log('✅ API Response:', JSON.stringify(data, null, 2))
    
    if (data.status_code === 0) {
      console.log('🎉 Music generation successful!')
      if (data.audio_data) {
        console.log(`📊 Audio data length: ${data.audio_data.length} characters`)
      }
      if (data.audio_url) {
        console.log(`🔗 Audio URL: ${data.audio_url}`)
      }
    } else {
      console.log('⚠️ Music generation failed:', data.status_msg)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Check if MINIMAX_API_KEY is set
if (!process.env.MINIMAX_API_KEY) {
  console.error('❌ MINIMAX_API_KEY environment variable is not set!')
  console.log('💡 Make sure to set it in your .env.local file')
  process.exit(1)
}

console.log('🔑 MINIMAX_API_KEY is set')
testMusicGeneration() 