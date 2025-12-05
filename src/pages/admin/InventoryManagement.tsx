import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Package, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

interface InventoryItem {
    id: string;
    bookTitle: string;
    sku: string;
    stock: number;
    lowStockThreshold: number;
    price: number;
    status: 'in-stock' | 'low-stock' | 'out-of-stock';
}

// Mock data
const mockInventory: InventoryItem[] = [
    {
        id: '1',
        bookTitle: 'Bhagavad Gita - Ancient Wisdom for Young Minds',
        sku: 'BG-001',
        stock: 150,
        lowStockThreshold: 20,
        price: 299,
        status: 'in-stock'
    },
    {
        id: '2',
        bookTitle: 'Ramayana Tales for Children',
        sku: 'RM-001',
        stock: 15,
        lowStockThreshold: 20,
        price: 349,
        status: 'low-stock'
    },
    {
        id: '3',
        bookTitle: 'Mahabharata Stories',
        sku: 'MB-001',
        stock: 0,
        lowStockThreshold: 20,
        price: 399,
        status: 'out-of-stock'
    },
    {
        id: '4',
        bookTitle: 'Panchatantra Collection',
        sku: 'PT-001',
        stock: 85,
        lowStockThreshold: 20,
        price: 249,
        status: 'in-stock'
    },
];

const InventoryManagement = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editStock, setEditStock] = useState<number>(0);

    const handleUpdateStock = (id: string, newStock: number) => {
        setInventory((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    let status: InventoryItem['status'] = 'in-stock';
                    if (newStock === 0) status = 'out-of-stock';
                    else if (newStock <= item.lowStockThreshold) status = 'low-stock';

                    return { ...item, stock: newStock, status };
                }
                return item;
            })
        );
        setEditingId(null);
        toast.success('Stock updated successfully');
    };

    const getStatusBadge = (status: InventoryItem['status']) => {
        const variants: Record<InventoryItem['status'], { variant: any; label: string }> = {
            'in-stock': { variant: 'default', label: 'In Stock' },
            'low-stock': { variant: 'secondary', label: 'Low Stock' },
            'out-of-stock': { variant: 'destructive', label: 'Out of Stock' },
        };

        const { variant, label } = variants[status];
        return <Badge variant={variant}>{label}</Badge>;
    };

    const totalItems = inventory.length;
    const lowStockItems = inventory.filter((i) => i.status === 'low-stock').length;
    const outOfStockItems = inventory.filter((i) => i.status === 'out-of-stock').length;
    const totalValue = inventory.reduce((sum, item) => sum + (item.stock * item.price), 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Inventory Management</h1>
                    <p className="text-muted-foreground">Track and manage product stock levels</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalItems}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                        <TrendingDown className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{outOfStockItems}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalValue.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Inventory Table */}
            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Current Stock</TableHead>
                                <TableHead>Low Stock Alert</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventory.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.bookTitle}</TableCell>
                                    <TableCell>{item.sku}</TableCell>
                                    <TableCell>
                                        {editingId === item.id ? (
                                            <Input
                                                type="number"
                                                value={editStock}
                                                onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                                                className="w-20"
                                                autoFocus
                                            />
                                        ) : (
                                            item.stock
                                        )}
                                    </TableCell>
                                    <TableCell>{item.lowStockThreshold}</TableCell>
                                    <TableCell>₹{item.price}</TableCell>
                                    <TableCell>₹{(item.stock * item.price).toLocaleString()}</TableCell>
                                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                                    <TableCell>
                                        {editingId === item.id ? (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleUpdateStock(item.id, editStock)}
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setEditingId(null)}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setEditingId(item.id);
                                                    setEditStock(item.stock);
                                                }}
                                            >
                                                Update
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default InventoryManagement;
