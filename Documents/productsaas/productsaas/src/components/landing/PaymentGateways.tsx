import { Button } from "@/components/ui/button";
import { ArrowRight, Bitcoin, CreditCard, DollarSign } from "lucide-react";

export const PaymentGateways = () => {
  const gateways = [
    { name: "Bitcoin", icon: Bitcoin, color: "text-accent" },
    { name: "PayPal", icon: DollarSign, color: "text-accent" },
    { name: "Stripe", icon: CreditCard, color: "text-accent" },
    { name: "Crypto", icon: Bitcoin, color: "text-accent" }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Vast Variety of Gateways
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Accept payments from customers worldwide with our extensive range of payment methods. 
            From traditional cards to cryptocurrencies, we support it all.
          </p>
        </div>

        {/* Payment Gateway Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {gateways.map((gateway, index) => (
            <div 
              key={index} 
              className="group animate-scale-in bg-card border border-border rounded-2xl p-8 text-center hover:shadow-float transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <gateway.icon className={`w-8 h-8 ${gateway.color}`} />
              </div>
              <h3 className="font-semibold text-card-foreground">{gateway.name}</h3>
            </div>
          ))}
        </div>

        {/* Additional payment methods text */}
        <div className="text-center animate-fade-in">
          <p className="text-muted-foreground mb-8">
            Plus many more payment options including Apple Pay, Google Pay, bank transfers, and regional payment methods.
          </p>
          <Button variant="outline" className="group">
            View All Payment Methods
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};