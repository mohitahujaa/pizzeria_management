const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        o.order_id,
        o.created_at,
        o.cust_id,
        c.cust_firstname,
        c.cust_lastname,
        o.item_id,
        i.item_name,
        i.item_size,
        o.quantity
      FROM orders o
      JOIN customers c ON o.cust_id = c.cust_id
      JOIN item i ON o.item_id = i.item_id
      ORDER BY o.created_at DESC
      LIMIT 50
    `);

    // Group orders by order_id
    const groupedOrders = rows.reduce((acc, order) => {
      if (!acc[order.order_id]) {
        acc[order.order_id] = {
          order_id: order.order_id,
          created_at: order.created_at,
          customer: {
            id: order.cust_id,
            name: `${order.cust_firstname} ${order.cust_lastname}`
          },
          items: []
        };
      }

      acc[order.order_id].items.push({
        item_id: order.item_id,
        name: order.item_name,
        size: order.item_size,
        quantity: order.quantity
      });

      return acc;
    }, {});

    res.json(Object.values(groupedOrders));
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({
      error: 'Failed to fetch orders',
      details: error.message
    });
  }
});

// POST /api/admin/update-inventory
router.post('/update-inventory', async (req, res) => {
  const { order_id } = req.body;
  
  if (!order_id) {
    return res.status(400).json({ error: 'order_id is required' });
  }

  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    // 1. Get all items in the order
    const [orderItems] = await connection.query(`
      SELECT o.item_id, o.quantity, i.sku
      FROM orders o
      JOIN item i ON o.item_id = i.item_id
      WHERE o.order_id = ?
    `, [order_id]);

    if (orderItems.length === 0) {
      throw new Error('Order not found or has no items');
    }

    // 2. For each item, get its recipe and update inventory
    for (const orderItem of orderItems) {
      // Get recipe ingredients for this item
      const [recipeIngredients] = await connection.query(`
        SELECT r.ing_id, r.quantity * ? as total_quantity_needed
        FROM recipe r
        WHERE r.recipe_id = ?
      `, [orderItem.quantity, orderItem.sku]);

      // Check and update inventory for each ingredient
      for (const ingredient of recipeIngredients) {
        // Check current inventory level
        const [inventoryRows] = await connection.query(`
          SELECT quantity 
          FROM inventory 
          WHERE item_id = ?
        `, [ingredient.ing_id]);

        if (inventoryRows.length === 0) {
          throw new Error(`Ingredient ${ingredient.ing_id} not found in inventory`);
        }

        const currentStock = inventoryRows[0].quantity;
        const newStock = currentStock - ingredient.total_quantity_needed;

        if (newStock < 0) {
          throw new Error(`Insufficient stock for ingredient ${ingredient.ing_id}. Required: ${ingredient.total_quantity_needed}, Available: ${currentStock}`);
        }

        // Update inventory
        await connection.query(`
          UPDATE inventory
          SET quantity = ?
          WHERE item_id = ?
        `, [newStock, ingredient.ing_id]);
      }
    }

    await connection.commit();
    res.json({ 
      success: true, 
      message: 'Inventory updated successfully',
      order_id: order_id
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error updating inventory:', error);
    res.status(500).json({
      error: 'Failed to update inventory',
      details: error.message
    });
  } finally {
    connection.release();
  }
});

// GET /api/admin/inventory
router.get('/inventory', async (req, res) => {
  try {
    console.log('Fetching inventory data...');
    
    // First, verify the connection
    await db.query('SELECT 1');
    console.log('Database connection verified');

    // Then try to fetch inventory data
    const [rows] = await db.query(`
      SELECT 
        i.ing_id,
        ing.ing_name as name,
        i.quantity
      FROM inventory i
      JOIN ingredient ing ON i.ing_id = ing.ing_id
      ORDER BY ing.ing_name
    `);

    console.log('Inventory data fetched:', rows);

    if (!rows || rows.length === 0) {
      console.log('No inventory data found');
      return res.json([]);
    }

    res.json(rows);
  } catch (error) {
    console.error('Detailed error in /inventory:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    res.status(500).json({
      error: 'Failed to fetch inventory',
      details: error.message,
      code: error.code
    });
  }
});

module.exports = router; 