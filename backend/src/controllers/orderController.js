const db = require('../config/database');
const { generateOrderId, updateInventoryForOrder } = require('../utils/orderUtils');

const orderController = {
  createOrder: async (req, res) => {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      const {
        customerId,
        addressId,
        delivery,
        items
      } = req.body;

      if (!customerId || !addressId || !items || !items.length) {
        throw new Error('Missing required order data');
      }

      // Verify customer exists
      const [customerRows] = await connection.query(
        'SELECT cust_id FROM customers WHERE cust_id = ?',
        [customerId]
      );

      if (customerRows.length === 0) {
        throw new Error(`Customer not found with ID: ${customerId}`);
      }

      // Verify address exists
      const [addressRows] = await connection.query(
        'SELECT add_id FROM address WHERE add_id = ?',
        [addressId]
      );

      if (addressRows.length === 0) {
        throw new Error(`Address not found with ID: ${addressId}`);
      }

      // Generate unique order ID
      const orderId = generateOrderId();

      // First, verify all inventory updates are possible
      for (const item of items) {
        await updateInventoryForOrder(connection, item.item_id, item.quantity);
      }

      // Then insert order items
      for (const item of items) {
        await connection.query(
          'INSERT INTO orders (order_id, item_id, quantity, cust_id, delivery, add_id) VALUES (?, ?, ?, ?, ?, ?)',
          [orderId, item.item_id, item.quantity, customerId, delivery, addressId]
        );
      }

      await connection.commit();

      res.status(201).json({
        success: true,
        orderId: orderId
      });

    } catch (error) {
      await connection.rollback();
      res.status(500).json({
        success: false,
        error: 'Failed to create order',
        details: error.message
      });
    } finally {
      connection.release();
    }
  }
};

module.exports = orderController; 