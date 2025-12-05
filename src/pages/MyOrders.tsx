import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ChevronLeft, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SupabaseUserService, Order, OrderItem } from '@/lib/supabaseUserService';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface BookInfo {
    id: string;
    title: string;
    image_url: string | null;
}

interface OrderItemWithImage extends OrderItem {
    book_image?: string | null;
}

interface OrderWithItems extends Order {
    items?: OrderItemWithImage[];
}

const MyOrders = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [orders, setOrders] = useState<OrderWithItems[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadOrders();
        }
    }, [user]);

    const loadOrders = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const userOrders = await SupabaseUserService.getUserOrders(user.id);
            
            // Fetch all books for images
            const { data: booksData } = await supabase
                .from('books')
                .select('id, title, image_url');
            
            const booksMap = new Map<string, BookInfo>();
            booksData?.forEach(book => booksMap.set(book.id, book));
            
            // Fetch items for each order with book images
            const ordersWithItems = await Promise.all(
                userOrders.map(async (order) => {
                    const items = await SupabaseUserService.getOrderItems(order.id);
                    const itemsWithImages = items.map(item => ({
                        ...item,
                        book_image: booksMap.get(item.book_id)?.image_url || null
                    }));
                    return { ...order, items: itemsWithImages };
                })
            );
            
            setOrders(ordersWithItems);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
            processing: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
            shipped: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
            delivered: 'bg-green-500/20 text-green-500 border-green-500/30',
            cancelled: 'bg-red-500/20 text-red-500 border-red-500/30',
        };
        return colors[status] || 'bg-muted text-muted-foreground';
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            pending: 'Order Placed',
            processing: 'Processing',
            shipped: 'Shipped',
            delivered: 'Delivered',
            cancelled: 'Cancelled',
        };
        return labels[status] || status;
    };

    return (
        <div className="container-mobile py-4 sm:py-6 space-y-4 sm:space-y-6 pb-24">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/profile')}
                    className="touch-manipulation"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">My Orders</h1>
            </div>

            {/* Orders List */}
            {isLoading ? (
                <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground animate-pulse" />
                    <p className="text-muted-foreground mt-4">Loading orders...</p>
                </div>
            ) : orders.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent className="pt-6">
                        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                        <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
                        <Button onClick={() => navigate('/ebook')} className="bg-primary">
                            Browse Books
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Card key={order.id} className="overflow-hidden border-border/50 hover:border-primary/30 transition-all">
                            {/* Order Header */}
                            <div className="bg-muted/30 px-4 py-3 flex items-center justify-between border-b border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Package className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {format(new Date(order.created_at), 'dd MMM yyyy, hh:mm a')}
                                        </p>
                                    </div>
                                </div>
                                <Badge className={`${getStatusColor(order.status)} border`}>
                                    {getStatusLabel(order.status)}
                                </Badge>
                            </div>

                            <CardContent className="p-4">
                                {/* Order Items with Images */}
                                {order.items && order.items.length > 0 && (
                                    <div className="space-y-3">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4">
                                                {/* Product Image */}
                                                <div className="w-16 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border/50">
                                                    {item.book_image ? (
                                                        <img
                                                            src={item.book_image}
                                                            alt={item.book_title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                                                            <Package className="h-6 w-6 text-primary/50" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-sm line-clamp-2">{item.book_title}</h4>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Qty: {item.quantity}
                                                    </p>
                                                    <p className="text-sm font-semibold text-primary mt-1">
                                                        ₹{item.book_price * item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Order Total */}
                                <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Total Amount</p>
                                        <p className="text-lg font-bold text-primary">₹{order.total_amount}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground">Payment</p>
                                        <p className="text-sm font-medium capitalize">
                                            {order.payment_status === 'pending' ? 'Cash on Delivery' : order.payment_status}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
