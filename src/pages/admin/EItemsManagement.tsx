import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Upload, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    rating: number;
    in_stock: boolean;
    created_at?: string;
}

const EItemsManagement = () => {
    const [items, setItems] = useState<EItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingItem, setEditingItem] = useState<EItem | null>(null);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        image: '',
        category: '',
        rating: 5,
        in_stock: true,
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const { data, error } = await supabase
                .from('e_items')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setItems(data || []);
        } catch (error) {
            console.error('Error fetching items:', error);
            toast({
                title: 'Error',
                description: 'Failed to load items',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isEditing && editingItem) {
                // Update existing item
                const { error } = await supabase
                    .from('e_items')
                    .update(formData)
                    .eq('id', editingItem.id);

                if (error) throw error;

                toast({
                    title: 'Success',
                    description: 'Item updated successfully',
                });
            } else {
                // Create new item
                const { error } = await supabase
                    .from('e_items')
                    .insert([formData]);

                if (error) throw error;

                toast({
                    title: 'Success',
                    description: 'Item added successfully',
                });
            }

            resetForm();
            fetchItems();
        } catch (error) {
            console.error('Error saving item:', error);
            toast({
                title: 'Error',
                description: 'Failed to save item',
                variant: 'destructive',
            });
        }
    };

    const handleEdit = (item: EItem) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image,
            category: item.category,
            rating: item.rating,
            in_stock: item.in_stock,
        });
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const { error } = await supabase
                .from('e_items')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast({
                title: 'Success',
                description: 'Item deleted successfully',
            });

            fetchItems();
        } catch (error) {
            console.error('Error deleting item:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete item',
                variant: 'destructive',
            });
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: 0,
            image: '',
            category: '',
            rating: 5,
            in_stock: true,
        });
        setIsEditing(false);
        setEditingItem(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">E-Items Management</h2>
                <div className="text-sm text-muted-foreground">
                    Total Items: {items.length}
                </div>
            </div>

            {/* Add/Edit Form */}
            <Card>
                <CardHeader>
                    <CardTitle>{isEditing ? 'Edit Item' : 'Add New Item'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Item Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                    id="category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Price (₹)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="rating">Rating (1-5)</Label>
                                <Input
                                    id="rating"
                                    type="number"
                                    min="1"
                                    max="5"
                                    step="0.1"
                                    value={formData.rating}
                                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                                    required
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="image">Image URL</Label>
                                <Input
                                    id="image"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    required
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="in_stock"
                                    checked={formData.in_stock}
                                    onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="in_stock">In Stock</Label>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit">
                                {isEditing ? 'Update Item' : 'Add Item'}
                            </Button>
                            {isEditing && (
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Items List */}
            <div className="grid gap-4">
                {isLoading ? (
                    <div className="text-center py-12">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground animate-pulse" />
                        <p className="text-muted-foreground mt-4">Loading items...</p>
                    </div>
                ) : items.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Items Yet</h3>
                            <p className="text-muted-foreground">Add your first item to get started</p>
                        </CardContent>
                    </Card>
                ) : (
                    items.map((item) => (
                        <Card key={item.id}>
                            <CardContent className="p-6">
                                <div className="flex gap-4">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold">{item.name}</h3>
                                                <p className="text-sm text-muted-foreground">{item.category}</p>
                                                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 mt-3">
                                            <span className="text-lg font-bold text-primary">₹{item.price}</span>
                                            <span className="text-sm">Rating: {item.rating}/5</span>
                                            <span className={`text-sm px-2 py-1 rounded ${item.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {item.in_stock ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default EItemsManagement;
