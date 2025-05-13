const express = require('express');
const cors = require('cors');
const itemsRouter = require('./routes/items');
const customersRouter = require('./routes/customers');
const ordersRouter = require('./routes/orders');
const adminRouter = require('./routes/admin');

// Create Express app
const app = express();

// Enable CORS for all routes with specific options
app.use(cors({
  origin: 'http://localhost:3000', // Allow only the frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true // Allow credentials
}));

// Parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/items', itemsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Pizzeria API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`
  });
});

// Start server
const PORT = process.env.PORT || 5000;

// Improved error handling for server startup
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoint available at http://localhost:${PORT}/api/items`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port or kill the process using that port.`);
  } else {
    console.error('Failed to start server:', err);
  }
  process.exit(1);
}); 