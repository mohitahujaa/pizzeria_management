import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Pizza Palace</h1>
        <p className="text-xl text-gray-600 mb-8">The best pizzas in town, made with love!</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link to="/menu" 
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold text-red-600 mb-2">Our Menu</h2>
            <p className="text-gray-600">Explore our delicious selection of pizzas and more</p>
          </Link>
          
          <Link to="/order" 
                className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <h2 className="text-2xl font-semibold text-red-600 mb-2">Order Now</h2>
            <p className="text-gray-600">Quick and easy online ordering</p>
          </Link>
          
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-red-600 mb-2">Contact Us</h2>
            <p className="text-gray-600">Call us: (555) 123-4567</p>
            <p className="text-gray-600">Email: info@pizzapalace.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 