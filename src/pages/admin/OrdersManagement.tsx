import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Eye, Download, Package, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Order {
    id: string;
    user_id: string;
    total_amount: number;
    currency: string;
    status: string;
    payment_status: string;
    created_at: string;
    customer_name?: string;
    customer_email?: string;
    items_count?: number;
}

interface OrderItem {
    id: string;
    book_title: string;
    book_price: number;
    quantity: number;
}

const OrdersManagement = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setIsLoading(true);
        try {
            // Fetch orders with profile data
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (ordersError) throw ordersError;

            // Fetch profiles for customer names
            const { data: profilesData } = await supabase
                .from('profiles')
                .select('id, name');

            // Fetch order items count
            const { data: itemsData } = await supabase
                .from('order_items')
                .select('order_id, quantity');

            // Map orders with customer info and items count
            const ordersWithInfo = (ordersData || []).map(order => {
                const profile = profilesData?.find(p => p.id === order.user_id);
                const orderItemsList = itemsData?.filter(i => i.order_id === order.id) || [];
                const itemsCount = orderItemsList.reduce((sum, i) => sum + i.quantity, 0);
                
                return {
                    ...order,
                    customer_name: profile?.name || 'Unknown',
                    items_count: itemsCount
                };
            });

            setOrders(ordersWithInfo);
            setFilteredOrders(ordersWithInfo);
        } catch (error) {
            console.error('Error loading orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let filtered = orders;

        if (searchQuery) {
            filtered = filtered.filter(
                (order) =>
                    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter((order) => order.status === statusFilter);
        }

        setFilteredOrders(filtered);
    }, [searchQuery, statusFilter, orders]);

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: any; label: string }> = {
            pending: { variant: 'secondary', label: 'Pending' },
            processing: { variant: 'default', label: 'Processing' },
            shipped: { variant: 'default', label: 'Shipped' },
            delivered: { variant: 'default', label: 'Delivered' },
            cancelled: { variant: 'destructive', label: 'Cancelled' },
        };

        const { variant, label } = variants[status] || { variant: 'secondary', label: status };
        return <Badge variant={variant}>{label}</Badge>;
    };

    const handleViewOrder = async (order: Order) => {
        setSelectedOrder(order);
        
        // Load order items
        const { data, error } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id);
        
        if (!error && data) {
            setOrderItems(data);
        }
        
        setIsDialogOpen(true);
    };

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;

            setOrders((prev) =>
                prev.map((order) =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
            
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
            
            toast.success('Order status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update order status');
        }
    };

    const handleExportOrders = () => {
        const csv = [
            ['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'],
            ...filteredOrders.map(o => [
                o.id,
                o.customer_name,
                o.items_count,
                `₹${o.total_amount}`,
                o.status,
                format(new Date(o.created_at), 'yyyy-MM-dd')
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
        toast.success('Orders exported to CSV');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Orders Management</h1>
                    <p className="text-muted-foreground">Manage and track all customer orders</p>
                </div>
                <Button onClick={handleExportOrders}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Orders
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orders.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {orders.filter((o) => o.status === 'pending').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Processing</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {orders.filter((o) => o.status === 'processing').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {orders.filter((o) => o.status === 'delivered').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by order ID or customer name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Orders Table */}
            <Card>
                <CardContent className="pt-6">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No orders found</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-mono text-xs">
                                            {order.id.slice(0, 8)}...
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{order.customer_name}</div>
                                        </TableCell>
                                        <TableCell>{order.items_count || 0}</TableCell>
                                        <TableCell>₹{order.total_amount}</TableCell>
                                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                                        <TableCell>
                                            {format(new Date(order.created_at), 'MMM dd, yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewOrder(order)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Order Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Order ID</label>
                                    <p className="text-sm text-muted-foreground font-mono">
                                        {selectedOrder.id}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Date</label>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(selectedOrder.created_at), 'PPpp')}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Customer Name</label>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedOrder.customer_name}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Payment Status</label>
                                    <p className="text-sm text-muted-foreground capitalize">
                                        {selectedOrder.payment_status}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Total Amount</label>
                                    <p className="text-lg font-bold text-primary">
                                        ₹{selectedOrder.total_amount}
                                    </p>
                                </div>
                            </div>

                            {/* Order Items */}
                            {orderItems.length > 0 && (
                                <div className="border-t pt-4">
                                    <label className="text-sm font-medium mb-2 block">Order Items</label>
                                    <div className="space-y-2">
                                        {orderItems.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center p-2 bg-muted rounded">
                                                <span>{item.book_title}</span>
                                                <span className="text-muted-foreground">
                                                    {item.quantity} × ₹{item.book_price}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="border-t pt-4">
                                <label className="text-sm font-medium">Update Status</label>
                                <Select
                                    value={selectedOrder.status}
                                    onValueChange={(value) =>
                                        handleUpdateStatus(selectedOrder.id, value)
                                    }
                                >
                                    <SelectTrigger className="mt-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default OrdersManagement;