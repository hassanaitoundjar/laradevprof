import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function DashboardRedirect() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/signin" replace />
  }

  const userRole = user.user_metadata?.role

  // Redirect based on user role
  if (userRole === 'seller') {
    return <Navigate to="/seller-dashboard" replace />
  } else if (userRole === 'admin') {
    return <Navigate to="/admin-dashboard" replace />
  } else {
    // Default fallback - redirect to signin if no valid role
    return <Navigate to="/signin" replace />
  }
}
