import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import mascotImage from "@/assets/mascot.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative pt-20 pb-16 sm:pb-24 lg:pt-24 lg:pb-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent mb-6">
                <span>🎉 New API v3.0 is here</span>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Communication APIs that developers
                <span className="bg-gradient-warm bg-clip-text text-transparent"> love to use</span>
              </h1>
              
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl">
                Build amazing communication experiences with our simple, powerful APIs. 
                Send SMS, make voice calls, and add video chat to your apps in minutes, not weeks.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  variant="hero"
                  className="group"
                >
                  Start building for free
                  <ArrowRight className="ml-2 h-4 w-4 transition-smooth group-hover:translate-x-1" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="group"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Watch demo
                </Button>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row gap-8 text-sm text-muted-foreground justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success"></div>
                  <span>99.99% uptime SLA</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success"></div>
                  <span>Global infrastructure</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success"></div>
                  <span>SOC 2 compliant</span>
                </div>
              </div>
            </div>

            {/* Mascot */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-gradient-warm opacity-20 blur-2xl"></div>
                <img 
                  src={mascotImage}
                  alt="CloudConnect friendly mascot"
                  className="relative h-80 w-80 sm:h-96 sm:w-96 object-contain hover-lift"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;