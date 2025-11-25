// Base TTS provider interface

export class BaseTTSProvider {
  async speak(text, language, options = {}) {
    throw new Error('speak() must be implemented by subclass')
  }

  async stop() {
    throw new Error('stop() must be implemented by subclass')
  }

  isAvailable() {
    return false
  }
}

