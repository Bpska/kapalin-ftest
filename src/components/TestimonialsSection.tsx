import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Lead Developer at TechFlow",
      company: "TechFlow",
      content: "CloudConnect's APIs are incredibly intuitive. We integrated SMS notifications in our app within hours, not days. The documentation is fantastic!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO at StartupXYZ",
      company: "StartupXYZ", 
      content: "The reliability is unmatched. We've processed millions of messages with 99.99% delivery rate. CloudConnect just works, every time.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Emma Thompson",
      role: "Engineering Manager at DevCorp",
      company: "DevCorp",
      content: "Finally, a communication API that doesn't make me want to pull my hair out. Simple, powerful, and the support team actually knows what they're talking about.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-4">
            Loved by 
            <span className="bg-gradient-warm bg-clip-text text-transparent"> developers</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of developers who've chosen CloudConnect to power their communication features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="border-0 shadow-soft hover-lift transition-smooth bg-card"
            >
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-4 w-4 fill-accent text-accent" 
                    />
                  ))}
                </div>

                {/* Content */}
                <blockquote className="text-card-foreground leading-relaxed mb-6">
                  "{testimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <img 
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-muted"
                  />
                  <div>
                    <div className="font-semibold text-card-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-foreground">50K+</div>
            <div className="text-sm text-muted-foreground">Active Developers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">1B+</div>
            <div className="text-sm text-muted-foreground">Messages Sent</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">180+</div>
            <div className="text-sm text-muted-foreground">Countries</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-foreground">99.99%</div>
            <div className="text-sm text-muted-foreground">Uptime SLA</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;