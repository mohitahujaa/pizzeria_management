import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCustomer } from '../context/CustomerContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { customerDetails } = useCustomer();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleProceedToCheckout = () => {
    if (!customerDetails) {
      navigate('/customer');
      return;
    }

    handlePlaceOrder();
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Current customer details:', customerDetails);
      console.log('Current cart items:', cartItems);

      if (!customerDetails || !customerDetails.id || !customerDetails.addressId) {
        throw new Error('Missing customer or address information. Please add delivery details.');
      }

      if (!cartItems.length) {
        throw new Error('Your cart is empty. Please add some items before placing an order.');
      }

      const orderItems = cartItems.map(item => ({
        menu_item_id: item.menu_item_id,
        size: item.size,
        quantity: item.quantity,
        unit_price: parseFloat(item.price)
      }));

      const orderData = {
        customer_id: customerDetails.id,
        address_id: customerDetails.addressId,
        delivery: true,
        items: orderItems,
        total_amount: getCartTotal()
      };

      console.log('Sending order data:', JSON.stringify(orderData, null, 2));

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      console.log('Server response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to place order');
      }

      // Order successful
      alert(`Order placed successfully! Order ID: ${data.order_id}`);
      
      // Clear the entire cart at once
      clearCart();
      
      // Navigate to menu
      navigate('/menu');
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link
              to="/menu"
              className="inline-block bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
            >
              Return to Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          {cartItems.map((item) => (
            <div
              key={`${item.menu_item_id}-${item.size}`}
              className="flex items-center justify-between py-4 border-b last:border-b-0"
            >
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">Size: {item.size}</p>
                <p className="text-red-600">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.menu_item_id, item.size, Math.max(1, item.quantity - 1))}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.menu_item_id, item.size, item.quantity + 1)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.menu_item_id, item.size)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {customerDetails && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-2">Delivery Details</h3>
              <p>{customerDetails.firstName} {customerDetails.lastName}</p>
              {customerDetails.addressLine1 && (
                <>
                  <p>{customerDetails.addressLine1}</p>
                  {customerDetails.addressLine2 && <p>{customerDetails.addressLine2}</p>}
                  <p>{customerDetails.city}, {customerDetails.zipCode}</p>
                </>
              )}
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold">${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <Link
                to="/menu"
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-300 transition-colors"
              >
                Continue Shopping
              </Link>
              <button
                className={`bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleProceedToCheckout}
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? 'Placing Order...' 
                  : customerDetails 
                    ? 'Place Order' 
                    : 'Add Delivery Details'
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage; 