import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/db';
import type { Product, Variant, Order } from '../services/db';

export type ViewType = 'home' | 'cart' | 'checkout' | 'admin';

export interface CartItem {
  product: Product;
  variant: Variant;
  quantity: number;
}

interface AppContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  cart: CartItem[];
  addToCart: (product: Product, variant: Variant, quantity?: number) => void;
  removeFromCart: (variantId: string) => void;
  updateCartQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  products: Product[];
  refreshProducts: () => void;
  orders: Order[];
  refreshOrders: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load initial products and orders
  useEffect(() => {
    setProducts(db.getProducts());
    setOrders(db.getOrders());
  }, []);

  const refreshProducts = () => {
    setProducts(db.getProducts());
  };

  const refreshOrders = () => {
    setOrders(db.getOrders());
  };

  const addToCart = (product: Product, variant: Variant, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((item) => item.variant.id === variant.id);
      
      if (existingItemIndex > -1) {
        // Increment quantity of existing item
        const newCart = [...prevCart];
        const newQty = newCart[existingItemIndex].quantity + quantity;
        
        // Ensure we don't exceed stock limit
        if (newQty <= variant.stock) {
          newCart[existingItemIndex].quantity = newQty;
        } else {
          alert(`Cannot add more. Only ${variant.stock} items available in stock.`);
        }
        return newCart;
      } else {
        // Add new item
        if (variant.stock >= quantity) {
          return [...prevCart, { product, variant, quantity }];
        } else {
          alert(`Cannot add. Item is out of stock.`);
          return prevCart;
        }
      }
    });
  };

  const removeFromCart = (variantId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.variant.id !== variantId));
  };

  const updateCartQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.variant.id === variantId) {
          // Check stock
          if (quantity <= item.variant.stock) {
            return { ...item, quantity };
          } else {
            alert(`Only ${item.variant.stock} items available in stock.`);
          }
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        products,
        refreshProducts,
        orders,
        refreshOrders,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
