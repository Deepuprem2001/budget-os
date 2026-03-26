import Sidebar from './Sidebar'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 flex overflow-x-hidden">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-16 lg:pt-8 min-w-0 overflow-x-hidden">
        {children}
      </main>

    </div>
  )
}

export default Layout