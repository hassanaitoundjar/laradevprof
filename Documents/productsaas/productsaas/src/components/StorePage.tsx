import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Share2,
  Package,
  ExternalLink,
  Copy,
  Check,
  ShoppingCart,
  Star,
  Heart,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { productService, Product } from "../lib/database";

interface StorePageProps {
  username?: string;
}

export function StorePage({ username: propUsername }: StorePageProps) {
  const { username: paramUsername } = useParams<{ username: string }>();
  const username = propUsername || paramUsername;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [showShareModal, setShowShareModal] = useState(false);

  // Store info - in a real app, this would come from user profile
  const storeInfo = {
    name: `${username}'s Store`,
    description:
      "Welcome to our online store! Discover amazing products at great prices.",
    logo: null,
    contact: {
      email: "contact@store.com",
      phone: "+1 (555) 123-4567",
      address: "123 Business St, City, State 12345",
    },
    subdomain: `${username
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, "")}.mystore.com`,
  };

  useEffect(() => {
    fetchProducts();
  }, [username]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      if (username) {
        // Get products for the specific store owner
        const data = await productService.getProductsByUsername(username);
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find((p) => p.id === productId);
      return total + (product ? product.price * quantity : 0);
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading store...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Package className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {storeInfo.name}
                </h1>
                <p className="text-sm text-gray-500">{storeInfo.subdomain}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Store Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">{storeInfo.description}</h2>
            <div className="flex items-center justify-center space-x-6 text-sm opacity-90">
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>{storeInfo.contact.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>{storeInfo.contact.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>{storeInfo.contact.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Our Products
          </h3>
          <p className="text-gray-600">
            Discover our amazing collection of products
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products available
            </h3>
            <p className="text-gray-500">
              This store doesn't have any products yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="h-48 w-full object-cover object-center"
                    />
                  ) : (
                    <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                      <Package size={32} className="text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    {product.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-gray-900">
                      ${product.price} {product.currency}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {product.type}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const productSlug = product.title
                        .toLowerCase()
                        .replace(/[^a-z0-9 -]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim()
                      window.location.href = `/${username}/checkout/${productSlug}`
                    }}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {storeInfo.name}
            </h4>
            <p className="text-gray-600 mb-4">{storeInfo.description}</p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>{storeInfo.contact.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>{storeInfo.contact.phone}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-400">
                Visit us at:{" "}
                <span className="font-medium text-indigo-600">
                  {window.location.origin}/{username}
                </span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
