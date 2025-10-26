import React from 'react'
import { motion } from 'framer-motion'
import { LogOut, User, Settings, BarChart3, Users, Calendar, Bell } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export function DashboardPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/signin')
  }

  const stats = [
    { label: 'Total Users', value: '2,543', icon: Users, color: 'bg-blue-500' },
    { label: 'Revenue', value: '$12,543', icon: BarChart3, color: 'bg-green-500' },
    { label: 'Events', value: '47', icon: Calendar, color: 'bg-purple-500' },
    { label: 'Notifications', value: '12', icon: Bell, color: 'bg-orange-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600">Welcome back, {user?.user_metadata?.username || user?.email}</p>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Settings size={20} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Welcome Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Welcome to your Dashboard!</h2>
                <p className="text-blue-100">
                  You're successfully authenticated with Supabase. This is a protected route.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4">User Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Email:</span>
                <span className="font-medium text-slate-900">{user?.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Username:</span>
                <span className="font-medium text-slate-900">
                  {user?.user_metadata?.username || 'Not provided'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">User ID:</span>
                <span className="font-medium text-slate-900 font-mono text-sm">{user?.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Email Verified:</span>
                <span className={`font-medium ${user?.email_confirmed_at ? 'text-green-600' : 'text-orange-600'}`}>
                  {user?.email_confirmed_at ? 'Yes' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Account Created:</span>
                <span className="font-medium text-slate-900">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Authentication Features</h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Email/Password Authentication
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Social Logins (Google, GitHub)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Password Reset Flow
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Email Verification
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Protected Routes
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Next Steps</h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Configure Supabase environment variables
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Enable OAuth providers in Supabase
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Customize email templates
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Add role-based access control
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Implement user profile management
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
