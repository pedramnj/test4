const db = require('../database');
const bcrypt = require('bcrypt');

// Register a new user
const registerUser = (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const checkEmailQuery = `SELECT * FROM users WHERE email = ?`;
  db.get(checkEmailQuery, [email], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (row) {
      res.status(400).json({ error: "Email already in use." });
      return;
    }

    const insertQuery = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
    db.run(insertQuery, [username, hashedPassword, email], (insertErr) => {
      if (insertErr) {
        res.status(500).json({ error: insertErr.message });
        return;
      }
      res.json({ message: 'User successfully registered' });
    });
  });
};


// User login
const loginUser = (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM users WHERE username = ?`;
  db.get(query, [username], (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (user && bcrypt.compareSync(password, user.password)) {
      res.json({ message: 'Login successful', user });
    } else {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  });
};

module.exports = {
  registerUser,
  loginUser
};
