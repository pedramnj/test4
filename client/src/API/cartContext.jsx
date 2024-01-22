import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchCartItems } from './cartService'; // Ensure this function is implemented

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to load cart items from the backend
  const loadCartItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetchCartItems();
      setCartItems(response.cartItems || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCartItems();
  }, []);

  // Provide functions to manipulate cart items if needed
  // Example: addToCart, removeFromCart

  return (
    <CartContext.Provider value={{ cartItems, isLoading, error, loadCartItems }}>
      {children}
    </CartContext.Provider>
  );
};
