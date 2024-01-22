const BASE_URL = 'http://localhost:3001'; // Replace with your actual backend URL

const addToCart = async (userId, bagId) => {
  try {
    const response = await fetch(`${BASE_URL}/cart/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, bagId }),
    });

    if (!response.ok) {
      throw new Error('Failed to add bag to cart');
    }

    return response.json(); // or handle the response as needed
  } catch (error) {
    throw error;
  }
};

const removeFromCart = async (userId, bagId) => {
  try {
    const response = await fetch(`${BASE_URL}/cart/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, bagId }),
    });

    if (!response.ok) {
      throw new Error('Failed to remove bag from cart');
    }

    return response.json(); // or handle the response as needed
  } catch (error) {
    throw error;
  }
};

const confirmReservation = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/cart/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to confirm reservation');
    }

    return response.json(); // or handle the response as needed
  } catch (error) {
    throw error;
  }
};
// In your cartService.js

const fetchCartItems = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/carts/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch cart items');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export { addToCart, removeFromCart, confirmReservation, fetchCartItems };
