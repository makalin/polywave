// Web Speech Recognition API provider

import { BaseASRProvider } from './base.js'

export class WebSpeechASRProvider extends BaseASRProvider {
  constructor() {
    super()
    this.recognition = null
    this.initialize()
  }

  initialize() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition()
      this.recognition.continuous = false
      this.recognition.interimResults = false
    }
  }

  isAvailable() {
    return !!this.recognition
  }

  async startListening(options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable()) {
        reject(new Error('Web Speech Recognition not available'))
        return
      }

      this.recognition.lang = this.mapLanguage(options.language || 'en-US')
      this.recognition.maxAlternatives = 1

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        const confidence = event.results[0][0].confidence
        resolve({ text: transcript, confidence })
      }

      this.recognition.onerror = (event) => {
        reject(new Error(`Speech recognition error: ${event.error}`))
      }

      this.recognition.onend = () => {
        // Recognition ended
      }

      this.recognition.start()
    })
  }

  async stopListening() {
    if (this.recognition && this.recognition.state !== 'inactive') {
      this.recognition.stop()
    }
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

