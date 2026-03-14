export const mockUser = {
  id: 'mock-user-123',
  email: 'deepan@example.com',
  user_metadata: {
    full_name: 'Deepan Prashanth',
  },
}

// ─── TRANSACTIONS ────────────────────────────────────────────────────────────
// Multiple months of data so charts, trends and year over year all look great

export const mockTransactions = [

  // ── January 2026 ──
  { id: 'jan-1', user_id: 'mock-user-123', type: 'income', amount: 1800, category: 'Salary', description: 'Monthly salary', date: '2026-01-01', created_at: '2026-01-01T00:00:00Z' },
  { id: 'jan-2', user_id: 'mock-user-123', type: 'expense', amount: 520, category: 'Housing', description: 'Monthly rent', date: '2026-01-02', created_at: '2026-01-02T00:00:00Z' },
  { id: 'jan-3', user_id: 'mock-user-123', type: 'expense', amount: 95, category: 'Food', description: 'Weekly groceries', date: '2026-01-05', created_at: '2026-01-05T00:00:00Z' },
  { id: 'jan-4', user_id: 'mock-user-123', type: 'expense', amount: 20, category: 'Transport', description: 'Monthly bus pass', date: '2026-01-06', created_at: '2026-01-06T00:00:00Z' },
  { id: 'jan-5', user_id: 'mock-user-123', type: 'expense', amount: 15, category: 'Entertainment', description: 'Netflix subscription', date: '2026-01-07', created_at: '2026-01-07T00:00:00Z' },
  { id: 'jan-6', user_id: 'mock-user-123', type: 'expense', amount: 80, category: 'Shopping', description: 'Winter clothes', date: '2026-01-10', created_at: '2026-01-10T00:00:00Z' },
  { id: 'jan-7', user_id: 'mock-user-123', type: 'expense', amount: 45, category: 'Utilities', description: 'Gas and electric', date: '2026-01-12', created_at: '2026-01-12T00:00:00Z' },
  { id: 'jan-8', user_id: 'mock-user-123', type: 'expense', amount: 60, category: 'Food', description: 'Dining out', date: '2026-01-15', created_at: '2026-01-15T00:00:00Z' },
  { id: 'jan-9', user_id: 'mock-user-123', type: 'income', amount: 150, category: 'Freelance', description: 'Logo design project', date: '2026-01-18', created_at: '2026-01-18T00:00:00Z' },
  { id: 'jan-10', user_id: 'mock-user-123', type: 'expense', amount: 25, category: 'Healthcare', description: 'Pharmacy', date: '2026-01-20', created_at: '2026-01-20T00:00:00Z' },
  { id: 'jan-11', user_id: 'mock-user-123', type: 'expense', amount: 40, category: 'Food', description: 'Weekly groceries', date: '2026-01-22', created_at: '2026-01-22T00:00:00Z' },
  { id: 'jan-12', user_id: 'mock-user-123', type: 'expense', amount: 12, category: 'Entertainment', description: 'Spotify subscription', date: '2026-01-25', created_at: '2026-01-25T00:00:00Z' },

  // ── February 2026 ──
  { id: 'feb-1', user_id: 'mock-user-123', type: 'income', amount: 1800, category: 'Salary', description: 'Monthly salary', date: '2026-02-01', created_at: '2026-02-01T00:00:00Z' },
  { id: 'feb-2', user_id: 'mock-user-123', type: 'expense', amount: 520, category: 'Housing', description: 'Monthly rent', date: '2026-02-02', created_at: '2026-02-02T00:00:00Z' },
  { id: 'feb-3', user_id: 'mock-user-123', type: 'expense', amount: 85, category: 'Food', description: 'Weekly groceries', date: '2026-02-04', created_at: '2026-02-04T00:00:00Z' },
  { id: 'feb-4', user_id: 'mock-user-123', type: 'expense', amount: 20, category: 'Transport', description: 'Monthly bus pass', date: '2026-02-05', created_at: '2026-02-05T00:00:00Z' },
  { id: 'feb-5', user_id: 'mock-user-123', type: 'expense', amount: 15, category: 'Entertainment', description: 'Netflix subscription', date: '2026-02-07', created_at: '2026-02-07T00:00:00Z' },
  { id: 'feb-6', user_id: 'mock-user-123', type: 'expense', amount: 120, category: 'Shopping', description: "Valentine's Day gifts", date: '2026-02-14', created_at: '2026-02-14T00:00:00Z' },
  { id: 'feb-7', user_id: 'mock-user-123', type: 'expense', amount: 45, category: 'Utilities', description: 'Gas and electric', date: '2026-02-15', created_at: '2026-02-15T00:00:00Z' },
  { id: 'feb-8', user_id: 'mock-user-123', type: 'income', amount: 300, category: 'Freelance', description: 'Website redesign', date: '2026-02-16', created_at: '2026-02-16T00:00:00Z' },
  { id: 'feb-9', user_id: 'mock-user-123', type: 'expense', amount: 75, category: 'Food', description: 'Dining out', date: '2026-02-18', created_at: '2026-02-18T00:00:00Z' },
  { id: 'feb-10', user_id: 'mock-user-123', type: 'expense', amount: 12, category: 'Entertainment', description: 'Spotify subscription', date: '2026-02-25', created_at: '2026-02-25T00:00:00Z' },
  { id: 'feb-11', user_id: 'mock-user-123', type: 'expense', amount: 35, category: 'Healthcare', description: 'GP appointment', date: '2026-02-20', created_at: '2026-02-20T00:00:00Z' },
  { id: 'feb-12', user_id: 'mock-user-123', type: 'expense', amount: 55, category: 'Food', description: 'Weekly groceries', date: '2026-02-24', created_at: '2026-02-24T00:00:00Z' },

  // ── March 2026 ──
  { id: 'mar-1', user_id: 'mock-user-123', type: 'income', amount: 1800, category: 'Salary', description: 'Monthly salary', date: '2026-03-01', created_at: '2026-03-01T00:00:00Z' },
  { id: 'mar-2', user_id: 'mock-user-123', type: 'expense', amount: 520, category: 'Housing', description: 'Monthly rent', date: '2026-03-02', created_at: '2026-03-02T00:00:00Z' },
  { id: 'mar-3', user_id: 'mock-user-123', type: 'expense', amount: 50, category: 'Food', description: 'Weekly groceries', date: '2026-03-03', created_at: '2026-03-03T00:00:00Z' },
  { id: 'mar-4', user_id: 'mock-user-123', type: 'expense', amount: 20, category: 'Transport', description: 'Monthly bus pass', date: '2026-03-04', created_at: '2026-03-04T00:00:00Z' },
  { id: 'mar-5', user_id: 'mock-user-123', type: 'income', amount: 200, category: 'Freelance', description: 'Web design project', date: '2026-03-05', created_at: '2026-03-05T00:00:00Z' },
  { id: 'mar-6', user_id: 'mock-user-123', type: 'expense', amount: 15, category: 'Entertainment', description: 'Netflix and Spotify', date: '2026-03-06', created_at: '2026-03-06T00:00:00Z' },
  { id: 'mar-7', user_id: 'mock-user-123', type: 'expense', amount: 50, category: 'Shopping', description: 'New shoes', date: '2026-03-07', created_at: '2026-03-07T00:00:00Z' },
  { id: 'mar-8', user_id: 'mock-user-123', type: 'expense', amount: 30, category: 'Utilities', description: 'Electricity bill', date: '2026-03-08', created_at: '2026-03-08T00:00:00Z' },
  { id: 'mar-9', user_id: 'mock-user-123', type: 'expense', amount: 65, category: 'Food', description: 'Dining out with friends', date: '2026-03-10', created_at: '2026-03-10T00:00:00Z' },
  { id: 'mar-10', user_id: 'mock-user-123', type: 'expense', amount: 40, category: 'Travel', description: 'Train to London', date: '2026-03-12', created_at: '2026-03-12T00:00:00Z' },
  { id: 'mar-11', user_id: 'mock-user-123', type: 'income', amount: 100, category: 'Investments', description: 'Dividend payment', date: '2026-03-13', created_at: '2026-03-13T00:00:00Z' },
  { id: 'mar-12', user_id: 'mock-user-123', type: 'expense', amount: 22, category: 'Healthcare', description: 'Prescription', date: '2026-03-14', created_at: '2026-03-14T00:00:00Z' },

]

