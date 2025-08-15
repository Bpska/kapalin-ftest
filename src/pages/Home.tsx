import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import BookCard from '@/components/BookCard';
import ThemeToggle from '@/components/ThemeToggle';
import { booksData } from '@/data/books';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = booksData.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-4 mb-6">
        <div className="text-center flex-1">
          <h1 className="font-serif text-3xl font-bold text-sage-brown mb-2">
            Kapalin Gita Tales
          </h1>
          <p className="text-muted-foreground text-sm">
            Ancient wisdom for young minds
          </p>
        </div>
        <ThemeToggle />
      </div>

      {/* Search Bar */}
      <div className="relative mx-2">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search wisdom tales..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 bg-card/50 border-border shadow-soft rounded-2xl h-12 backdrop-blur-sm"
        />
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 gap-4 px-2">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No books found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Home;