import React, { useState } from 'react';
import { addToCart } from '../API/cartService';

const CartButton = ({ userId, bagId }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [error, setError] = useState('');

  const handleAddToCart = async () => {
    try {
      await addToCart(userId, bagId);
      setIsAdded(true);
      setError('');
      // Resetting after 3 seconds
      setTimeout(() => setIsAdded(false), 3000);
    } catch (error) {
      console.error('Failed to add bag to cart:', error);
      setError('Failed to add bag to cart');
    }
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={handleAddToCart} disabled={isAdded}>
        {isAdded ? 'Added to Cart' : 'Add to Cart'}
      </button>
      {error && <div className="text-danger mt-2">{error}</div>}
    </div>
  );
};

export default CartButton;