// ─── BUDGETS ─────────────────────────────────────────────────────────────────
// January, February and March so budget vs actual chart has history

export const mockBudgets = [

  // January
  { id: 'bud-jan-1', user_id: 'mock-user-123', category: 'Housing', amount: 550, month: 1, year: 2026 },
  { id: 'bud-jan-2', user_id: 'mock-user-123', category: 'Food', amount: 200, month: 1, year: 2026 },
  { id: 'bud-jan-3', user_id: 'mock-user-123', category: 'Transport', amount: 50, month: 1, year: 2026 },
  { id: 'bud-jan-4', user_id: 'mock-user-123', category: 'Entertainment', amount: 40, month: 1, year: 2026 },
  { id: 'bud-jan-5', user_id: 'mock-user-123', category: 'Shopping', amount: 100, month: 1, year: 2026 },
  { id: 'bud-jan-6', user_id: 'mock-user-123', category: 'Utilities', amount: 60, month: 1, year: 2026 },

  // February
  { id: 'bud-feb-1', user_id: 'mock-user-123', category: 'Housing', amount: 550, month: 2, year: 2026 },
  { id: 'bud-feb-2', user_id: 'mock-user-123', category: 'Food', amount: 200, month: 2, year: 2026 },
  { id: 'bud-feb-3', user_id: 'mock-user-123', category: 'Transport', amount: 50, month: 2, year: 2026 },
  { id: 'bud-feb-4', user_id: 'mock-user-123', category: 'Entertainment', amount: 40, month: 2, year: 2026 },
  { id: 'bud-feb-5', user_id: 'mock-user-123', category: 'Shopping', amount: 100, month: 2, year: 2026 },
  { id: 'bud-feb-6', user_id: 'mock-user-123', category: 'Utilities', amount: 60, month: 2, year: 2026 },

  // March
  { id: 'bud-mar-1', user_id: 'mock-user-123', category: 'Housing', amount: 550, month: 3, year: 2026 },
  { id: 'bud-mar-2', user_id: 'mock-user-123', category: 'Food', amount: 200, month: 3, year: 2026 },
  { id: 'bud-mar-3', user_id: 'mock-user-123', category: 'Transport', amount: 50, month: 3, year: 2026 },
  { id: 'bud-mar-4', user_id: 'mock-user-123', category: 'Entertainment', amount: 40, month: 3, year: 2026 },
  { id: 'bud-mar-5', user_id: 'mock-user-123', category: 'Shopping', amount: 80, month: 3, year: 2026 },
  { id: 'bud-mar-6', user_id: 'mock-user-123', category: 'Utilities', amount: 50, month: 3, year: 2026 },
  { id: 'bud-mar-7', user_id: 'mock-user-123', category: 'Travel', amount: 30, month: 3, year: 2026 },
  { id: 'bud-mar-8', user_id: 'mock-user-123', category: 'Healthcare', amount: 30, month: 3, year: 2026 },
]

