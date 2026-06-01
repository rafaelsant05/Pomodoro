
    import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '../../contexts/TaskContext/AuthContext/useAuthContext'
import styles from './styles.module.css'

export function Login() {
    const { isAuthenticated, signIn } = useAuthContext()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isAuthenticated) navigate('/home', { replace: true })
    }, [isAuthenticated, navigate])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setMessage('')
        if (!email || !password) { setMessage('Preencha todos os campos.'); return }
        setLoading(true)
        try {
            await signIn({ email, password })
        } catch (err: unknown) {
            setMessage(err instanceof Error ? err.message : 'Erro ao fazer login')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <span className={styles.logo}>Pomodoro</span>
                    <h1>Bem-vindo</h1>
                    <p>Entre na sua conta para continuar</p>
                </div>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label htmlFor="email">E-mail</label>
                        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="password">Senha</label>
                        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                    </div>
                    {message && <p className={styles.message}>{message}</p>}
                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
                <div className={styles.links}>
                    <Link to="/register">Criar conta</Link>
                    <Link to="/forgot-password">Esqueci minha senha</Link>
                </div>
            </div>
        </div>
    )
}
