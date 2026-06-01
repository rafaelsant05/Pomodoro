import { createContext } from "react"

interface User {
    id: number
    name: string
    email: string
}

interface AuthContextProps {
    isAuthenticated: boolean
    user: User | null
    token: string | null
    signIn: (credentials: { email: string; password: string }) => Promise<void>
    signUp: (data: { name: string; email: string; password: string }) => Promise<void>
    signOut: () => void
}

export const AuthContext = createContext({} as AuthContextProps)