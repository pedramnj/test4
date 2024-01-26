import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCartItems } from '../API/cartService';
import { useUser } from '../API/UserContext'; 

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useUser(); // Use the user context to get the current user

  const loadCartItems = async () => {
    if (user && user.id) { // Check if user is logged in and has an id
      try {
        const items = await fetchCartItems(user.id); // Fetch cart items for the logged-in user
        setCartItems(items.cartItems || []);
      } catch (error) {
        //no error handeling!
      }
    } else {
      setCartItems([]); // Reset cart items if no user is logged in
    }
  };

  useEffect(() => {
    loadCartItems();
  }, [user]); // Dependency on user to re-fetch when the user logs in or out

  // Context value and provider
  return (
    <CartContext.Provider value={{ cartItems, loadCartItems }}>
      {children}
    </CartContext.Provider>
  );
};
