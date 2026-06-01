import { useReducer, useEffect, type ReactNode } from 'react'
import { TaskContext } from './TaskContext'
import { taskReducer } from './taskReducer'
import { initialTaskState } from './initialTaskState'
import { TaskActionTypes } from './taskActions'

const getSavedState = () => {
    try {
        const saved = localStorage.getItem('chronos-tasks')
        if (!saved) return initialTaskState
        const parsed = JSON.parse(saved)
        return { ...initialTaskState, tasks: parsed.tasks ?? [] }
    } catch {
        return initialTaskState
    }
}

export function TaskContextProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(taskReducer, getSavedState())

    useEffect(() => {
        localStorage.setItem('chronos-tasks', JSON.stringify({ tasks: state.tasks }))
    }, [state.tasks])

    useEffect(() => {
        if (!state.activeTask) return

        const interval = setInterval(() => {
            const nextSeconds = state.secondsRemaining - 1

            if (nextSeconds <= 0) {
                dispatch({ type: TaskActionTypes.COMPLETE_TASK })
                clearInterval(interval)
                return
            }

            dispatch({
                type: TaskActionTypes.COUNT_DOWN,
                payload: { secondsRemaining: nextSeconds },
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [state.activeTask, state.secondsRemaining])

    return (
        <TaskContext.Provider value={{ state, dispatch }}>
            {children}
        </TaskContext.Provider>
    )
}