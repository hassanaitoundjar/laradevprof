import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Shield,
  UserCheck,
  UserX,
  AlertTriangle,
  Settings,
  BarChart3,
  Activity,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function AdminDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    { 
      label: 'Total Users', 
      value: '2,543', 
      change: '+12.5%', 
      icon: Users, 
      color: 'bg-blue-500',
      trend: 'up'
    },
    { 
      label: 'Platform Revenue', 
      value: '$45,231.00', 
      change: '+18.2%', 
      icon: DollarSign, 
      color: 'bg-green-500',
      trend: 'up'
    },
    { 
      label: 'Active Sellers', 
      value: '156', 
      change: '+5.1%', 
      icon: UserCheck, 
      color: 'bg-purple-500',
      trend: 'up'
    },
    { 
      label: 'Pending Reviews', 
      value: '23', 
      change: '-2', 
      icon: AlertTriangle, 
      color: 'bg-orange-500',
      trend: 'down'
    },
  ]

  const recentUsers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@email.com',
      role: 'seller',
      status: 'active',
      joinDate: '2024-01-15',
      revenue: '$1,234.56'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      role: 'seller',
      status: 'pending',
      joinDate: '2024-01-14',
      revenue: '$0.00'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.wilson@email.com',
      role: 'seller',
      status: 'active',
      joinDate: '2024-01-13',
      revenue: '$2,456.78'
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      role: 'admin',
      status: 'active',
      joinDate: '2024-01-12',
      revenue: 'N/A'
    }
  ]

  const platformMetrics = [
    { label: 'Total Products', value: '1,247', change: '+23 this week' },
    { label: 'Total Orders', value: '5,432', change: '+156 today' },
    { label: 'Commission Earned', value: '$4,523.10', change: '+$234 today' },
    { label: 'Dispute Rate', value: '0.8%', change: '-0.2% this month' }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'sellers', label: 'Sellers' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' }
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-600">Platform management and analytics</p>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition-all"
              >
                <Shield size={20} />
                Security
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition-all"
              >
                <Settings size={20} />
                Settings
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                      <p className={`text-sm mt-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Platform Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Platform Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {platformMetrics.map((metric, index) => (
                  <div key={metric.label} className="text-center">
                    <p className="text-2xl font-bold text-slate-900">{metric.value}</p>
                    <p className="text-sm font-medium text-slate-600">{metric.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{metric.change}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Platform Revenue</h3>
                  <select className="text-sm border border-slate-300 rounded-lg px-3 py-1">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                  </select>
                </div>
                <div className="h-64 bg-gradient-to-t from-green-50 to-transparent rounded-lg flex items-end justify-center">
                  <p className="text-slate-500">Revenue analytics visualization</p>
                </div>
              </motion.div>

              {/* User Growth */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-4">User Growth</h3>
                <div className="h-64 bg-gradient-to-t from-blue-50 to-transparent rounded-lg flex items-end justify-center">
                  <p className="text-slate-500">User growth analytics</p>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Users Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">User Management</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                  <Filter className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Users Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Join Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-slate-600">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-slate-900">{user.name}</div>
                              <div className="text-sm text-slate-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                          {user.revenue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 hover:bg-slate-100 rounded">
                              <Eye className="w-4 h-4 text-slate-400" />
                            </button>
                            <button className="p-1 hover:bg-slate-100 rounded">
                              <Edit className="w-4 h-4 text-slate-400" />
                            </button>
                            <button className="p-1 hover:bg-slate-100 rounded">
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
