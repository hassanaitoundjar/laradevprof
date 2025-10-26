import { supabase } from './supabase'

export interface Product {
  id?: string
  user_id: string
  title: string
  price: number
  currency: string
  description: string
  type: string
  payment_gateways: string[]
  custom_fields: CustomField[]
  images?: string[]
  status: 'draft' | 'active' | 'inactive'
  created_at?: string
  updated_at?: string
}

export interface CustomField {
  id: number
  name: string
  type: string
  required: boolean
  options?: string[] // For select fields
}

export interface UserSettings {
  id?: string
  user_id: string
  currency: string
  paypal_email?: string
  created_at?: string
  updated_at?: string
}

export interface Coupon {
  id?: string
  user_id: string
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_order_amount?: number
  max_uses?: number
  current_uses?: number
  expires_at?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}


export const productService = {
  // Create a new product
  async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Get all products for a user
  async getProducts(userId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get all products (for public store view)
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get products by username for store view
  async getProductsByUsername(username: string) {
    // Simple approach: get all active products for now
    // In production, you'd filter by the actual user who owns the store
    const { data: allProducts, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products by username:', error)
      return []
    }

    // For now, return all active products
    // TODO: Implement proper user-product filtering when user system is fully set up
    return allProducts || []
  },

  // Update a product
  async updateProduct(productId: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single()

    if (error) {
      console.error('Error updating product:', error)
      throw error
    }

    return data
  },

  // Toggle product status
  async toggleProductStatus(productId: string, currentStatus: 'active' | 'draft' | 'inactive') {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'

    const { data, error } = await supabase
      .from('products')
      .update({ status: newStatus })
      .eq('id', productId)
      .select()
      .single()

    if (error) {
      console.error('Error toggling product status:', error)
      throw error
    }

    return data
  },

  // Update currency for all user products
  async updateUserProductsCurrency(userId: string, newCurrency: string) {
    const { data, error } = await supabase
      .from('products')
      .update({ currency: newCurrency })
      .eq('user_id', userId)
      .select()

    if (error) throw error
    return data
  },

  // Delete a product
  async deleteProduct(productId: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (error) {
      console.error('Error deleting product:', error)
      throw error
    }

    return true
  }
}

// Order types
export interface Order {
  id?: string
  seller_id: string
  customer_email: string
  customer_name?: string
  product_id?: string
  product_title: string
  quantity: number
  unit_price: number
  total_amount: number
  currency: string
  payment_method?: string
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  customer_notes?: string
  seller_notes?: string
  custom_field_data?: Record<string, string>
  created_at?: string
  updated_at?: string
}

export const orderService = {
  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single()

    if (error) throw error

    // Auto-create or update customer from order data
    if (data) {
      await this.createOrUpdateCustomerFromOrder(data)
    }

    return data
  },

  async createOrUpdateCustomerFromOrder(order: Order) {
    try {
      // Check if customer already exists
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('*')
        .eq('seller_id', order.seller_id)
        .eq('email', order.customer_email)
        .single()

      if (existingCustomer) {
        // Update existing customer stats
        const updatedStats = {
          total_orders: existingCustomer.total_orders + 1,
          total_spent: existingCustomer.total_spent + order.total_amount,
          last_order_date: order.created_at || new Date().toISOString(),
          name: order.customer_name || existingCustomer.name
        }

        await supabase
          .from('customers')
          .update(updatedStats)
          .eq('id', existingCustomer.id)
      } else {
        // Create new customer
        const newCustomer = {
          seller_id: order.seller_id,
          email: order.customer_email,
          name: order.customer_name,
          total_orders: 1,
          total_spent: order.total_amount,
          last_order_date: order.created_at || new Date().toISOString(),
          status: 'active' as const
        }

        await supabase
          .from('customers')
          .insert([newCustomer])
      }
    } catch (error) {
      console.error('Error creating/updating customer from order:', error)
    }
  },

  // Get order by ID
  async getById(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (error) throw error
    return data
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: Order['order_status']) {
    const { data, error } = await supabase
      .from('orders')
      .update({ order_status: status })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update payment status
  async updatePaymentStatus(orderId: string, status: Order['payment_status']) {
    const { data, error } = await supabase
      .from('orders')
      .update({ payment_status: status })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getOrders(sellerId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async updateOrder(id: string, updates: Partial<Order>) {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteOrder(id: string) {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getOrdersByStatus(sellerId: string, status: Order['order_status']) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('seller_id', sellerId)
      .eq('order_status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getOrderStats(sellerId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('order_status, payment_status, total_amount')
      .eq('seller_id', sellerId)

    if (error) throw error

    const stats = {
      total: data?.length || 0,
      pending: data?.filter(o => o.order_status === 'pending').length || 0,
      processing: data?.filter(o => o.order_status === 'processing').length || 0,
      shipped: data?.filter(o => o.order_status === 'shipped').length || 0,
      delivered: data?.filter(o => o.order_status === 'delivered').length || 0,
      cancelled: data?.filter(o => o.order_status === 'cancelled').length || 0,
      totalRevenue: data?.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + o.total_amount, 0) || 0,
      pendingPayments: data?.filter(o => o.payment_status === 'pending').length || 0
    }

    return stats
  }
}

// Customer types
export interface Customer {
  id?: string
  seller_id: string
  email: string
  name?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  postal_code?: string
  total_orders: number
  total_spent: number
  last_order_date?: string
  notes?: string
  status: 'active' | 'inactive' | 'blocked'
  created_at?: string
  updated_at?: string
}

export interface Query {
  id?: string
  seller_id: string
  customer_email: string
  customer_name?: string
  subject: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  category: 'general' | 'technical' | 'billing' | 'product' | 'refund' | 'complaint'
  reply_message?: string
  replied_at?: string
  created_at?: string
  updated_at?: string
}

export const customerService = {
  async createCustomer(customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('customers')
      .insert([customerData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getCustomers(sellerId: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async updateCustomer(id: string, updates: Partial<Customer>) {
    const { data, error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteCustomer(id: string) {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getCustomersByStatus(sellerId: string, status: Customer['status']) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('seller_id', sellerId)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getCustomerStats(sellerId: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('status, total_orders, total_spent')
      .eq('seller_id', sellerId)

    if (error) throw error

    const stats = {
      total: data?.length || 0,
      active: data?.filter(c => c.status === 'active').length || 0,
      inactive: data?.filter(c => c.status === 'inactive').length || 0,
      blocked: data?.filter(c => c.status === 'blocked').length || 0,
      totalRevenue: data?.reduce((sum, c) => sum + c.total_spent, 0) || 0,
      totalOrders: data?.reduce((sum, c) => sum + c.total_orders, 0) || 0,
      averageOrderValue: data?.length ? (data.reduce((sum, c) => sum + c.total_spent, 0) / data.reduce((sum, c) => sum + c.total_orders, 0)) || 0 : 0
    }

    return stats
  },

  async searchCustomers(sellerId: string, searchTerm: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('seller_id', sellerId)
      .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async syncCustomersFromOrders(sellerId: string) {
    try {
      // Get all orders for this seller
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: true })

      if (error) throw error

      // Process each order to create/update customers
      for (const order of orders || []) {
        await orderService.createOrUpdateCustomerFromOrder(order)
      }

      return { success: true }
    } catch (error) {
      console.error('Error syncing customers from orders:', error)
      throw error
    }
  }
}

export const queryService = {
  async createQuery(queryData: Omit<Query, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('queries')
      .insert([queryData])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getQueries(sellerId: string) {
    const { data, error } = await supabase
      .from('queries')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getQuery(queryId: string, sellerId: string) {
    const { data, error } = await supabase
      .from('queries')
      .select('*')
      .eq('id', queryId)
      .eq('seller_id', sellerId)
      .single()

    if (error) throw error
    return data
  },

  async updateQueryStatus(queryId: string, sellerId: string, status: Query['status']) {
    const { data, error } = await supabase
      .from('queries')
      .update({ status })
      .eq('id', queryId)
      .eq('seller_id', sellerId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async replyToQuery(queryId: string, sellerId: string, replyMessage: string) {
    const { data, error } = await supabase
      .from('queries')
      .update({
        reply_message: replyMessage,
        replied_at: new Date().toISOString(),
        status: 'resolved'
      })
      .eq('id', queryId)
      .eq('seller_id', sellerId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteQuery(queryId: string, sellerId: string) {
    const { error } = await supabase
      .from('queries')
      .delete()
      .eq('id', queryId)
      .eq('seller_id', sellerId)

    if (error) throw error
  },

  async getQueryStats(sellerId: string) {
    const { data, error } = await supabase
      .from('queries')
      .select('status, priority')
      .eq('seller_id', sellerId)

    if (error) throw error

    const queries = data || []
    return {
      total: queries.length,
      open: queries.filter(q => q.status === 'open').length,
      inProgress: queries.filter(q => q.status === 'in_progress').length,
      resolved: queries.filter(q => q.status === 'resolved').length,
      urgent: queries.filter(q => q.priority === 'urgent').length,
      high: queries.filter(q => q.priority === 'high').length
    }
  },

  async getQueriesByStatus(sellerId: string, status: Query['status']) {
    const { data, error } = await supabase
      .from('queries')
      .select('*')
      .eq('seller_id', sellerId)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getQueriesByPriority(sellerId: string, priority: Query['priority']) {
    const { data, error } = await supabase
      .from('queries')
      .select('*')
      .eq('seller_id', sellerId)
      .eq('priority', priority)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async searchQueries(sellerId: string, searchTerm: string) {
    const { data, error } = await supabase
      .from('queries')
      .select('*')
      .eq('seller_id', sellerId)
      .or(`subject.ilike.%${searchTerm}%,customer_name.ilike.%${searchTerm}%,customer_email.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }
}

export const userSettingsService = {
  // Get user settings
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      // If no settings found, return default settings
      if (error.code === 'PGRST116') {
        return {
          user_id: userId,
          currency: 'USD'
        }
      }
      console.error('Error fetching user settings:', error)
      return null
    }
    return data
  },

  // Create or update user settings
  async upsertUserSettings(settings: Omit<UserSettings, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert([settings], { onConflict: 'user_id' })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update user settings and sync currency to all products
  async updateUserSettingsAndSyncCurrency(settings: Omit<UserSettings, 'id' | 'created_at' | 'updated_at'>) {
    // First update user settings
    const settingsData = await this.upsertUserSettings(settings)
    
    // Then update all user's products with the new currency
    if (settings.currency) {
      await productService.updateUserProductsCurrency(settings.user_id, settings.currency)
    }
    
    return settingsData
  }
}

export const couponService = {
  // Get all coupons for a user
  async getUserCoupons(userId: string): Promise<Coupon[]> {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Create a new coupon
  async createCoupon(couponData: Omit<Coupon, 'id' | 'created_at' | 'updated_at' | 'current_uses'>) {
    const { data, error } = await supabase
      .from('coupons')
      .insert([{ ...couponData, current_uses: 0 }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update a coupon
  async updateCoupon(couponId: string, updates: Partial<Coupon>) {
    const { data, error } = await supabase
      .from('coupons')
      .update(updates)
      .eq('id', couponId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete a coupon
  async deleteCoupon(couponId: string) {
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', couponId)

    if (error) throw error
  },

  // Validate and apply coupon
  async validateCoupon(userId: string, code: string, orderAmount: number) {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('user_id', userId)
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()

    if (error || !data) {
      throw new Error('Invalid coupon code')
    }

    const coupon = data as Coupon

    // Check if coupon is expired
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      throw new Error('Coupon has expired')
    }

    // Check minimum order amount
    if (coupon.min_order_amount && orderAmount < coupon.min_order_amount) {
      throw new Error(`Minimum order amount is ${coupon.min_order_amount}`)
    }

    // Check usage limit
    if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
      throw new Error('Coupon usage limit reached')
    }

    return coupon
  },

  // Increment coupon usage
  async incrementCouponUsage(couponId: string) {
    // First get current usage count
    const { data: currentData, error: fetchError } = await supabase
      .from('coupons')
      .select('current_uses')
      .eq('id', couponId)
      .single()

    if (fetchError) throw fetchError

    // Then increment it
    const { data, error } = await supabase
      .from('coupons')
      .update({ current_uses: (currentData.current_uses || 0) + 1 })
      .eq('id', couponId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Toggle coupon status
  async toggleCouponStatus(couponId: string) {
    const { data: currentData, error: fetchError } = await supabase
      .from('coupons')
      .select('is_active')
      .eq('id', couponId)
      .single()

    if (fetchError) throw fetchError

    const { data, error } = await supabase
      .from('coupons')
      .update({ is_active: !currentData.is_active })
      .eq('id', couponId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

