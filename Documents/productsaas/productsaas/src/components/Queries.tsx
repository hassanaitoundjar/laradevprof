import React, { useState, useEffect } from 'react'
import { MessageSquare, Plus, Search, Filter, Eye, Reply, Trash2, Clock, CheckCircle, AlertTriangle, Zap, User, Mail, Calendar, Tag, MessageCircle, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { queryService, Query } from '../lib/database'

interface QueriesProps {
  onCreateQuery?: () => void
}

const Queries: React.FC<QueriesProps> = ({ onCreateQuery }) => {
  const { user } = useAuth()
  const [queries, setQueries] = useState<Query[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | Query['status']>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | Query['priority']>('all')
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null)
  const [showQueryDetails, setShowQueryDetails] = useState(false)
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    urgent: 0,
    high: 0
  })

  useEffect(() => {
    if (user) {
      fetchQueries()
      fetchStats()
    }
  }, [user])

  const fetchQueries = async () => {
    try {
      setLoading(true)
      const data = await queryService.getQueries(user!.id)
      setQueries(data)
    } catch (error) {
      console.error('Error fetching queries:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const data = await queryService.getQueryStats(user!.id)
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleUpdateStatus = async (queryId: string, status: Query['status']) => {
    try {
      await queryService.updateQueryStatus(queryId, user!.id, status)
      await fetchQueries()
      await fetchStats()
    } catch (error) {
      console.error('Error updating query status:', error)
    }
  }

  const handleReplyToQuery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedQuery || !replyMessage.trim()) return

    try {
      await queryService.replyToQuery(selectedQuery.id!, user!.id, replyMessage)
      setReplyMessage('')
      setShowReplyModal(false)
      setSelectedQuery(null)
      await fetchQueries()
      await fetchStats()
    } catch (error) {
      console.error('Error replying to query:', error)
    }
  }

  const handleDeleteQuery = async (queryId: string) => {
    if (!confirm('Are you sure you want to delete this query?')) return

    try {
      await queryService.deleteQuery(queryId, user!.id)
      await fetchQueries()
      await fetchStats()
    } catch (error) {
      console.error('Error deleting query:', error)
    }
  }

  const filteredQueries = queries.filter(query => {
    const matchesSearch = !searchTerm || 
                         query.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || query.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || query.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getPriorityIcon = (priority: Query['priority']) => {
    switch (priority) {
      case 'urgent': return <Zap className="w-4 h-4 text-red-500" />
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'low': return <Clock className="w-4 h-4 text-gray-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusIcon = (status: Query['status']) => {
    switch (status) {
      case 'open': return <MessageCircle className="w-4 h-4 text-blue-500" />
      case 'in_progress': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'closed': return <CheckCircle className="w-4 h-4 text-gray-500" />
      default: return <MessageCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: Query['status']) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-50'
      case 'in_progress': return 'text-yellow-600 bg-yellow-50'
      case 'resolved': return 'text-green-600 bg-green-50'
      case 'closed': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: Query['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Queries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open</p>
              <p className="text-2xl font-bold text-gray-900">{stats.open}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Zap className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Urgent</p>
              <p className="text-2xl font-bold text-gray-900">{stats.urgent}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">{stats.high}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Queries Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Customer Queries</h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search queries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | Query['status'])}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as 'all' | Query['priority'])}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredQueries.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQueries.map((query) => (
                  <tr key={query.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-gray-100 rounded-full">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {query.customer_name || 'Anonymous'}
                          </div>
                          <div className="text-sm text-gray-500">{query.customer_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {query.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getPriorityIcon(query.priority)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(query.priority)}`}>
                          {query.priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(query.status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(query.status)}`}>
                          {query.status.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-600 bg-gray-100">
                        {query.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {query.created_at 
                        ? new Date(query.created_at).toLocaleDateString()
                        : 'Unknown'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedQuery(query)
                            setShowQueryDetails(true)
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedQuery(query)
                            setShowReplyModal(true)
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Reply className="w-4 h-4" />
                        </button>
                        <select
                          value={query.status}
                          onChange={(e) => handleUpdateStatus(query.id!, e.target.value as Query['status'])}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="open">Open</option>
                          <option value="in_progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                        <button
                          onClick={() => handleDeleteQuery(query.id!)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No queries found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filteredQueries.length === 0 && queries.length > 0
                  ? 'Try adjusting your search or filters.'
                  : 'No customer queries yet.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Query Details Modal */}
      {showQueryDetails && selectedQuery && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Query Details</h3>
              <button
                onClick={() => setShowQueryDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer</label>
                  <p className="text-sm text-gray-900">{selectedQuery.customer_name || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500">{selectedQuery.customer_email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="text-sm text-gray-900">
                    {selectedQuery.created_at 
                      ? new Date(selectedQuery.created_at).toLocaleString()
                      : 'Unknown'
                    }
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <div className="flex items-center space-x-2 mt-1">
                    {getPriorityIcon(selectedQuery.priority)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedQuery.priority)}`}>
                      {selectedQuery.priority}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusIcon(selectedQuery.status)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedQuery.status)}`}>
                      {selectedQuery.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-600 bg-gray-100 mt-1">
                    {selectedQuery.category}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <p className="text-sm text-gray-900 mt-1">{selectedQuery.subject}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedQuery.message}</p>
                </div>
              </div>

              {selectedQuery.reply_message && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Your Reply</label>
                  <div className="mt-1 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedQuery.reply_message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Replied on {selectedQuery.replied_at 
                        ? new Date(selectedQuery.replied_at).toLocaleString()
                        : 'Unknown'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowQueryDetails(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowQueryDetails(false)
                  setShowReplyModal(true)
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedQuery && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reply to Query</h3>
              <button
                onClick={() => setShowReplyModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">{selectedQuery.subject}</p>
              <p className="text-sm text-gray-500 mt-1">From: {selectedQuery.customer_email}</p>
            </div>

            <form onSubmit={handleReplyToQuery} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Reply
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Type your reply here..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReplyModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Send Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Queries
