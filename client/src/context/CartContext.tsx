import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { Product, CartItem, Wishlist } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  cartItems: CartItem[];
  wishlistItems: Product[];
  coupon: string;
  discountPercentage: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (code: string) => boolean;
  clearCart: () => void;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userInfo } = useAuth();
  
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist state
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [coupon, setCoupon] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync wishlist from backend on login
  useEffect(() => {
    if (userInfo) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [userInfo]);

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get<Wishlist>('/wishlist');
      setWishlistItems(data.products);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const toggleWishlist = async (productId: string): Promise<boolean> => {
    if (!userInfo) return false;
    try {
      const { data } = await api.post('/wishlist/toggle', { productId });
      setWishlistItems(data.wishlist.products);
      return data.isAdded;
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      return false;
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product._id === product._id);
      if (existing) {
        // Enforce stock limit
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prevItems.map((item) =>
          item.product._id === product._id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prevItems, { product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item
      )
    );
  };

  const applyCoupon = (code: string): boolean => {
    const formattedCode = code.trim().toUpperCase();
    if (formattedCode === 'SAVE10') {
      setCoupon('SAVE10');
      setDiscountPercentage(10);
      return true;
    } else if (formattedCode === 'NEXUS20') {
      setCoupon('NEXUS20');
      setDiscountPercentage(20);
      return true;
    }
    return false;
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon('');
    setDiscountPercentage(0);
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => {
    const activePrice = item.product.discountPrice && item.product.discountPrice > 0 
      ? item.product.discountPrice 
      : item.product.price;
    return acc + activePrice * item.quantity;
  }, 0);

  const discountAmount = (subtotal * discountPercentage) / 100;
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 150; // Free shipping above ₹5000
  const tax = (subtotal - discountAmount) * 0.18; // 18% GST
  const total = Math.max(subtotal - discountAmount + shipping + tax, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        coupon,
        discountPercentage,
        subtotal: Math.round(subtotal * 100) / 100,
        shipping: Math.round(shipping * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        total: Math.round(total * 100) / 100,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        applyCoupon,
        clearCart,
        fetchWishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
