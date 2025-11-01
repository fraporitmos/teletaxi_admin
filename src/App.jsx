import React, { useState, useEffect } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './Pages/LoginPage'
import OverviewPage from './Pages/OverviewPage'
import Sidebar from './Pages/Sidebar'
import SalesPage from './Pages/SalesPage'
import OrdersPage from './Pages/OrdersPage'
import Analyticspage from './Pages/Analyticspage'
import SettingsPage from './Pages/SettingsPage'
import PassengerPage from './Pages/PassengerPage'
import DriverPage from './Pages/DriverPage'
import TravelsPage from './Pages/TravelsPage'
import MapPage from './Pages/MapPage'


function App() {
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('username')
    const pass = localStorage.getItem('password')
    if (user === `${import.meta.env.VITE_USERNAME}` && pass === `${import.meta.env.VITE_PASSWORD}`) {
      setAuthenticated(true)
    }
  }, [])

  if (!authenticated) {
    return <LoginPage onLogin={() => setAuthenticated(true)} />
  }

  return (
    <div className="flex h-screen backgroundPrimary overflow-hidden">
      <Sidebar />
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/viajes" element={<TravelsPage />} />
        <Route path="/pasajeros" element={<PassengerPage />} />
        <Route path="/conductores" element={<DriverPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/analytics" element={<Analyticspage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/mapa" element={<MapPage />} />

      </Routes>
    </div>
  )
}

export default App
