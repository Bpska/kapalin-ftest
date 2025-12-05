import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Eye, Users, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalOrders: number;
    totalSpent: number;
    joinDate: string;
    status: 'active' | 'inactive';
}

// Mock data
const mockCustomers: Customer[] = [
    {
        id: '1',
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        phone: '+91 98765 43210',
        totalOrders: 5,
        totalSpent: 1495,
        joinDate: '2024-01-15',
        status: 'active'
    },
    {
        id: '2',
        name: 'Priya Patel',
        email: 'priya@example.com',
        phone: '+91 98765 43211',
        totalOrders: 3,
        totalSpent: 897,
        joinDate: '2024-02-20',
        status: 'active'
    },
    {
        id: '3',
        name: 'Amit Kumar',
        email: 'amit@example.com',
        phone: '+91 98765 43212',
        totalOrders: 8,
        totalSpent: 2392,
        joinDate: '2024-01-10',
        status: 'active'
    },
    {
        id: '4',
        name: 'Sneha Reddy',
        email: 'sneha@example.com',
        phone: '+91 98765 43213',
        totalOrders: 1,
        totalSpent: 299,
        joinDate: '2024-11-30',
        status: 'active'
    },
    {
        id: '5',
        name: 'Vikram Singh',
        email: 'vikram@example.com',
        phone: '+91 98765 43214',
        totalOrders: 0,
        totalSpent: 0,
        joinDate: '2024-12-01',
        status: 'inactive'
    },
];

const CustomersManagement = () => {
    const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(mockCustomers);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        let filtered = customers;

        if (searchQuery) {
            filtered = filtered.filter(
                (customer) =>
                    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    customer.phone.includes(searchQuery)
            );
        }

        setFilteredCustomers(filtered);
    }, [searchQuery, customers]);

    const handleViewCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsDialogOpen(true);
    };

    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((c) => c.status === 'active').length;
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0) || 0;

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
                            placeholder="Search by name, email, or phone..."
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
                                        <div>
                                            <div className="font-medium">{customer.name}</div>
                                            <div className="text-sm text-muted-foreground">{customer.email}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{customer.phone}</TableCell>
                                    <TableCell>{customer.totalOrders}</TableCell>
                                    <TableCell>₹{customer.totalSpent}</TableCell>
                                    <TableCell>{new Date(customer.joinDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                                            {customer.status}
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
                                    <label className="text-sm font-medium">Email</label>
                                    <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Phone</label>
                                    <p className="text-sm text-muted-foreground">{selectedCustomer.phone}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <p className="text-sm text-muted-foreground capitalize">{selectedCustomer.status}</p>
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
                                        {new Date(selectedCustomer.joinDate).toLocaleDateString()}
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
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CustomersManagement;
