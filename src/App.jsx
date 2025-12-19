import './App.css'
import axios from 'axios'
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import BookScreen from './BookScreen';
import DashboardScreen from './DashboardScreen'; 
import MainLayout from './MainLayout';         
// Import ไฟล์ใหม่เข้ามา
import CategoryScreen from './CategoryScreen';

axios.defaults.baseURL = "http://localhost:3000"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
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
          element={!isAuthenticated ? <LoginScreen onLoginSuccess={handleLoginSuccess}/> : <Navigate to="/books" replace />} 
        />
        
        <Route 
          path="/books" 
          element={
            isAuthenticated ? (
              <MainLayout onLogout={() => setIsAuthenticated(false)}>
                <BookScreen />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* เพิ่ม Route ใหม่สำหรับจัดการ Category */}
        <Route 
          path="/categories" 
          element={
            isAuthenticated ? (
              <MainLayout onLogout={() => setIsAuthenticated(false)}>
                <CategoryScreen />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
       
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <MainLayout onLogout={() => setIsAuthenticated(false)}>
                <DashboardScreen />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route path="*" element={<Navigate to={isAuthenticated ? "/books" : "/login"} replace />} />
      </Routes>
    </Router>
  )
}

export default App