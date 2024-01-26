const BASE_URL = 'http://localhost:3001'; 

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

    return response.json(); 
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

    return response.json(); 
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

    return response.json();
  } catch (error) {
    throw error;
  }
};



const fetchCartItems = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/cart/carts/${userId}`, {
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

const updateCartItemQuantity = async (userId, bagId, itemId, newQuantity) => {
  try {
    const response = await fetch(`${BASE_URL}/cart/update-item`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, bagId, itemId, newQuantity }),
    });

    if (!response.ok) {
      throw new Error('Failed to update cart item');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

const fetchReservedBags = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/cart/reserved/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reserved bags');
    }

    return await response.json(); 
  } catch (error) {
    throw error;
  }
};



const cancelReservation = async (userId, bagId) => {
  try {
    const response = await fetch(`${BASE_URL}/cart/cancel-reservation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, bagId }),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel reservation');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};




export { addToCart, removeFromCart, confirmReservation, fetchCartItems, updateCartItemQuantity, fetchReservedBags, cancelReservation };
