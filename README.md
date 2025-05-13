# Pizzeria Management System

A full-stack web application for managing a pizzeria's operations including orders, inventory, and customer management.

## Project Structure

```
pizzeria-proj/
├── backend/                  # Backend server
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   │   └── database.js  # Database connection setup
│   │   ├── controllers/     # Request handlers
│   │   │   └── orderController.js
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   │   └── orders.js
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   │   └── orderUtils.js
│   │   └── server.js       # Main server file
│   ├── database/
│   │   ├── migrations/     # Database migrations
│   │   └── seeds/         # Seed data
│   └── package.json
├── src/                    # Frontend React application
│   ├── components/        # React components
│   ├── context/          # React context
│   ├── App.js
│   └── index.js
├── public/               # Static files
└── package.json
```

## Setup Instructions

1. Database Setup
   ```bash
   cd backend/database/migrations
   # Run SQL files in order to set up database schema
   ```

2. Backend Setup
   ```bash
   cd backend
   npm install
   npm run dev  # Starts server in development mode
   ```

3. Frontend Setup
   ```bash
   npm install
   npm start
   ```

## API Endpoints

### Orders
- `POST /api/orders` - Create new order
  - Handles inventory updates
  - Validates customer and address
  - Generates unique order ID

### Inventory
- `POST /api/admin/update-inventory` - Update inventory levels
- `GET /api/admin/inventory` - Get current inventory status

### Customers
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create new customer

## Database Schema

The system uses MySQL with the following main tables:
- `customers` - Customer information
- `orders` - Order details
- `inventory` - Stock levels
- `items` - Menu items
- `recipe` - Item ingredients
- `ingredient` - Ingredient details

## Features

1. Order Management
   - Create and track orders
   - Automatic inventory updates
   - Order history

2. Inventory Control
   - Real-time stock tracking
   - Low stock alerts
   - Automatic updates on orders

3. Customer Management
   - Customer profiles
   - Order history
   - Address management

## Development

- Backend: Node.js with Express
- Frontend: React
- Database: MySQL
- API: RESTful architecture
- Security: CORS enabled, input validation 