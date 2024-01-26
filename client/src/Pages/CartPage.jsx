import React, { useState, useEffect } from 'react';
import { fetchCartItems, updateCartItemQuantity, removeFromCart, confirmReservation } from '../API/cartService';
import { useUser } from '../API/UserContext';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [originalCartItems, setOriginalCartItems] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = useUser();

  useEffect(() => {
    loadCartItems();
  }, [user.id]);

  const loadCartItems = async () => {
    const response = await fetchCartItems(user.id);
    setCartItems(response.cartItems);
    setOriginalCartItems(JSON.parse(JSON.stringify(response.cartItems))); // Deep copy for original state
  };

  const handleQuantityChange = (bagId, itemId, change) => {
    // Temporarily update the quantity in the frontend
    const updatedCartItems = cartItems.map(bag => {
      if (bag.id === bagId) {
        return {
          ...bag,
          foodItems: bag.foodItems.map(item => {
            if (item.id === itemId) {
              return { ...item, quantity: Math.max(item.quantity + change, 0) };
            }
            return item;
          })
        };
      }
      return bag;
    });
    setCartItems(updatedCartItems);
  };

  const handleResetQuantity = (bagId, itemId) => {
    // Reset to original quantity
    const originalBag = originalCartItems.find(bag => bag.id === bagId);
    const originalItem = originalBag?.foodItems.find(item => item.id === itemId);
    handleQuantityChange(bagId, itemId, originalItem?.quantity - cartItems.find(bag => bag.id === bagId).foodItems.find(item => item.id === itemId).quantity);
  };

  const handleRemoveBag = async (bagId) => {
    await removeFromCart(user.id, bagId);
    loadCartItems(); // Reload cart items to reflect changes
    showMessage('Bag removed from cart.');
  };

  const handleCheckout = async () => {
    await confirmReservation(user.id);
    loadCartItems(); // Reload to show updated cart
    showMessage('Reservation confirmed!');
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="container mt-4">
      <h2>Your Cart</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {cartItems.map(bag => (
        <div key={bag.id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{`${bag.type} Bag - ${bag.size} (Price: $${bag.price}, Available Time: ${bag.availableTime})`}</h5>
            {bag.type === 'regular' && bag.foodItems.map(item => (
              <div key={item.id} className="d-flex align-items-center mb-2">
                <span className="me-2">{`${item.name}: ${item.quantity}`}</span>
                <button className="btn btn-sm btn-secondary" onClick={() => handleQuantityChange(bag.id, item.id, -1)}>-</button>
                <button className="btn btn-sm btn-danger ms-1" onClick={() => handleResetQuantity(bag.id, item.id)}>Reset</button>
              </div>
            ))}
            <button className="btn btn-warning mt-2" onClick={() => handleRemoveBag(bag.id)}>Remove Bag</button>
          </div>
        </div>
      ))}
      <button className="btn btn-success mt-4" onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default CartPage;
