import { Button } from "@/components/ui/button";
import { MessageSquare, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Products", href: "#products" },
    { name: "Solutions", href: "#solutions" },
    { name: "Developers", href: "#developers" },
    { name: "Pricing", href: "#pricing" },
    { name: "Support", href: "#support" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <MessageSquare className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">CloudConnect</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex md:items-center md:gap-4">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button variant="hero" size="sm">
            Start Building
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-border md:hidden">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="ghost" size="sm" className="justify-start">
                Sign In
              </Button>
              <Button variant="hero" size="sm">
                Start Building
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;