import { MessageSquare, Twitter, Github, Linkedin } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: "SMS API", href: "#" },
      { name: "Voice API", href: "#" },
      { name: "Video API", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "Documentation", href: "#" },
    ],
    Company: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Press", href: "#" },
      { name: "Partners", href: "#" },
    ],
    Resources: [
      { name: "Help Center", href: "#" },
      { name: "Community", href: "#" },
      { name: "Tutorials", href: "#" },
      { name: "Status Page", href: "#" },
      { name: "API Reference", href: "#" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Security", href: "#" },
      { name: "Compliance", href: "#" },
      { name: "Cookie Policy", href: "#" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "GitHub", icon: Github, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                  <MessageSquare className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">CloudConnect</span>
              </div>
              <p className="text-sm text-background/70 max-w-sm mb-6">
                The friendliest cloud communication platform for developers. 
                Build amazing experiences with APIs that just work.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-background/70 hover:text-background transition-smooth"
                  >
                    <social.icon className="h-5 w-5" />
                    <span className="sr-only">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-semibold text-sm mb-4">{category}</h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-background/70 hover:text-background transition-smooth"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/20 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/70">
            © 2024 CloudConnect. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-background/70">
            <span className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success"></div>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;