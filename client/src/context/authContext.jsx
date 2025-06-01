import { createContext, useContext, useState } from 'react'

// Create the context
const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(()=>{
    const user = localStorage.getItem("user")
   return user ? JSON.parse(user) : null
  })
  const [sessionId, setSessionId] = useState(()=>{
    const sessionId = localStorage.getItem("sessionId")
   return sessionId || null
  })

  const updateUser = (userData) => {
    setUser(userData)
  }

  const updateSessionId = (token) => {
    setSessionId(token)
  }

  return (
    <AuthContext.Provider value={{ user, sessionId, updateUser, updateSessionId }}>
      {children}
    </AuthContext.Provider>
  )
}
