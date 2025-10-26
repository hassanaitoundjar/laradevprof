import { Twitter, Github, Linkedin, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-hero text-hero-foreground">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Shoppsy</h3>
              <p className="text-hero-foreground/70 text-sm leading-relaxed">
                The complete platform for selling digital products online. Built
                for creators, by creators.
              </p>
            </div>
            <div className="flex space-x-4">
              {[
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Mail, href: "#", label: "Email" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-hero-foreground/10 rounded-lg flex items-center justify-center hover:bg-success/20 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              {[
                "Features",
                "Pricing",
                "API",
                "Integrations",
                "Documentation",
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-hero-foreground/70 hover:text-hero-foreground transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-3 text-sm">
              {[
                "Blog",
                "Help Center",
                "Community",
                "Webinars",
                "Case Studies",
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-hero-foreground/70 hover:text-hero-foreground transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              {[
                "About Us",
                "Careers",
                "Press Kit",
                "Privacy Policy",
                "Terms of Service",
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-hero-foreground/70 hover:text-hero-foreground transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-hero-foreground/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-hero-foreground/70 text-sm">
            © 2024 Shoppsy. All rights reserved.
          </p>
          <p className="text-hero-foreground/70 text-sm mt-4 md:mt-0">
            Made with ❤️ for digital creators everywhere
          </p>
        </div>
      </div>
    </footer>
  );
};
