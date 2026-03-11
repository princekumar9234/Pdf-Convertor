import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

const GUEST_LIMIT = 3
const GUEST_COUNT_KEY = 'pdf_guest_count'
const TOKEN_KEY = 'pdf_token'
const USER_KEY = 'pdf_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [guestCount, setGuestCount] = useState(0)

  // Load persisted state on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const savedUser = localStorage.getItem(USER_KEY)
    const savedGuest = parseInt(localStorage.getItem(GUEST_COUNT_KEY) || '0', 10)

    setGuestCount(savedGuest)

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
        // Verify token is still valid
        authAPI.getMe()
          .then(({ data }) => {
            setUser(data.user)
            localStorage.setItem(USER_KEY, JSON.stringify(data.user))
          })
          .catch(() => {
            logout()
          })
      } catch {
        logout()
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login({ email, password })
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    setUser(data.user)
    return data
  }, [])

  const signup = useCallback(async (name, email, password) => {
    const { data } = await authAPI.signup({ name, email, password })
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  const incrementGuestCount = useCallback(() => {
    const newCount = guestCount + 1
    setGuestCount(newCount)
    localStorage.setItem(GUEST_COUNT_KEY, String(newCount))
    return newCount
  }, [guestCount])

  const canConvert = useCallback(() => {
    if (user) return true // logged-in: unlimited
    return guestCount < GUEST_LIMIT
  }, [user, guestCount])

  const remainingFreeConversions = useCallback(() => {
    if (user) return Infinity
    return Math.max(0, GUEST_LIMIT - guestCount)
  }, [user, guestCount])

  const updateUserCount = useCallback((count) => {
    setUser(prev => {
      if (!prev) return prev
      const updated = { ...prev, conversionCount: count }
      localStorage.setItem(USER_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      guestCount,
      login,
      signup,
      logout,
      canConvert,
      incrementGuestCount,
      remainingFreeConversions,
      updateUserCount,
      isAuthenticated: !!user,
      GUEST_LIMIT,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
