// Deck loader - loads vocabulary decks from JSON files

export async function loadDeck(deckPath) {
  try {
    const response = await fetch(deckPath)
    if (!response.ok) {
      throw new Error(`Failed to load deck: ${response.statusText}`)
    }
    const deck = await response.json()
    return deck
  } catch (error) {
    console.error('Error loading deck:', error)
    throw error
  }
}

export async function loadAllDecks() {
  const deckFiles = [
    '/decks/german-basics.json',
    '/decks/french-basics.json',
    '/decks/russian-basics.json',
  ]

  const decks = []
  for (const file of deckFiles) {
    try {
      const deck = await loadDeck(file)
      decks.push(deck)
    } catch (error) {
      console.warn(`Could not load deck ${file}:`, error)
    }
  }

  return decks
}

export function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

