import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  useEffect(() => {
    const storedUsername = localStorage.getItem('username')
    const storedPassword = localStorage.getItem('password')
    if (storedUsername === `${import.meta.env.VITE_USERNAME}` && storedPassword === `${import.meta.env.VITE_PASSWORD_CRED}`) {
      onLogin()
      navigate('/')
    }
  }, [navigate, onLogin])
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === `${import.meta.env.VITE_USERNAME}` && password === `${import.meta.env.VITE_PASSWORD_CRED}`) {
      localStorage.setItem('username', username)
      localStorage.setItem('password', password)
      onLogin()
      navigate('/')
      return
    }
    alert('Invalid credentials')
  };
  return (
<div class="backgroundSecondary flex justify-center items-center h-screen">
<div class="w-1/2 h-screen hidden lg:block">
  <img src="https://res.cloudinary.com/dyzga4bnr/image/upload/v1752101504/jesus-navarro-2k4X2lQKU_g-unsplash_prghqy.jpg" alt="Placeholder Image" class="object-cover w-full h-full" />
</div>
<div class="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
  <h1 class="text-2xl text-black font-semibold mb-4">"TaxiAdmin - Chiclayo"</h1>
  <form onSubmit={handleSubmit}>
    <div class="mb-4">
      <label for="username" class="block text-black">Usuario</label>
      <input type="text" id="username" name="username" class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-primary" autocomplete="off" value={username} onChange={(e) => setUsername(e.target.value)} />
    </div>
    <div class="mb-4">
      <label for="password" class="block text-black">Contraseña</label>
      <input type="password" id="password" name="password" class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-primary" autocomplete="off" value={password} onChange={(e) => setPassword(e.target.value)}/>
    </div>
    <div class="mb-4 flex items-center">
      <input type="checkbox" id="remember" name="remember" class="text-primary"/>
      <label for="remember" class="text-black ml-2">Recordarme</label>
    </div>
    <div class="mb-6 text-primary">
      <a href="https://wa.me/51947254438" class="underline">Contactar soporte</a>
    </div>
    <button type="submit" class="bg-primaryDark hover:bg-primaryLight text-white font-semibold rounded-md py-2 px-4 w-full text-lg">Iniciar ahora</button>
  </form>

</div>
</div>
  )
}

export default LoginPage