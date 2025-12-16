import './App.css'
import axios from 'axios'
import { useState, useEffect } from 'react';
import LoginScreen from './LoginScreen';
import BookScreen from './BookScreen';

axios.defaults.baseURL = "http://localhost:3000"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const handleLoginSuccess = () => {setIsAuthenticated(true)}

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }
      setIsAuthenticated(true)
    }
  }, [])

  return (
    <>
      {isAuthenticated ? <BookScreen/> : <LoginScreen onLoginSuccess={handleLoginSuccess}/>}
    </>
  )
}

export default App