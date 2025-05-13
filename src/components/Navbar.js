import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-red-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">Pizza Palace</Link>
          <div className="flex space-x-4">
            <Link to="/" className="hover:text-gray-200">Home</Link>
            <Link to="/menu" className="hover:text-gray-200">Menu</Link>
            <Link to="/cart" className="hover:text-gray-200">Cart</Link>
            <Link to="/admin" className="hover:text-gray-200">Admin</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 