import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SignUpPage } from "./components/auth/SignUpPage";
import { SignInPage } from "./components/auth/SignInPage";
import { ForgotPasswordPage } from "./components/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./components/auth/ResetPasswordPage";
import { EmailVerificationPage } from "./components/auth/EmailVerificationPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RoleBasedRoute } from "./components/auth/RoleBasedRoute";
import { SellerDashboard } from "./components/SellerDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { DashboardRedirect } from "./components/DashboardRedirect";
import { StorePage } from './components/StorePage'
import { CheckoutPage } from './components/CheckoutPage';
import OrderDetails from "./components/OrderDetails";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<EmailVerificationPage />} />
            
            {/* Role-based protected routes */}
            <Route path="/seller-dashboard" element={
              <RoleBasedRoute allowedRoles={['seller']}>
                <SellerDashboard />
              </RoleBasedRoute>
            } />
            
            <Route path="/admin-dashboard" element={
              <RoleBasedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleBasedRoute>
            } />
            
            {/* Generic dashboard redirect based on role */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            } />
            
            {/* Order Details Route */}
            <Route path="/order/:orderId" element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            } />
            
            {/* Store Page Route */}
            <Route path="/:username" element={<StorePage />} />
            
            {/* Checkout Route - nested under username */}
            <Route path="/:username/checkout/:productSlug" element={<CheckoutPage />} />
            
            {/* Redirect old checkout URLs to 404 or handle them */}
            <Route path="/checkout/:productId" element={<Navigate to="/" replace />} />
            
            {/* Landing page - redirect to dashboard if authenticated */}
            <Route path="/" element={<Index />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
