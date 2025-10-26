import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, Zap } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-20 bg-hero text-hero-foreground relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-hero"></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-success/10 rounded-full blur-xl animate-float"></div>
      <div
        className="absolute bottom-20 right-20 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-float"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-hero-foreground/80 mb-12 max-w-2xl mx-auto">
            Join thousands of creators who are already building successful
            digital product businesses. Start your free trial today - no credit
            card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              variant="cta"
              size="lg"
              className="bg-success hover:bg-success/90 group"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-hero-foreground/20 text-hero-foreground hover:bg-hero-foreground/10"
            >
              Schedule a Demo
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-hero-foreground/20">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-success" />
              </div>
              <div className="text-left">
                <div className="font-semibold">50,000+</div>
                <div className="text-sm text-hero-foreground/70">
                  Active Users
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-success" />
              </div>
              <div className="text-left">
                <div className="font-semibold">4.9/5</div>
                <div className="text-sm text-hero-foreground/70">
                  Customer Rating
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-success" />
              </div>
              <div className="text-left">
                <div className="font-semibold">99.9%</div>
                <div className="text-sm text-hero-foreground/70">
                  Uptime SLA
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
