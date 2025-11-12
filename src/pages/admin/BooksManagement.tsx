import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { bookService } from '@/services/bookService';
import { adminService, BookForm } from '@/services/adminService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const BooksManagement = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<BookForm>({
    title: '',
    description: '',
    price: 0,
    currency: 'INR',
    author: '',
    pages: 0,
    language: 'English',
    category: '',
    content_preview: '',
    book_type: 'hardcover',
    image_url: '',
  });

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (error) {
      toast.error('Failed to load books');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.image_url;
      
      if (imageFile) {
        const fileName = `${Date.now()}_${imageFile.name}`;
        imageUrl = await adminService.uploadFile('book-covers', fileName, imageFile);
      }

      const bookData = { ...formData, image_url: imageUrl };

      if (editingBook) {
        await adminService.updateBook(editingBook.id, bookData);
        toast.success('Book updated successfully');
      } else {
        await adminService.createBook(bookData);
        toast.success('Book created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      loadBooks();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save book');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
      await adminService.deleteBook(id);
      toast.success('Book deleted successfully');
      loadBooks();
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  const handleEdit = (book: any) => {
    setEditingBook(book);
    setFormData(book);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      currency: 'INR',
      author: '',
      pages: 0,
      language: 'English',
      category: '',
      content_preview: '',
      book_type: 'hardcover',
      image_url: '',
    });
    setEditingBook(null);
    setImageFile(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Books Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Book
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price *</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                
                <div>
                  <Label>Book Type *</Label>
                  <Select value={formData.book_type} onValueChange={(value: any) => setFormData({ ...formData, book_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hardcover">Hardcover</SelectItem>
                      <SelectItem value="ebook">E-Book</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Author</Label>
                  <Input
                    value={formData.author || ''}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Pages</Label>
                  <Input
                    type="number"
                    value={formData.pages || ''}
                    onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Language</Label>
                  <Input
                    value={formData.language || ''}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Category</Label>
                  <Input
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Cover Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingBook ? 'Update' : 'Create'} Book
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <Card key={book.id}>
            <CardHeader>
              {book.image_url && (
                <img src={book.image_url} alt={book.title} className="w-full h-48 object-cover rounded-lg mb-4" />
              )}
              <CardTitle className="text-lg">{book.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground line-clamp-2">{book.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary">₹{book.price}</span>
                <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                  {book.book_type}
                </span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(book)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(book.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BooksManagement;