// ─── GOALS ───────────────────────────────────────────────────────────────────

export const mockGoals = [
  {
    id: 'goal-1',
    name: 'Holiday to Iceland',
    targetAmount: 3000,
    currentAmount: 850,
    targetDate: '2026-12-01',
    emoji: '✈️',
    completed: false,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'goal-2',
    name: 'Emergency Fund',
    targetAmount: 5000,
    currentAmount: 2800,
    targetDate: '2026-09-01',
    emoji: '🛡️',
    completed: false,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'goal-3',
    name: 'New Laptop',
    targetAmount: 1200,
    currentAmount: 1200,
    targetDate: '2026-03-01',
    emoji: '💻',
    completed: true,
    createdAt: '2025-10-01T00:00:00Z',
  },
  {
    id: 'goal-4',
    name: 'Masters Tuition Fee',
    targetAmount: 8000,
    currentAmount: 3200,
    targetDate: '2026-08-01',
    emoji: '🎓',
    completed: false,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'goal-5',
    name: 'Car Fund',
    targetAmount: 4000,
    currentAmount: 600,
    targetDate: '2027-06-01',
    emoji: '🚗',
    completed: false,
    createdAt: '2026-02-01T00:00:00Z',
  },
]

// ─── DEBTS ───────────────────────────────────────────────────────────────────

export const mockDebts = [
  {
    id: 'debt-1',
    name: 'Student Loan',
    type: 'Student Loan',
    emoji: '🎓',
    originalAmount: 15000,
    remainingAmount: 11200,
    interestRate: 4.5,
    minimumPayment: 150,
    dueDate: '2035-09-01',
    color: '#a78bfa',
    createdAt: '2022-09-01T00:00:00Z',
  },
  {
    id: 'debt-2',
    name: 'Barclays Credit Card',
    type: 'Credit Card',
    emoji: '💳',
    originalAmount: 2000,
    remainingAmount: 850,
    interestRate: 19.9,
    minimumPayment: 50,
    dueDate: '2027-01-01',
    color: '#f43f5e',
    createdAt: '2025-06-01T00:00:00Z',
  },
  {
    id: 'debt-3',
    name: 'Car Loan',
    type: 'Personal Loan',
    emoji: '🚗',
    originalAmount: 8000,
    remainingAmount: 3200,
    interestRate: 6.9,
    minimumPayment: 200,
    dueDate: '2028-06-01',
    color: '#f59e0b',
    createdAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'debt-4',
    name: 'Phone Contract',
    type: 'Personal Loan',
    emoji: '📱',
    originalAmount: 800,
    remainingAmount: 320,
    interestRate: 0,
    minimumPayment: 40,
    dueDate: '2026-10-01',
    color: '#06b6d4',
    createdAt: '2025-10-01T00:00:00Z',
  },
]

