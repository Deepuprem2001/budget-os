import { format } from "date-fns";

export function formatCurrency(amount, currencyCode = 'GBP') {
    const currencies = {
        GBP: {locale: 'en-GB'},
        USD: {locale: 'en-US'},
        INR: {locale: 'en-IN'},
        EUR: {locale: 'de-DE'}
    }
    
    const {locale} = currencies[currencyCode] || currencies.GBP

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: 2,
    }).format(amount)
}

export function formatDate(dateString) {
    return format(new Date(dateString), 'dd MMM yyyy')
}

export function getMonthName(month) {
  return format(new Date(2026, month - 1, 1), 'MMMM')
}

export function getMonths() {
  return Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: format(new Date(2026, i, 1), 'MMMM'),
  }))
}

export function getYears() {
  const currentYear = new Date().getFullYear()
  return [currentYear - 1, currentYear, currentYear + 1]
}

export function getPercentage(value, total) {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}