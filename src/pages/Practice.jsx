import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { loadDeck, shuffleArray } from '../decks/loader'
import ttsManager from '../tts'
import asrManager from '../asr'
import { Storage } from '../utils/storage'
import { GameLogic } from '../utils/gameLogic'
import { SRS } from '../utils/srs'
import Card from '../components/Card'
import Button from '../components/Button'
import ScoreDisplay from '../components/ScoreDisplay'
import StatsBar from '../components/StatsBar'
import Loading from '../components/Loading'
import keyboardManager from '../utils/keyboard'
import toastManager from '../utils/toast'

export default function Practice() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const language = searchParams.get('lang') || 'de'
  
  const [deck, setDeck] = useState(null)
  const [cards, setCards] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(null)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    // Try to load from custom decks first, then default
    const customDecks = Storage.getCustomDecks()
    const customDeck = customDecks.find(d => d.language === language)
    
    if (customDeck) {
      setDeck(customDeck)
      const shuffled = shuffleArray(customDeck.cards)
      setCards(shuffled)
    } else {
      loadDeck(`/decks/${language}-basics.json`)
        .then(loadedDeck => {
          setDeck(loadedDeck)
          const shuffled = shuffleArray(loadedDeck.cards)
          setCards(shuffled)
        })
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
  }, [language, navigate])

  const currentCard = cards[currentIndex]

  const handlePlay = async () => {
    if (!currentCard || isPlaying) return
    
    setIsPlaying(true)
    try {
      const settings = Storage.getSettings()
      await ttsManager.speak(currentCard.target, language, {
        rate: settings.ttsRate,
        pitch: settings.ttsPitch
      })
    } catch (error) {
      console.error('TTS error:', error)
      toastManager.error('Text-to-speech not available. Please check your browser permissions.')
    } finally {
      setIsPlaying(false)
    }
  }

  const handleSpeak = async () => {
    if (!currentCard || isListening) return

    setIsListening(true)
    try {
      const result = await asrManager.startListening({ language })
      const pronunciationScore = GameLogic.scorePronunciation(
        currentCard.target,
        result.text,
        language
      )
      
      setScore(pronunciationScore)
      
      // Update SRS
      const cardProgress = Storage.getCardProgress()
      const currentProgress = cardProgress[currentCard.id] || {
        interval: 0,
        easeFactor: 2.5,
        retryCount: 0
      }

      const srsResult = SRS.calculateNextReview(
        pronunciationScore,
        currentProgress.interval,
        currentProgress.easeFactor
      )

      Storage.updateCardProgress(currentCard.id, {
        ...srsResult,
        retryCount: pronunciationScore === 'retry' ? currentProgress.retryCount + 1 : currentProgress.retryCount
      })
      
      // Update stats
      const gameStats = Storage.getStats()
      const xpGained = GameLogic.calculateXP(pronunciationScore)
      const newXP = gameStats.xp + xpGained
      const newLevel = GameLogic.calculateLevel(newXP)
      
      const langStats = Storage.getLanguageStats(language)
      Storage.updateLanguageStats(language, {
        xp: langStats.xp + xpGained,
        cardsStudied: langStats.cardsStudied + 1,
        perfectCount: pronunciationScore === 'perfect' ? langStats.perfectCount + 1 : langStats.perfectCount,
        goodCount: pronunciationScore === 'good' ? langStats.goodCount + 1 : langStats.goodCount,
        retryCount: pronunciationScore === 'retry' ? langStats.retryCount + 1 : langStats.retryCount,
      })

      const updatedStats = {
        ...gameStats,
        xp: newXP,
        level: newLevel,
        streak: GameLogic.updateStreak(gameStats.streak, gameStats.lastPracticeDate),
        lastPracticeDate: new Date().toISOString()
      }
      
      Storage.setStats(updatedStats)
      setStats(updatedStats)
      
      if (pronunciationScore === 'perfect') {
        toastManager.success('Perfect! +20 XP')
      } else if (pronunciationScore === 'good') {
        toastManager.info('Good! +10 XP')
      }
      
    } catch (error) {
      console.error('ASR error:', error)
      toastManager.error('Speech recognition not available. Please check your browser permissions.')
    } finally {
      setIsListening(false)
    }
  }

  useEffect(() => {
    // Keyboard shortcuts
    keyboardManager.register(' ', () => {
      if (!isRevealed) {
        handleReveal()
      } else if (!isListening && !isPlaying) {
        handleSpeak()
      }
    })
    keyboardManager.register('p', handlePlay)
    keyboardManager.register('n', () => {
      if (score) handleNext()
    })

    return () => {
      keyboardManager.unregister(' ')
      keyboardManager.unregister('p')
      keyboardManager.unregister('n')
    }
  }, [isRevealed, isListening, isPlaying, score])

  const handleNext = () => {
    setScore(null)
    setIsRevealed(false)
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // End of deck
      navigate('/')
    }
  }

  const handleReveal = () => {
    setIsRevealed(true)
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
            Card {currentIndex + 1} / {cards.length}
          </div>
        </div>

        <StatsBar stats={stats} />

        <Card
          card={currentCard}
          onReveal={handleReveal}
          isRevealed={isRevealed}
        />

        <div className="flex justify-center gap-4 mt-8">
          <Button
            onClick={handlePlay}
            disabled={isPlaying}
            variant="primary"
          >
            {isPlaying ? 'Playing...' : '🔊 Play'}
          </Button>
          
          <Button
            onClick={handleSpeak}
            disabled={isListening || !isRevealed}
            variant="success"
          >
            {isListening ? '🎙️ Listening...' : '🎙️ Speak'}
          </Button>
        </div>

        {score && (
          <ScoreDisplay score={score} onNext={handleNext} />
        )}
      </div>
    </div>
  )
}

