export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-retro-cyan text-xl font-pixel mb-4 animate-pulse-glow">
          {message}
        </div>
        <div className="flex gap-2 justify-center">
          <div className="w-2 h-2 bg-retro-cyan rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-retro-magenta rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-retro-yellow rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
}

