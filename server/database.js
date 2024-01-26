const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const saltRounds = 10; // Recommended salt rounds for bcrypt

// Connect to SQLite database
const db = new sqlite3.Database('./surplus_food_rescue.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    console.log('Connected to the SQLite database!! AMAZING');
    initDb();
  }
});

// Function to initialize the database tables
const initDb = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS establishments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        phone TEXT NOT NULL,
        cuisine_type TEXT
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS bags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        size TEXT NOT NULL,
        price REAL NOT NULL,
        establishment_id INTEGER NOT NULL,
        available_time TEXT NOT NULL,
        reserved BOOLEAN NOT NULL DEFAULT 0,
        FOREIGN KEY(establishment_id) REFERENCES establishments(id)
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS food_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL
      );
    `);

    db.run(`
    CREATE TABLE IF NOT EXISTS carts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      bag_id INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(bag_id) REFERENCES bags(id)
    );
  `);

    db.run(`
      CREATE TABLE IF NOT EXISTS bag_food_item (
        bag_id INTEGER NOT NULL,
        food_item_id INTEGER NOT NULL,
        FOREIGN KEY(bag_id) REFERENCES bags(id),
        FOREIGN KEY(food_item_id) REFERENCES food_items(id)
      );
    `)

    db.run(`
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      bag_id INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(bag_id) REFERENCES bags(id)
    );
    
  `)
  });
};

// Function to hash passwords
const hashPassword = (password) => {
  return bcrypt.hashSync(password, saltRounds);
};



module.exports = db;
