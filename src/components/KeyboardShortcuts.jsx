export default function KeyboardShortcuts({ onClose }) {
  const shortcuts = [
    { key: 'P', description: 'Start Practice' },
    { key: 'R', description: 'Review Difficult Cards' },
    { key: 'S', description: 'View Stats' },
    { key: 'E', description: 'Open Deck Editor' },
    { key: '⇧,', description: 'Open Settings' },
    { key: 'Space', description: 'Reveal/Speak (in practice)' },
    { key: 'P', description: 'Play audio (in practice)' },
    { key: 'N', description: 'Next card (after scoring)' },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-retro-darker border-2 border-retro-cyan p-8 rounded-lg max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-pixel text-retro-cyan">Keyboard Shortcuts ⌨️</h2>
          <button
            onClick={onClose}
            className="text-retro-magenta hover:text-retro-cyan text-2xl"
          >
            ×
          </button>
        </div>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex justify-between items-center border-b border-retro-cyan pb-2">
              <span className="text-retro-yellow font-pixel">{shortcut.description}</span>
              <kbd className="px-3 py-1 bg-retro-dark border border-retro-cyan text-retro-cyan font-pixel rounded">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

