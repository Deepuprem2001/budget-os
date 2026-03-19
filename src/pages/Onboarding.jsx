import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useBudgetStore from '../store/useBudgetStore'
import { CATEGORIES } from '../types/index'
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Wallet,
  Target,
  ArrowLeftRight,
  Sparkles,
} from 'lucide-react'

const CURRENCIES = [
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar' },
]

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: (direction) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  }),
}

function Onboarding() {
  const navigate = useNavigate()
  const completeOnboarding = useBudgetStore((state) => state.completeOnboarding)
  const setBudget = useBudgetStore((state) => state.setBudget)
  const addTransaction = useBudgetStore((state) => state.addTransaction)

  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)

  const [profile, setProfile] = useState({
    name: '',
    currency: 'GBP',
  })

  const [budget, setBudgetData] = useState({
    category: 'Food',
    amount: '',
  })

  const [transaction, setTransaction] = useState({
    type: 'income',
    description: '',
    amount: '',
    category: 'Salary',
    date: new Date().toISOString().slice(0, 10),
  })

  const goNext = () => {
    setDirection(1)
    setStep((s) => s + 1)
  }

  const goBack = () => {
    setDirection(-1)
    setStep((s) => s - 1)
  }

  const handleFinish = async () => {
    // Save profile first and WAIT for it
    await completeOnboarding({
      name: profile.name,
      currency: profile.currency,
    })

    // Save budget if filled
    if (budget.amount) {
      await setBudget({
        category: budget.category,
        amount: parseFloat(budget.amount),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      })
    }

    // Save transaction if filled
    if (transaction.description && transaction.amount) {
      await addTransaction({
        ...transaction,
        amount: parseFloat(transaction.amount),
      })
    }

    // Only navigate AFTER everything is saved
    navigate('/dashboard')
  }

  const steps = [
    {
      id: 'welcome',
      icon: Sparkles,
      iconColor: 'text-violet-400',
      iconBg: 'bg-violet-500/20',
      title: 'Welcome to FinSight',
      subtitle: "Let's get you set up in 3 quick steps",
    },
    {
      id: 'profile',
      icon: Wallet,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20',
      title: 'Tell us about yourself',
      subtitle: 'Set your name and preferred currency',
    },
    {
      id: 'budget',
      icon: Target,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/20',
      title: 'Set your first budget',
      subtitle: 'Pick a spending category and set a monthly limit',
    },
    {
      id: 'transaction',
      icon: ArrowLeftRight,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/20',
      title: 'Add your first transaction',
      subtitle: 'Log your first income or expense to get started',
    },
    {
      id: 'done',
      icon: Check,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/20',
      title: "You're all set!",
      subtitle: 'Your FinSight is ready to go',
    },
  ]

  const currentStep = steps[step]
  const Icon = currentStep.icon
  const totalSteps = steps.length

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-xs">
              {step === 0 ? 'Getting started' : `Step ${step} of ${totalSteps - 2}`}
            </span>
            <span className="text-gray-500 text-xs">
              {Math.round((step / (totalSteps - 1)) * 100)}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full accent-bg rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step / (totalSteps - 1)) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl overflow-hidden">

          {/* Step header */}
          <div className="p-8 pb-6 text-center border-b border-gray-700/40">
            <motion.div
              key={step}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`w-14 h-14 ${currentStep.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4`}
            >
              <Icon size={24} className={currentStep.iconColor} />
            </motion.div>
            <h1 className="text-white font-bold text-xl mb-1">{currentStep.title}</h1>
            <p className="text-gray-400 text-sm">{currentStep.subtitle}</p>
          </div>

          {/* Step content */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="p-8"
              >

                {/* Step 0 — Welcome */}
                {step === 0 && (
                  <div className="space-y-4">
                    {[
                      { icon: '📊', text: 'Track your income and expenses' },
                      { icon: '🎯', text: 'Set budgets and financial goals' },
                      { icon: '💡', text: 'Get personalised smart insights' },
                      { icon: '💳', text: 'Monitor and pay off your debts' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 bg-gray-900/40 rounded-xl px-4 py-3"
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-gray-300 text-sm">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Step 1 — Profile */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Your name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        placeholder="e.g. Deepan"
                        autoFocus
                        className="w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Currency
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {CURRENCIES.map((c) => (
                          <button
                            key={c.code}
                            onClick={() => setProfile({ ...profile, currency: c.code })}
                            className={`p-3 rounded-xl border text-center transition-all ${
                              profile.currency === c.code
                                ? 'accent-bg/20 border-violet-500/50 text-white'
                                : 'bg-gray-900/40 border-gray-700/60 text-gray-400 hover:border-gray-600'
                            }`}
                          >
                            <div className="text-lg font-bold">{c.symbol}</div>
                            <div className="text-xs mt-0.5">{c.code}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2 — Budget */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Category
                      </label>
                      <select
                        value={budget.category}
                        onChange={(e) => setBudgetData({ ...budget, category: e.target.value })}
                        className="w-full bg-gray-900/60 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                      >
                        {CATEGORIES.expense.map((cat) => (
                          <option key={cat} value={cat} className="bg-gray-800">
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Monthly limit
                      </label>
                      <input
                        type="number"
                        value={budget.amount}
                        onChange={(e) => setBudgetData({ ...budget, amount: e.target.value })}
                        placeholder="e.g. 300"
                        className="w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                    <p className="text-gray-600 text-xs text-center">
                      You can set more budgets later on the Budgets page
                    </p>
                  </div>
                )}

                {/* Step 3 — Transaction */}
                {step === 3 && (
                  <div className="space-y-4">
                    {/* Type toggle */}
                    <div className="flex gap-2 bg-gray-900/60 p-1 rounded-xl">
                      {['income', 'expense'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setTransaction({
                            ...transaction,
                            type,
                            category: type === 'income' ? 'Salary' : 'Food',
                          })}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                            transaction.type === type
                              ? type === 'income'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={transaction.description}
                        onChange={(e) => setTransaction({ ...transaction, description: e.target.value })}
                        placeholder="e.g. Monthly salary"
                        className="w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Amount
                        </label>
                        <input
                          type="number"
                          value={transaction.amount}
                          onChange={(e) => setTransaction({ ...transaction, amount: e.target.value })}
                          placeholder="0.00"
                          className="w-full bg-gray-900/60 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Category
                        </label>
                        <select
                          value={transaction.category}
                          onChange={(e) => setTransaction({ ...transaction, category: e.target.value })}
                          className="w-full bg-gray-900/60 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                        >
                          {CATEGORIES[transaction.type].map((cat) => (
                            <option key={cat} value={cat} className="bg-gray-800">
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <p className="text-gray-600 text-xs text-center">
                      You can skip this and add transactions later
                    </p>
                  </div>
                )}

                {/* Step 4 — Done */}
                {step === 4 && (
                  <div className="space-y-3">
                    {[
                      profile.name && `👋 Welcome, ${profile.name}!`,
                      budget.amount && `✅ Budget set for ${budget.category} — £${budget.amount}/month`,
                      transaction.description && `✅ First transaction added — ${transaction.description}`,
                      `✅ Dark mode ready`,
                      `✅ Smart insights enabled`,
                    ]
                      .filter(Boolean)
                      .map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-3 bg-gray-900/40 rounded-xl px-4 py-3"
                        >
                          <span className="text-gray-300 text-sm">{item}</span>
                        </motion.div>
                      ))}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation buttons */}
          <div className="px-8 pb-8 flex gap-3">
            {step > 0 && step < totalSteps - 1 && (
              <button
                onClick={goBack}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 bg-gray-700/60 hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft size={16} />
                Back
              </button>
            )}

            {step < totalSteps - 1 ? (
              <button
                onClick={goNext}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white accent-bg hover:bg-violet-700 transition-colors"
              >
                {step === 0 ? "Let's go!" : 'Continue'}
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                Take me to my dashboard
                <ChevronRight size={16} />
              </button>
            )}
          </div>

        </div>

        {/* Skip link */}
        {step > 0 && step < totalSteps - 1 && (
          <p className="text-center mt-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 text-xs hover:text-gray-400 transition-colors"
            >
              Skip setup for now
            </button>
          </p>
        )}

      </div>
    </div>
  )
}

export default Onboarding