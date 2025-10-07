import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const response = await axios.get('/user')
          setUser(response.data)
        }
      } catch (error) {
        console.error('Authentication error:', error)
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = (userData, token) => {
    setUser(userData)
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  const logout = async () => {
    try {
      await axios.post('/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
