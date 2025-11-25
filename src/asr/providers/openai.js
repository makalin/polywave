// OpenAI Whisper API provider

import { BaseASRProvider } from './base.js'

export class OpenAIASRProvider extends BaseASRProvider {
  constructor(apiKey) {
    super()
    this.apiKey = apiKey
    this.baseURL = 'https://api.openai.com/v1/audio/transcriptions'
    this.mediaRecorder = null
    this.audioChunks = []
  }

  isAvailable() {
    return !!this.apiKey && navigator.mediaDevices && navigator.mediaDevices.getUserMedia
  }

  async startListening(options = {}) {
    if (!this.isAvailable()) {
      throw new Error('OpenAI ASR not available')
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.mediaRecorder = new MediaRecorder(stream)
      this.audioChunks = []

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data)
        }
      }

      return new Promise((resolve, reject) => {
        this.mediaRecorder.onstop = async () => {
          try {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' })
            const formData = new FormData()
            formData.append('file', audioBlob, 'recording.webm')
            formData.append('model', 'whisper-1')
            formData.append('language', this.mapLanguage(options.language || 'en'))

            const response = await fetch(this.baseURL, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${this.apiKey}`,
              },
              body: formData,
            })

            if (!response.ok) {
              throw new Error(`OpenAI ASR error: ${response.statusText}`)
            }

            const data = await response.json()
            resolve({ text: data.text, confidence: 0.9 }) // OpenAI doesn't provide confidence
          } catch (error) {
            reject(error)
          } finally {
            // Stop all tracks
            stream.getTracks().forEach(track => track.stop())
          }
        }

        this.mediaRecorder.onerror = reject
        this.mediaRecorder.start()
      })
    } catch (error) {
      console.error('OpenAI ASR error:', error)
      throw error
    }
  }

  async stopListening() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop()
    }
  }

  mapLanguage(language) {
    const langMap = {
      'de': 'de',
      'fr': 'fr',
      'ru': 'ru',
      'en': 'en',
      'tr': 'tr'
    }
    return langMap[language] || 'en'
  }
}

