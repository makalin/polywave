import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Storage } from '../utils/storage'
import { DeckUtils } from '../utils/deckUtils'
import Button from '../components/Button'
import toastManager from '../utils/toast'

export default function DeckEditor() {
  const navigate = useNavigate()
  const [deckName, setDeckName] = useState('')
  const [language, setLanguage] = useState('de')
  const [cards, setCards] = useState([
    { id: '1', base: '', target: '', example_base: '', example_target: '' }
  ])

  const addCard = () => {
    setCards([...cards, {
      id: Date.now().toString(),
      base: '',
      target: '',
      example_base: '',
      example_target: ''
    }])
  }

  const removeCard = (id) => {
    setCards(cards.filter(c => c.id !== id))
  }

  const updateCard = (id, field, value) => {
    setCards(cards.map(card =>
      card.id === id ? { ...card, [field]: value } : card
    ))
  }

  const handleSave = () => {
    if (!deckName.trim()) {
      toastManager.error('Please enter a deck name')
      return
    }

    const deck = {
      language,
      name: deckName,
      cards: cards.filter(c => c.base && c.target)
    }

    if (deck.cards.length === 0) {
      toastManager.error('Please add at least one card')
      return
    }

    const validation = DeckUtils.validateDeck(deck)
    if (!validation.valid) {
      toastManager.error(validation.error)
      return
    }

    Storage.addCustomDeck(deck)
    toastManager.success('Deck saved successfully!')
    navigate('/')
  }

  const handleImport = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      const deck = await DeckUtils.importDeck(file)
      setDeckName(deck.name)
      setLanguage(deck.language)
      setCards(deck.cards)
      toastManager.success('Deck imported successfully!')
    } catch (error) {
      toastManager.error(error.message)
    }
  }

  const handleExport = () => {
    const deck = {
      language,
      name: deckName || 'Untitled Deck',
      cards: cards.filter(c => c.base && c.target)
    }
    DeckUtils.exportDeck(deck)
    toastManager.success('Deck exported!')
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-pixel text-retro-cyan">
            Deck Editor 📝
          </h1>
          <Button onClick={() => navigate('/')} variant="danger">
            ← Back
          </Button>
        </div>

        <div className="bg-retro-darker border-2 border-retro-cyan p-6 rounded-lg mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-retro-yellow font-pixel mb-2">
                Deck Name
              </label>
              <input
                type="text"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                className="w-full bg-retro-dark border-2 border-retro-cyan p-2 text-retro-cyan font-pixel"
                placeholder="My Custom Deck"
              />
            </div>
            <div>
              <label className="block text-retro-yellow font-pixel mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-retro-dark border-2 border-retro-cyan p-2 text-retro-cyan font-pixel"
              >
                <option value="de">German</option>
                <option value="fr">French</option>
                <option value="ru">Russian</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <label className="retro-button cursor-pointer">
              Import JSON
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <Button onClick={handleExport} variant="success">
              Export JSON
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className="bg-retro-darker border-2 border-retro-cyan p-4 rounded-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-retro-yellow font-pixel">Card {index + 1}</span>
                {cards.length > 1 && (
                  <Button
                    onClick={() => removeCard(card.id)}
                    variant="danger"
                    className="text-sm px-3 py-1"
                  >
                    Remove
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-retro-cyan text-sm mb-1">Base (English)</label>
                  <input
                    type="text"
                    value={card.base}
                    onChange={(e) => updateCard(card.id, 'base', e.target.value)}
                    className="w-full bg-retro-dark border border-retro-cyan p-2 text-retro-cyan font-pixel text-sm"
                  />
                </div>
                <div>
                  <label className="block text-retro-cyan text-sm mb-1">Target</label>
                  <input
                    type="text"
                    value={card.target}
                    onChange={(e) => updateCard(card.id, 'target', e.target.value)}
                    className="w-full bg-retro-dark border border-retro-cyan p-2 text-retro-cyan font-pixel text-sm"
                  />
                </div>
                <div>
                  <label className="block text-retro-cyan text-sm mb-1">Example (Base)</label>
                  <input
                    type="text"
                    value={card.example_base}
                    onChange={(e) => updateCard(card.id, 'example_base', e.target.value)}
                    className="w-full bg-retro-dark border border-retro-cyan p-2 text-retro-cyan font-pixel text-sm"
                  />
                </div>
                <div>
                  <label className="block text-retro-cyan text-sm mb-1">Example (Target)</label>
                  <input
                    type="text"
                    value={card.example_target}
                    onChange={(e) => updateCard(card.id, 'example_target', e.target.value)}
                    className="w-full bg-retro-dark border border-retro-cyan p-2 text-retro-cyan font-pixel text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={addCard} variant="primary">
            + Add Card
          </Button>
          <Button onClick={handleSave} variant="success">
            Save Deck
          </Button>
        </div>
      </div>
    </div>
  )
}

