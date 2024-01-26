const sqlite3 = require('sqlite3').verbose();

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


// Function to preload data into the database
const preloadData = () => {
  // Insert Establishments
  const insertEstablishment = db.prepare(`INSERT INTO establishments (name, address, phone, cuisine_type) VALUES (?, ?, ?, ?)`);
  const establishments = [
    { name: "Green Bistro", address: "123 Elm St", phone: "123-456-7890", cuisine_type: "Vegetarian" },
    { name: "Sunrise Bakery", address: "456 Oak St", phone: "234-567-8901", cuisine_type: "Bakery" },
    { name: "Orchard Cafe", address: "789 Pine St", phone: "345-678-9012", cuisine_type: "Cafe" },
    { name: "Harvest Deli", address: "135 Maple St", phone: "456-789-0123", cuisine_type: "Deli" },
    { name: "AbooZaboo", address: "145 Abruzzi St", phone: "339-789-0123", cuisine_type: "Italian" },
    { name: "CarduPizza", address: "111 Piazza Carducci Sq", phone: "339-789-0246", cuisine_type: "international" },
    { name: "AliBABA", address: "95 Lontana St", phone: "339-958-0245", cuisine_type: "Sandwich" },
    { name: "Michelangelo", address: "11 Rosso St", phone: "339-854-0123", cuisine_type: "Store" }
  ];
  establishments.forEach(est => insertEstablishment.run(est.name, est.address, est.phone, est.cuisine_type));
  insertEstablishment.finalize();

  // Insert Bags (4 surprise, 4 regular)
  const insertBag = db.prepare(`INSERT INTO bags (type, size, price, establishment_id, available_time, reserved) VALUES (?, ?, ?, ?, ?, ?)`);
  const bags = [
    { type: "surprise", size: "small", price: 5.99, establishment_id: 1, available_time: "10 AM - 2 PM" },
    { type: "regular", size: "medium", price: 7.99, establishment_id: 2, available_time: "11 AM - 3 PM" },
    { type: "surprise", size: "medium", price: 7.99, establishment_id: 3, available_time: "11 AM - 3 PM" },
    { type: "surprise", size: "large", price: 9.99, establishment_id: 4, available_time: "10 AM - 2 PM" },
    { type: "regular", size: "small", price: 5.99, establishment_id: 5, available_time: "10 AM - 2 PM" },
    { type: "surprise", size: "medium", price: 8.99, establishment_id: 6, available_time: "9 AM - 5 PM" },
    { type: "regular", size: "large", price: 11.99, establishment_id: 7, available_time: "12 PM - 6 PM" },
    { type: "regular", size: "small", price: 6.99, establishment_id: 8, available_time: "8 AM - 4 PM" },
  ];
  bags.forEach(bag => insertBag.run(bag.type, bag.size, bag.price, bag.establishment_id, bag.available_time, 0));
  insertBag.finalize();

  // Insert Food Items
  const insertFoodItem = db.prepare(`INSERT INTO food_items (name, quantity) VALUES (?, ?)`);
  const foodItems = [
    { name: "Apple", quantity: 2 },
    { name: "Banana", quantity: 1 },
    { name: "Banana", quantity: 3 },
    { name: "Orange", quantity: 4 },
    { name: "Strawberries", quantity: 1 },
    { name: "Grapes", quantity: 5 },
    { name: "Mango", quantity: 2 },
    { name: "Peach", quantity: 3 },
    { name: "Watermelon", quantity: 1},
    { name: "Kiwi", quantity: 5 },
    { name: "Blueberries", quantity: 3 },
    { name: "Pineapple", quantity: 1 },
  ];
  foodItems.forEach(item => insertFoodItem.run(item.name, item.quantity));
  insertFoodItem.finalize();

  // Insert Bag_Food_Item Relations for Regular Bags
  const insertBagFoodItem = db.prepare(`INSERT INTO bag_food_item (bag_id, food_item_id) VALUES (?, ?)`);
  const bagFoodRelations = [
    { bag_id: 2, food_item_id: 1 },
    { bag_id: 2, food_item_id: 5 },
    { bag_id: 2, food_item_id: 9 },
    { bag_id: 5, food_item_id: 2 },
    { bag_id: 5, food_item_id: 6 },
    { bag_id: 5, food_item_id: 10 },
    { bag_id: 7, food_item_id: 3 },
    { bag_id: 7, food_item_id: 7 },
    { bag_id: 7, food_item_id: 11 },
    { bag_id: 8, food_item_id: 4 },
    { bag_id: 8, food_item_id: 8 },
    { bag_id: 8, food_item_id: 12 },
  ];
  bagFoodRelations.forEach(relation => insertBagFoodItem.run(relation.bag_id, relation.food_item_id));
  insertBagFoodItem.finalize();

  // Preload Users with Hashed Passwords
  const insertUser = db.prepare(`INSERT OR IGNORE INTO users (username, password, email) VALUES (?, ?, ?)`);
  const users = [
    { username: "user1", password: hashPassword("password1"), email: "user1@example.com" },
    { username: "user2", password: hashPassword("password2"), email: "user2@example.com" },
    { username: "user3", password: hashPassword("password3"), email: "user3@example.com" }
  ];
  users.forEach(user => insertUser.run(user.username, user.password, user.email));
  insertUser.finalize();

  db.run(`UPDATE bags SET reserved = 1 WHERE id IN (1, 2)`); // Assuming users have reserved these bags
};