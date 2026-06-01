import { Router, Response } from 'express'
import { prisma } from '../lib/prisma'
import { authMiddleware, AuthRequest } from '../middlewares/auth.middleware'

export const tasksRouter = Router()
tasksRouter.use(authMiddleware)

tasksRouter.get('/', async (req: AuthRequest, res: Response) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.userId! },
    orderBy: { startDate: 'desc' }
  })
  return res.json(tasks)
})

tasksRouter.post('/', async (req: AuthRequest, res: Response) => {
  const { id, name, duration, type, startDate, completeDate, interruptDate } = req.body
  const task = await prisma.task.create({
    data: { id, name, duration, type, startDate, completeDate, interruptDate, userId: req.userId! }
  })
  return res.json(task)
})

tasksRouter.patch('/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params['id'] as string

  const existing = await prisma.task.findFirst({ where: { id, userId: req.userId! } })
  if (!existing) return res.status(404).json({ error: 'Tarefa não encontrada' })

  const task = await prisma.task.update({
    where: { id },
    data: req.body
  })
  return res.json(task)
})

tasksRouter.delete('/:id', async (req: AuthRequest, res: Response) => {
  const id = req.params['id'] as string

  const existing = await prisma.task.findFirst({ where: { id, userId: req.userId! } })
  if (!existing) return res.status(404).json({ error: 'Tarefa não encontrada' })

  await prisma.task.delete({ where: { id } })
  return res.status(204).send()
})