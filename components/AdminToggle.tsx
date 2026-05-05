'use client'

interface AdminToggleProps {
  isEditing: boolean
  onToggle: () => void
}

export function AdminToggle({ isEditing, onToggle }: AdminToggleProps) {
  return (
    <div className="fixed top-6 right-6 z-50">
      <button
        onClick={onToggle}
        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
          isEditing
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
            : 'bg-neutral-200 hover:bg-neutral-300 text-foreground'
        }`}
        aria-label={isEditing ? 'Exit admin mode' : 'Enter admin mode'}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
        </svg>
        {isEditing ? 'Exit Admin' : 'Admin Mode'}
      </button>
    </div>
  )
}
