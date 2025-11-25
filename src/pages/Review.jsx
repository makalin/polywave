import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { loadDeck, shuffleArray } from '../decks/loader'
import { Storage } from '../utils/storage'
import { SRS } from '../utils/srs'
import Card from '../components/Card'
import Button from '../components/Button'
import StatsBar from '../components/StatsBar'
import Loading from '../components/Loading'
import { GameLogic } from '../utils/gameLogic'
import toastManager from '../utils/toast'

export default function Review() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const language = searchParams.get('lang') || 'de'
  const mode = searchParams.get('mode') || 'difficult' // difficult, due, mastered

  const [deck, setDeck] = useState(null)
  const [cards, setCards] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    // Try custom decks first
    const customDecks = Storage.getCustomDecks()
    const customDeck = customDecks.find(d => d.language === language)
    
    const loadDeckData = (deck) => {
      setDeck(deck)
      const cardProgress = Storage.getCardProgress()
      const { difficult, due, mastered } = SRS.getCardsByDifficulty(deck.cards, cardProgress)
      
      let selectedCards = []
      if (mode === 'difficult') selectedCards = difficult
      else if (mode === 'due') selectedCards = due
      else if (mode === 'mastered') selectedCards = mastered

      if (selectedCards.length === 0) {
        selectedCards = deck.cards // Fallback to all cards
      }

      setCards(shuffleArray(selectedCards))
    }

    if (customDeck) {
      loadDeckData(customDeck)
    } else {
      loadDeck(`/decks/${language}-basics.json`)
        .then(loadDeckData)
        .catch(err => {
          console.error('Failed to load deck:', err)
          toastManager.error('Failed to load deck')
          navigate('/')
        })
    }

    const gameStats = Storage.getStats()
    setStats({
      ...gameStats,
      level: GameLogic.calculateLevel(gameStats.xp)
    })
  }, [language, mode, navigate])

  const currentCard = cards[currentIndex]

  const handleNext = (score) => {
    if (currentCard && score) {
      const cardProgress = Storage.getCardProgress()
      const currentProgress = cardProgress[currentCard.id] || {
        interval: 0,
        easeFactor: 2.5,
        retryCount: 0
      }

      const srsResult = SRS.calculateNextReview(
        score,
        currentProgress.interval,
        currentProgress.easeFactor
      )

      Storage.updateCardProgress(currentCard.id, {
        ...srsResult,
        retryCount: score === 'retry' ? currentProgress.retryCount + 1 : currentProgress.retryCount
      })
    }

    setIsRevealed(false)
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      navigate('/')
    }
  }

  if (!deck || !currentCard || !stats) {
    return <Loading />
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={() => navigate('/')} variant="danger">
            ← Back
          </Button>
          <div className="text-retro-cyan font-pixel">
            {mode === 'difficult' ? '🔴 Difficult' : mode === 'due' ? '⏰ Due' : '✅ Mastered'} - 
            Card {currentIndex + 1} / {cards.length}
          </div>
        </div>

        <StatsBar stats={stats} />

        <Card
          card={currentCard}
          onReveal={() => setIsRevealed(true)}
          isRevealed={isRevealed}
        />

        {isRevealed && (
          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={() => handleNext('retry')}
              variant="danger"
            >
              ❌ Hard
            </Button>
            <Button
              onClick={() => handleNext('good')}
              variant="warning"
            >
              ⚠️ Good
            </Button>
            <Button
              onClick={() => handleNext('perfect')}
              variant="success"
            >
              ✅ Easy
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

