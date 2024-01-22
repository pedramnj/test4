const db = require('../database');

const getAllEstablishments = async (req, res) => {
  const establishmentsQuery = `SELECT * FROM establishments`;
  const bagsQuery = `SELECT * FROM bags WHERE establishment_id = ?`;
  const foodItemsQuery = `
    SELECT fi.* 
    FROM food_items fi
    JOIN bag_food_item bfi ON fi.id = bfi.food_item_id
    WHERE bfi.bag_id = ?`;

  try {
    const establishments = await new Promise((resolve, reject) => {
      db.all(establishmentsQuery, [], (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    const establishmentsWithBags = await Promise.all(establishments.map(async (establishment) => {
      const bags = await new Promise((resolve, reject) => {
        db.all(bagsQuery, [establishment.id], (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });

      for (const bag of bags) {
        if (bag.type === 'regular') {
          bag.foodItems = await new Promise((resolve, reject) => {
            db.all(foodItemsQuery, [bag.id], (err, items) => {
              if (err) reject(err);
              else resolve(items);
            });
          });
        }
      }

      return { ...establishment, bags };
    }));

    res.json({ establishments: establishmentsWithBags });
  } catch (error) {
    console.error('Error in getAllEstablishments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getAllEstablishments
};
