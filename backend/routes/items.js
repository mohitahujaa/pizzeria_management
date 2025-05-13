const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/items
router.get('/', async (req, res) => {
  try {
    console.log('Attempting to fetch items from database...');
    
    // First get all non-pizza items
    const [nonPizzaRows] = await db.query(`
      SELECT 
        item_name,
        item_cat as category,
        item_price as regular_price,
        item_id as regular_id,
        sku
      FROM item
      WHERE item_cat IN ('Beverage', 'Side', 'Dessert')
    `);

    // Then get pizza items with both sizes
    const [pizzaRows] = await db.query(`
      SELECT 
        p1.item_name,
        'Pizza' as category,
        p1.item_id as regular_id,
        p1.item_price as regular_price,
        p2.item_id as large_id,
        p2.item_price as large_price,
        p1.sku
      FROM 
        (SELECT * FROM item WHERE item_cat = 'Pizza' AND item_size = 'Regular') p1
      LEFT JOIN 
        (SELECT * FROM item WHERE item_cat = 'Pizza' AND item_size = 'Large') p2
      ON p1.item_name = p2.item_name
      ORDER BY p1.item_name
    `);

    console.log('Non-pizza items:', nonPizzaRows);
    console.log('Pizza items with sizes:', pizzaRows);

    // Combine and format all items
    const formattedItems = [
      ...nonPizzaRows.map(item => ({
        name: item.item_name,
        category: item.category,
        sku: item.sku,
        regular_price: parseFloat(item.regular_price),
        regular_id: item.regular_id,
        large_price: null,
        large_id: null
      })),
      ...pizzaRows.map(item => ({
        name: item.item_name,
        category: item.category,
        sku: item.sku,
        regular_price: parseFloat(item.regular_price),
        regular_id: item.regular_id,
        large_price: item.large_price ? parseFloat(item.large_price) : null,
        large_id: item.large_id || null
      }))
    ];

    console.log('Formatted items:', formattedItems);
    res.json(formattedItems);
  } catch (error) {
    console.error('Detailed error fetching items:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Could not fetch items from database',
      details: error.message
    });
  }
});

// GET /api/items/categories
router.get('/categories', async (req, res) => {
  try {
    console.log('Attempting to fetch categories from database...');
    // Get distinct categories
    const [rows] = await db.query('SELECT DISTINCT item_cat FROM item ORDER BY item_cat');
    console.log('Found categories:', rows.map(row => row.item_cat));
    const categories = rows.map(row => row.item_cat);
    res.json(categories);
  } catch (error) {
    console.error('Detailed error fetching categories:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Could not fetch categories from database'
    });
  }
});

// GET /api/items/by-category/:category
router.get('/by-category/:category', async (req, res) => {
  try {
    console.log('Attempting to fetch items for category:', req.params.category);
    const category = req.params.category;
    let query;
    let params = [category];

    if (category !== 'Pizza') {
      // For non-pizza items (Beverage, Side, Dessert)
      query = `
        SELECT 
          item_name,
          item_cat as category,
          item_price as regular_price,
          item_id as regular_id,
          sku
        FROM item
        WHERE item_cat = ?
        ORDER BY item_name
      `;
    } else {
      // For pizzas with both sizes
      query = `
        SELECT 
          p1.item_name,
          'Pizza' as category,
          p1.item_id as regular_id,
          p1.item_price as regular_price,
          p2.item_id as large_id,
          p2.item_price as large_price,
          p1.sku
        FROM 
          (SELECT * FROM item WHERE item_cat = 'Pizza' AND item_size = 'Regular') p1
        LEFT JOIN 
          (SELECT * FROM item WHERE item_cat = 'Pizza' AND item_size = 'Large') p2
        ON p1.item_name = p2.item_name
        ORDER BY p1.item_name
      `;
    }
    
    const [rows] = await db.query(query, params);
    console.log('Found', rows.length, 'items for category:', category);
    console.log('Raw query results:', rows);
    
    const formattedItems = rows.map(item => {
      if (item.category === 'Pizza') {
        return {
          name: item.item_name,
          category: item.category,
          sku: item.sku,
          regular_price: parseFloat(item.regular_price),
          regular_id: item.regular_id,
          large_price: item.large_price ? parseFloat(item.large_price) : null,
          large_id: item.large_id || null
        };
      } else {
        return {
          name: item.item_name,
          category: item.category,
          sku: item.sku,
          regular_price: parseFloat(item.regular_price),
          regular_id: item.regular_id,
          large_price: null,
          large_id: null
        };
      }
    });

    console.log('Formatted items:', formattedItems);
    res.json(formattedItems);
  } catch (error) {
    console.error('Detailed error fetching items by category:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Could not fetch items for the specified category',
      details: error.message
    });
  }
});

module.exports = router; 