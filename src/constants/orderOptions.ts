export const ADDITIONAL_OPTIONS = [
  { name: 'fuel', label: 'Полный бак, 500р', shortLabel: 'Полный бак', price: 500 },
  { name: 'chair', label: 'Детское кресло, 200р', shortLabel: 'Детское кресло', price: 200 },
  { name: 'right', label: 'Правый руль, 1600р', shortLabel: 'Правый руль', price: 1600 },
] as const

export const RATES = [
  { rateId: 1, name: 'Поминутно', label: 'Поминутно, 7₽/мин', unitPrice: 7, unit: 'minute' as const },
  { rateId: 2, name: 'На сутки', label: 'На сутки, 1999 ₽/сутки', unitPrice: 1999, unit: 'day' as const },
] as const
