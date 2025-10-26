import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import dashboardHero from "@/assets/dashboard-hero.png";

export const HeroSection = () => {
  return (
    <section className="bg-hero text-hero-foreground relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-hero"></div>

      <div className="container mx-auto px-6 py-20 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Sell Digital Goods
              <span className="block text-accent"> Online</span>
            </h1>

            <p className="text-xl text-hero-foreground/80 leading-relaxed max-w-lg">
              Everything you need to launch, promote and scale your digital
              product business. Start selling in minutes with our all-in-one
              platform.
            </p>

            <p className="text-xl text-hero-foreground/80 leading-relaxed max-w-lg"></p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="group">
                Start Selling Now
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-hero-foreground/20 text-hero-foreground hover:bg-hero-foreground/10"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-hero-foreground/70">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                No setup fees
              </div>
              <div className="flex items-center gap-2 text-sm text-hero-foreground/70">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                14-day free trial
              </div>
            </div>
          </div>

          {/* Right content - Dashboard mockup */}
          <div className="relative animate-scale-in">
            <div className="relative">
              <img
                src={dashboardHero}
                alt="SaaS dashboard interface showing analytics and sales metrics"
                className="w-full h-auto rounded-2xl shadow-hero animate-float"
              />
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-success text-success-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce">
                $12,845 Revenue
              </div>
              <div
                className="absolute -bottom-4 -left-4 bg-card text-card-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce"
                style={{ animationDelay: "0.5s" }}
              >
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
