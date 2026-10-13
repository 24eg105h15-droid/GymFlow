import { createContext, useContext, useState } from 'react'
import { apiRequest } from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('gymflow-user') || 'null')
    } catch {
      return null
    }
  })

  async function authenticate(path, payload) {
    const result = await apiRequest(path, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    localStorage.setItem('gymflow-token', result.token)
    localStorage.setItem('gymflow-user', JSON.stringify(result.user))
    setUser(result.user)
    return result.user
  }

  function logout() {
    localStorage.removeItem('gymflow-token')
    localStorage.removeItem('gymflow-user')
    setUser(null)
  }

  function updateUser(updatedUser) {
    localStorage.setItem('gymflow-user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider value={{ user, login: (data) => authenticate('/auth/login', data), register: (data) => authenticate('/auth/register', data), logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}