import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { productService, userSettingsService, Product as DatabaseProduct } from '../../lib/database'

interface CreateProductProps {
  onBack: () => void
  editProduct?: DatabaseProduct | null
}

export function CreateProduct({ onBack, editProduct }: CreateProductProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    currency: 'USD', // Will be updated with user's default currency
    description: '',
    type: 'Service',
    paymentGateways: {
      bitcoin: false,
      ethereum: false,
      litecoin: false,
      paypal: false,
      stripe: false
    }
  })

  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const [customFields, setCustomFields] = useState([
    { id: 1, name: '', type: 'text', required: false, options: [] }
  ])

  // Handle image uploads
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files')
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    // Add to existing images (max 5 images)
    const newImages = [...images, ...validFiles].slice(0, 5)
    setImages(newImages)

    // Create previews
    const newPreviews = [...imagePreviews]
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const preview = e.target?.result as string
        setImagePreviews(prev => [...prev, preview].slice(0, 5))
      }
      reader.readAsDataURL(file)
    })

    // Clear input
    if (event.target) {
      event.target.value = ''
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const triggerImageUpload = () => {
    fileInputRef.current?.click()
  }

  // Initialize form with edit data or user settings
  useEffect(() => {
    const initializeForm = async () => {
      if (editProduct) {
        setFormData({
          title: editProduct.title,
          price: editProduct.price.toString(),
          currency: editProduct.currency,
          description: editProduct.description || '',
          type: editProduct.type,
          paymentGateways: {
            bitcoin: editProduct.payment_gateways.includes('bitcoin'),
            ethereum: editProduct.payment_gateways.includes('ethereum'),
            litecoin: editProduct.payment_gateways.includes('litecoin'),
            paypal: editProduct.payment_gateways.includes('paypal'),
            stripe: editProduct.payment_gateways.includes('stripe')
          }
        })
        
        if (editProduct.custom_fields && editProduct.custom_fields.length > 0) {
          // Ensure custom fields have proper id structure and options array
          const fieldsWithIds = editProduct.custom_fields.map((field, index) => ({
            ...field,
            id: field.id || index + 1,
            options: field.options || []
          }))
          setCustomFields(fieldsWithIds)
        }

        // Load existing images
        if (editProduct.images && editProduct.images.length > 0) {
          setImagePreviews(editProduct.images)
          // Convert base64 strings back to File objects for editing
          const convertBase64ToFiles = async () => {
            const filePromises = editProduct.images.map(async (base64, index) => {
              const response = await fetch(base64)
              const blob = await response.blob()
              return new File([blob], `image-${index}.jpg`, { type: blob.type })
            })
            const files = await Promise.all(filePromises)
            setImages(files)
          }
          convertBase64ToFiles()
        }
      } else if (user) {
        // For new products, load user's default currency setting
        try {
          const userSettings = await userSettingsService.getUserSettings(user.id)
          if (userSettings?.currency) {
            setFormData(prev => ({
              ...prev,
              currency: userSettings.currency
            }))
          }
        } catch (error) {
          console.error('Error loading user settings:', error)
          // Keep default USD if settings can't be loaded
        }
      }
    }

    initializeForm()
  }, [editProduct, user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckboxChange = (gateway: string) => {
    setFormData(prev => ({
      ...prev,
      paymentGateways: {
        ...prev.paymentGateways,
        [gateway]: !prev.paymentGateways[gateway as keyof typeof prev.paymentGateways]
      }
    }))
  }

  const addCustomField = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent form submission
    const newId = customFields.length > 0 ? Math.max(...customFields.map(f => f.id)) + 1 : 1
    setCustomFields(prev => [...prev, { id: newId, name: '', type: 'text', required: false, options: [] }])
  }

  const removeCustomField = (id: number) => {
    setCustomFields(prev => prev.filter(field => field.id !== id))
  }

  const updateCustomField = (id: number, field: string, value: string | boolean | string[]) => {
    setCustomFields(prev => prev.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError('You must be logged in to create a product')
      return
    }

    if (!formData.title || !formData.price) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Get enabled payment gateways
      const enabledGateways = Object.entries(formData.paymentGateways)
        .filter(([_, enabled]) => enabled)
        .map(([gateway, _]) => gateway)

      // Filter out empty custom fields
      const validCustomFields = customFields.filter(field => field.name.trim() !== '')

      // Convert images to base64 for storage
      const imageUrls: string[] = []
      for (const image of images) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.readAsDataURL(image)
        })
        imageUrls.push(base64)
      }

      const productData = {
        user_id: user.id,
        title: formData.title,
        price: parseFloat(formData.price),
        currency: formData.currency,
        description: formData.description,
        type: formData.type,
        payment_gateways: enabledGateways,
        custom_fields: validCustomFields,
        images: imageUrls,
        status: 'active' as const
      }

      if (editProduct) {
        // Update existing product
        await productService.updateProduct(editProduct.id!, productData)
      } else {
        // Create new product
        await productService.createProduct(productData)
      }
      
      // Success - go back to products list
      onBack()
    } catch (err) {
      console.error('Error creating product:', err)
      setError('Failed to create product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDiscard = () => {
    if (window.confirm('Are you sure you want to discard this product? All changes will be lost.')) {
      onBack()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {editProduct ? 'Edit Product' : 'Unsaved Product'}
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleDiscard}
            disabled={loading}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Discard
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
{loading ? 'Saving...' : (editProduct ? 'Update Product' : 'Save Product')}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Details */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Product title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <div className="flex">
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <div className="border border-gray-300 rounded-lg">
                  <div className="flex items-center space-x-2 p-2 border-b border-gray-200 bg-gray-50">
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <strong>B</strong>
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded italic">
                      I
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded underline">
                      U
                    </button>
                  </div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full px-3 py-2 border-0 focus:ring-0 resize-none"
                    placeholder="Product Description"
                  />
                  <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-200">
                    Max: 1 - 999 of 0
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
            
            <div className="space-y-4">
              {/* Upload Button */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Add up to 5 images for your product</p>
                <button
                  type="button"
                  onClick={triggerImageUpload}
                  disabled={images.length >= 5}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload size={16} />
                  <span>Upload Images</span>
                </button>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Add More Button */}
                  {images.length < 5 && (
                    <button
                      type="button"
                      onClick={triggerImageUpload}
                      className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors"
                    >
                      <ImageIcon size={20} />
                      <span className="text-xs mt-1">Add More</span>
                    </button>
                  )}
                </div>
              )}

              {/* Empty State */}
              {imagePreviews.length === 0 && (
                <div 
                  onClick={triggerImageUpload}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors"
                >
                  <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload product images</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 5MB each (Max 5 images)</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Gateways */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Gateways</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(formData.paymentGateways).map(([gateway, enabled]) => (
                <label key={gateway} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => handleCheckboxChange(gateway)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{gateway}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Product Stock */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Stock</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="Service">Service</option>
                <option value="Digital">Digital</option>
                <option value="Physical">Physical</option>
              </select>
            </div>
          </div>

          {/* Custom Fields */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Custom Fields</h2>
              <span className="text-sm text-gray-500">Optional</span>
            </div>
            
            <div className="space-y-4">
              {customFields.map((field) => (
                <div key={field.id} className="space-y-3 p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Field name
                      </label>
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => updateCustomField(field.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Field name"
                      />
                    </div>
                    
                    <div className="col-span-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Field type
                      </label>
                      <select
                        value={field.type}
                        onChange={(e) => updateCustomField(field.id, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                        <option value="number">Number</option>
                        <option value="tel">Phone</option>
                        <option value="textarea">Textarea</option>
                        <option value="select">Select</option>
                        <option value="checkbox">Checkbox</option>
                      </select>
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Required
                      </label>
                      <div className="flex items-center justify-center h-10">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateCustomField(field.id, 'required', e.target.checked)}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <button
                        type="button"
                        onClick={() => removeCustomField(field.id)}
                        className="w-full h-10 flex items-center justify-center text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={customFields.length === 1}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Options input for select fields */}
                  {field.type === 'select' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Options (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={field.options?.join(', ') || ''}
                        onChange={(e) => {
                          const options = e.target.value.split(',').map(opt => opt.trim()).filter(opt => opt !== '')
                          updateCustomField(field.id, 'options', options)
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Option 1, Option 2, Option 3"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter options separated by commas
                      </p>
                    </div>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addCustomField}
                className="w-full px-4 py-2 text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Add field
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Status</h3>
              <span className="text-sm text-gray-500">Unlisted</span>
            </div>
            
            <div className="space-y-3">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                Save as draft
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                Preview
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreateProduct
