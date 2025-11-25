// Base ASR provider interface

export class BaseASRProvider {
  async startListening(options = {}) {
    throw new Error('startListening() must be implemented by subclass')
  }

  async stopListening() {
    throw new Error('stopListening() must be implemented by subclass')
  }

  isAvailable() {
    return false
  }
}

