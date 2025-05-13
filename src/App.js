import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import MenuPage from './components/MenuPage';
import CartPage from './components/CartPage';
import CustomerDetailsPage from './components/CustomerDetailsPage';
import AdminDashboard from './components/AdminDashboard';
import { CartProvider } from './context/CartContext';
import { CustomerProvider } from './context/CustomerContext';

function App() {
  return (
    <CustomerProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/customer" element={<CustomerDetailsPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </Router>
        </div>
      </CartProvider>
    </CustomerProvider>
  );
}

export default App; 