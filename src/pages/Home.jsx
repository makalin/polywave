import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { loadAllDecks } from '../decks/loader'
import { Storage } from '../utils/storage'
import { GameLogic } from '../utils/gameLogic'
import { SRS } from '../utils/srs'
import Button from '../components/Button'
import StatsBar from '../components/StatsBar'
import Loading from '../components/Loading'
import KeyboardShortcuts from '../components/KeyboardShortcuts'
import keyboardManager from '../utils/keyboard'
import toastManager from '../utils/toast'

export default function Home() {
  const navigate = useNavigate()
  const [decks, setDecks] = useState([])
  const [stats, setStats] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState(null)
  const [showShortcuts, setShowShortcuts] = useState(false)

  useEffect(() => {
    loadAllDecks().then(loadedDecks => {
      const customDecks = Storage.getCustomDecks()
      setDecks([...loadedDecks, ...customDecks])
    })
    const gameStats = Storage.getStats()
    setStats({
      ...gameStats,
      level: GameLogic.calculateLevel(gameStats.xp)
    })
  }, [])

  const languages = [
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  ]

  const handleStartPractice = () => {
    if (selectedLanguage) {
      navigate(`/practice?lang=${selectedLanguage}`)
    }
  }

  const handleReview = (mode) => {
    if (selectedLanguage) {
      navigate(`/review?lang=${selectedLanguage}&mode=${mode}`)
    }
  }

  useEffect(() => {
    // Keyboard shortcuts
    keyboardManager.register('p', () => {
      if (selectedLanguage) handleStartPractice()
    })
    keyboardManager.register('r', () => {
      if (selectedLanguage) handleReview('difficult')
    })
    keyboardManager.register('s', () => navigate('/stats'))
    keyboardManager.register('e', () => navigate('/editor'))
    keyboardManager.register('?', () => setShowShortcuts(true))
    keyboardManager.register(',', () => navigate('/settings'), { shift: true })

    return () => {
      keyboardManager.unregister('p')
      keyboardManager.unregister('r')
      keyboardManager.unregister('s')
      keyboardManager.unregister('e')
      keyboardManager.unregister('?')
      keyboardManager.unregister('shift+,')
    }
  }, [selectedLanguage, navigate])

  // Calculate daily progress
  const getDailyProgress = () => {
    const settings = Storage.getSettings()
    const stats = Storage.getStats()
    const today = new Date().toDateString()
    const lastDate = stats.lastPracticeDate ? new Date(stats.lastPracticeDate).toDateString() : null
    
    if (lastDate !== today) {
      return { current: 0, goal: settings.dailyGoal }
    }

    // Count cards studied today (approximate from language stats)
    let todayCards = 0
    Object.values(stats.languages).forEach(lang => {
      // This is approximate - in a real app you'd track daily separately
      todayCards += Math.min(lang.cardsStudied, 10) // Rough estimate
    })

    return { current: todayCards, goal: settings.dailyGoal }
  }

  const dailyProgress = getDailyProgress()
  const progressPercent = Math.min((dailyProgress.current / dailyProgress.goal) * 100, 100)

  // Get review stats
  const getReviewStats = (langCode) => {
    const allDecks = [...decks, ...Storage.getCustomDecks()]
    const deck = allDecks.find(d => d.language === langCode)
    if (!deck) return { difficult: 0, due: 0, mastered: 0 }

    const cardProgress = Storage.getCardProgress()
    const { difficult, due, mastered } = SRS.getCardsByDifficulty(deck.cards, cardProgress)
    return { difficult: difficult.length, due: due.length, mastered: mastered.length }
  }

  if (!stats) {
    return <Loading />
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-pixel text-retro-cyan mb-4 drop-shadow-glow-cyan">
            PolyWave 🌊🗣️
          </h1>
          <p className="text-xl text-retro-green">
            Retro-styled multilingual vocab trainer
          </p>
        </div>

        <StatsBar stats={stats} />

        {/* Daily Goal Progress */}
        <div className="bg-retro-darker border-2 border-retro-cyan p-6 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-retro-yellow font-pixel">Daily Goal</span>
            <span className="text-retro-cyan font-pixel">
              {dailyProgress.current} / {dailyProgress.goal}
            </span>
          </div>
          <div className="w-full bg-retro-dark h-4 border border-retro-cyan">
            <div
              className="h-full bg-retro-green transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-retro-darker border-2 border-retro-cyan p-8 rounded-lg mb-6">
          <h2 className="text-2xl font-pixel text-retro-yellow mb-6 text-center">
            Choose Your Language
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {languages.map((lang) => {
              const allDecks = [...decks, ...Storage.getCustomDecks()]
              const deck = allDecks.find(d => d.language === lang.code)
              const isSelected = selectedLanguage === lang.code
              const reviewStats = getReviewStats(lang.code)
              
              return (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`
                    p-6 border-2 rounded-lg transition-all text-left
                    ${isSelected 
                      ? 'border-retro-cyan bg-retro-cyan text-retro-dark shadow-glow-cyan' 
                      : 'border-retro-cyan text-retro-cyan hover:bg-retro-cyan hover:text-retro-dark'
                    }
                  `}
                >
                  <div className="text-4xl mb-2">{lang.flag}</div>
                  <div className="font-pixel text-lg">{lang.name}</div>
                  {deck && (
                    <div className="text-sm mt-2 space-y-1">
                      <div className="opacity-70">{deck.cards.length} cards</div>
                      {reviewStats.difficult > 0 && (
                        <div className="text-retro-magenta">🔴 {reviewStats.difficult} difficult</div>
                      )}
                      {reviewStats.due > 0 && (
                        <div className="text-retro-yellow">⏰ {reviewStats.due} due</div>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          <div className="text-center space-y-4">
            <Button
              onClick={handleStartPractice}
              disabled={!selectedLanguage}
              variant="primary"
            >
              Start Practice (P)
            </Button>
            
            {selectedLanguage && (
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => handleReview('difficult')}
                  variant="danger"
                  className="text-sm"
                >
                  Review Difficult (R)
                </Button>
                <Button
                  onClick={() => handleReview('due')}
                  variant="warning"
                  className="text-sm"
                >
                  Review Due
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Button
            onClick={() => navigate('/stats')}
            variant="success"
          >
            Stats (S)
          </Button>
          <Button
            onClick={() => navigate('/editor')}
            variant="primary"
          >
            Editor (E)
          </Button>
          <Button
            onClick={() => navigate('/settings')}
            variant="warning"
          >
            Settings (⇧,)
          </Button>
          <Button
            onClick={() => {
              Storage.remove('polywave_stats')
              Storage.remove('polywave_card_progress')
              toastManager.success('Data reset!')
              window.location.reload()
            }}
            variant="danger"
          >
            Reset Data
          </Button>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => setShowShortcuts(true)}
            className="text-retro-cyan hover:text-retro-yellow text-sm font-pixel underline"
          >
            Keyboard Shortcuts (?)
          </button>
        </div>
      </div>

      {showShortcuts && (
        <KeyboardShortcuts onClose={() => setShowShortcuts(false)} />
      )}
    </div>
  )
}

