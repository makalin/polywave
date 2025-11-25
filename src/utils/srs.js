// Spaced Repetition System (SRS) - SM-2 algorithm inspired

export class SRS {
  // Calculate next review date based on performance
  static calculateNextReview(score, currentInterval, easeFactor = 2.5) {
    let newInterval
    let newEaseFactor = easeFactor

    if (score === 'perfect') {
      if (currentInterval === 0) {
        newInterval = 1 // First review: next day
      } else if (currentInterval === 1) {
        newInterval = 6 // Second review: 6 days
      } else {
        newInterval = Math.round(currentInterval * newEaseFactor)
      }
      // Slight increase in ease factor for perfect
      newEaseFactor = Math.min(newEaseFactor + 0.15, 2.5)
    } else if (score === 'good') {
      if (currentInterval === 0) {
        newInterval = 1
      } else {
        newInterval = Math.round(currentInterval * newEaseFactor * 0.8)
      }
      // No change to ease factor
    } else {
      // Retry - reset interval
      newInterval = 0
      // Decrease ease factor
      newEaseFactor = Math.max(newEaseFactor - 0.2, 1.3)
    }

    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + newInterval)

    return {
      nextReview: nextReview.toISOString(),
      interval: newInterval,
      easeFactor: newEaseFactor
    }
  }

  // Get cards due for review
  static getDueCards(cards, cardProgress) {
    const now = new Date()
    return cards.filter(card => {
      const progress = cardProgress[card.id]
      if (!progress) return true // New card
      
      const nextReview = new Date(progress.nextReview)
      return nextReview <= now
    })
  }

  // Get cards by difficulty
  static getCardsByDifficulty(cards, cardProgress) {
    const now = new Date()
    const difficult = []
    const due = []
    const mastered = []

    cards.forEach(card => {
      const progress = cardProgress[card.id]
      if (!progress) {
        due.push(card)
        return
      }

      const nextReview = new Date(progress.nextReview)
      if (progress.retryCount > 3 || progress.easeFactor < 1.5) {
        difficult.push(card)
      } else if (nextReview <= now) {
        due.push(card)
      } else {
        mastered.push(card)
      }
    })

    return { difficult, due, mastered }
  }
}

