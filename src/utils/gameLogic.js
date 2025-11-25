// Game logic: XP, levels, streaks, scoring

export const GameLogic = {
  // XP calculation
  calculateXP(score) {
    if (score === 'perfect') return 20
    if (score === 'good') return 10
    return 0
  },

  // Level calculation (100 XP per level)
  calculateLevel(xp) {
    return Math.floor(xp / 100) + 1
  },

  // Streak calculation
  updateStreak(currentStreak, lastPracticeDate) {
    const today = new Date().toDateString()
    const lastDate = lastPracticeDate ? new Date(lastPracticeDate).toDateString() : null
    
    if (lastDate === today) {
      return currentStreak // Already practiced today
    }
    
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()
    
    if (lastDate === yesterdayStr) {
      return currentStreak + 1 // Continue streak
    }
    
    return 1 // New streak
  },

  // Score pronunciation match
  scorePronunciation(target, recognized, language) {
    // Normalize strings
    const normalize = (str) => str.toLowerCase().trim().replace(/[^\w\s]/g, '')
    const targetNorm = normalize(target)
    const recognizedNorm = normalize(recognized)
    
    // Exact match
    if (targetNorm === recognizedNorm) {
      return 'perfect'
    }
    
    // Check if recognized contains target or vice versa
    if (targetNorm.includes(recognizedNorm) || recognizedNorm.includes(targetNorm)) {
      return 'good'
    }
    
    // Levenshtein distance for similarity
    const distance = this.levenshteinDistance(targetNorm, recognizedNorm)
    const maxLen = Math.max(targetNorm.length, recognizedNorm.length)
    const similarity = 1 - (distance / maxLen)
    
    if (similarity >= 0.8) {
      return 'perfect'
    } else if (similarity >= 0.6) {
      return 'good'
    }
    
    return 'retry'
  },

  // Levenshtein distance algorithm
  levenshteinDistance(str1, str2) {
    const matrix = []
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }
    
    return matrix[str2.length][str1.length]
  }
}

