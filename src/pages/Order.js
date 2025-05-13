import React, { useState } from 'react';

function Order() {
  const [orderForm, setOrderForm] = useState({
    customerId: '',
    addressId: '',
    delivery: false,
    items: []
  });

  const [validationStatus, setValidationStatus] = useState({
    customerId: null,
    addressId: null
  });

  const [error, setError] = useState(null);

  // Validate customer ID
  const validateCustomerId = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/customers/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setValidationStatus(prev => ({ ...prev, customerId: true }));
        setError(null);
      } else {
        setValidationStatus(prev => ({ ...prev, customerId: false }));
        setError('Invalid Customer ID');
      }
    } catch (err) {
      setValidationStatus(prev => ({ ...prev, customerId: false }));
      setError('Error validating Customer ID');
    }
  };

  // Validate address ID
  const validateAddressId = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/customers/address/${id}`);
      const data = await response.json();
      
      if (data.success) {
        setValidationStatus(prev => ({ ...prev, addressId: true }));
        setError(null);
      } else {
        setValidationStatus(prev => ({ ...prev, addressId: false }));
        setError('Invalid Address ID');
      }
    } catch (err) {
      setValidationStatus(prev => ({ ...prev, addressId: false }));
      setError('Error validating Address ID');
    }
  };

  const handleCustomerIdChange = (e) => {
    const value = e.target.value;
    setOrderForm(prev => ({ ...prev, customerId: value }));
    if (value) validateCustomerId(value);
  };

  const handleAddressIdChange = (e) => {
    const value = e.target.value;
    setOrderForm(prev => ({ ...prev, addressId: value }));
    if (value) validateAddressId(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate both IDs before submitting
    if (!validationStatus.customerId || !validationStatus.addressId) {
      setError('Please ensure both Customer ID and Address ID are valid');
      return;
    }

    if (!orderForm.items.length) {
      setError('Please add at least one item to your order');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderForm)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`Order created successfully! Order ID: ${data.orderId}`);
        // Reset form
        setOrderForm({
          customerId: '',
          addressId: '',
          delivery: false,
          items: []
        });
        setValidationStatus({
          customerId: null,
          addressId: null
        });
        setError(null);
      } else {
        throw new Error(data.error || 'Failed to create order');
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Place Your Order</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Customer ID
            </label>
            <input
              type="text"
              className={`w-full p-2 border rounded ${
                validationStatus.customerId === true ? 'border-green-500' :
                validationStatus.customerId === false ? 'border-red-500' :
                'border-gray-300'
              }`}
              value={orderForm.customerId}
              onChange={handleCustomerIdChange}
              required
            />
            {validationStatus.customerId === false && (
              <p className="text-red-500 text-xs mt-1">Invalid Customer ID</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Address ID
            </label>
            <input
              type="text"
              className={`w-full p-2 border rounded ${
                validationStatus.addressId === true ? 'border-green-500' :
                validationStatus.addressId === false ? 'border-red-500' :
                'border-gray-300'
              }`}
              value={orderForm.addressId}
              onChange={handleAddressIdChange}
              required
            />
            {validationStatus.addressId === false && (
              <p className="text-red-500 text-xs mt-1">Invalid Address ID</p>
            )}
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={orderForm.delivery}
                onChange={(e) => setOrderForm({...orderForm, delivery: e.target.checked})}
                className="form-checkbox"
              />
              <span className="text-gray-700 text-sm font-bold">Delivery</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
            disabled={!validationStatus.customerId || !validationStatus.addressId}
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}

export default Order; 