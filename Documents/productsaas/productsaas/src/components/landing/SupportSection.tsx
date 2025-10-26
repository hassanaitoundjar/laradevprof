import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Users, Clock, Star } from "lucide-react";
import supportImage from "@/assets/support-chat.png";

export const SupportSection = () => {
  return (
    <section className="py-20 bg-feature">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Support Image */}
          <div className="animate-slide-in">
            <div className="relative">
              <img
                src={supportImage}
                alt="Customer support interface with live chat and satisfaction ratings"
                className="w-full h-auto rounded-2xl shadow-float"
              />
              {/* Floating support metrics */}
              <div className="absolute -top-3 -right-3 bg-card text-card-foreground p-3 rounded-xl shadow-lg border border-border">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-accent fill-current" />
                  <span className="font-semibold">4.9/5</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Customer Rating
                </div>
              </div>

              <div className="absolute -bottom-3 -left-3 bg-success text-success-foreground p-3 rounded-xl shadow-lg">
                <div className="text-sm font-semibold">24/7</div>
                <div className="text-xs">Support Available</div>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div className="space-y-8 animate-fade-in">
            <div>
              <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium mb-4">
                <MessageSquare className="w-4 h-4" />
                SUPPORT
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Support your Customers
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Provide world-class support with our built-in customer service
                tools. Keep your customers happy with fast response times and
                comprehensive help resources.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: MessageSquare,
                  title: "Live Chat Support",
                  desc: "Real-time communication with your customers",
                },
                {
                  icon: Users,
                  title: "Help Desk Integration",
                  desc: "Manage tickets and track customer issues",
                },
                {
                  icon: Clock,
                  title: "24/7 Availability",
                  desc: "Round-the-clock support monitoring and alerts",
                },
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-4 group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center group-hover:bg-success/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-success" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="feature" className="group">
              Explore Support Tools
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
