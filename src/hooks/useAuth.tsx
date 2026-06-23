import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth'
import { auth } from '../lib/firebase'

interface AuthContextValue {
  user: User | null
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  error: null,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        setLoading(false)
        return
      }

      try {
        await signInAnonymously(auth)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to sign in')
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
