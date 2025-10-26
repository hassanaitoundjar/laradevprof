import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { AutomatedDelivery } from "@/components/landing/AutomatedDelivery";
import { SupportSection } from "@/components/landing/SupportSection";
import { PaymentGateways } from "@/components/landing/PaymentGateways";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";
import { Navigation } from "../components/Navigation";
import { useAuth } from "../contexts/AuthContext";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect authenticated users to role-specific dashboard
    if (!loading && user) {
      const userRole = user.user_metadata?.role;
      if (userRole === 'seller') {
        navigate('/seller-dashboard');
      } else if (userRole === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <AutomatedDelivery />
      <SupportSection />
      <PaymentGateways />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
