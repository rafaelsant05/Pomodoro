import express from 'express'
import cors from 'cors'
import { settingsRouter } from './routes/settings.routes'
import { tasksRouter } from './routes/tasks.routes'
import { authRouter } from './routes/auth.routes'

export const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())

// Corrige serializacao de BigInt
app.set('json replacer', (_key: string, value: unknown) => {
  return typeof value === 'bigint' ? value.toString() : value
})

app.use('/auth', authRouter)
app.use('/settings', settingsRouter)
app.use('/tasks', tasksRouter)

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})
