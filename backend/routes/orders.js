const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Helper function to generate order ID
function generateOrderId() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD${timestamp}${random}`;
}

// Helper function to update inventory based on recipe
async function updateInventoryForOrder(connection, itemId, orderQuantity) {
  console.log(`Attempting to update inventory for item ${itemId} with quantity ${orderQuantity}`);

  // Get the item's SKU (recipe_id) and category
  const [itemRows] = await connection.query(`
    SELECT sku, item_name, item_cat 
    FROM item 
    WHERE item_id = ?
  `, [itemId]);

  if (itemRows.length === 0) {
    throw new Error(`Item not found with ID: ${itemId}`);
  }

  const recipeId = itemRows[0].sku;
  const itemCategory = itemRows[0].item_cat;
  console.log(`Found SKU ${recipeId} for item ${itemRows[0].item_name} (Category: ${itemCategory})`);

  // For beverages and desserts, check direct inventory using exact category names
  if (itemCategory === 'Beverage' || itemCategory === 'Dessert') {
    console.log(`Checking direct inventory for ${itemCategory} item: ${itemRows[0].item_name}`);
    
    // Map SKU to ingredient ID based on item name
    const [ingredientRows] = await connection.query(`
      SELECT ing_id 
      FROM ingredient 
      WHERE ing_name = ?
    `, [itemRows[0].item_name]);

    if (ingredientRows.length === 0) {
      throw new Error(`No ingredient mapping found for ${itemCategory} item: ${itemRows[0].item_name}`);
    }

    const ingredientId = ingredientRows[0].ing_id;
    
    const [inventoryRows] = await connection.query(`
      SELECT i.ing_id, i.quantity, ing.ing_name
      FROM inventory i
      JOIN ingredient ing ON i.ing_id = ing.ing_id
      WHERE i.ing_id = ?
    `, [ingredientId]);

    if (inventoryRows.length === 0) {
      throw new Error(`No inventory found for ${itemCategory} item: ${itemRows[0].item_name}`);
    }

    const currentStock = inventoryRows[0].quantity;
    const newStock = currentStock - orderQuantity;

    if (newStock < 0) {
      throw new Error(`Insufficient stock for ${itemRows[0].item_name}. Required: ${orderQuantity}, Available: ${currentStock}`);
    }

    await connection.query(`
      UPDATE inventory 
      SET quantity = ? 
      WHERE ing_id = ?
    `, [newStock, ingredientId]);

    console.log(`Updated direct inventory for ${itemRows[0].item_name}: ${currentStock} -> ${newStock}`);
    return;
  }

  // For pizzas and sides, check recipe ingredients
  console.log(`Checking recipe ingredients for ${itemCategory} item: ${itemRows[0].item_name}`);
  
  const [recipeRows] = await connection.query(`
    SELECT r.ing_id, r.quantity, i.ing_name
    FROM recipe r
    JOIN ingredient i ON r.ing_id = i.ing_id
    WHERE r.recipe_id = ?
  `, [recipeId]);

  if (recipeRows.length === 0) {
    throw new Error(`No recipe found for ${itemRows[0].item_name} (${itemCategory})`);
  }

  console.log(`Found ${recipeRows.length} ingredients in recipe for ${itemRows[0].item_name}`);

  // Update inventory for each ingredient
  for (const ingredient of recipeRows) {
    // Calculate total quantity needed
    const totalQuantityNeeded = ingredient.quantity * orderQuantity;

    // Check current inventory level
    const [inventoryRows] = await connection.query(`
      SELECT quantity 
      FROM inventory 
      WHERE ing_id = ?
    `, [ingredient.ing_id]);

    if (inventoryRows.length === 0) {
      throw new Error(`Ingredient ${ingredient.ing_name} not found in inventory`);
    }

    const currentStock = inventoryRows[0].quantity;
    const newStock = currentStock - totalQuantityNeeded;

    if (newStock < 0) {
      throw new Error(`Insufficient stock for ingredient ${ingredient.ing_name}. Required: ${totalQuantityNeeded}, Available: ${currentStock}`);
    }

    // Update inventory
    await connection.query(`
      UPDATE inventory 
      SET quantity = ? 
      WHERE ing_id = ?
    `, [newStock, ingredient.ing_id]);

    console.log(`Updated inventory for ${ingredient.ing_name}: ${currentStock} -> ${newStock}`);
  }
}

// POST /api/orders
router.post('/', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      customer_id,
      address_id,
      delivery,
      items,
      total_amount
    } = req.body;

    console.log('Received order data:', {
      customer_id,
      address_id,
      delivery,
      items,
      total_amount
    });

    if (!customer_id || !address_id || !items || !items.length) {
      throw new Error('Missing required order data');
    }

    // Verify customer exists
    const [customerRows] = await connection.query(
      'SELECT cust_id FROM customers WHERE cust_id = ?',
      [customer_id]
    );

    if (customerRows.length === 0) {
      throw new Error(`Customer not found with ID: ${customer_id}`);
    }

    // Verify address exists
    const [addressRows] = await connection.query(
      'SELECT add_id FROM address WHERE add_id = ?',
      [address_id]
    );

    if (addressRows.length === 0) {
      throw new Error(`Address not found with ID: ${address_id}`);
    }

    // Generate unique order ID
    const orderId = generateOrderId();
    console.log('Generated order ID:', orderId);

    // Log items before inventory check
    console.log('Checking inventory for items:', JSON.stringify(items, null, 2));

    // First, verify all inventory updates are possible
    for (const item of items) {
      console.log('Processing item:', item);
      await updateInventoryForOrder(connection, item.menu_item_id, item.quantity);
    }

    // Log items before order insertion
    console.log('Inserting order items:', JSON.stringify(items, null, 2));

    // Then insert order items
    for (const item of items) {
      console.log('Inserting order item:', {
        orderId,
        itemId: item.menu_item_id,
        quantity: item.quantity,
        customer_id,
        delivery,
        address_id
      });

      await connection.query(
        'INSERT INTO orders (order_id, item_id, quantity, cust_id, delivery, add_id) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.menu_item_id, item.quantity, customer_id, delivery, address_id]
      );
    }

    // Commit transaction
    await connection.commit();
    console.log('Order created successfully:', orderId);

    res.status(201).json({
      success: true,
      order_id: orderId
    });

  } catch (error) {
    console.error('Error creating order:', error);
    await connection.rollback();
    res.status(400).json({ 
      success: false,
      message: error.message || 'Failed to create order',
      error: {
        message: error.message,
        stack: error.stack,
        sqlMessage: error.sqlMessage,
        sqlState: error.sqlState,
        code: error.code
      }
    });
  } finally {
    connection.release();
  }
});

module.exports = router; 