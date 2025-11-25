// Deck utilities: import, export, validation

export const DeckUtils = {
  // Validate deck structure
  validateDeck(deck) {
    if (!deck.language || !deck.name || !Array.isArray(deck.cards)) {
      return { valid: false, error: 'Invalid deck structure' }
    }

    for (const card of deck.cards) {
      if (!card.id || !card.base || !card.target) {
        return { valid: false, error: 'Cards must have id, base, and target fields' }
      }
    }

    return { valid: true }
  },

  // Export deck to JSON
  exportDeck(deck) {
    const dataStr = JSON.stringify(deck, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${deck.name.replace(/\s+/g, '-').toLowerCase()}.json`
    link.click()
    URL.revokeObjectURL(url)
  },

  // Import deck from file
  importDeck(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const deck = JSON.parse(e.target.result)
          const validation = this.validateDeck(deck)
          
          if (!validation.valid) {
            reject(new Error(validation.error))
            return
          }

          resolve(deck)
        } catch (error) {
          reject(new Error('Invalid JSON file'))
        }
      }

      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  },

  // Convert CSV to deck
  csvToDeck(csvText, language, name) {
    const lines = csvText.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim())
    
    const cards = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const card = {
        id: `${language}_${i}`,
        base: values[0] || '',
        target: values[1] || '',
        example_base: values[2] || '',
        example_target: values[3] || ''
      }
      cards.push(card)
    }

    return {
      language,
      name,
      cards
    }
  },

  // Convert deck to CSV
  deckToCSV(deck) {
    const headers = ['base', 'target', 'example_base', 'example_target']
    const lines = [headers.join(',')]
    
    deck.cards.forEach(card => {
      const row = [
        card.base || '',
        card.target || '',
        card.example_base || '',
        card.example_target || ''
      ]
      lines.push(row.join(','))
    })

    return lines.join('\n')
  },

  // Export deck as CSV
  exportDeckCSV(deck) {
    const csv = this.deckToCSV(deck)
    const dataBlob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${deck.name.replace(/\s+/g, '-').toLowerCase()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }
}

