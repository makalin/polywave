// Keyboard shortcuts manager

class KeyboardManager {
  constructor() {
    this.shortcuts = new Map()
    this.enabled = true
  }

  register(key, callback, options = {}) {
    const { ctrl = false, shift = false, alt = false } = options
    const keyCombo = `${ctrl ? 'ctrl+' : ''}${shift ? 'shift+' : ''}${alt ? 'alt+' : ''}${key.toLowerCase()}`
    
    this.shortcuts.set(keyCombo, callback)
  }

  unregister(keyCombo) {
    this.shortcuts.delete(keyCombo)
  }

  handleKeyDown(event) {
    if (!this.enabled) return

    const key = event.key.toLowerCase()
    const ctrl = event.ctrlKey || event.metaKey
    const shift = event.shiftKey
    const alt = event.altKey

    // Don't trigger shortcuts when typing in inputs
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return
    }

    const keyCombo = `${ctrl ? 'ctrl+' : ''}${shift ? 'shift+' : ''}${alt ? 'alt+' : ''}${key}`
    const callback = this.shortcuts.get(keyCombo)

    if (callback) {
      event.preventDefault()
      callback(event)
    }
  }

  enable() {
    this.enabled = true
  }

  disable() {
    this.enabled = false
  }

  init() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e))
  }
}

export default new KeyboardManager()

