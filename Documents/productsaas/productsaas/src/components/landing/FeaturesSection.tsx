import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Zap,
  Users,
  Shield,
} from "lucide-react";
import analyticsImage from "@/assets/analytics-dashboard.png";

export const FeaturesSection = () => {
  return (
    <div className="bg-feature text-feature-foreground">
      {/* Easy to Start Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Easy to start, fast to grow
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Launch your digital product business in minutes with our intuitive
              platform. No technical skills required - just upload, configure,
              and start selling.
            </p>
          </div>
        </div>
      </section>

      {/* All-in-One Platform Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image */}
            <div className="animate-slide-in">
              <div className="relative">
                <img
                  src={analyticsImage}
                  alt="Analytics dashboard showing sales performance and customer insights"
                  className="w-full h-auto rounded-2xl shadow-float"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-transparent to-accent/10"></div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  All-in-One Platform
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Everything you need to run your digital business in one place.
                  From product management to customer analytics, we've got you
                  covered.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: BarChart3,
                    text: "Advanced Analytics & Reports",
                    desc: "Track sales, revenue, and customer behavior",
                  },
                  {
                    icon: Zap,
                    text: "Instant Product Delivery",
                    desc: "Automated delivery upon successful payment",
                  },
                  {
                    icon: Users,
                    text: "Customer Management",
                    desc: "Built-in CRM and communication tools",
                  },
                  {
                    icon: Shield,
                    text: "Secure Payment Processing",
                    desc: "Enterprise-grade security and compliance",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center group-hover:bg-success/20 transition-colors">
                        <feature.icon className="w-6 h-6 text-success" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.text}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.desc}
                      </p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                  </div>
                ))}
              </div>

              <Button variant="feature" className="group">
                Learn More
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
