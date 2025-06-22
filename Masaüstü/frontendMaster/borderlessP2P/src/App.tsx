import { Outlet } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Outlet />
    </div>
  )
}

export default App
