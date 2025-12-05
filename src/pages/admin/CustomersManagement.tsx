import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Eye, Users, TrendingUp, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Customer {
    id: string;
    name: string;
    phone?: string;
    created_at: string;
    totalOrders: number;
    totalSpent: number;
}

const CustomersManagement = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        setIsLoading(true);
        try {
            // Fetch profiles
            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (profilesError) throw profilesError;

            // Fetch orders for aggregation
            const { data: ordersData } = await supabase
                .from('orders')
                .select('user_id, total_amount');

            // Map customers with order stats
            const customersWithStats = (profilesData || []).map(profile => {
                const userOrders = ordersData?.filter(o => o.user_id === profile.id) || [];
                const totalOrders = userOrders.length;
                const totalSpent = userOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

                return {
                    id: profile.id,
                    name: profile.name || 'Unnamed',
                    phone: profile.phone,
                    created_at: profile.created_at,
                    totalOrders,
                    totalSpent
                };
            });

            setCustomers(customersWithStats);
            setFilteredCustomers(customersWithStats);
        } catch (error) {
            console.error('Error loading customers:', error);
            toast.error('Failed to load customers');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let filtered = customers;

        if (searchQuery) {
            filtered = filtered.filter(
                (customer) =>
                    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    customer.phone?.includes(searchQuery)
            );
        }

        setFilteredCustomers(filtered);
    }, [searchQuery, customers]);

    const handleViewCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsDialogOpen(true);
    };

    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((c) => c.totalOrders > 0).length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

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
                    <h1 className="text-3xl font-bold">Customers Management</h1>
                    <p className="text-muted-foreground">View and manage customer information</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCustomers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeCustomers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{avgOrderValue.toFixed(0)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Customers Table */}
            <Card>
                <CardContent className="pt-6">
                    {filteredCustomers.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No customers found</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Total Orders</TableHead>
                                    <TableHead>Total Spent</TableHead>
                                    <TableHead>Join Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCustomers.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell>
                                            <div className="font-medium">{customer.name}</div>
                                        </TableCell>
                                        <TableCell>{customer.phone || 'N/A'}</TableCell>
                                        <TableCell>{customer.totalOrders}</TableCell>
                                        <TableCell>₹{customer.totalSpent}</TableCell>
                                        <TableCell>
                                            {customer.created_at 
                                                ? format(new Date(customer.created_at), 'MMM dd, yyyy')
                                                : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={customer.totalOrders > 0 ? 'default' : 'secondary'}>
                                                {customer.totalOrders > 0 ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewCustomer(customer)}
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

            {/* Customer Details Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Customer Details</DialogTitle>
                    </DialogHeader>
                    {selectedCustomer && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Name</label>
                                    <p className="text-sm text-muted-foreground">{selectedCustomer.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Phone</label>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedCustomer.phone || 'Not provided'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <p className="text-sm text-muted-foreground capitalize">
                                        {selectedCustomer.totalOrders > 0 ? 'Active' : 'Inactive'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Total Orders</label>
                                    <p className="text-sm text-muted-foreground">{selectedCustomer.totalOrders}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Total Spent</label>
                                    <p className="text-sm text-muted-foreground">₹{selectedCustomer.totalSpent}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Join Date</label>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedCustomer.created_at
                                            ? format(new Date(selectedCustomer.created_at), 'PPP')
                                            : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Average Order Value</label>
                                    <p className="text-sm text-muted-foreground">
                                        ₹{selectedCustomer.totalOrders > 0
                                            ? (selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(0)
                                            : 0}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Customer ID</label>
                                    <p className="text-xs text-muted-foreground font-mono">
                                        {selectedCustomer.id}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CustomersManagement;