function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-gray-700" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500 animate-spin" />
      </div>
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  )
}

export default LoadingSpinner