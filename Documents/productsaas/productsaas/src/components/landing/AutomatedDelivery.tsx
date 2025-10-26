import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, CheckCircle, Bell, Truck } from "lucide-react";
import deliveryImage from "@/assets/delivery-automation.png";

export const AutomatedDelivery = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Truck className="w-4 h-4" />
            DELIVERY
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Automated Delivery
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Set up your products once and let our system handle the rest. Instant delivery, 
            automated emails, and seamless customer experience without lifting a finger.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Features List */}
          <div className="space-y-8 animate-slide-in">
            <div className="space-y-6">
              {[
                { icon: CheckCircle, title: "Instant Product Access", desc: "Customers get immediate access after payment confirmation" },
                { icon: Bell, title: "Smart Notifications", desc: "Automated emails for purchases, receipts, and product updates" },
                { icon: Clock, title: "Scheduled Releases", desc: "Set up timed releases and drip content delivery" },
                { icon: ArrowRight, title: "Custom Workflows", desc: "Create personalized delivery sequences for different products" }
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-4 group hover:bg-card/50 p-4 rounded-lg transition-all">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center group-hover:bg-success/20 transition-colors">
                      <feature.icon className="w-5 h-5 text-success" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="cta" size="lg" className="group">
              Set Up Automation
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          
          {/* Right - Automation Image */}
          <div className="animate-scale-in">
            <div className="relative">
              <img 
                src={deliveryImage} 
                alt="Automated delivery system showing notifications and workflow cards"
                className="w-full h-auto rounded-2xl shadow-float"
              />
              {/* Overlay notification badges */}
              <div className="absolute top-4 right-4 bg-success text-success-foreground px-3 py-2 rounded-full text-xs font-semibold shadow-lg animate-pulse">
                Auto-delivered
              </div>
              <div className="absolute bottom-4 left-4 bg-card text-card-foreground px-3 py-2 rounded-full text-xs font-semibold shadow-lg border border-border">
                99.9% Uptime
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};