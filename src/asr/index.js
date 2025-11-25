// ASR manager - selects and uses appropriate provider

import { WebSpeechASRProvider } from './providers/webSpeech.js'
import { OpenAIASRProvider } from './providers/openai.js'

class ASRManager {
  constructor() {
    this.provider = null
    this.initialize()
  }

  initialize() {
    const providerType = import.meta.env.VITE_ASR_PROVIDER || 'web'
    const apiKey = import.meta.env.VITE_ASR_API_KEY

    if (providerType === 'openai' && apiKey) {
      this.provider = new OpenAIASRProvider(apiKey)
    } else {
      this.provider = new WebSpeechASRProvider()
    }

    if (!this.provider.isAvailable()) {
      console.warn('ASR provider not available')
    }
  }

  async startListening(options = {}) {
    if (!this.provider || !this.provider.isAvailable()) {
      throw new Error('ASR not available')
    }
    return this.provider.startListening(options)
  }

  async stopListening() {
    if (this.provider) {
      return this.provider.stopListening()
    }
  }

  isAvailable() {
    return this.provider && this.provider.isAvailable()
  }
}

export default new ASRManager()

