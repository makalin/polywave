// Toast notification system

class ToastManager {
  constructor() {
    this.toasts = []
    this.listeners = []
  }

  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  notify() {
    this.listeners.forEach(listener => listener(this.toasts))
  }

  show(message, type = 'info', duration = 3000) {
    const id = Date.now() + Math.random()
    const toast = { id, message, type, duration }
    
    this.toasts.push(toast)
    this.notify()

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id)
      }, duration)
    }

    return id
  }

  success(message, duration = 3000) {
    return this.show(message, 'success', duration)
  }

  error(message, duration = 4000) {
    return this.show(message, 'error', duration)
  }

  warning(message, duration = 3000) {
    return this.show(message, 'warning', duration)
  }

  info(message, duration = 3000) {
    return this.show(message, 'info', duration)
  }

  remove(id) {
    this.toasts = this.toasts.filter(t => t.id !== id)
    this.notify()
  }

  clear() {
    this.toasts = []
    this.notify()
  }
}

export default new ToastManager()

