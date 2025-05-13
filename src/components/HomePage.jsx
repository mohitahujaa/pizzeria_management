import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MobileMenu from './MobileMenu';

const HomePage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-red-700 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">Pizzeria Delizioso</div>
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-yellow-200 transition-colors">Home</Link>
            <Link to="/menu" className="hover:text-yellow-200 transition-colors">Menu</Link>
            <a href="/order" className="hover:text-yellow-200 transition-colors">Order Now</a>
            <a href="/login" className="hover:text-yellow-200 transition-colors">Staff Login</a>
          </div>
          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Hero Section */}
      <div className="relative flex-grow">
        <div className="absolute inset-0 bg-[url('/images/pizza-hero.jpg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative container mx-auto px-4 py-32 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Pizzeria Delizioso</h1>
          <p className="text-xl md:text-2xl mb-8">Authentic Italian Pizza, Made with Love</p>
          <button className="bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-red-700 transition-colors transform hover:scale-105">
            Start Order
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
              <p>123 Pizza Street</p>
              <p>New York, NY 10001</p>
              <p>Phone: (555) 123-4567</p>
              <p>Email: info@pizzeriadelizioso.com</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Hours</h3>
              <p>Monday - Thursday: 11am - 10pm</p>
              <p>Friday - Saturday: 11am - 11pm</p>
              <p>Sunday: 12pm - 9pm</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-red-500">Facebook</a>
                <a href="#" className="hover:text-red-500">Instagram</a>
                <a href="#" className="hover:text-red-500">Twitter</a>
              </div>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-gray-700">
            <p>&copy; 2024 Pizzeria Delizioso. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage; 