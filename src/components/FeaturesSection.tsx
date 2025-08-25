import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Phone, Video, Zap, Shield, Globe } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "SMS & Messaging",
      description: "Send SMS and rich messages globally with industry-leading delivery rates and real-time status updates.",
      gradient: "bg-gradient-primary"
    },
    {
      icon: Phone,
      title: "Voice Calls",
      description: "Crystal-clear voice calls with intelligent routing, call recording, and advanced analytics built-in.",
      gradient: "bg-gradient-secondary"
    },
    {
      icon: Video,
      title: "Video Chat",
      description: "Add face-to-face conversations to your app with our WebRTC-powered video calling APIs.",
      gradient: "bg-gradient-accent"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Sub-second API response times and 99.99% uptime SLA. Your users won't even notice we're there.",
      gradient: "bg-gradient-primary"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC 2 Type II certified with end-to-end encryption and enterprise-grade security controls.",
      gradient: "bg-gradient-secondary"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Reach users in 180+ countries with our worldwide carrier network and local phone numbers.",
      gradient: "bg-gradient-accent"
    }
  ];

  return (
    <section className="py-20 bg-muted-light" id="products">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-4">
            Everything you need to 
            <span className="bg-gradient-warm bg-clip-text text-transparent"> connect</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful communication APIs designed for developers who want to build amazing experiences without the complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-soft hover-lift transition-smooth bg-card"
            >
              <CardHeader>
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.gradient} mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-card-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Code Example */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Simple APIs, powerful results
            </h3>
            <p className="text-muted-foreground">
              Get started in minutes with our intuitive SDKs
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-medium bg-foreground text-background overflow-hidden">
              <CardContent className="p-6">
                <pre className="text-sm overflow-x-auto">
                  <code>{`// Send an SMS in just 3 lines of code
import { CloudConnect } from 'cloudconnect';

const client = new CloudConnect('your-api-key');

await client.messages.create({
  to: '+1234567890',
  from: '+1987654321',
  body: 'Hello from CloudConnect! 👋'
});`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;