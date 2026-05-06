export const audCurrency = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0,
})

export function formatCurrency(value: number) {
  return audCurrency.format(Number(value) || 0)
}
