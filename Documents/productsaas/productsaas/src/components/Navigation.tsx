import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Menu } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { AuthButton } from "./auth/AuthButton";

export function Navigation() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 sticky top-0 z-50"
    >
      <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
        <div className="md:flex md:items-center">
          {/* Logo and Mobile Menu */}
          <div className="flex justify-between items-center">
            <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
              <Link
                to="/"
                className="inline-block text-white text-xl font-bold"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <span>ProductSaaS</span>
                </div>
              </Link>
            </motion.div>

            {/* Mobile menu button */}
            <div className="inline-block cursor-pointer md:hidden">
              <Menu className="text-white w-6 h-6" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block ml-auto">
            <div className="flex items-center pt-1">
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-4" />
              ) : user ? (
                <div className="flex items-center space-x-3">
                  <Link
                    to={
                      user.user_metadata?.role === "seller"
                        ? "/seller-dashboard"
                        : "/admin-dashboard"
                    }
                    className="flex items-center space-x-3 text-white hover:text-blue-200 transition-colors"
                  >
                    <img
                      src="/assets/img/default-avatar.png"
                      className="h-8 w-8 rounded-full"
                      alt="User Avatar"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.email}&background=667eea&color=fff`;
                      }}
                    />
                    <span className="text-white">
                      {user.email?.split("@")[0] || "User"}
                    </span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-white hover:text-red-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <LogOut size={16} />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/signin"
                    className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <span className="inline-flex rounded-md shadow-sm">
                    <Link to="/signup">
                      <button className="disabled:opacity-75 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-lime-500 hover:bg-lime-600 focus:outline-none focus:border-lime-600 focus:shadow-outline-lime active:bg-lime-600 transition duration-150 ease-in-out md:px-2 lg:px-7 py-2 border border-transparent text-base">
                        Sign Up
                      </button>
                    </Link>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