// ─── ASSETS ──────────────────────────────────────────────────────────────────

export const mockAssets = [
  {
    id: 'asset-1',
    name: 'Barclays Current Account',
    category: 'Cash',
    emoji: '🏦',
    value: 2450,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'asset-2',
    name: 'Savings Account',
    category: 'Cash',
    emoji: '💰',
    value: 3200,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'asset-3',
    name: 'Stocks & Shares ISA',
    category: 'Investments',
    emoji: '📈',
    value: 5800,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'asset-4',
    name: 'Crypto Portfolio',
    category: 'Investments',
    emoji: '₿',
    value: 1200,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'asset-5',
    name: 'Car',
    category: 'Vehicle',
    emoji: '🚗',
    value: 8500,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'asset-6',
    name: 'Laptop & Electronics',
    category: 'Other',
    emoji: '💻',
    value: 1500,
    createdAt: '2026-01-01T00:00:00Z',
  },
]

// ─── RECURRING TRANSACTIONS ───────────────────────────────────────────────────

export const mockRecurringTransactions = [
  {
    id: 'rec-1',
    type: 'income',
    description: 'Monthly Salary',
    amount: 1800,
    category: 'Salary',
    frequency: 'monthly',
    startDate: '2026-01-01',
    lastGenerated: '2026-03-01T00:00:00Z',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'rec-2',
    type: 'expense',
    description: 'Monthly Rent',
    amount: 520,
    category: 'Housing',
    frequency: 'monthly',
    startDate: '2026-01-02',
    lastGenerated: '2026-03-02T00:00:00Z',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'rec-3',
    type: 'expense',
    description: 'Netflix',
    amount: 15,
    category: 'Entertainment',
    frequency: 'monthly',
    startDate: '2026-01-07',
    lastGenerated: '2026-03-07T00:00:00Z',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'rec-4',
    type: 'expense',
    description: 'Spotify',
    amount: 12,
    category: 'Entertainment',
    frequency: 'monthly',
    startDate: '2026-01-25',
    lastGenerated: '2026-03-25T00:00:00Z',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'rec-5',
    type: 'expense',
    description: 'Bus Pass',
    amount: 20,
    category: 'Transport',
    frequency: 'monthly',
    startDate: '2026-01-06',
    lastGenerated: '2026-03-06T00:00:00Z',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'rec-6',
    type: 'expense',
    description: 'Gas & Electric',
    amount: 45,
    category: 'Utilities',
    frequency: 'monthly',
    startDate: '2026-01-12',
    lastGenerated: '2026-03-12T00:00:00Z',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'rec-7',
    type: 'expense',
    description: 'Amazon Prime',
    amount: 9,
    category: 'Entertainment',
    frequency: 'monthly',
    startDate: '2026-01-15',
    lastGenerated: '2026-03-15T00:00:00Z',
    active: false,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'rec-8',
    type: 'expense',
    description: 'Gym Membership',
    amount: 35,
    category: 'Healthcare',
    frequency: 'monthly',
    startDate: '2026-01-10',
    lastGenerated: '2026-03-10T00:00:00Z',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
]

// ─── NET WORTH HISTORY ────────────────────────────────────────────────────────
// Pre-populated so the chart has data immediately

export const mockNetWorthHistory = [
  { month: '2025-10', assets: 18000, liabilities: 17500, netWorth: 500, savedAt: '2025-10-31T00:00:00Z' },
  { month: '2025-11', assets: 19200, liabilities: 17100, netWorth: 2100, savedAt: '2025-11-30T00:00:00Z' },
  { month: '2025-12', assets: 20100, liabilities: 16800, netWorth: 3300, savedAt: '2025-12-31T00:00:00Z' },
  { month: '2026-01', assets: 21000, liabilities: 16400, netWorth: 4600, savedAt: '2026-01-31T00:00:00Z' },
  { month: '2026-02', assets: 22200, liabilities: 15900, netWorth: 6300, savedAt: '2026-02-28T00:00:00Z' },
  { month: '2026-03', assets: 22650, liabilities: 15570, netWorth: 7080, savedAt: '2026-03-14T00:00:00Z' },
]