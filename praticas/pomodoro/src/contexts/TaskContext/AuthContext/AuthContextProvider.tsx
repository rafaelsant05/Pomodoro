import { useState, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'
export function AuthContextProvider({ children }: { children: ReactNode }) {

    const [isAuthenticated, setIsAuthenticated] = useState(false)

    async function signIn({ email, password }: { email: string; password: string }) {
        if (email === 'teste@email.com' && password === '123456') {
            setIsAuthenticated(true)
        } else {
            throw new Error('Credenciais inválidas')
        }
    }

    function signOut() {
        setIsAuthenticated(false)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}