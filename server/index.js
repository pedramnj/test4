const express = require('express');
const cors = require('cors');
const db = require('./database'); 

// Import route handlers
const userRoutes = require('./routes/users');
const establishmentsRoutes = require('./routes/establishments');
const bagsRoutes = require('./routes/bags');
const cartRoutes = require('./routes/cart'); 
const app = express();



// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/users', userRoutes);
app.use('/establishments', establishmentsRoutes);
app.use('/bags', bagsRoutes);
app.use('/cart', cartRoutes); 
// Root route for basic server check
app.get('/', (req, res) => {
  res.send('Welcome to the Surplus Food Rescue API!');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
