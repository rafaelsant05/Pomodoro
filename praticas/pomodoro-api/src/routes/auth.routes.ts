import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { prisma } from '../lib/prisma'

export const authRouter = Router()

// CADASTRO
authRouter.post('/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body

  if (!name || !email || !password)
    return res.status(400).json({ error: 'Preencha todos os campos' })

  if (password.length < 6)
    return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' })

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists)
    return res.status(409).json({ error: 'E-mail já cadastrado' })

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, passwordHash }
  })

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
  return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } })
})

// LOGIN
authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({ error: 'Preencha todos os campos' })

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user)
    return res.status(401).json({ error: 'E-mail ou senha incorretos' })

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid)
    return res.status(401).json({ error: 'E-mail ou senha incorretos' })

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
})

// ESQUECI MINHA SENHA
authRouter.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body

  if (!email)
    return res.status(400).json({ error: 'Informe o e-mail' })

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user)
    return res.status(404).json({ error: 'E-mail não encontrado' }) // ✅ mudança aqui

  const resetToken = crypto.randomBytes(32).toString('hex')
  const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60)

  await prisma.user.update({
    where: { email },
    data: { resetToken, resetTokenExpiry }
  })

  return res.json({
    message: 'Token de redefinição gerado',
    resetToken,
    expiresIn: '1 hora'
  })
})

// REDEFINIR SENHA
authRouter.post('/reset-password', async (req: Request, res: Response) => {
  const { resetToken, newPassword } = req.body

  if (!resetToken || !newPassword)
    return res.status(400).json({ error: 'Token e nova senha são obrigatórios' })

  if (newPassword.length < 6)
    return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' })

  const user = await prisma.user.findFirst({
    where: {
      resetToken,
      resetTokenExpiry: { gt: new Date() }
    }
  })

  if (!user)
    return res.status(400).json({ error: 'Token inválido ou expirado' })

  const passwordHash = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetToken: null, resetTokenExpiry: null }
  })

  return res.json({ message: 'Senha redefinida com sucesso' })
})

// ME (retorna dados do usuário logado)
authRouter.get('/me', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'Não autenticado' })

  const token = authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token não fornecido' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as unknown as { userId: number }
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })
    return res.json({ id: user.id, name: user.name, email: user.email })
  } catch {
    return res.status(401).json({ error: 'Token inválido' })
  }
})