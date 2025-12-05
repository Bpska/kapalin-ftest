import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Eye, Download, Package } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    items: number;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    date: string;
}

// Mock data - replace with real API calls later
const mockOrders: Order[] = [
    {
        id: '1',
        orderNumber: 'ORD-2024-001',
        customerName: 'Rahul Sharma',
        customerEmail: 'rahul@example.com',
        items: 2,
        total: 598,
        status: 'delivered',
        date: '2024-12-01'
    },
    {
        id: '2',
        orderNumber: 'ORD-2024-002',
        customerName: 'Priya Patel',
        customerEmail: 'priya@example.com',
        items: 1,
        total: 299,
        status: 'shipped',
        date: '2024-12-02'
    },
    {
        id: '3',
        orderNumber: 'ORD-2024-003',
        customerName: 'Amit Kumar',
        customerEmail: 'amit@example.com',
        items: 3,
        total: 897,
        status: 'processing',
        date: '2024-12-03'
    },
    {
        id: '4',
        orderNumber: 'ORD-2024-004',
        customerName: 'Sneha Reddy',
        customerEmail: 'sneha@example.com',
        items: 1,
        total: 299,
        status: 'pending',
        date: '2024-12-04'
    },
];

const OrdersManagement = () => {
    const [orders, setOrders] = useState<Order[]>(mockOrders);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        let filtered = orders;

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(
                (order) =>
                    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter((order) => order.status === statusFilter);
        }

        setFilteredOrders(filtered);
    }, [searchQuery, statusFilter, orders]);

    const getStatusBadge = (status: Order['status']) => {
        const variants: Record<Order['status'], { variant: any; label: string }> = {
            pending: { variant: 'secondary', label: 'Pending' },
            processing: { variant: 'default', label: 'Processing' },
            shipped: { variant: 'default', label: 'Shipped' },
            delivered: { variant: 'default', label: 'Delivered' },
            cancelled: { variant: 'destructive', label: 'Cancelled' },
        };

        const { variant, label } = variants[status];
        return <Badge variant={variant}>{label}</Badge>;
    };

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsDialogOpen(true);
    };

    const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
        toast.success('Order status updated successfully');
    };

    const handleExportOrders = () => {
        toast.success('Orders exported to CSV');
    };

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
                                    placeholder="Search by order number, customer name, or email..."
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
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order Number</TableHead>
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
                                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{order.customerName}</div>
                                            <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{order.items}</TableCell>
                                    <TableCell>₹{order.total}</TableCell>
                                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
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
                                    <label className="text-sm font-medium">Order Number</label>
                                    <p className="text-sm text-muted-foreground">{selectedOrder.orderNumber}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Date</label>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(selectedOrder.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Customer Name</label>
                                    <p className="text-sm text-muted-foreground">{selectedOrder.customerName}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <p className="text-sm text-muted-foreground">{selectedOrder.customerEmail}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Total Items</label>
                                    <p className="text-sm text-muted-foreground">{selectedOrder.items}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Total Amount</label>
                                    <p className="text-sm text-muted-foreground">₹{selectedOrder.total}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Update Status</label>
                                <Select
                                    value={selectedOrder.status}
                                    onValueChange={(value: Order['status']) =>
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
