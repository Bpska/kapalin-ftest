import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Package, TrendingDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { bookService } from '@/services/bookService';

interface Book {
    id: string;
    title: string;
    price: number;
    book_type: string | null;
    author?: string | null;
    category?: string | null;
    image_url?: string | null;
}

const InventoryManagement = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        setIsLoading(true);
        try {
            const data = await bookService.getAllBooks();
            setBooks(data || []);
        } catch (error) {
            console.error('Error loading books:', error);
            toast.error('Failed to load inventory');
        } finally {
            setIsLoading(false);
        }
    };

    const totalItems = books.length;
    const hardcoverBooks = books.filter(b => b.book_type === 'hardcover' || b.book_type === 'both').length;
    const ebookBooks = books.filter(b => b.book_type === 'ebook' || b.book_type === 'both').length;
    const totalValue = books.reduce((sum, book) => sum + book.price, 0);

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
                    <h1 className="text-3xl font-bold">Inventory Management</h1>
                    <p className="text-muted-foreground">View all books in your catalog</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Books</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalItems}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Hardcover</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{hardcoverBooks}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">E-Books</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{ebookBooks}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Catalog Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalValue.toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Inventory Table */}
            <Card>
                <CardContent className="pt-6">
                    {books.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No books in inventory</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Add books from the Books Management page
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Book</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {books.map((book) => (
                                    <TableRow key={book.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {book.image_url && (
                                                    <img 
                                                        src={book.image_url} 
                                                        alt={book.title}
                                                        className="w-10 h-14 object-cover rounded"
                                                    />
                                                )}
                                                <span className="font-medium">{book.title}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{book.author || 'N/A'}</TableCell>
                                        <TableCell>{book.category || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">
                                                {book.book_type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-semibold">₹{book.price}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default InventoryManagement;