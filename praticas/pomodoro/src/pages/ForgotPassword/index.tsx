import React, { useState } from "react"
import { Link } from "react-router-dom"
import styles from "../login/styles.module.css"

const API = "http://localhost:3333"

export function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage("")
    if (!email) { setMessage("Informe seu e-mail."); return }
    setLoading(true)
    try {
      const res = await fetch(API + "/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (data.resetToken) {
        setResetToken(data.resetToken)
        setMessage("Token gerado! Copie o token abaixo e use na tela de redefinição.")
      } else {
        setMessage(data.message || "Se o e-mail existir, voce recebera o token.")
      }
    } catch {
      setMessage("Erro ao processar solicitação.")
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <span className={styles.logo}>Pomodoro</span>
            <h1>Esqueci minha senha</h1>
            <p>Informe seu e-mail para recuperar o acesso</p>
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="email">E-mail</label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" />
            </div>
            {message && <p className={styles.message}>{message}</p>}
            {resetToken && (
                <div className={styles.field}>
                  <label>Seu token de redefinicao:</label>
                  <input type="text" value={resetToken} readOnly onClick={e => (e.target as HTMLInputElement).select()} />
                </div>
            )}
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? "Enviando..." : "Gerar token"}
            </button>
          </form>
          <div className={styles.links}>
            <Link to="/reset-password">Ja tenho um token</Link>
            <Link to="/">Voltar ao login</Link>
          </div>
        </div>
      </div>
  )
}