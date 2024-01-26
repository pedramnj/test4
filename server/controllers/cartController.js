const db = require('../database');

// Add a bag to the user's cart
const addToCart = (req, res) => {
  const { userId, bagId } = req.body;

  // Check if the bag is already reserved
  const checkBagQuery = `SELECT reserved FROM bags WHERE id = ?`;
  db.get(checkBagQuery, [bagId], (err, bag) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Check if the bag is found in the database
    if (!bag) {
      res.status(404).json({ message: 'Bag not found.' });
      return;
    }

    // Check if the bag is already reserved
    if (bag.reserved) {
      res.status(400).json({ message: 'This bag is already reserved.' });
      return;
    }

    // Add to cart
    const addToCartQuery = `INSERT INTO carts (user_id, bag_id) VALUES (?, ?)`;
    db.run(addToCartQuery, [userId, bagId], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Bag added to cart successfully.' });
    });
  });
};

// Remove a bag from the user's cart
const removeFromCart = (req, res) => {
  const { userId, bagId } = req.body;

  const removeFromCartQuery = `DELETE FROM carts WHERE user_id = ? AND bag_id = ?`;
  db.run(removeFromCartQuery, [userId, bagId], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Bag removed from cart successfully.' });
  });
};

// Confirm reservation of the cart items

const confirmReservation = (req, res) => {
  const { userId } = req.body;

  db.serialize(() => {
    db.run('BEGIN TRANSACTION;');

    const getCartItemsQuery = `SELECT bag_id FROM carts WHERE user_id = ?`;
    db.all(getCartItemsQuery, [userId], (err, rows) => {
      if (err) {
        db.run('ROLLBACK;');
        res.status(500).json({ error: err.message });
        return;
      }

      rows.forEach(row => {
        const reserveBagQuery = `UPDATE bags SET reserved = 1 WHERE id = ?`;
        db.run(reserveBagQuery, [row.bag_id], (updateErr) => {
          if (updateErr) {
            db.run('ROLLBACK;');
            res.status(500).json({ error: updateErr.message });
            return;
          }

          const insertReservationQuery = `INSERT INTO reservations (user_id, bag_id) VALUES (?, ?)`;
          db.run(insertReservationQuery, [userId, row.bag_id], (insertErr) => {
            if (insertErr) {
              db.run('ROLLBACK;');
              res.status(500).json({ error: insertErr.message });
              return;
            }
          });
        });
      });

      const clearCartQuery = `DELETE FROM carts WHERE user_id = ?`;
      db.run(clearCartQuery, [userId], (clearErr) => {
        if (clearErr) {
          db.run('ROLLBACK;');
          res.status(500).json({ error: clearErr.message });
          return;
        }
        db.run('COMMIT;');
        res.json({ message: 'All items in the cart have been reserved successfully.' });
      });
    });
  });
};


// Get the user's cart items

const fetchCart = (req, res) => {
  const { userId } = req.params;

  const fetchCartQuery = `
    SELECT carts.bag_id, bags.type, bags.size, bags.price, bags.available_time,
           food_items.id as foodItemId, food_items.name, food_items.quantity
    FROM carts
    JOIN bags ON carts.bag_id = bags.id
    LEFT JOIN bag_food_item ON bags.id = bag_food_item.bag_id
    LEFT JOIN food_items ON bag_food_item.food_item_id = food_items.id
    WHERE carts.user_id = ?`;

  db.all(fetchCartQuery, [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Process rows to group food items under each bag
    let cartItems = {};
    rows.forEach(row => {
      if (!cartItems[row.bag_id]) {
        cartItems[row.bag_id] = {
          id: row.bag_id,
          type: row.type,
          size: row.size,
          price: row.price,
          availableTime: row.available_time,
          foodItems: []
        };
      }
      if (row.foodItemId) {
        cartItems[row.bag_id].foodItems.push({
          id: row.foodItemId,
          name: row.name,
          quantity: row.quantity
        });
      }
    });
    
    res.json({ cartItems: Object.values(cartItems) });
  });
};


const updateCartItemQuantity = (req, res) => {
  const { userId, bagId, itemId, newQuantity } = req.body;

  //  `itemId` refers to the `id` of a food item in the `food_items` table
  const updateItemQuery = `UPDATE food_items SET quantity = ? WHERE id = ?`;

  db.run(updateItemQuery, [newQuantity, itemId], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Item quantity updated successfully.' });
  });
};



const cancelReservation = (req, res) => {
  const { userId, bagId } = req.body;

  // Start a transaction
  db.serialize(() => {
    db.run('BEGIN TRANSACTION;');

    // Update the reserved status in the bags table
    const updateBagQuery = `UPDATE bags SET reserved = 0 WHERE id = ?`;
    db.run(updateBagQuery, [bagId], (err) => {
      if (err) {
        db.run('ROLLBACK;');
        res.status(500).json({ error: err.message });
        return;
      }

      // Delete the reservation record
      const deleteReservationQuery = `DELETE FROM reservations WHERE user_id = ? AND bag_id = ?`;
      db.run(deleteReservationQuery, [userId, bagId], (deleteErr) => {
        if (deleteErr) {
          db.run('ROLLBACK;');
          res.status(500).json({ error: deleteErr.message });
          return;
        }

        db.run('COMMIT;');
        res.json({ message: 'Reservation cancelled successfully.' });
      });
    });
  });
};


const fetchReservedBags = (req, res) => {
  const { userId } = req.params;

  // Adjusted query to join the reservations and bags tables
  const query = `
    SELECT bags.* FROM bags 
    INNER JOIN reservations ON bags.id = reservations.bag_id 
    WHERE reservations.user_id = ? AND bags.reserved = 1`;

  db.all(query, [userId], (err, bags) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ reservedBags: bags });
  });
};




module.exports = {
  cancelReservation,
  fetchReservedBags,
  fetchCart,
  addToCart,
  removeFromCart,
  confirmReservation,
  updateCartItemQuantity 

};