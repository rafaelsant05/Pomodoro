import { Router, Response } from 'express'
import { prisma } from '../lib/prisma'
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware'

export const settingsRouter = Router()
settingsRouter.use(authMiddleware)

settingsRouter.get('/', async (req: AuthRequest, res: Response) => {
  let settings = await prisma.settings.findUnique({ where: { userId: req.userId! } })
  if (!settings) {
    settings = await prisma.settings.create({
      data: { workTime: 25, shortBreakTime: 5, longBreakTime: 15, userId: req.userId! }
    })
  }
  return res.json(settings)
})

settingsRouter.put('/', async (req: AuthRequest, res: Response) => {
  const { workTime, shortBreakTime, longBreakTime } = req.body
  const settings = await prisma.settings.upsert({
    where: { userId: req.userId! },
    update: { workTime, shortBreakTime, longBreakTime },
    create: { workTime, shortBreakTime, longBreakTime, userId: req.userId! }
  })
  return res.json(settings)
})
