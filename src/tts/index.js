// TTS manager - selects and uses appropriate provider

import { WebSpeechTTSProvider } from './providers/webSpeech.js'
import { OpenAITTSProvider } from './providers/openai.js'

class TTSManager {
  constructor() {
    this.provider = null
    this.initialize()
  }

  initialize() {
    const providerType = import.meta.env.VITE_TTS_PROVIDER || 'web'
    const apiKey = import.meta.env.VITE_TTS_API_KEY

    if (providerType === 'openai' && apiKey) {
      this.provider = new OpenAITTSProvider(apiKey)
    } else {
      this.provider = new WebSpeechTTSProvider()
    }

    if (!this.provider.isAvailable()) {
      console.warn('TTS provider not available')
    }
  }

  async speak(text, language, options = {}) {
    if (!this.provider || !this.provider.isAvailable()) {
      throw new Error('TTS not available')
    }
    return this.provider.speak(text, language, options)
  }

  async stop() {
    if (this.provider) {
      return this.provider.stop()
    }
  }

  isAvailable() {
    return this.provider && this.provider.isAvailable()
  }
}

export default new TTSManager()

