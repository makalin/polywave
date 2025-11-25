import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Storage } from '../utils/storage'
import Button from '../components/Button'

export default function Settings() {
  const navigate = useNavigate()
  const [settings, setSettings] = useState(Storage.getSettings())

  const handleSave = () => {
    Storage.setSettings(settings)
    navigate('/')
  }

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-pixel text-retro-cyan mb-4">
            Settings ⚙️
          </h1>
        </div>

        <div className="bg-retro-darker border-2 border-retro-cyan p-8 rounded-lg space-y-6">
          <div>
            <label className="block text-retro-yellow font-pixel mb-2">
              TTS Playback Rate
            </label>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={settings.ttsRate}
              onChange={(e) => updateSetting('ttsRate', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-retro-cyan text-sm mt-1">
              {settings.ttsRate}x speed
            </div>
          </div>

          <div>
            <label className="block text-retro-yellow font-pixel mb-2">
              TTS Pitch
            </label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={settings.ttsPitch}
              onChange={(e) => updateSetting('ttsPitch', parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-retro-cyan text-sm mt-1">
              {settings.ttsPitch}x pitch
            </div>
          </div>

          <div>
            <label className="block text-retro-yellow font-pixel mb-2">
              Daily Goal (cards)
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={settings.dailyGoal}
              onChange={(e) => updateSetting('dailyGoal', parseInt(e.target.value))}
              className="w-full bg-retro-dark border-2 border-retro-cyan p-2 text-retro-cyan font-pixel"
            />
          </div>

          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="enableSounds"
              checked={settings.enableSounds}
              onChange={(e) => updateSetting('enableSounds', e.target.checked)}
              className="w-5 h-5"
            />
            <label htmlFor="enableSounds" className="text-retro-yellow font-pixel">
              Enable Sound Effects
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={handleSave} variant="success">
              Save Settings
            </Button>
            <Button onClick={() => navigate('/')} variant="danger">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

