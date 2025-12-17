import './App.css'
import axios from 'axios'
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import BookScreen from './BookScreen';

axios.defaults.baseURL = "http://localhost:3000"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }
      setIsAuthenticated(true)
    }
  }, [])

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <LoginScreen onLoginSuccess={handleLoginSuccess}/> : <Navigate to="/books" />} 
        />
        <Route 
          path="/books" 
          element={isAuthenticated ? <BookScreen/> : <Navigate to="/login" />} 
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/books" : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App