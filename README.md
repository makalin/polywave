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

- 🔊 **Text-to-Speech (TTS)**  
  - Natural voices for DE/FR/RU  
  - Slow/normal playback  
  - Loop mode for shadowing practice.

- 🎙️ **Speech Recognition (ASR)**  
  - User repeats the word  
  - Whisper / Web Speech API  
  - Confidence scoring (Perfect / Good / Retry)

- 🧠 **Practice System**  
  - Word cards  
  - Reveal/Hide translation  
  - SRS-inspired spaced repetition  
  - Quick sessions (1–2 min)

- 🏆 **Gamified Progress**  
  - XP, streaks, levels  
  - Per-language stats  
  - Retro sound effects (optional)

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

## Roadmap

* [ ] Core UI + retro CRT shader
* [ ] Deck selector + importer
* [ ] TTS for DE/FR/RU
* [ ] Whisper ASR integration
* [ ] XP + streak logic
* [ ] Mobile build (Capacitor)
* [ ] Custom deck editor (JSON/CSV)
* [ ] Global leaderboard
* [ ] Daily challenges

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
