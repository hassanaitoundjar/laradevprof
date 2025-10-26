import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Users,
  MessageSquare,
  Settings as SettingsIcon,
  LogOut,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Calendar,
  Home,
  User,
  Bell,
  Percent,
  AlertCircle,
  Clock,
  CheckCircle,
  Reply,
  ShoppingBag,
  Star,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import ProductsList from "./products/ProductsList";
import CreateProduct from "./products/CreateProduct";
import Settings from "./Settings";
import Orders from "./Orders";
import Customers from "./Customers";

import Queries from "./Queries";
import { StorePage } from "./StorePage";
import { Coupons } from "./Coupons";

export function SellerDashboard() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const stats = [
    {
      label: "Total Revenue",
      value: "$12,543.00",
      change: "+12.5%",
      icon: DollarSign,
      color: "bg-green-500",
      trend: "up",
    },
    {
      label: "Products Sold",
      value: "1,247",
      change: "+8.2%",
      icon: ShoppingBag,
      color: "bg-blue-500",
      trend: "up",
    },
    {
      label: "Active Products",
      value: "23",
      change: "+2",
      icon: Package,
      color: "bg-purple-500",
      trend: "up",
    },
    {
      label: "Customer Rating",
      value: "4.8",
      change: "+0.2",
      icon: Star,
      color: "bg-yellow-500",
      trend: "up",
    },
  ];

  const recentProducts = [
    {
      id: 1,
      name: "Premium Gaming Account",
      price: "$49.99",
      sales: 23,
      revenue: "$1,149.77",
      status: "active",
      image: "/api/placeholder/60/60",
    },
    {
      id: 2,
      name: "Digital Art Pack",
      price: "$19.99",
      sales: 45,
      revenue: "$899.55",
      status: "active",
      image: "/api/placeholder/60/60",
    },
    {
      id: 3,
      name: "Software License",
      price: "$99.99",
      sales: 12,
      revenue: "$1,199.88",
      status: "pending",
      image: "/api/placeholder/60/60",
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "john.doe@email.com",
      product: "Premium Gaming Account",
      amount: "$49.99",
      status: "completed",
      date: "2 hours ago",
    },
    {
      id: "#ORD-002",
      customer: "jane.smith@email.com",
      product: "Digital Art Pack",
      amount: "$19.99",
      status: "processing",
      date: "4 hours ago",
    },
    {
      id: "#ORD-003",
      customer: "mike.wilson@email.com",
      product: "Software License",
      amount: "$99.99",
      status: "completed",
      date: "6 hours ago",
    },
  ];


  const queries = [
    {
      id: 1,
      customer: "john.doe@email.com",
      subject: "Issue with product delivery",
      message:
        "I purchased a gaming account but haven't received the login details yet. Can you help?",
      status: "pending",
      priority: "high",
      createdAt: "2024-01-10 14:30",
      product: "Premium Gaming Account",
    },
    {
      id: 2,
      customer: "jane.smith@email.com",
      subject: "Refund request",
      message:
        "The digital art pack I bought doesn't match the description. I would like a refund.",
      status: "in_progress",
      priority: "medium",
      createdAt: "2024-01-09 16:45",
      product: "Digital Art Pack",
    },
    {
      id: 3,
      customer: "mike.wilson@email.com",
      subject: "Product question",
      message: "Does the software license include technical support?",
      status: "resolved",
      priority: "low",
      createdAt: "2024-01-08 10:15",
      product: "Software License",
    },
    {
      id: 4,
      customer: "sarah.jones@email.com",
      subject: "Account access problem",
      message:
        "I can't log into the account I purchased. The credentials don't seem to work.",
      status: "pending",
      priority: "high",
      createdAt: "2024-01-10 09:20",
      product: "Premium Gaming Account",
    },
  ];

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowCreateProduct(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowCreateProduct(true);
  };

  const handleBackToProducts = () => {
    setShowCreateProduct(false);
    setEditingProduct(null);
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "customers", label: "Customers", icon: Users },
    { id: "queries", label: "Queries", icon: MessageSquare },
    { id: "coupons", label: "Coupons", icon: Percent },
    { id: "store", label: "My Store", icon: ShoppingCart },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

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
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id
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
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === "dashboard"
                  ? "Dashboard"
                  : sidebarItems.find((item) => item.id === activeTab)?.label}
              </h1>
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
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Top Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">$40.00</p>
                      <p className="text-sm text-gray-500">Last 24 hours</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Orders Per Day</p>
                      <p className="text-2xl font-bold text-gray-900">6</p>
                      <p className="text-sm text-green-600">+20% increase</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">95</p>
                      <p className="text-sm text-gray-500">30 Days</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Revenue
                  </h3>
                  <select className="text-sm border border-gray-300 rounded px-3 py-1">
                    <option>Last 24 hours</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                  </select>
                </div>
                <div className="h-64 bg-gradient-to-t from-blue-50 to-transparent rounded-lg flex items-center justify-center">
                  <div className="w-full h-full relative">
                    {/* Simple chart representation */}
                    <svg className="w-full h-full" viewBox="0 0 400 200">
                      <path
                        d="M 20 180 Q 100 120 180 100 T 380 80"
                        stroke="#4F46E5"
                        strokeWidth="3"
                        fill="none"
                        className="drop-shadow-sm"
                      />
                      <defs>
                        <linearGradient
                          id="gradient"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#4F46E5"
                            stopOpacity="0.3"
                          />
                          <stop
                            offset="100%"
                            stopColor="#4F46E5"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 20 180 Q 100 120 180 100 T 380 80 L 380 180 L 20 180 Z"
                        fill="url(#gradient)"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && !showCreateProduct && (
            <ProductsList
              onAddProduct={handleAddProduct}
              onEditProduct={handleEditProduct}
            />
          )}

          {activeTab === "products" && showCreateProduct && (
            <CreateProduct
              onBack={handleBackToProducts}
              editProduct={editingProduct}
            />
          )}

          {activeTab === "orders" && <Orders />}

          {activeTab === "settings" && <Settings />}

          {activeTab === "customers" && <Customers />}

          {activeTab === "queries" && <Queries />}

          {activeTab === "store" && (
            <StorePage username={user?.user_metadata?.username} />
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Analytics
                </h2>
              </div>

              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6">
                  <p className="text-gray-500">
                    Analytics data will appear here.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "queries" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Customer Queries
                </h2>
                <div className="flex items-center space-x-3">
                  <select className="text-sm border border-gray-300 rounded-lg px-3 py-2">
                    <option value="all">All Queries</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {queries.filter((q) => q.status === "pending").length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                      <Clock className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">In Progress</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {
                          queries.filter((q) => q.status === "in_progress")
                            .length
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Resolved</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {queries.filter((q) => q.status === "resolved").length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Queries
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {queries.map((query) => (
                    <div key={query.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <MessageSquare className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                {query.subject}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {query.customer}
                              </p>
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 mb-3 ml-11">
                            {query.message}
                          </p>

                          <div className="flex items-center space-x-4 ml-11">
                            <span className="text-xs text-gray-500">
                              {query.createdAt}
                            </span>
                            <span className="text-xs text-gray-500">
                              Product: {query.product}
                            </span>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                query.priority === "high"
                                  ? "bg-red-100 text-red-800"
                                  : query.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {query.priority} priority
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              query.status === "pending"
                                ? "bg-red-100 text-red-800"
                                : query.status === "in_progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {query.status.replace("_", " ")}
                          </span>
                          <button
                            onClick={() => setShowQueryModal(true)}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                          >
                            <Reply className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "coupons" && <Coupons />}
        </div>


        {/* Reply to Query Modal */}
        {showQueryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Reply to Query
                </h3>
                <button
                  onClick={() => setShowQueryModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer
                  </label>
                  <input
                    type="text"
                    value="john.doe@email.com"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value="Re: Issue with product delivery"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Response
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Type your response to the customer..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowQueryModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Send Reply
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
