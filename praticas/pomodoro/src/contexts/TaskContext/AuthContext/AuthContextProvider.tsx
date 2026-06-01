import { useState, useEffect, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'

interface User {
    id: number
    name: string
    email: string
}

const API = 'http://localhost:3333'

export function AuthContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        const savedToken = localStorage.getItem('pomodoro_token')
        const savedUser = localStorage.getItem('pomodoro_user')
        if (savedToken && savedUser) {
            setToken(savedToken)
            setUser(JSON.parse(savedUser))
        }
    }, [])

    async function signIn({ email, password }: { email: string; password: string }) {
        const res = await fetch(API + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Erro ao fazer login')
        localStorage.setItem('pomodoro_token', data.token)
        localStorage.setItem('pomodoro_user', JSON.stringify(data.user))
        setToken(data.token)
        setUser(data.user)
    }

    async function signUp({ name, email, password }: { name: string; email: string; password: string }) {
        const res = await fetch(API + '/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Erro ao cadastrar')
        localStorage.setItem('pomodoro_token', data.token)
        localStorage.setItem('pomodoro_user', JSON.stringify(data.user))
        setToken(data.token)
        setUser(data.user)
    }

    function signOut() {
        localStorage.removeItem('pomodoro_token')
        localStorage.removeItem('pomodoro_user')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!token, user, token, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}