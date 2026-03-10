import Sidebar from './Sidebar'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 flex">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>

    </div>
  )
}

export default Layout