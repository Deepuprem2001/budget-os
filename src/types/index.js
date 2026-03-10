export const TransactionType = {
    INCOME: 'income',
    EXPENSE: 'expense',
}

export const CATEGORIES = {
    income: [
        'Salary',
        'Freelance',
        'Investments',
        'Rental',
        'Business',
        'Other Income',
    ],
    expense: [
        'Housing',
        'Food',
        'Transport',
        'Healthcare',
        'Entertainment',
        'Shopping',
        'Utilities',
        'Education',
        'Travel',
        'Other',
    ],
}

export const CATEGORY_COLORS = {
  Housing: '#f97316',
  Food: '#eab308',
  Transport: '#3b82f6',
  Healthcare: '#ec4899',
  Entertainment: '#a855f7',
  Shopping: '#06b6d4',
  Utilities: '#84cc16',
  Education: '#f59e0b',
  Travel: '#10b981',
  Other: '#6b7280',
  Salary: '#22d3ee',
  Freelance: '#4ade80',
  Investments: '#fb7185',
  Rental: '#c084fc',
  Business: '#fbbf24',
  'Other Income': '#94a3b8',
}

export const CURRENCIES = [
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
]