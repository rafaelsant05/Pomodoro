import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from '../../pages/login'
import { Register } from '../../pages/Register'
import { ForgotPassword } from '../../pages/ForgotPassword'
import { ResetPassword } from '../../pages/ResetPassword'
import { Home } from '../../pages/Home'
import { History } from '../../pages/History'
import { Settings } from '../../pages/Settings'
import { ProtectedRoute } from '../../components/ProtectedRoute'
import { PublicOnlyRoute } from '../../components/PublicOnlyRoute'

export function MainRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
        <Route path="/reset-password" element={<PublicOnlyRoute><ResetPassword /></PublicOnlyRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
