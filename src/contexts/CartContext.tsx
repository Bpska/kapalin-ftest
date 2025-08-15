import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Book {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  about: string;
  samplePages: string[];
}

export interface CartItem {
  book: Book;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; book: Book }
  | { type: 'REMOVE_FROM_CART'; bookId: string }
  | { type: 'UPDATE_QUANTITY'; bookId: string; quantity: number }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.book.id === action.book.id);
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.book.id === action.book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0)
        };
      } else {
        const updatedItems = [...state.items, { book: action.book, quantity: 1 }];
        return {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0)
        };
      }
    }
    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(item => item.book.id !== action.bookId);
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0)
      };
    }
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        const updatedItems = state.items.filter(item => item.book.id !== action.bookId);
        return {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0)
        };
      }
      const updatedItems = state.items.map(item =>
        item.book.id === action.bookId
          ? { ...item, quantity: action.quantity }
          : item
      );
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0)
      };
    }
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  const addToCart = (book: Book) => dispatch({ type: 'ADD_TO_CART', book });
  const removeFromCart = (bookId: string) => dispatch({ type: 'REMOVE_FROM_CART', bookId });
  const updateQuantity = (bookId: string, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', bookId, quantity });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider value={{ state, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};