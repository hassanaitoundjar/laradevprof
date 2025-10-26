import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  MoreVertical,
  RefreshCw,
  CheckCircle,
  Minus,
  X,
  User,
  CreditCard,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { customerService, Customer, orderService } from "../lib/database";

interface CustomersProps {
  onCreateCustomer?: () => void;
}

const Customers: React.FC<CustomersProps> = ({ onCreateCustomer }) => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Customer["status"]>(
    "all"
  );
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postal_code: "",
    notes: "",
  });

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  });

  const handleSyncFromOrders = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      await customerService.syncCustomersFromOrders(user.id);
      await fetchCustomers();
      await fetchStats();
    } catch (error) {
      console.error("Error syncing customers from orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCustomers();
      fetchStats();
    }
  }, [user]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await customerService.getCustomers(user!.id);
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await customerService.getCustomerStats(user!.id);
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await customerService.createCustomer({
        ...newCustomer,
        seller_id: user!.id,
        total_orders: 0,
        total_spent: 0,
        status: "active",
      });
      setShowCreateModal(false);
      setNewCustomer({
        email: "",
        name: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        postal_code: "",
        notes: "",
      });
      fetchCustomers();
      fetchStats();
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  const handleUpdateCustomerStatus = async (
    customerId: string,
    newStatus: Customer["status"]
  ) => {
    try {
      await customerService.updateCustomer(customerId, { status: newStatus });
      fetchCustomers();
      fetchStats();
    } catch (error) {
      console.error("Error updating customer status:", error);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await customerService.deleteCustomer(customerId);
        fetchCustomers();
        fetchStats();
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: Customer["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "inactive":
        return <Minus className="w-4 h-4 text-gray-500" />;
      case "blocked":
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Customer["status"]) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50";
      case "inactive":
        return "text-gray-600 bg-gray-50";
      case "blocked":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Customers
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Active Customers
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Avg Order Value
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.averageOrderValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Customers</h2>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Sync from Orders Button */}
              <button
                onClick={handleSyncFromOrders}
                disabled={loading}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                <span>Sync from Orders</span>
              </button>

              {/* Add Customer Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Customer</span>
              </button>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "all" | Customer["status"])
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </select>

              {/* Add Customer Button */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Customer
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`text-sm font-medium ${
                              customer.name
                                ? "text-gray-900"
                                : "text-gray-500 italic"
                            }`}
                          >
                            {customer.name || "Customer"}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Mail className="w-3 h-3" />
                          <span>{customer.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 space-y-1">
                      {customer.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                      {customer.city && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>
                            {customer.city}, {customer.country}
                          </span>
                        </div>
                      )}
                      {!customer.phone && !customer.city && (
                        <span className="text-gray-400">No contact info</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <ShoppingBag className="w-3 h-3 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {customer.total_orders}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-3 h-3 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        ${customer.total_spent.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(customer.status)}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          customer.status
                        )}`}
                      >
                        {customer.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.last_order_date
                      ? new Date(customer.last_order_date).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={async () => {
                          setSelectedCustomer(customer);
                          // Fetch customer orders for custom field data
                          try {
                            const orders = await orderService.getOrders(
                              user!.id
                            );
                            const customerOrdersData = orders.filter(
                              (order) => order.customer_email === customer.email
                            );
                            setCustomerOrders(customerOrdersData);
                          } catch (error) {
                            console.error(
                              "Error fetching customer orders:",
                              error
                            );
                            setCustomerOrders([]);
                          }
                          setShowCustomerDetails(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <select
                        value={customer.status}
                        onChange={(e) =>
                          handleUpdateCustomerStatus(
                            customer.id!,
                            e.target.value as Customer["status"]
                          )
                        }
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="blocked">Blocked</option>
                      </select>
                      <button
                        onClick={() => handleDeleteCustomer(customer.id!)}
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

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No customers found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filters."
                  : "Get started by adding your first customer."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Customer Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Customer
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newCustomer.email}
                    onChange={(e) =>
                      setNewCustomer((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="customer@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) =>
                      setNewCustomer((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(e) =>
                      setNewCustomer((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={newCustomer.city}
                    onChange={(e) =>
                      setNewCustomer((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={newCustomer.country}
                    onChange={(e) =>
                      setNewCustomer((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="United States"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={newCustomer.postal_code}
                    onChange={(e) =>
                      setNewCustomer((prev) => ({
                        ...prev,
                        postal_code: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="10001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={newCustomer.address}
                  onChange={(e) =>
                    setNewCustomer((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={2}
                  placeholder="123 Main Street"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newCustomer.notes}
                  onChange={(e) =>
                    setNewCustomer((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                  placeholder="Internal notes about this customer..."
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      {showCustomerDetails && selectedCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Customer Details
              </h3>
              <button
                onClick={() => setShowCustomerDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="flex items-center text-sm font-medium text-gray-900 mb-3">
                    <User className="w-4 h-4 mr-2" />
                    Contact Information
                  </h4>
                  <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                    {(() => {
                      // Extract contact info from custom fields if missing from customer record
                      let displayName = selectedCustomer.name;
                      let displayPhone = selectedCustomer.phone;

                      if (!displayName || !displayPhone) {
                        customerOrders.forEach((order) => {
                          if (order.custom_field_data) {
                            Object.entries(order.custom_field_data).forEach(
                              ([fieldName, fieldValue]) => {
                                const lowerFieldName = fieldName.toLowerCase();
                                console.log(
                                  "Field:",
                                  fieldName,
                                  "Value:",
                                  fieldValue
                                ); // Debug log
                                if (
                                  !displayName &&
                                  (lowerFieldName === "name" ||
                                    lowerFieldName.includes("name"))
                                ) {
                                  displayName = String(fieldValue);
                                }
                                if (
                                  !displayPhone &&
                                  (lowerFieldName.includes("phone") ||
                                    lowerFieldName.includes("mobile") ||
                                    lowerFieldName.includes("number"))
                                ) {
                                  displayPhone = String(fieldValue);
                                }
                              }
                            );
                          }
                        });
                      }

                      return (
                        <>
                          <div className="flex items-center space-x-2">
                            <User className="w-3 h-3 text-gray-400" />
                            <span className="font-medium">Name:</span>
                            <span
                              className={
                                displayName
                                  ? "text-gray-900"
                                  : "text-gray-500 italic"
                              }
                            >
                              {displayName || "Not provided"}
                            </span>
                            {displayName && !selectedCustomer.name && (
                              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                from order
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="font-medium">Email:</span>
                            <span className="text-gray-900">
                              {selectedCustomer.email}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span className="font-medium">Phone:</span>
                            <span
                              className={
                                displayPhone
                                  ? "text-gray-900"
                                  : "text-gray-500 italic"
                              }
                            >
                              {displayPhone || "Not provided"}
                            </span>
                            {displayPhone && !selectedCustomer.phone && (
                              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                from order
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-gray-400" />
                            <span className="font-medium">Status:</span>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                selectedCustomer.status
                              )}`}
                            >
                              {selectedCustomer.status}
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div>
                  <h4 className="flex items-center text-sm font-medium text-gray-900 mb-3">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Order Statistics
                  </h4>
                  <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <ShoppingBag className="w-3 h-3 text-gray-400" />
                      <span className="font-medium">Total Orders:</span>
                      <span>{selectedCustomer.total_orders}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-3 h-3 text-gray-400" />
                      <span className="font-medium">Total Spent:</span>
                      <span>{selectedCustomer.total_spent.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="font-medium">Last Order:</span>
                      <span>
                        {selectedCustomer.last_order_date
                          ? new Date(
                              selectedCustomer.last_order_date
                            ).toLocaleDateString()
                          : "Never"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-3 h-3 text-gray-400" />
                      <span className="font-medium">Customer Since:</span>
                      <span>
                        {new Date(
                          selectedCustomer.created_at!
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              {(selectedCustomer.address || selectedCustomer.city) && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Address
                  </h4>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedCustomer.address && (
                      <div>{selectedCustomer.address}</div>
                    )}
                    {selectedCustomer.city && (
                      <div>
                        {selectedCustomer.city}
                        {selectedCustomer.postal_code &&
                          `, ${selectedCustomer.postal_code}`}
                        {selectedCustomer.country && (
                          <div>{selectedCustomer.country}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Custom Fields from Orders */}
              {customerOrders.length > 0 && (
                <div>
                  <h4 className="flex items-center text-sm font-medium text-gray-900 mb-3">
                    <Filter className="w-4 h-4 mr-2" />
                    Custom Information from Orders
                  </h4>
                  <div className="space-y-3">
                    {customerOrders.map((order, index) => {
                      if (
                        !order.custom_field_data ||
                        Object.keys(order.custom_field_data).length === 0
                      )
                        return null;
                      return (
                        <div
                          key={order.id || index}
                          className="bg-gray-50 p-4 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-xs font-medium text-gray-700">
                              Order: {order.product_title}
                            </h5>
                            <span className="text-xs text-gray-500">
                              {new Date(order.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            {Object.entries(order.custom_field_data).map(
                              ([fieldName, fieldValue]) => (
                                <div
                                  key={fieldName}
                                  className="flex items-start space-x-2"
                                >
                                  <span className="font-medium text-gray-600 min-w-0 flex-shrink-0">
                                    {fieldName}:
                                  </span>
                                  <span className="text-gray-900 break-words">
                                    {String(fieldValue) === "true"
                                      ? "✓ Yes"
                                      : String(fieldValue) === "false"
                                      ? "✗ No"
                                      : String(fieldValue)}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedCustomer.notes && (
                <div>
                  <h4 className="flex items-center text-sm font-medium text-gray-900 mb-2">
                    <Edit className="w-4 h-4 mr-2" />
                    Notes
                  </h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedCustomer.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
