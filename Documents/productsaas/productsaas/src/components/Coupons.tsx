import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar, 
  Percent, 
  DollarSign,
  Users,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { couponService, Coupon } from '../lib/database'

export function Coupons() {
  const { user } = useAuth()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '',
    min_order_amount: '',
    max_uses: '',
    expires_at: '',
    is_active: true
  })

  useEffect(() => {
    loadCoupons()
  }, [user])

  const loadCoupons = async () => {
    if (!user) return
    
    try {
      const data = await couponService.getUserCoupons(user.id)
      setCoupons(data)
    } catch (error) {
      console.error('Error loading coupons:', error)
      setMessage({ type: 'error', text: 'Failed to load coupons' })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      code: '',
      discount_type: 'percentage',
      discount_value: '',
      min_order_amount: '',
      max_uses: '',
      expires_at: '',
      is_active: true
    })
    setEditingCoupon(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const couponData = {
        user_id: user.id,
        code: formData.code.toUpperCase(),
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : 0,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        expires_at: formData.expires_at || null,
        is_active: formData.is_active
      }

      if (editingCoupon) {
        await couponService.updateCoupon(editingCoupon.id!, couponData)
        setMessage({ type: 'success', text: 'Coupon updated successfully!' })
      } else {
        await couponService.createCoupon(couponData)
        setMessage({ type: 'success', text: 'Coupon created successfully!' })
      }

      await loadCoupons()
      setShowCreateModal(false)
      resetForm()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save coupon' })
    }
  }

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value.toString(),
      min_order_amount: coupon.min_order_amount?.toString() || '',
      max_uses: coupon.max_uses?.toString() || '',
      expires_at: coupon.expires_at ? coupon.expires_at.split('T')[0] : '',
      is_active: coupon.is_active || true
    })
    setShowCreateModal(true)
  }

  const handleDelete = async (couponId: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return

    try {
      await couponService.deleteCoupon(couponId)
      await loadCoupons()
      setMessage({ type: 'success', text: 'Coupon deleted successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete coupon' })
    }
  }

  const handleToggleStatus = async (couponId: string) => {
    try {
      await couponService.toggleCouponStatus(couponId)
      await loadCoupons()
      setMessage({ type: 'success', text: 'Coupon status updated!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update coupon status' })
    }
  }

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discount_type === 'percentage') {
      return `${coupon.discount_value}%`
    } else {
      return `$${coupon.discount_value}`
    }
  }

  const isExpired = (expiresAt: string | null | undefined) => {
    if (!expiresAt) return false
    return new Date(expiresAt) < new Date()
  }

  const getStatusColor = (coupon: Coupon) => {
    if (!coupon.is_active) return 'bg-gray-100 text-gray-800'
    if (isExpired(coupon.expires_at)) return 'bg-red-100 text-red-800'
    if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) return 'bg-orange-100 text-orange-800'
    return 'bg-green-100 text-green-800'
  }

  const getStatusText = (coupon: Coupon) => {
    if (!coupon.is_active) return 'Inactive'
    if (isExpired(coupon.expires_at)) return 'Expired'
    if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) return 'Used Up'
    return 'Active'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-600">Create and manage discount coupons for your products</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowCreateModal(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Create Coupon
        </button>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Coupons Grid */}
      {coupons.length === 0 ? (
        <div className="text-center py-12">
          <Percent className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons yet</h3>
          <p className="text-gray-600 mb-4">Create your first coupon to start offering discounts</p>
          <button
            onClick={() => {
              resetForm()
              setShowCreateModal(true)
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Coupon
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Coupon Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Percent className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{coupon.code}</h3>
                      <button
                        onClick={() => copyToClipboard(coupon.code)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {copiedCode === coupon.code ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(coupon)}`}>
                      {getStatusText(coupon)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(coupon)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(coupon.id!)}
                    className="p-1 text-gray-400 hover:text-yellow-600"
                  >
                    {coupon.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={() => handleDelete(coupon.id!)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Discount Info */}
              <div className="mb-4">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {formatDiscount(coupon)} OFF
                </div>
                {coupon.min_order_amount > 0 && (
                  <p className="text-sm text-gray-600">
                    Min. order: ${coupon.min_order_amount}
                  </p>
                )}
              </div>

              {/* Usage Stats */}
              <div className="space-y-2 mb-4">
                {coupon.max_uses && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Usage:</span>
                    <span className="font-medium">
                      {coupon.current_uses || 0} / {coupon.max_uses}
                    </span>
                  </div>
                )}
                {coupon.expires_at && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Expires:</span>
                    <span className={`font-medium ${isExpired(coupon.expires_at) ? 'text-red-600' : ''}`}>
                      {new Date(coupon.expires_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Progress Bar for Usage */}
              {coupon.max_uses && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(((coupon.current_uses || 0) / coupon.max_uses) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Coupon Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., SAVE20"
                  required
                />
              </div>

              {/* Discount Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Type *
                </label>
                <select
                  value={formData.discount_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount_type: e.target.value as 'percentage' | 'fixed' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Value *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={formData.discount_type === 'percentage' ? '100' : undefined}
                    value={formData.discount_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount_value: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={formData.discount_type === 'percentage' ? '20' : '10.00'}
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {formData.discount_type === 'percentage' ? '%' : '$'}
                  </div>
                </div>
              </div>

              {/* Minimum Order Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Order Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.min_order_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, min_order_amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Max Uses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Uses
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.max_uses}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_uses: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Unlimited"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                  Active (coupon can be used)
                </label>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingCoupon ? 'Update' : 'Create'} Coupon
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Coupons
