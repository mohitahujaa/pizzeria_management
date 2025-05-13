import React, { createContext, useContext, useState } from 'react';

const CustomerContext = createContext();

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};

export const CustomerProvider = ({ children }) => {
  const [customerDetails, setCustomerDetails] = useState(null);

  const updateCustomerDetails = (details) => {
    setCustomerDetails(details);
  };

  const clearCustomerDetails = () => {
    setCustomerDetails(null);
  };

  const value = {
    customerDetails,
    updateCustomerDetails,
    clearCustomerDetails
  };

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
};

export default CustomerContext; 