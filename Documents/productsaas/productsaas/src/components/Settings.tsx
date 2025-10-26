import React, { useState, useRef, useEffect } from 'react'
import { User, Mail, Lock, Eye, EyeOff, Save, CreditCard, Shield, Bell, Globe, Key, Upload, Camera, DollarSign } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { userSettingsService } from '../lib/database'

export function Settings() {
  const { user, updatePassword } = useAuth()
  const [activeSection, setActiveSection] = useState('account')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [accountData, setAccountData] = useState({
    username: user?.user_metadata?.username || '',
    email: user?.email || '',
    profilePicture: null as File | null
  })

  const [previewImage, setPreviewImage] = useState<string | null>(null)


  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [notifications, setNotifications] = useState({
    browserNotifications: true,
    emailOnSuccessfulOrder: true,
    emailOnNewQuery: true,
    emailOnQueryReply: true,
    notificationEmail: user?.email || ''
  })

  const [paymentData, setPaymentData] = useState({
    currency: 'USD',
    paypalEmail: ''
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select a valid image file' })
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size must be less than 5MB' })
        return
      }

      setAccountData(prev => ({ ...prev, profilePicture: file }))
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  // Load user settings on component mount
  useEffect(() => {
    const loadUserSettings = async () => {
      if (!user) return

      try {
        const settings = await userSettingsService.getUserSettings(user.id)
        if (settings) {
          setPaymentData({
            currency: settings.currency || 'USD',
            paypalEmail: settings.paypal_email || ''
          })
        }
      } catch (error) {
        console.error('Error loading user settings:', error)
      }
    }

    loadUserSettings()
  }, [user])

  const handleAccountSave = async () => {
    setLoading(true)
    setMessage(null)
    
    try {
      // Here you would update user profile and upload image
      if (accountData.profilePicture) {
        // Simulate image upload
        console.log('Uploading image:', accountData.profilePicture.name)
      }
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setMessage({ type: 'success', text: 'Account settings updated successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update account settings' })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    if (securityData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      await updatePassword(securityData.newPassword)
      setMessage({ type: 'success', text: 'Password updated successfully!' })
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update password' })
    } finally {
      setLoading(false)
    }
  }


  const handleNotificationsSave = async () => {
    setLoading(true)
    setMessage(null)
    
    try {
      // Here you would update notification preferences
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setMessage({ type: 'success', text: 'Notification preferences updated successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update notification preferences' })
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSave = async () => {
    setLoading(true)
    setMessage(null)
    
    try {
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Save payment settings and sync currency to all products
      await userSettingsService.updateUserSettingsAndSyncCurrency({
        user_id: user.id,
        currency: paymentData.currency,
        paypal_email: paymentData.paypalEmail
      })
      
      setMessage({ type: 'success', text: 'Settings updated and currency synced to all products!' })
    } catch (error) {
      console.error('Error saving payment settings:', error)
      setMessage({ type: 'error', text: 'Failed to update payment settings' })
    } finally {
      setLoading(false)
    }
  }



  const sections = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'payments', label: 'Payment', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <section.icon size={20} />
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Account Settings */}
          {activeSection === 'account' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
              </div>

              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-6">
                  <div 
                    className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors overflow-hidden"
                    onClick={handleImageClick}
                  >
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User size={32} className="text-gray-500" />
                    )}
                  </div>
                  <div>
                    <button 
                      onClick={handleImageClick}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                      <Camera size={16} />
                      {previewImage ? 'Change Photo' : 'Upload Photo'}
                    </button>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={accountData.username}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    placeholder="Enter your username"
                  />
                  <p className="text-sm text-gray-500 mt-1">Username cannot be changed</p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Email
                  </label>
                  <input
                    type="email"
                    value={accountData.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    placeholder="Enter your email"
                  />
                  <p className="text-sm text-gray-500 mt-1">Email address cannot be changed</p>
                </div>

                <button
                  onClick={handleAccountSave}
                  disabled={loading}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeSection === 'payments' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
              </div>

              <div className="space-y-6">
                {/* Currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={paymentData.currency}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                  </select>
                </div>

                {/* PayPal Email - Only Payment Method */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">P</span>
                    </div>
                    <label className="text-sm font-medium text-gray-700">
                      PayPal Email
                    </label>
                  </div>
                  <input
                    type="email"
                    value={paymentData.paypalEmail}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, paypalEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter PayPal email for receiving payments"
                  />
                  <p className="text-sm text-gray-500 mt-1">This email will be used to receive PayPal payments from customers</p>
                </div>

                <button
                  onClick={handlePaymentSave}
                  disabled={loading}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          )}


          {/* Security Settings */}
          {activeSection === 'security' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
              </div>

              <div className="space-y-6">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={securityData.currentPassword}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>

                <button
                  onClick={handlePasswordChange}
                  disabled={loading || !securityData.currentPassword || !securityData.newPassword}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Shield size={16} />
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
              </div>

              <div className="space-y-6">
                {/* Notification Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Notification Email Address
                  </label>
                  <input
                    type="email"
                    value={notifications.notificationEmail}
                    onChange={(e) => setNotifications(prev => ({ ...prev, notificationEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter email for notifications"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This email will receive all notification emails (can be different from your account email)
                  </p>
                </div>

                {/* Browser Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Browser Notifications
                    </h3>
                    <p className="text-sm text-gray-500">
                      Receive browser notifications for important events
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.browserNotifications}
                      onChange={(e) => setNotifications(prev => ({ ...prev, browserNotifications: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {/* Email on Successful Order */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Receive an email on a successful order
                    </h3>
                    <p className="text-sm text-gray-500">
                      Get notified via email when an order is completed successfully
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailOnSuccessfulOrder}
                      onChange={(e) => setNotifications(prev => ({ ...prev, emailOnSuccessfulOrder: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {/* Email on New Query */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Receive an email on a new query
                    </h3>
                    <p className="text-sm text-gray-500">
                      Get notified via email when a customer submits a new query
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailOnNewQuery}
                      onChange={(e) => setNotifications(prev => ({ ...prev, emailOnNewQuery: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {/* Email on Query Reply */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Receive an email on a query reply
                    </h3>
                    <p className="text-sm text-gray-500">
                      Get notified via email when you reply to a customer query
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailOnQueryReply}
                      onChange={(e) => setNotifications(prev => ({ ...prev, emailOnQueryReply: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <button
                  onClick={handleNotificationsSave}
                  disabled={loading}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
