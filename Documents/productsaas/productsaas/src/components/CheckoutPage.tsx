import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Lock,
  CreditCard,
  Mail,
  User,
  MapPin,
  Phone,
  Package,
  Check,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  productService,
  orderService,
  userSettingsService,
  couponService,
  Product,
} from "../lib/database";

export function CheckoutPage() {
  const { username, productSlug } = useParams<{
    username: string;
    productSlug: string;
  }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Customer Information
    email: "",
    firstName: "",
    lastName: "",
    phone: "",

    // Billing Address
    address: "",
    city: "",
    postalCode: "",
    country: "US",

    // Payment Information
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",

    // Order Details
    quantity: 1,
    notes: "",
    couponCode: "",

    // Custom Fields (will be populated dynamically)
    customFields: {} as Record<string, string>,
  });

  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponValidating, setCouponValidating] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  // Helper function to create slug from product title
  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productSlug || !username) {
        setError("Product not found");
        setLoading(false);
        return;
      }

      try {
        // Get all products and find by slug
        const allProducts = await productService.getAll();
        const productData = allProducts.find(
          (p) => createSlug(p.title) === productSlug && p.status === "active"
        );

        if (!productData) {
          setError("Product not found");
        } else {
          setProduct(productData);

          // Initialize custom fields in form data
          if (
            productData.custom_fields &&
            productData.custom_fields.length > 0
          ) {
            const initialCustomFields: Record<string, string> = {};
            productData.custom_fields.forEach((field) => {
              initialCustomFields[field.name] = "";
            });
            setFormData((prev) => ({
              ...prev,
              customFields: initialCustomFields,
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug, username]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomFieldChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [fieldName]: value,
      },
    }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData((prev) => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setFormData((prev) => ({ ...prev, expiryDate: formatted }));
  };

  const calculateSubtotal = () => {
    if (!product) return 0;
    return product.price * formData.quantity;
  };

  const calculateDiscount = () => {
    if (!couponApplied || !appliedCoupon) return 0;

    if (appliedCoupon.discount_type === "percentage") {
      return calculateSubtotal() * (appliedCoupon.discount_value / 100);
    } else {
      // Fixed amount discount
      return Math.min(appliedCoupon.discount_value, calculateSubtotal());
    }
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const applyCoupon = async () => {
    if (!formData.couponCode.trim()) return;

    setCouponValidating(true);

    try {
      const couponCode = formData.couponCode.toUpperCase();

      // Validate coupon using the database service
      // Note: We need the seller's user_id for coupon validation
      if (!product?.user_id) {
        throw new Error("Product owner information not available");
      }
      const coupon = await couponService.validateCoupon(
        product.user_id,
        couponCode,
        calculateSubtotal()
      );

      if (coupon) {
        setAppliedCoupon(coupon);
        setCouponApplied(true);
        setError(null);

        // Increment coupon usage
        await couponService.incrementCouponUsage(coupon.id);
      } else {
        setError("Invalid coupon code");
        setCouponApplied(false);
        setAppliedCoupon(null);
      }
    } catch (err) {
      console.error("Coupon validation error:", err);
      setError("Failed to validate coupon");
      setCouponApplied(false);
      setCouponDiscount(0);
      setAppliedCoupon(null);
    } finally {
      setCouponValidating(false);
    }
  };

  const removeCoupon = () => {
    setCouponApplied(false);
    setCouponDiscount(0);
    setAppliedCoupon(null);
    setFormData((prev) => ({ ...prev, couponCode: "" }));
  };

  // Create PayPal Standard payment URL
  const createPayPalUrl = (paypalEmail: string, order: any, product: any) => {
    const baseUrl = "https://www.paypal.com/cgi-bin/webscr";
    const params = new URLSearchParams({
      cmd: "_xclick",
      business: paypalEmail,
      item_name: product.title,
      item_number: order.id || "N/A",
      amount: calculateTotal().toString(),
      currency_code: product.currency,
      return: `${window.location.origin}/payment/success?order_id=${order.id}`,
      cancel_return: `${window.location.origin}/payment/cancel?order_id=${order.id}`,
      notify_url: `${window.location.origin}/api/paypal/ipn`,
      custom: order.id || "",
      no_shipping: "1",
      no_note: "1",
    });

    return `${baseUrl}?${params.toString()}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) return;

    setSubmitting(true);
    setError(null);

    try {
      // PayPal is the only payment method, no card validation needed

      // Validate fields based on whether product has custom fields or not
      if (product.custom_fields && product.custom_fields.length > 0) {
        // Product has custom fields - validate only required custom fields
        for (const field of product.custom_fields) {
          if (
            field.required &&
            (!formData.customFields[field.name] ||
              formData.customFields[field.name].trim() === "")
          ) {
            throw new Error(`Please fill in the required field: ${field.name}`);
          }
        }
        // No need to validate default customer info when custom fields exist
      } else {
        // Product has no custom fields - validate default customer information
        if (!formData.email || !formData.firstName || !formData.lastName) {
          throw new Error("Please fill in all required customer information");
        }
      }

      // Handle PayPal payment
      if (paymentMethod === "paypal") {
        // Get seller's PayPal email from user settings
        const sellerSettings = await userSettingsService.getUserSettings(
          product.user_id
        );
        const paypalEmail = sellerSettings?.paypal_email;

        if (!paypalEmail) {
          throw new Error("PayPal is not configured for this seller");
        }

        // Create order with pending payment status
        const orderData = {
          seller_id: product.user_id,
          product_id: product.id!,
          product_title: product.title,
          customer_email:
            formData.email ||
            (product.custom_fields?.find((f) => f.type === "email")?.name
              ? formData.customFields[
                  product.custom_fields.find((f) => f.type === "email")!.name
                ]
              : ""),
          customer_name:
            `${formData.firstName} ${formData.lastName}` || "Customer",
          quantity: formData.quantity,
          unit_price: product.price,
          total_amount: calculateTotal(),
          currency: product.currency,
          payment_method: paymentMethod,
          customer_notes: formData.notes,
          custom_field_data: formData.customFields,
          payment_status: "pending" as const,
          order_status: "pending" as const,
        };

        const order = await orderService.createOrder(orderData);

        // Redirect to PayPal
        const paypalUrl = createPayPalUrl(paypalEmail, order, product);
        window.location.href = paypalUrl;
        return;
      }

      // This should not be reached since PayPal is the only payment method
      throw new Error("Invalid payment method");
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Failed to process order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-500"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Successful!
          </h2>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. You will receive a confirmation email
            shortly.
          </p>
          <p className="text-sm text-gray-500">Redirecting...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Custom Fields - Only show if product has custom fields */}
              {product &&
              product.custom_fields &&
              product.custom_fields.length > 0 ? (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Order Information
                  </h3>
                  <div className="space-y-4">
                    {product.custom_fields.map((field, index) => (
                      <div key={index}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.name}{" "}
                          {field.required && (
                            <span className="text-red-500">*</span>
                          )}
                        </label>
                        {field.type === "text" ? (
                          <input
                            type="text"
                            value={formData.customFields[field.name] || ""}
                            onChange={(e) =>
                              handleCustomFieldChange(
                                field.name,
                                e.target.value
                              )
                            }
                            required={field.required}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Enter ${field.name.toLowerCase()}`}
                          />
                        ) : field.type === "textarea" ? (
                          <textarea
                            value={formData.customFields[field.name] || ""}
                            onChange={(e) =>
                              handleCustomFieldChange(
                                field.name,
                                e.target.value
                              )
                            }
                            required={field.required}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Enter ${field.name.toLowerCase()}`}
                          />
                        ) : field.type === "email" ? (
                          <input
                            type="email"
                            value={formData.customFields[field.name] || ""}
                            onChange={(e) =>
                              handleCustomFieldChange(
                                field.name,
                                e.target.value
                              )
                            }
                            required={field.required}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Enter ${field.name.toLowerCase()}`}
                          />
                        ) : field.type === "number" ? (
                          <input
                            type="number"
                            value={formData.customFields[field.name] || ""}
                            onChange={(e) =>
                              handleCustomFieldChange(
                                field.name,
                                e.target.value
                              )
                            }
                            required={field.required}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Enter ${field.name.toLowerCase()}`}
                          />
                        ) : field.type === "tel" ? (
                          <input
                            type="tel"
                            value={formData.customFields[field.name] || ""}
                            onChange={(e) =>
                              handleCustomFieldChange(
                                field.name,
                                e.target.value
                              )
                            }
                            required={field.required}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Enter ${field.name.toLowerCase()}`}
                          />
                        ) : field.type === "select" ? (
                          <select
                            value={formData.customFields[field.name] || ""}
                            onChange={(e) =>
                              handleCustomFieldChange(
                                field.name,
                                e.target.value
                              )
                            }
                            required={field.required}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select an option</option>
                            {field.options?.map((option, index) => (
                              <option key={index} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : field.type === "checkbox" ? (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.customFields[field.name] === "true"}
                              onChange={(e) =>
                                handleCustomFieldChange(
                                  field.name,
                                  e.target.checked ? "true" : "false"
                                )
                              }
                              required={field.required}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label className="ml-2 text-sm text-gray-700">
                              {field.name}
                            </label>
                          </div>
                        ) : (
                          <input
                            type="text"
                            value={formData.customFields[field.name] || ""}
                            onChange={(e) =>
                              handleCustomFieldChange(
                                field.name,
                                e.target.value
                              )
                            }
                            required={field.required}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Enter ${field.name.toLowerCase()}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Default Customer Information - Only show if no custom fields */
                <>{/* Billing Address */}</>
              )}

              {/* Payment Method */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Method
                </h3>

                {/* PayPal Payment Method - Only Option */}
                <div className="mb-4">
                  <div className="p-3 border border-blue-500 bg-blue-50 rounded-lg text-sm font-medium text-blue-700 text-center">
                    PayPal Payment
                  </div>
                </div>

                {/* PayPal Payment Info */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <p className="text-sm text-yellow-800">
                    You will be redirected to PayPal to complete your payment
                    securely.
                  </p>
                </div>
              </div>

              {/* Coupon Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Code (Optional)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="couponCode"
                    value={formData.couponCode}
                    onChange={handleInputChange}
                    disabled={couponApplied}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Enter coupon code"
                  />
                  {!couponApplied ? (
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={couponValidating || !formData.couponCode.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {couponValidating ? "Validating..." : "Apply"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {couponApplied && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800">
                      Coupon applied! {couponDiscount}% discount
                    </p>
                  </div>
                )}
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any special instructions or notes..."
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Complete Order - {calculateTotal().toFixed(2)}{" "}
                    {product.currency}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Order Summary
            </h3>

            {product && (
              <div className="space-y-4">
                {/* Product Details */}
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {product.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Type: {product.type}
                    </p>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between py-2 border-t">
                  <span className="text-sm text-gray-600">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          quantity: Math.max(1, prev.quantity - 1),
                        }))
                      }
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{formData.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          quantity: prev.quantity + 1,
                        }))
                      }
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Unit Price ({product.currency})
                    </span>
                    <span>{product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Quantity</span>
                    <span>{formData.quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>
                      {calculateSubtotal().toFixed(2)} {product.currency}
                    </span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({couponDiscount}%)</span>
                      <span>
                        -{calculateDiscount().toFixed(2)} {product.currency}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>
                      {calculateTotal().toFixed(2)} {product.currency}
                    </span>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-gray-50 rounded-md p-3 mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Lock className="w-4 h-4 mr-2" />
                    Your payment information is secure and encrypted
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
