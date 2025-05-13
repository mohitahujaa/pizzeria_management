import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomer } from '../context/CustomerContext';

const CustomerDetailsPage = () => {
  const navigate = useNavigate();
  const { updateCustomerDetails } = useCustomer();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    zipCode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['firstName', 'lastName', 'email', 'addressLine1', 'city', 'zipCode'];
    
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    // Validate email format
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate zip code format (assuming US format)
    if (formData.zipCode.trim() && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Save customer and address data together
      const customerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        address: {
          address1: formData.addressLine1,
          address2: formData.addressLine2 || '',
          city: formData.city,
          zipcode: formData.zipCode
        }
      };

      const response = await fetch('http://localhost:5000/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save customer details');
      }

      const data = await response.json();
      
      // Save all details including address in context
      updateCustomerDetails({
        id: data.customerId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        addressId: data.addressId,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        zipCode: formData.zipCode
      });
      
      navigate('/cart');
    } catch (error) {
      console.error('Error saving customer details:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Failed to save customer details. Please try again.'
      }));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Delivery Details</h1>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              {errors.submit}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="firstName">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.firstName && (
                <p className="mt-1 text-red-500 text-sm">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="lastName">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.lastName && (
                <p className="mt-1 text-red-500 text-sm">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="addressLine1">
                Address Line 1 *
              </label>
              <input
                type="text"
                id="addressLine1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                placeholder="Street address"
                className={`w-full p-2 border rounded-lg ${errors.addressLine1 ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.addressLine1 && (
                <p className="mt-1 text-red-500 text-sm">{errors.addressLine1}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="addressLine2">
                Address Line 2 (Optional)
              </label>
              <input
                type="text"
                id="addressLine2"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                placeholder="Apartment, suite, etc. (optional)"
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="city">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.city && (
                <p className="mt-1 text-red-500 text-sm">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="zipCode">
                ZIP Code *
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="12345"
                className={`w-full p-2 border rounded-lg ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.zipCode && (
                <p className="mt-1 text-red-500 text-sm">{errors.zipCode}</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Continue to Cart'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerDetailsPage; 