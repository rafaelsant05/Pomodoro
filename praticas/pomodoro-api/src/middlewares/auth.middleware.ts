import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userId?: number
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token nao fornecido' })
  }

  const parts = authHeader.split(' ')
  const token = parts[1]
  const secret = process.env.JWT_SECRET

  if (!token || !secret) {
    return res.status(401).json({ error: 'Token invalido' })
  }

  try {
    const payload = jwt.verify(token, secret) as unknown as { userId: number }
    req.userId = payload.userId
    next()
  } catch {
    return res.status(401).json({ error: 'Token invalido ou expirado' })
  }
}