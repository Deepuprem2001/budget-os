function EmptyState({ emoji, title, message, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">{emoji}</div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-sm leading-relaxed">{message}</p>
      {action && (
        <button
          onClick={action}
          className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default EmptyState