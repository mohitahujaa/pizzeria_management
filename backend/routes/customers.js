const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Validate customer ID
router.get('/:id', async (req, res) => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT cust_id FROM customers WHERE cust_id = ?',
      [req.params.id]
    );
    
    res.json({
      success: rows.length > 0,
      exists: rows.length > 0
    });
  } catch (error) {
    console.error('Error validating customer:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate customer',
      details: error.message
    });
  } finally {
    connection.release();
  }
});

// Validate address ID
router.get('/address/:id', async (req, res) => {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT add_id FROM address WHERE add_id = ?',
      [req.params.id]
    );
    
    res.json({
      success: rows.length > 0,
      exists: rows.length > 0
    });
  } catch (error) {
    console.error('Error validating address:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate address',
      details: error.message
    });
  } finally {
    connection.release();
  }
});

// POST /api/customers
router.post('/', async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const { firstName, lastName, email, address } = req.body;
    console.log('Received customer data:', { firstName, lastName, email, address });

    // Check if customer with email already exists
    const [existingCustomer] = await connection.query(
      'SELECT cust_id FROM customers WHERE email = ?',
      [email]
    );

    let customerId;

    if (existingCustomer.length > 0) {
      // Update existing customer
      customerId = existingCustomer[0].cust_id;
      await connection.query(
        'UPDATE customers SET cust_firstname = ?, cust_lastname = ? WHERE cust_id = ?',
        [firstName, lastName, customerId]
      );
      console.log('Updated existing customer with ID:', customerId);
    } else {
      // Insert new customer
      const [customerResult] = await connection.query(
        'INSERT INTO customers (cust_firstname, cust_lastname, email) VALUES (?, ?, ?)',
        [firstName, lastName, email]
      );
      customerId = customerResult.insertId;
      console.log('Created new customer with ID:', customerId);
    }

    // Insert address
    const [addressResult] = await connection.query(
      'INSERT INTO address (delivery_address1, delivery_address2, delivery_city, delivery_zipcode) VALUES (?, ?, ?, ?)',
      [address.address1, address.address2 || '', address.city, address.zipcode]
    );
    const addressId = addressResult.insertId;
    console.log('Created address with ID:', addressId);

    // Verify the customer exists
    const [customerCheck] = await connection.query(
      'SELECT * FROM customers WHERE cust_id = ?',
      [customerId]
    );

    if (customerCheck.length === 0) {
      throw new Error('Failed to create/update customer record');
    }

    // Verify the address was created
    const [addressCheck] = await connection.query(
      'SELECT * FROM address WHERE add_id = ?',
      [addressId]
    );

    if (addressCheck.length === 0) {
      throw new Error('Failed to create address record');
    }

    await connection.commit();
    console.log('Successfully created/updated customer and address');

    res.status(201).json({
      success: true,
      customerId,
      addressId,
      message: 'Customer and address created/updated successfully'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error creating/updating customer:', {
      message: error.message,
      stack: error.stack,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({
      success: false,
      error: 'Failed to create/update customer',
      details: error.message
    });
  } finally {
    connection.release();
  }
});

module.exports = router; 