import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatDate,
  getMonthName,
  getMonths,
  getYears,
  getPercentage,
} from '../lib/utils'

describe('formatCurrency', () => {
  it('formats GBP correctly', () => {
    expect(formatCurrency(1200)).toBe('£1,200.00')
  })

  it('formats USD correctly', () => {
    expect(formatCurrency(1200, 'USD')).toBe('$1,200.00')
  })

  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('£0.00')
  })

  it('falls back to GBP for unknown currency', () => {
    expect(formatCurrency(100, 'XYZ')).toBe('£100.00')
  })
})

describe('formatDate', () => {
  it('formats date string correctly', () => {
    expect(formatDate('2026-03-01')).toBe('01 Mar 2026')
  })

  it('formats different months correctly', () => {
    expect(formatDate('2026-12-25')).toBe('25 Dec 2026')
  })
})

describe('getMonthName', () => {
  it('returns correct month name for March', () => {
    expect(getMonthName(3)).toBe('March')
  })

  it('returns correct month name for December', () => {
    expect(getMonthName(12)).toBe('December')
  })

  it('returns correct month name for January', () => {
    expect(getMonthName(1)).toBe('January')
  })
})

describe('getMonths', () => {
  it('returns 12 months', () => {
    expect(getMonths()).toHaveLength(12)
  })

  it('first month is January with value 1', () => {
    expect(getMonths()[0]).toEqual({ value: 1, label: 'January' })
  })

  it('last month is December with value 12', () => {
    expect(getMonths()[11]).toEqual({ value: 12, label: 'December' })
  })
})

describe('getYears', () => {
  it('returns 3 years', () => {
    expect(getYears()).toHaveLength(3)
  })

  it('includes current year', () => {
    const currentYear = new Date().getFullYear()
    expect(getYears()).toContain(currentYear)
  })

  it('includes previous and next year', () => {
    const currentYear = new Date().getFullYear()
    expect(getYears()).toContain(currentYear - 1)
    expect(getYears()).toContain(currentYear + 1)
  })
})

describe('getPercentage', () => {
  it('calculates percentage correctly', () => {
    expect(getPercentage(50, 100)).toBe(50)
  })

  it('returns 0 when total is 0', () => {
    expect(getPercentage(100, 0)).toBe(0)
  })

  it('rounds to nearest integer', () => {
    expect(getPercentage(1, 3)).toBe(33)
  })

  it('handles 100 percent', () => {
    expect(getPercentage(100, 100)).toBe(100)
  })
})