export default function StatsBar({ stats }) {
  return (
    <div className="w-full bg-retro-darker border-2 border-retro-cyan p-4 mb-6">
      <div className="flex flex-wrap justify-between items-center gap-4 text-sm font-pixel">
        <div className="flex items-center gap-2">
          <span className="text-retro-cyan">XP:</span>
          <span className="text-retro-yellow">{stats.xp}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-retro-cyan">Level:</span>
          <span className="text-retro-yellow">{stats.level}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-retro-cyan">Streak:</span>
          <span className="text-retro-green">{stats.streak} 🔥</span>
        </div>
      </div>
    </div>
  )
}

