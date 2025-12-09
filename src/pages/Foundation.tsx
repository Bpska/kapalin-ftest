import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ShoppingBag, Plane, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Foundation = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const divisions = [
        {
            id: 1,
            title: 'Kapalin Tales Books',
            description: 'Discover ancient wisdom through beautifully illustrated books for all ages. Explore our collection of spiritual literature, mythology, and timeless stories.',
            icon: BookOpen,
            color: 'from-amber-500 to-orange-600',
            iconBg: 'bg-amber-100 dark:bg-amber-900/30',
            iconColor: 'text-amber-600 dark:text-amber-400',
            route: '/old-home',
            features: ['E-Books', 'Hardcover Editions', 'Audio Books', 'Illustrated Stories']
        },
        {
            id: 2,
            title: 'E-Items',
            description: 'Browse our curated collection of digital products, spiritual merchandise, and exclusive content. From meditation guides to sacred art prints.',
            icon: ShoppingBag,
            color: 'from-blue-500 to-purple-600',
            iconBg: 'bg-blue-100 dark:bg-blue-900/30',
            iconColor: 'text-blue-600 dark:text-blue-400',
            route: '/e-items',
            features: ['Digital Downloads', 'Merchandise', 'Exclusive Content', 'Gift Items']
        },
        {
            id: 3,
            title: 'Tourist & Travel',
            description: 'Embark on spiritual journeys to sacred destinations. Experience transformative pilgrimages and cultural tours guided by experts.',
            icon: Plane,
            color: 'from-green-500 to-teal-600',
            iconBg: 'bg-green-100 dark:bg-green-900/30',
            iconColor: 'text-green-600 dark:text-green-400',
            route: '/travel',
            features: ['Pilgrimage Tours', 'Cultural Experiences', 'Spiritual Retreats', 'Guided Journeys']
        }
    ];

    const handleNavigate = (route: string) => {
        navigate(route);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background py-20">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                    <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                        Kapalin Gita's Foundation
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                        Preserving ancient wisdom for future generations through books, digital experiences, and spiritual journeys
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm text-muted-foreground">3 Active Divisions</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
                            <span className="text-sm text-muted-foreground">Serving 20,000+ Seekers</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Three Divisions */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {divisions.map((division, index) => {
                        const Icon = division.icon;
                        return (
                            <Card
                                key={division.id}
                                className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                            >
                                {/* Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${division.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                                <CardContent className="relative p-8 space-y-6">
                                    {/* Icon */}
                                    <div className={`inline-flex p-4 rounded-2xl ${division.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`h-8 w-8 ${division.iconColor}`} />
                                    </div>

                                    {/* Title */}
                                    <div>
                                        <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                            {division.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {division.description}
                                        </p>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-2">
                                        {division.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA Button */}
                                    <Button
                                        onClick={() => handleNavigate(division.route)}
                                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                                        variant="outline"
                                    >
                                        Explore Now
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>

                                    {/* Number Badge */}
                                    <div className="absolute top-4 right-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-primary">{division.id}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Additional Info Section */}
                <div className="mt-16 text-center">
                    <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
                        <CardContent className="p-12">
                            <h2 className="text-3xl font-bold text-foreground mb-4">
                                Our Mission
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                                At Kapalin Gita's Foundation, we are dedicated to making ancient spiritual wisdom accessible
                                to everyone through modern storytelling, digital innovation, and immersive experiences.
                                Join us on this journey of discovery and enlightenment.
                            </p>
                            <div className="mt-8 flex flex-wrap justify-center gap-4">
                                <Button size="lg" onClick={() => navigate('/ebook')}>
                                    <BookOpen className="mr-2 h-5 w-5" />
                                    Browse Books
                                </Button>
                                <Button size="lg" variant="outline" onClick={() => navigate('/profile')}>
                                    View My Profile
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-card border-y border-border py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">50+</div>
                            <div className="text-sm text-muted-foreground">Books Published</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">20K+</div>
                            <div className="text-sm text-muted-foreground">Happy Readers</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">100+</div>
                            <div className="text-sm text-muted-foreground">Audio Stories</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">15+</div>
                            <div className="text-sm text-muted-foreground">Travel Destinations</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Foundation;
