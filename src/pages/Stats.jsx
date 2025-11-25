import { useNavigate } from 'react-router-dom'
import { Storage } from '../utils/storage'
import { GameLogic } from '../utils/gameLogic'
import { SRS } from '../utils/srs'
import Button from '../components/Button'
import StatsBar from '../components/StatsBar'
import Loading from '../components/Loading'
import { useEffect, useState } from 'react'

export default function Stats() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const gameStats = Storage.getStats()
    setStats({
      ...gameStats,
      level: GameLogic.calculateLevel(gameStats.xp)
    })
  }, [])

  if (!stats) {
    return <Loading />
  }

  const languages = [
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  ]

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-pixel text-retro-cyan mb-4">
            Your Stats 📊
          </h1>
        </div>

        <StatsBar stats={stats} />

        <div className="bg-retro-darker border-2 border-retro-cyan p-8 rounded-lg mb-6">
          <h2 className="text-2xl font-pixel text-retro-yellow mb-6">
            Language Progress
          </h2>

          <div className="space-y-4">
            {languages.map((lang) => {
              const langStats = Storage.getLanguageStats(lang.code)
              const langLevel = GameLogic.calculateLevel(langStats.xp)
              
              return (
                <div
                  key={lang.code}
                  className="border-2 border-retro-cyan p-4 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="text-xl font-pixel text-retro-cyan">{lang.name}</span>
                    </div>
                    <div className="text-retro-yellow font-pixel">
                      Level {langLevel}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-pixel">
                    <div>
                      <div className="text-retro-cyan">XP</div>
                      <div className="text-retro-yellow">{langStats.xp}</div>
                    </div>
                    <div>
                      <div className="text-retro-cyan">Cards</div>
                      <div className="text-retro-yellow">{langStats.cardsStudied}</div>
                    </div>
                    <div>
                      <div className="text-retro-green">Perfect</div>
                      <div className="text-retro-green">{langStats.perfectCount}</div>
                    </div>
                    <div>
                      <div className="text-retro-magenta">Retries</div>
                      <div className="text-retro-magenta">{langStats.retryCount}</div>
                    </div>
                  </div>
                  
                  {/* SRS Stats */}
                  <div className="mt-4 pt-4 border-t border-retro-cyan">
                    <div className="text-xs text-retro-cyan mb-2">SRS Status</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-retro-magenta">🔴 Difficult</div>
                        <div className="text-retro-yellow">
                          {(() => {
                            const allDecks = Storage.getCustomDecks()
                            // Would need deck loaded to calculate properly
                            return '—'
                          })()}
                        </div>
                      </div>
                      <div>
                        <div className="text-retro-yellow">⏰ Due</div>
                        <div className="text-retro-yellow">—</div>
                      </div>
                      <div>
                        <div className="text-retro-green">✅ Mastered</div>
                        <div className="text-retro-green">—</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="text-center">
          <Button onClick={() => navigate('/')} variant="primary">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}

