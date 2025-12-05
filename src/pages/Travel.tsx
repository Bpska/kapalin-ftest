import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plane, MapPin, Calendar, Users, Star, Clock, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TourPackage {
    id: string;
    name: string;
    destination: string;
    description: string;
    price: number;
    duration: string;
    image: string;
    category: string;
    rating: number;
    groupSize: string;
    highlights: string[];
}

// Mock tour packages
const mockTours: TourPackage[] = [
    {
        id: '1',
        name: 'Varanasi Spiritual Journey',
        destination: 'Varanasi, Uttar Pradesh',
        description: 'Experience the ancient city of Varanasi with guided temple visits, Ganga Aarti, and spiritual teachings',
        price: 15999,
        duration: '5 Days / 4 Nights',
        image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600',
        category: 'Pilgrimage',
        rating: 4.9,
        groupSize: '10-15 people',
        highlights: ['Ganga Aarti', 'Temple Tours', 'Boat Ride', 'Spiritual Discourse']
    },
    {
        id: '2',
        name: 'Rishikesh Yoga Retreat',
        destination: 'Rishikesh, Uttarakhand',
        description: 'Immerse yourself in yoga and meditation at the yoga capital of the world',
        price: 12999,
        duration: '7 Days / 6 Nights',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
        category: 'Retreat',
        rating: 5.0,
        groupSize: '8-12 people',
        highlights: ['Daily Yoga', 'Meditation', 'Ayurveda', 'River Rafting']
    },
    {
        id: '3',
        name: 'Char Dham Yatra',
        destination: 'Uttarakhand',
        description: 'Complete pilgrimage to the four sacred shrines in the Himalayas',
        price: 35999,
        duration: '12 Days / 11 Nights',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600',
        category: 'Pilgrimage',
        rating: 4.8,
        groupSize: '15-20 people',
        highlights: ['Yamunotri', 'Gangotri', 'Kedarnath', 'Badrinath']
    },
    {
        id: '4',
        name: 'Tirupati Temple Tour',
        destination: 'Tirupati, Andhra Pradesh',
        description: 'Visit the sacred Tirumala Venkateswara Temple with VIP darshan arrangements',
        price: 8999,
        duration: '3 Days / 2 Nights',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600',
        category: 'Pilgrimage',
        rating: 4.7,
        groupSize: '12-18 people',
        highlights: ['VIP Darshan', 'Temple Tours', 'Local Sightseeing', 'Prasadam']
    },
    {
        id: '5',
        name: 'Amritsar Golden Temple',
        destination: 'Amritsar, Punjab',
        description: 'Experience the spiritual beauty of the Golden Temple and Sikh heritage',
        price: 9999,
        duration: '4 Days / 3 Nights',
        image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=600',
        category: 'Cultural',
        rating: 4.9,
        groupSize: '10-15 people',
        highlights: ['Golden Temple', 'Wagah Border', 'Jallianwala Bagh', 'Langar']
    },
    {
        id: '6',
        name: 'Himalayan Meditation Retreat',
        destination: 'Dharamshala, Himachal Pradesh',
        description: 'Find inner peace in the serene Himalayan mountains with guided meditation',
        price: 18999,
        duration: '10 Days / 9 Nights',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
        category: 'Retreat',
        rating: 5.0,
        groupSize: '6-10 people',
        highlights: ['Silent Meditation', 'Nature Walks', 'Tibetan Culture', 'Organic Food']
    },
];

