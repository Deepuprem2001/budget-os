# 💰 FinSight — Personal Finance Platform

> A full-stack personal finance platform built with React, Supabase and Tailwind CSS. Track spending, manage budgets, monitor debts, set financial goals and get personalised smart insights — all in one place.

![FinSight Dashboard](https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![Tests](https://img.shields.io/badge/Tests-30%20passing-success?style=flat-square)

---

## 🌟 Features

### 📊 Dashboard
- **Summary cards** — total income, expenses, net balance and savings rate at a glance
- **Spending forecast** — intelligent prediction of month-end spend using fixed vs variable cost logic
- **Financial Health Score** — weighted score out of 100 based on savings rate, budget adherence, debt management, goal progress and spending consistency
- **Smart Insights** — 10 personalised insights including overspending alerts, savings opportunities, goal nudges and positive reinforcement

### 💳 Transactions
- Add, edit and delete income and expense transactions
- Search and filter by description, category, type and date
- Export all transactions to CSV for use in Excel or Google Sheets
- Real-time updates across all charts and calculations

### 📋 Budgets
- Set monthly spending limits per category
- Visual progress bars with colour-coded alerts (on track / warning / over budget)
- Budget vs actual comparison chart in Analytics

### 📈 Analytics
- **Expense breakdown** pie chart by category
- **Monthly bar chart** — income vs expenses over the year
- **Net balance line chart** — monthly savings trend
- **Yearly summary** — total income, expenses, savings rate and average monthly spend
- **Budget vs actual** — side by side comparison per category
- **Category spending trends** — interactive multi-line chart with category toggles
- **Year over year comparison** — grouped bar chart comparing current vs previous year across expenses, income and net

### 🎯 Financial Goals
- Create savings goals with target amounts and deadlines
- Track progress with visual progress bars
- Auto-calculates monthly savings needed to hit each goal on time
- Adding funds automatically creates a linked savings transaction

### 💸 Debt Tracker
- Track credit cards, loans, student debt and more
- Visual payoff progress per debt
- Payoff date estimate based on minimum payments
- Monthly interest cost calculation
- Making payments automatically creates a linked expense transaction

### 👤 Profile
- Edit display name and currency preference
- Avatar with initials
- Change password
- Account deletion with confirmation

### ✨ Polish
- Dark and light mode with localStorage persistence
- Fully responsive — works on mobile, tablet and desktop
- Collapsible sidebar with hamburger menu on mobile
- Loading states and error boundary

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + JavaScript |
| Styling | Tailwind CSS v4 + Lucide React |
| Routing | React Router DOM v6 |
| State Management | Zustand |
| Charts | Recharts |
| Backend | Supabase (PostgreSQL + Auth) |
| Build Tool | Vite |
| Testing | Vitest + React Testing Library |
| Deployment | Vercel |
| Utilities | date-fns, clsx, tailwind-merge |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- A Supabase account (free tier works perfectly)

### 1. Clone the repository

```bash
git clone https://github.com/Deepan/budget-os.git
cd budget-os
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

Create a new project at [supabase.com](https://supabase.com) and run the following SQL in the Supabase SQL editor:

```sql
-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade,
  full_name text,
  currency text default 'GBP',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (id)
);

-- Transactions table
create table transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  type text check (type in ('income', 'expense')),
  amount numeric not null,
  category text not null,
  description text,
  date date not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Budgets table
create table budgets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  category text not null,
  amount numeric not null,
  month integer not null,
  year integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Goals table
create table goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  name text not null,
  target_amount numeric not null,
  current_amount numeric default 0,
  target_date date,
  emoji text,
  color text,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Debts table
create table debts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  name text not null,
  type text not null,
  emoji text,
  color text,
  original_amount numeric not null,
  remaining_amount numeric not null,
  interest_rate numeric default 0,
  minimum_payment numeric default 0,
  due_date date,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table transactions enable row level security;
alter table budgets enable row level security;
alter table goals enable row level security;
alter table debts enable row level security;

-- RLS policies
create policy "Users can manage their own data" on profiles for all using (auth.uid() = id);
create policy "Users can manage their own data" on transactions for all using (auth.uid() = user_id);
create policy "Users can manage their own data" on budgets for all using (auth.uid() = user_id);
create policy "Users can manage their own data" on goals for all using (auth.uid() = user_id);
create policy "Users can manage their own data" on debts for all using (auth.uid() = user_id);
```

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these in your Supabase project under **Settings → API**.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Running Tests

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run coverage
```

The test suite includes 30 tests covering:
- Utility functions (formatCurrency, formatDate, getPercentage, exportToCSV)
- Zustand store actions (add, update, delete transactions and budgets)
- Computed values (getTotalIncome, getTotalExpenses, getBalance, getFilteredTransactions)

---

## 📁 Project Structure

```
budget-os/
├── src/
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   ├── layout/              # App shell, sidebar, navigation
│   │   ├── dashboard/           # Dashboard widgets
│   │   ├── transactions/        # Transaction components
│   │   ├── budgets/             # Budget components
│   │   ├── analytics/           # Chart components
│   │   ├── goals/               # Goals components
│   │   └── debts/               # Debt tracker components
│   ├── pages/                   # Page-level components
│   ├── hooks/                   # Custom React hooks
│   ├── store/                   # Zustand state management
│   ├── lib/                     # Supabase client, utilities, mock data
│   ├── types/                   # Shared constants and types
│   └── tests/                   # Test files
├── .env.local                   # Environment variables (not committed)
├── vite.config.js
└── README.md
```

---

## 🧠 Architecture Decisions

**Zustand over Redux** — Zustand gives us global state with minimal boilerplate. All financial data lives in one store making it easy to share calculations across components without prop drilling.

**Mock data layer** — the app ships with realistic mock data so the UI is fully functional without a database connection. Swapping to real Supabase data only requires updating the store actions.

**Computed values in the store** — `getTotalIncome`, `getTotalExpenses`, `getBalance` and `getFilteredTransactions` are derived from raw transactions inside the store. This means every component always gets consistent numbers from a single source of truth.

**Fixed vs variable forecasting** — the spending forecast splits expenses into fixed categories (Housing, Utilities, Healthcare etc.) and variable categories. Variable spend is extrapolated based on current daily rate, giving a more accurate month-end prediction than simply multiplying current spend.

**Weighted health scoring** — the Financial Health Score weights savings rate and budget adherence most heavily (25pts each) because these have the biggest impact on long-term financial health. Neutral scores are given when data is missing to avoid unfairly penalising new users.

---

## 🔮 Roadmap

- [ ] Connect real Supabase backend
- [ ] Savings streak gamification
- [ ] Recurring transactions
- [ ] Bank import via CSV upload
- [ ] Mobile app via React Native
- [ ] AI-powered financial advice

---

## 👨‍💻 Author

**Deepan Prashanth**
- GitHub: [@Deepan Prashanth Prem Kumar](https://github.com/Deepuprem2001)
---

## 📄 License

MIT License — feel free to use this project as inspiration for your own.
