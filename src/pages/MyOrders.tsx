import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ChevronLeft, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SupabaseUserService, Order, OrderItem } from '@/lib/supabaseUserService';
import { format } from 'date-fns';

interface OrderWithItems extends Order {
    items?: OrderItem[];
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
            
            // Fetch items for each order
            const ordersWithItems = await Promise.all(
                userOrders.map(async (order) => {
                    const items = await SupabaseUserService.getOrderItems(order.id);
                    return { ...order, items };
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
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
            delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="container-mobile py-4 sm:py-6 space-y-4 sm:space-y-6">
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
                    <CardContent>
                        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                        <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
                        <Button onClick={() => navigate('/old-home')}>
                            Browse Books
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Card key={order.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(order.created_at), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                    <Badge className={getStatusColor(order.status)}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Total Amount</span>
                                        <span className="font-bold text-lg">₹{order.total_amount}</span>
                                    </div>

                                    {order.items && order.items.length > 0 && (
                                        <div className="border-t pt-3">
                                            <p className="text-sm font-medium mb-2">Items ({order.items.length})</p>
                                            {order.items.slice(0, 2).map((item) => (
                                                <div key={item.id} className="text-sm text-muted-foreground">
                                                    • {item.book_title} (x{item.quantity})
                                                </div>
                                            ))}
                                            {order.items.length > 2 && (
                                                <p className="text-sm text-muted-foreground">
                                                    +{order.items.length - 2} more items
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <Button
                                        variant="outline"
                                        className="w-full mt-4"
                                        onClick={() => navigate(`/orders/${order.id}`)}
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                    </Button>
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