# PolyWave 🌊🗣️  
Retro-styled multilingual vocab trainer with **text-to-speech** and **speech recognition** for **German, French, and Russian**. Hear the word, repeat it, get a score — surf the wave of languages.

---

## Features

- 🎮 **Retro Pixel UI**  
  Neon colors, CRT glow, arcade-style cards and buttons.

- 🌍 **Multilanguage Packs**  
  - Target languages: **German, French, Russian**  
  - Base language selectable (EN/TR/etc.)
  - Add your own decks easily via JSON.
  - **Custom deck editor** with import/export (JSON/CSV)

- 🔊 **Text-to-Speech (TTS)**  
  - Natural voices for DE/FR/RU  
  - Adjustable playback rate and pitch
  - OpenAI TTS or Web Speech API fallback

- 🎙️ **Speech Recognition (ASR)**  
  - User repeats the word  
  - OpenAI Whisper / Web Speech API  
  - Advanced pronunciation scoring with Levenshtein distance
  - Confidence scoring (Perfect / Good / Retry)

- 🧠 **Advanced Practice System**  
  - Word cards with examples
  - Reveal/Hide translation  
  - **Spaced Repetition System (SRS)** - SM-2 algorithm
  - Review modes: Difficult, Due, Mastered
  - Quick sessions (1–2 min)

- 🏆 **Gamified Progress**  
  - XP, streaks, levels  
  - Per-language stats  
  - Daily goals with progress tracking
  - Advanced statistics dashboard

- ⚙️ **Professional Tools**  
  - Settings page (TTS speed, pitch, daily goals)
  - Custom deck creation and editing
  - Import/Export decks (JSON/CSV)
  - Keyboard shortcuts throughout
  - Toast notifications
  - Loading states and error handling

---

## Architecture

**Frontend**
- React + Vite or SvelteKit  
- Tailwind / retro pixel theme  
- Web Audio API + optional Canvas CRT effect

**Backend (optional)**
- Node.js / Go micro API  
- Deck management, scoring, user data  
- Server-side TTS/ASR integration

**TTS Providers**
- OpenAI TTS  
- Web Speech Synthesis (fallback)  
- Any TTS through adapter layer

**ASR Providers**
- Whisper (OpenAI Realtime / API)  
- Web Speech Recognition (fallback)

---

## Project Structure

```

polywave/
├── src/
│   ├── components/
│   ├── pages/
│   ├── tts/
│   │   └── providers/
│   ├── asr/
│   │   └── providers/
│   ├── decks/
│   └── utils/
├── public/
├── package.json
└── README.md

````

---

## Installation

```bash
git clone https://github.com/makalin>/polywave.git
cd polywave
npm install
npm run dev
````

Open:
`http://localhost:5173`

---

## Environment Setup

Create `.env`:

```env
VITE_TTS_PROVIDER=openai
VITE_TTS_API_KEY=your_key

VITE_ASR_PROVIDER=openai
VITE_ASR_API_KEY=your_key
```

You can add more providers by creating a new adapter in:

```
src/tts/providers/
src/asr/providers/
```

---

## Vocab Deck Format

```json
{
  "language": "de",
  "name": "Basics – Travel",
  "cards": [
    {
      "id": "de_travel_001",
      "base": "train",
      "target": "Zug",
      "example_base": "We go by train.",
      "example_target": "Wir fahren mit dem Zug."
    }
  ]
}
```

Place your decks inside:

```
/src/decks/
```

---

## Core Flow

1. Choose target language (DE/FR/RU).
2. App shows a vocabulary card.
3. Tap **Play** → TTS speaks the word.
4. Tap **Speak** → ASR listens.
5. PolyWave scores pronunciation & updates XP.
6. Next card appears — fast, addictive cycles.

---

## Professional Features

✅ **Implemented:**
- Spaced Repetition System (SRS) with SM-2 algorithm
- Custom deck editor with import/export
- Settings page with TTS/ASR preferences
- Daily goals and progress tracking
- Review modes (Difficult, Due, Mastered)
- Keyboard shortcuts system
- Toast notification system
- Advanced statistics dashboard
- Loading states and error handling
- Card difficulty tracking

## Roadmap

* [ ] Mobile build (Capacitor)
* [ ] Global leaderboard
* [ ] Daily challenges
* [ ] Audio playback history
* [ ] Study streaks calendar
* [ ] Export progress data
* [ ] Multi-user support
* [ ] Cloud sync

---

## Contributing

* Submit vocab decks
* Improve recognition accuracy
* Add languages
* Add retro themes
* Add achievements / badges

PRs welcome.

---

## License

MIT License – free to use, modify, and share PolyWave.
