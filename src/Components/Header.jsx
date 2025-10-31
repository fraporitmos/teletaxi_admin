import React from 'react'
import '../App.css'
function Header({title}) {
  return (
      <header 
      className='backgroundSecondary bg-opacity-50 
      backdrop-blur-md shadow-lg '>
        <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-12'>
        <h1 className='text-2xl font-semibold textColor'>{title}</h1>
        </div>
      </header>
  )
}

export default Header;