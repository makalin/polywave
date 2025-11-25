export default function ScoreDisplay({ score, onNext }) {
  const scoreConfig = {
    perfect: {
      text: 'Perfect! 🎯',
      color: 'text-retro-green',
      bg: 'bg-retro-green',
      border: 'border-retro-green',
      glow: 'shadow-glow-cyan'
    },
    good: {
      text: 'Good! 👍',
      color: 'text-retro-yellow',
      bg: 'bg-retro-yellow',
      border: 'border-retro-yellow',
      glow: 'shadow-glow-yellow'
    },
    retry: {
      text: 'Try Again 🔄',
      color: 'text-retro-magenta',
      bg: 'bg-retro-magenta',
      border: 'border-retro-magenta',
      glow: 'shadow-glow-magenta'
    }
  }

  const config = scoreConfig[score] || scoreConfig.retry

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80 ${config.glow}`}>
      <div className={`${config.bg} ${config.border} border-4 p-8 rounded-lg text-center`}>
        <div className="text-4xl font-pixel text-retro-dark mb-4">
          {config.text}
        </div>
        <button
          onClick={onNext}
          className="retro-button mt-4"
        >
          Next Card
        </button>
      </div>
    </div>
  )
}