const Travel = () => {
    const [tours, setTours] = useState<TourPackage[]>(mockTours);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const { toast } = useToast();

    const categories = ['all', ...Array.from(new Set(tours.map(t => t.category)))];

    const filteredTours = selectedCategory === 'all'
        ? tours
        : tours.filter(t => t.category === selectedCategory);

    const handleBookNow = (tour: TourPackage) => {
        toast({
            title: "Booking Initiated!",
            description: `We'll contact you shortly for ${tour.name} booking details.`,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-green-500/10 via-teal-500/10 to-background py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 mb-4 animate-fade-in">
                            <Plane className="h-4 w-4" />
                            <span className="text-sm font-medium">Spiritual Tourism</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-slide-up">
                            Tourist & Travel
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            Embark on transformative spiritual journeys to sacred destinations across India
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="text-center hover:shadow-lg transition-all hover:-translate-y-1">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-green-600 mb-1">{tours.length}</div>
                            <div className="text-sm text-muted-foreground">Tour Packages</div>
                        </CardContent>
                    </Card>
                    <Card className="text-center hover:shadow-lg transition-all hover:-translate-y-1">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-green-600 mb-1">15+</div>
                            <div className="text-sm text-muted-foreground">Destinations</div>
                        </CardContent>
                    </Card>
                    <Card className="text-center hover:shadow-lg transition-all hover:-translate-y-1">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-green-600 mb-1">500+</div>
                            <div className="text-sm text-muted-foreground">Happy Travelers</div>
                        </CardContent>
                    </Card>
                    <Card className="text-center hover:shadow-lg transition-all hover:-translate-y-1">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-green-600 mb-1">4.9</div>
                            <div className="text-sm text-muted-foreground">Avg Rating</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? 'default' : 'outline'}
                            onClick={() => setSelectedCategory(category)}
                            className="capitalize transition-all hover:scale-105"
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                {/* Tours Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTours.map((tour, index) => (
                        <Card
                            key={tour.id}
                            className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Tour Image */}
                            <div className="relative h-56 overflow-hidden bg-muted">
                                <img
                                    src={tour.image}
                                    alt={tour.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute top-4 right-4">
                                    <Badge className="bg-green-600">
                                        {tour.category}
                                    </Badge>
                                </div>
                                <button className="absolute top-4 left-4 p-2 rounded-full bg-white/90 hover:bg-white transition-colors">
                                    <Heart className="h-5 w-5 text-red-500" />
                                </button>
                            </div>

                            <CardHeader>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{tour.destination}</span>
                                </div>
                                <CardTitle className="text-xl group-hover:text-green-600 transition-colors">
                                    {tour.name}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {tour.description}
                                </p>

                                {/* Tour Details */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>{tour.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        <span>{tour.groupSize}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < Math.floor(tour.rating)
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-muted-foreground">{tour.rating}</span>
                                    </div>
                                </div>

                                {/* Highlights */}
                                <div className="flex flex-wrap gap-1">
                                    {tour.highlights.slice(0, 3).map((highlight, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                            {highlight}
                                        </Badge>
                                    ))}
                                </div>

                                {/* Price and Action */}
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Starting from</div>
                                        <div className="text-2xl font-bold text-green-600">₹{tour.price.toLocaleString()}</div>
                                    </div>
                                    <Button
                                        onClick={() => handleBookNow(tour)}
                                        className="bg-green-600 hover:bg-green-700 group-hover:scale-105 transition-all"
                                    >
                                        Book Now
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Why Choose Us */}
                <div className="mt-16">
                    <h2 className="text-3xl font-bold text-center mb-8">Why Travel With Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="text-center hover:shadow-lg transition-all hover:-translate-y-2">
                            <CardContent className="pt-8 pb-8">
                                <div className="inline-flex p-4 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                                    <Users className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Expert Guides</h3>
                                <p className="text-muted-foreground">
                                    Experienced spiritual guides with deep knowledge of sacred sites
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all hover:-translate-y-2">
                            <CardContent className="pt-8 pb-8">
                                <div className="inline-flex p-4 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                                    <Clock className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Flexible Schedules</h3>
                                <p className="text-muted-foreground">
                                    Customizable itineraries to match your spiritual journey
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all hover:-translate-y-2">
                            <CardContent className="pt-8 pb-8">
                                <div className="inline-flex p-4 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                                    <Heart className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Authentic Experience</h3>
                                <p className="text-muted-foreground">
                                    Genuine spiritual experiences with local communities
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
        </div>
    );
};

export default Travel;
