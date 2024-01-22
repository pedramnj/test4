const db = require('../database');

// Get all available bags
const getAllBags = (req, res) => {
  const query = `SELECT * FROM bags WHERE reserved = 0`;
  db.all(query, [], (err, bags) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ bags });
  });
};

// Reserve a bag
const reserveBag = (req, res) => {
  const { bagId, userId } = req.body;
  
  // Check if the bag is already reserved
  db.get(`SELECT reserved FROM bags WHERE id = ?`, [bagId], (err, bag) => {
    if (err || !bag) {
      res.status(500).json({ error: err ? err.message : "Bag not found" });
      return;
    }

    if (bag.reserved) {
      res.status(400).json({ error: "This bag is already reserved" });
      return;
    }

    // Reserve the bag
    db.run(`UPDATE bags SET reserved = 1 WHERE id = ?`, [bagId], (updateErr) => {
      if (updateErr) {
        res.status(500).json({ error: updateErr.message });
        return;
      }
      res.json({ message: "Bag reserved successfully" });
    });
  });
};

module.exports = {
  getAllBags,
  reserveBag
};
