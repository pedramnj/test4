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

  // Start a transaction
  db.serialize(() => {
    db.run('BEGIN TRANSACTION;');

    const getCartItemsQuery = `SELECT bags.id AS bag_id, establishment_id FROM bags 
                               INNER JOIN carts ON bags.id = carts.bag_id 
                               WHERE carts.user_id = ? AND DATE(bags.available_time) = DATE('now')`;
    db.all(getCartItemsQuery, [userId], (err, rows) => {
      if (err) {
        db.run('ROLLBACK;');
        res.status(500).json({ error: err.message });
        return;
      }

      // Check if the user is reserving more than one bag from the same establishment
      const establishmentCount = rows.reduce((acc, row) => {
        acc[row.establishment_id] = (acc[row.establishment_id] || 0) + 1;
        return acc;
      }, {});

      if (Object.values(establishmentCount).some(count => count > 1)) {
        db.run('ROLLBACK;');
        res.status(400).json({ message: 'Cannot reserve more than one bag per establishment per day.' });
        return;
      }

      // Reserve each bag in the cart
      rows.forEach(row => {
        const reserveBagQuery = `UPDATE bags SET reserved = 1 WHERE id = ?`;
        db.run(reserveBagQuery, [row.bag_id], (updateErr) => {
          if (updateErr) {
            db.run('ROLLBACK;');
            res.status(500).json({ error: updateErr.message });
            return;
          }
        });
      });

      // Clear the cart after reservation
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
  const { userId } = req.params; // Assuming you're passing userId as a parameter

  const fetchCartQuery = `
    SELECT carts.bag_id, bags.type, bags.size, bags.price
    FROM carts
    JOIN bags ON carts.bag_id = bags.id
    WHERE carts.user_id = ?`;

  db.all(fetchCartQuery, [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ cartItems: rows });
  });
};

module.exports = {
  fetchCart,
  addToCart,
  removeFromCart,
  confirmReservation
};