import { format } from "date-fns";

export function formatCurrency(amount, currencyCode = 'GBP') {
  const supportedCurrencies = {
    GBP: { locale: 'en-GB' },
    USD: { locale: 'en-US' },
    INR: { locale: 'en-IN' },
    EUR: { locale: 'de-DE' },
  }

  const currency = supportedCurrencies[currencyCode]
    ? currencyCode
    : 'GBP'

  const { locale } = supportedCurrencies[currency]

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
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

export function exportToCSV(transactions, filename = 'transactions.csv') {
  if (transactions.length === 0) return

  // Define columns
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount (£)']

  // Build rows
  const rows = transactions.map((t) => [
    t.date,
    `"${t.description.replace(/"/g, '""')}"`,
    t.category,
    t.type,
    t.type === 'expense' ? `-${t.amount}` : t.amount,
  ])

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n')

  // Create download link and trigger click
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}