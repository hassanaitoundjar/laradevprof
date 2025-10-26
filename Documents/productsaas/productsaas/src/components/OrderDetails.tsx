import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  DollarSign,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Edit,
  Save,
  X,
  Home,
  ShoppingBag,
  Users,
  MessageSquare,
  Settings as SettingsIcon,
  LogOut,
  BarChart3,
  Percent,
  ShoppingCart,
  Bell,
} from "lucide-react";
import { orderService, Order } from "../lib/database";
import { useAuth } from "../contexts/AuthContext";

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Partial<Order>>({});

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/seller-dashboard" },
    { id: "products", label: "Products", icon: Package, path: "/seller-dashboard" },
    { id: "orders", label: "Orders", icon: ShoppingBag, path: "/seller-dashboard" },
    { id: "customers", label: "Customers", icon: Users, path: "/seller-dashboard" },
    { id: "queries", label: "Queries", icon: MessageSquare, path: "/seller-dashboard" },
    { id: "coupons", label: "Coupons", icon: Percent, path: "/seller-dashboard" },
    { id: "store", label: "My Store", icon: ShoppingCart, path: "/seller-dashboard" },
    { id: "analytics", label: "Analytics", icon: BarChart3, path: "/seller-dashboard" },
    { id: "settings", label: "Settings", icon: SettingsIcon, path: "/seller-dashboard" },
  ];

  useEffect(() => {
    if (orderId && user) {
      fetchOrder();
    }
  }, [orderId, user]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const orders = await orderService.getOrders(user!.id);
      const foundOrder = orders.find((o) => o.id === orderId);
      
      if (foundOrder) {
        setOrder(foundOrder);
        setEditedOrder(foundOrder);
      } else {
        setError("Order not found");
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async () => {
    if (!order || !orderId) return;

    try {
      await orderService.updateOrder(orderId, {
        order_status: editedOrder.order_status,
        payment_status: editedOrder.payment_status,
        seller_notes: editedOrder.seller_notes,
      });
      
      setOrder({ ...order, ...editedOrder });
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating order:", err);
      setError("Failed to update order");
    }
  };

  const getStatusIcon = (status: Order["order_status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "processing":
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-purple-500" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPaymentStatusColor = (status: Order["payment_status"]) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-50 border-green-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      case "refunded":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getOrderStatusColor = (status: Order["order_status"]) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-50 border-green-200";
      case "shipped":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "processing":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-900 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-indigo-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-indigo-900 font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold">Shoppy</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    item.id === "orders"
                      ? "bg-indigo-800 text-white"
                      : "text-indigo-200 hover:bg-indigo-800 hover:text-white"
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-indigo-800">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-indigo-700 rounded-full flex items-center justify-center">
              <User size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {user?.user_metadata?.username || "User"}
              </p>
              <p className="text-xs text-indigo-300">Seller</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="w-full text-left text-sm text-indigo-300 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell size={20} />
              </button>
              <span className="text-sm text-gray-600">
                Welcome, {user?.user_metadata?.username}
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate("/seller-dashboard")}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                  {loading ? "Loading..." : error ? "Order Details" : `Order #${order?.id?.slice(-8)}`}
                </h1>
              </div>
              {!loading && !error && order && (
                <div className="flex items-center space-x-3">
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2"
                    >
                      <Edit size={16} />
                      Edit Order
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => {
                          setIsEditing(false);
                          setEditedOrder(order);
                        }}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleUpdateOrder}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                      >
                        <Save size={16} />
                        Save Changes
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : error || !order ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {error || "Order not found"}
                </h2>
                <button
                  onClick={() => navigate("/seller-dashboard")}
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Go back to dashboard
                </button>
              </div>
            </div>
          ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-indigo-600" />
                  Order Summary
                </h2>
                <div className="flex items-center space-x-3">
                  {getStatusIcon(order.order_status)}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getOrderStatusColor(
                      order.order_status
                    )}`}
                  >
                    {order.order_status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Product</label>
                    <p className="text-lg font-medium text-gray-900">{order.product_title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Quantity</label>
                    <p className="text-lg text-gray-900">{order.quantity}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Unit Price</label>
                    <p className="text-lg text-gray-900">
                      {order.unit_price.toFixed(2)} {order.currency}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Order Date</label>
                    <p className="text-lg text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {new Date(order.created_at!).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Amount</label>
                    <p className="text-2xl font-bold text-gray-900 flex items-center">
                      <DollarSign className="w-5 h-5 mr-1 text-green-600" />
                      {order.total_amount.toFixed(2)} {order.currency}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2 text-indigo-600" />
                Customer Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Customer Name</label>
                    <p className="text-lg text-gray-900">{order.customer_name || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <p className="text-lg text-gray-900 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {order.customer_email}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Payment Method</label>
                    <p className="text-lg text-gray-900 flex items-center">
                      <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                      {order.payment_method || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Payment Status</label>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPaymentStatusColor(
                        order.payment_status
                      )}`}
                    >
                      {order.payment_status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Fields */}
            {order.custom_field_data && Object.keys(order.custom_field_data).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Custom Information
                </h2>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(order.custom_field_data).map(([fieldName, fieldValue]) => (
                      <div key={fieldName} className="space-y-1">
                        <label className="text-sm font-medium text-blue-900">{fieldName}</label>
                        <p className="text-blue-800">
                          {fieldValue === "true"
                            ? "✓ Yes"
                            : fieldValue === "false"
                            ? "✗ No"
                            : fieldValue || "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {(order.customer_notes || order.seller_notes || isEditing) && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Notes</h2>
                <div className="space-y-4">
                  {order.customer_notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Customer Notes</label>
                      <p className="mt-1 text-gray-900 bg-gray-50 p-3 rounded-lg">
                        {order.customer_notes}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Seller Notes</label>
                    {isEditing ? (
                      <textarea
                        value={editedOrder.seller_notes || ""}
                        onChange={(e) =>
                          setEditedOrder({ ...editedOrder, seller_notes: e.target.value })
                        }
                        rows={3}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Add notes about this order..."
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 bg-gray-50 p-3 rounded-lg">
                        {order.seller_notes || "No seller notes"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Management */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Management</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Status
                  </label>
                  {isEditing ? (
                    <select
                      value={editedOrder.order_status || order.order_status}
                      onChange={(e) =>
                        setEditedOrder({
                          ...editedOrder,
                          order_status: e.target.value as Order["order_status"],
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.order_status)}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getOrderStatusColor(
                          order.order_status
                        )}`}
                      >
                        {order.order_status}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status
                  </label>
                  {isEditing ? (
                    <select
                      value={editedOrder.payment_status || order.payment_status}
                      onChange={(e) =>
                        setEditedOrder({
                          ...editedOrder,
                          payment_status: e.target.value as Order["payment_status"],
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPaymentStatusColor(
                        order.payment_status
                      )}`}
                    >
                      {order.payment_status}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Order ID</span>
                  <span className="text-sm font-medium text-gray-900">
                    #{order.id?.slice(-8)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Created</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(order.created_at!).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Items</span>
                  <span className="text-sm font-medium text-gray-900">{order.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="text-sm font-bold text-gray-900">
                    {order.total_amount.toFixed(2)} {order.currency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
