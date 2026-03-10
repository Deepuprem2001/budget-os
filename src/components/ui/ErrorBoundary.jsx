import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('Error caught by boundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-white text-xl font-bold mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              An unexpected error occurred. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              Refresh page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary