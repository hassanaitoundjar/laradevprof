import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'

interface RoleBasedRouteProps {
  children: React.ReactNode
  allowedRoles: string[]
  fallback?: string
}

export function RoleBasedRoute({ children, allowedRoles, fallback = '/signin' }: RoleBasedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to={fallback} state={{ from: location }} replace />
  }

  const userRole = user.user_metadata?.role
  if (!userRole || !allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl p-8 shadow-lg border border-slate-200 text-center max-w-md"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚫</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600 mb-4">
            You don't have permission to access this page. Required role: {allowedRoles.join(' or ')}.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}
