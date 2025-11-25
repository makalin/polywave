import { useState, useEffect } from 'react'
import toastManager from '../utils/toast'

export default function Toast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts)
    return unsubscribe
  }, [])

  const getToastStyles = (type) => {
    const styles = {
      success: 'bg-retro-green border-retro-green text-retro-dark',
      error: 'bg-retro-magenta border-retro-magenta text-retro-dark',
      warning: 'bg-retro-yellow border-retro-yellow text-retro-dark',
      info: 'bg-retro-cyan border-retro-cyan text-retro-dark'
    }
    return styles[type] || styles.info
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            border-2 p-4 rounded-lg shadow-glow-cyan
            font-pixel text-sm animate-fade-in
            ${getToastStyles(toast.type)}
          `}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}

