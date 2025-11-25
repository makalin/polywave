// Web Speech Synthesis API provider

import { BaseTTSProvider } from './base.js'

export class WebSpeechTTSProvider extends BaseTTSProvider {
  constructor() {
    super()
    this.synthesis = window.speechSynthesis
    this.currentUtterance = null
  }

  isAvailable() {
    return 'speechSynthesis' in window
  }

  async speak(text, language, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable()) {
        reject(new Error('Web Speech Synthesis not available'))
        return
      }

      // Stop any current speech
      this.stop()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = this.mapLanguage(language)
      utterance.rate = options.rate || 1.0
      utterance.pitch = options.pitch || 1.0
      utterance.volume = options.volume || 1.0

      utterance.onend = () => {
        this.currentUtterance = null
        resolve()
      }

      utterance.onerror = (error) => {
        this.currentUtterance = null
        reject(error)
      }

      this.currentUtterance = utterance
      this.synthesis.speak(utterance)
    })
  }

  async stop() {
    if (this.synthesis.speaking) {
      this.synthesis.cancel()
    }
    this.currentUtterance = null
  }

  mapLanguage(language) {
    const langMap = {
      'de': 'de-DE',
      'fr': 'fr-FR',
      'ru': 'ru-RU',
      'en': 'en-US',
      'tr': 'tr-TR'
    }
    return langMap[language] || language
  }
}

