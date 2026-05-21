import { createContext } from 'react'

interface AuthContextProps {
    isAuthenticated: boolean
    signIn: (credentials: { email: string; password: string }) => Promise<void>
    signOut: () => void
}

export const AuthContext = createContext({} as AuthContextProps)