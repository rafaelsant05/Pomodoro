import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import styles from "../login/styles.module.css"

const API = "http://localhost:3333"

export function ResetPassword() {
  const navigate = useNavigate()
  const [resetToken, setResetToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage("")
    if (!resetToken || !newPassword) { setMessage("Preencha todos os campos."); return }
    if (newPassword.length < 6) { setMessage("Senha deve ter pelo menos 6 caracteres."); return }
    setLoading(true)
    try {
      const res = await fetch(API + "/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword })
      })
      const data = await res.json()
      if (!res.ok) { setMessage(data.error || "Erro ao redefinir senha"); return }
      setMessage("Senha redefinida com sucesso!")
      setTimeout(() => navigate("/"), 2000)
    } catch {
      setMessage("Erro ao redefinir senha.")
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <span className={styles.logo}>Pomodoro</span>
            <h1>Redefinir senha</h1>
            <p>Cole o token recebido e defina sua nova senha</p>
          </div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="token">Token de redefinicao</label>
              <input id="token" type="text" value={resetToken} onChange={e => setResetToken(e.target.value)} placeholder="Cole o token aqui" />
            </div>
            <div className={styles.field}>
              <label htmlFor="newPassword">Nova senha</label>
              <input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimo 6 caracteres" />
            </div>
            {message && <p className={styles.message}>{message}</p>}
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? "Salvando..." : "Redefinir senha"}
            </button>
          </form>
          <div className={styles.links}>
            <Link to="/">Voltar ao login</Link>
          </div>
        </div>
      </div>
  )
}