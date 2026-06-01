import { createContext, type Dispatch } from 'react'
import type { TaskStateModel } from '../../models/TaskStateModel'
import type { TaskActionModel } from './taskActions'

interface TaskContextProps {
  state: TaskStateModel
  dispatch: Dispatch<TaskActionModel>
}

export const TaskContext = createContext({} as TaskContextProps)