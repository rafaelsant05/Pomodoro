import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthContext } from '../../contexts/TaskContext/AuthContext/useAuthContext'
import styles from '../login/styles.module.css'

export function Register() {
    const { isAuthenticated, signUp } = useAuthContext()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isAuthenticated) navigate('/home', { replace: true })
    }, [isAuthenticated, navigate])

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setMessage('')
        if (!name || !email || !password) { setMessage('Preencha todos os campos.'); return }
        if (password.length < 6) { setMessage('Senha deve ter pelo menos 6 caracteres.'); return }
        setLoading(true)
        try {
            await signUp({ name, email, password })
        } catch (err: unknown) {
            setMessage(err instanceof Error ? err.message : 'Erro ao cadastrar')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <span className={styles.logo}>Pomodoro</span>
                    <h1>Criar conta</h1>
                    <p>Cadastre-se para começar a usar</p>
                </div>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label htmlFor="name">Nome</label>
                        <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="email">E-mail</label>
                        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" />
                    </div>
                    <div className={styles.field}>
                        <label htmlFor="password">Senha</label>
                        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
                    </div>
                    {message && <p className={styles.message}>{message}</p>}
                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Criar conta'}
                    </button>
                </form>
                <div className={styles.links}>
                    <Link to="/">Já tenho conta</Link>
                </div>
            </div>
        </div>
    )
}