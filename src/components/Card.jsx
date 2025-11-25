import { useState } from 'react'

export default function Card({ card, onReveal, isRevealed }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="card-glow bg-retro-darker border-2 border-retro-cyan p-8 rounded-lg">
        <div className="text-center space-y-6">
          <div className="text-4xl font-pixel text-retro-cyan mb-4">
            {card.target}
          </div>
          
          {isRevealed && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-xl text-retro-yellow">
                {card.base}
              </div>
              {card.example_target && (
                <div className="text-sm text-retro-green italic">
                  "{card.example_target}"
                </div>
              )}
              {card.example_base && (
                <div className="text-xs text-retro-cyan opacity-70">
                  "{card.example_base}"
                </div>
              )}
            </div>
          )}
          
          {!isRevealed && (
            <button
              onClick={onReveal}
              className="retro-button mt-4"
            >
              Reveal Translation
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

