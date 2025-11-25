// LocalStorage utilities for game state

export const Storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (e) {
      return defaultValue
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error('Storage set error:', e)
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.error('Storage remove error:', e)
    }
  },

  // Game-specific storage
  getStats() {
    return this.get('polywave_stats', {
      xp: 0,
      level: 1,
      streak: 0,
      lastPracticeDate: null,
      languages: {}
    })
  },

  setStats(stats) {
    this.set('polywave_stats', stats)
  },

  getLanguageStats(language) {
    const stats = this.getStats()
    if (!stats.languages[language]) {
      stats.languages[language] = {
        xp: 0,
        cardsStudied: 0,
        perfectCount: 0,
        goodCount: 0,
        retryCount: 0
      }
    }
    return stats.languages[language]
  },

  updateLanguageStats(language, updates) {
    const stats = this.getStats()
    if (!stats.languages[language]) {
      stats.languages[language] = {
        xp: 0,
        cardsStudied: 0,
        perfectCount: 0,
        goodCount: 0,
        retryCount: 0
      }
    }
    Object.assign(stats.languages[language], updates)
    this.setStats(stats)
  },

  // Card progress for SRS
  getCardProgress() {
    return this.get('polywave_card_progress', {})
  },

  setCardProgress(progress) {
    this.set('polywave_card_progress', progress)
  },

  updateCardProgress(cardId, updates) {
    const progress = this.getCardProgress()
    progress[cardId] = {
      ...progress[cardId],
      ...updates,
      lastReviewed: new Date().toISOString()
    }
    this.setCardProgress(progress)
  },

  // Custom decks
  getCustomDecks() {
    return this.get('polywave_custom_decks', [])
  },

  setCustomDecks(decks) {
    this.set('polywave_custom_decks', decks)
  },

  addCustomDeck(deck) {
    const decks = this.getCustomDecks()
    decks.push(deck)
    this.setCustomDecks(decks)
  },

  // Settings
  getSettings() {
    return this.get('polywave_settings', {
      ttsRate: 0.9,
      ttsPitch: 1.0,
      dailyGoal: 10,
      enableSounds: true,
      theme: 'retro'
    })
  },

  setSettings(settings) {
    this.set('polywave_settings', settings)
  }
}

