import React from 'react'
import Header from '../Components/Header'
import Profile from '../Components/Settings/Profile'
import Notifications from '../Components/Settings/Notifications'
import Security from '../Components/Settings/Security'
import ConnectedAccounts from '../Components/Settings/ConnectedAccounts'
import DangerZone from '../Components/Settings/DangerZone'



function SettingsPage() {
  return (
    <div className='flex-1 overflow-auto relative  z-10'>
      <Header title="Settings" />
      <main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
        <Profile />
        <Notifications />
        <Security />
        <ConnectedAccounts/>
        <DangerZone/>
      </main>

    </div>

  )
}

export default SettingsPage