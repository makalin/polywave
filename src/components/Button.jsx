export default function Button({ children, onClick, disabled, variant = 'primary', className = '' }) {
  const baseClasses = 'retro-button'
  const variantClasses = {
    primary: 'border-retro-cyan text-retro-cyan hover:bg-retro-cyan hover:text-retro-dark',
    success: 'border-retro-green text-retro-green hover:bg-retro-green hover:text-retro-dark',
    warning: 'border-retro-yellow text-retro-yellow hover:bg-retro-yellow hover:text-retro-dark',
    danger: 'border-retro-magenta text-retro-magenta hover:bg-retro-magenta hover:text-retro-dark',
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  )
}

