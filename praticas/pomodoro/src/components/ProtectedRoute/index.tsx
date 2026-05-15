import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/TaskContext/AuthContext'

type ProtectedRouteProps = {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useAuthContext()

    if (!isAuthenticated) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}