import React, { useState, useEffect } from 'react'
import { 
  Plus,
  Search,
  Filter,
  Edit,
  Share,
  Trash2,
  MoreHorizontal,
  Power,
  PowerOff
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { productService, Product as DatabaseProduct } from '../../lib/database'

interface ProductsListProps {
  onAddProduct: () => void
  onEditProduct?: (product: DatabaseProduct) => void
}

export function ProductsList({ onAddProduct, onEditProduct }: ProductsListProps) {
  const { user } = useAuth()
  const [products, setProducts] = useState<DatabaseProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return

      try {
        setLoading(true)
        const userProducts = await productService.getProducts(user.id)
        setProducts(userProducts)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [user])

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    try {
      setError(null)
      await productService.deleteProduct(productId)
      setProducts(prev => prev.filter(p => p.id !== productId))
    } catch (err) {
      console.error('Error deleting product:', err)
      setError('Failed to delete product')
    }
  }

  const handleToggleStatus = async (product: DatabaseProduct) => {
    try {
      setError(null)
      const updatedProduct = await productService.toggleProductStatus(
        product.id!,
        product.status
      )
      setProducts(prev => 
        prev.map(p => p.id === product.id ? updatedProduct : p)
      )
    } catch (err) {
      console.error('Error toggling product status:', err)
      setError('Failed to update product status')
    }
  }

  const handleEditProduct = (product: DatabaseProduct) => {
    if (onEditProduct) {
      onEditProduct(product)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <button 
            onClick={onAddProduct}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center text-gray-500">Loading products...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <button 
            onClick={onAddProduct}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button 
          onClick={onAddProduct}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  INFO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PRICE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TYPE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  OPTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No products found. Create your first product to get started!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.title}</div>
                      <div className="text-sm text-gray-500">{product.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${product.price} {product.currency}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(product)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        product.status === 'active' 
                          ? 'bg-green-600' 
                          : 'bg-gray-200'
                      }`}
                      title={`${product.status === 'active' ? 'Deactivate' : 'Activate'} product`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          product.status === 'active' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                        title="Share product"
                      >
                        <Share className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id!)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ProductsList
