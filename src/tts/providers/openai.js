// OpenAI TTS provider

import { BaseTTSProvider } from './base.js'

export class OpenAITTSProvider extends BaseTTSProvider {
  constructor(apiKey) {
    super()
    this.apiKey = apiKey
    this.baseURL = 'https://api.openai.com/v1/audio/speech'
  }

  isAvailable() {
    return !!this.apiKey
  }

  async speak(text, language, options = {}) {
    if (!this.isAvailable()) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const voice = this.mapLanguageToVoice(language)
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: voice,
          speed: options.rate || 1.0,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI TTS error: ${response.statusText}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)

      return new Promise((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl)
          resolve()
        }
        audio.onerror = reject
        audio.play()
      })
    } catch (error) {
      console.error('OpenAI TTS error:', error)
      throw error
    }
  }

  async stop() {
    // Stop any playing audio
    const audioElements = document.querySelectorAll('audio')
    audioElements.forEach(audio => {
      audio.pause()
      audio.currentTime = 0
    })
  }

  mapLanguageToVoice(language) {
    // OpenAI TTS voices: alloy, echo, fable, onyx, nova, shimmer
    const voiceMap = {
      'de': 'nova', // German
      'fr': 'nova', // French
      'ru': 'nova', // Russian
      'en': 'alloy',
    }
    return voiceMap[language] || 'alloy'
  }
}

