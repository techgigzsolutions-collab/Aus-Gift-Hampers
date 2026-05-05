interface QuantityControlProps {
  quantity: number
  maxQuantity: number
  onQuantityChange: (quantity: number) => void
}

export function QuantityControl({
  quantity,
  maxQuantity,
  onQuantityChange,
}: QuantityControlProps) {
  const handleDecrement = () => {
    if (quantity > 0) {
      onQuantityChange(quantity - 1)
    }
  }

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value) && value >= 0 && value <= maxQuantity) {
      onQuantityChange(value)
    }
  }

  return (
    <div className="flex items-center justify-center gap-3 border border-border rounded-lg p-2 bg-secondary/30">
      <button
        onClick={handleDecrement}
        disabled={quantity === 0}
        className="p-2 text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-md"
        aria-label="Decrease quantity"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>

      <input
        type="number"
        min="0"
        max={maxQuantity}
        value={quantity}
        onChange={handleChange}
        className="w-12 text-center bg-background text-foreground font-bold focus:outline-none rounded-md border border-border/50 py-1"
        aria-label="Quantity"
      />

      <button
        onClick={handleIncrement}
        disabled={quantity >= maxQuantity}
        className="p-2 text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-md"
        aria-label="Increase quantity"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  )
}
