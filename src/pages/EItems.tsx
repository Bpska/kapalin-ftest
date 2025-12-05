import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Package, TrendingUp } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    rating: number;
    in_stock: boolean;
}

const EItems = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);
    const { addToCart } = useCart();
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('e_items')
                .select('*')
                .eq('in_stock', true)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase error:', error);
                // If table doesn't exist, show empty state
                setProducts([]);
            } else {
                setProducts(data || []);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const categories = products.length > 0
        ? ['all', ...Array.from(new Set(products.map(p => p.category)))]
        : ['all'];

    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(p => p.category === selectedCategory);

    const handleAddToCart = (product: Product) => {
        addToCart({
            id: product.id,
            title: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            about: product.description,
            samplePages: []
        });

        toast({
            title: "Added to cart!",
            description: `${product.name} has been added to your cart.`,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4 animate-fade-in">
                            <Package className="h-4 w-4" />
                            <span className="text-sm font-medium">Spiritual Products</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-slide-up">
                            E-Items Collection
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            Discover our curated collection of spiritual products, meditation tools, and sacred items
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="text-center hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-primary mb-1">{products.length}</div>
                            <div className="text-sm text-muted-foreground">Products</div>
                        </CardContent>
                    </Card>
                    <Card className="text-center hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-primary mb-1">4.8</div>
                            <div className="text-sm text-muted-foreground">Avg Rating</div>
                        </CardContent>
                    </Card>
                    <Card className="text-center hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-primary mb-1">100%</div>
                            <div className="text-sm text-muted-foreground">In Stock</div>
                        </CardContent>
                    </Card>
                    <Card className="text-center hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-primary mb-1">24h</div>
                            <div className="text-sm text-muted-foreground">Delivery</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Category Filter */}
                {categories.length > 1 && (
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
                )}

                {/* Products Grid */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <Package className="h-16 w-16 mx-auto text-muted-foreground animate-pulse mb-4" />
                        <p className="text-muted-foreground">Loading products...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Products Available</h3>
                            <p className="text-muted-foreground mb-4">Check back soon for new items!</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((product, index) => (
                            <Card
                                key={product.id}
                                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Product Image */}
                                <div className="relative h-64 overflow-hidden bg-muted">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    {product.in_stock && (
                                        <Badge className="absolute top-4 right-4 bg-green-600">
                                            In Stock
                                        </Badge>
                                    )}
                                </div>

                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <Badge variant="outline" className="mb-2">
                                                {product.category}
                                            </Badge>
                                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                                {product.name}
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {product.description}
                                    </p>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${i < Math.floor(product.rating)
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-muted-foreground">{product.rating}</span>
                                    </div>

                                    {/* Price and Action */}
                                    <div className="flex items-center justify-between pt-2">
                                        <div>
                                            <div className="text-2xl font-bold text-primary">₹{product.price}</div>
                                        </div>
                                        <Button
                                            onClick={() => handleAddToCart(product)}
                                            className="group-hover:bg-primary group-hover:scale-105 transition-all"
                                        >
                                            <ShoppingCart className="mr-2 h-4 w-4" />
                                            Add to Cart
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Call to Action */}
                <div className="mt-16">
                    <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
                        <CardContent className="p-12 text-center">
                            <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                            <h2 className="text-3xl font-bold text-foreground mb-4">
                                Need Help Choosing?
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                                Our spiritual advisors are here to help you find the perfect items for your practice
                            </p>
                            <Button size="lg" onClick={() => navigate('/cart')}>
                                View Cart
                            </Button>
                        </CardContent>
                    </Card>
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

export default EItems;
