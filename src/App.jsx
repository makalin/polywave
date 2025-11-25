import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Practice from './pages/Practice'
import Stats from './pages/Stats'
import Settings from './pages/Settings'
import DeckEditor from './pages/DeckEditor'
import Review from './pages/Review'
import Toast from './components/Toast'
import keyboardManager from './utils/keyboard'
import './App.css'

function App() {
  useEffect(() => {
    keyboardManager.init()
  }, [])

  return (
    <div className="crt-effect min-h-screen">
      <Toast />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/editor" element={<DeckEditor />} />
          <Route path="/review" element={<Review />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App

