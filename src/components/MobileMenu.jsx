import React from 'react';
import { Link } from 'react-router-dom';

const MobileMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="fixed right-0 top-0 h-full w-64 bg-red-700 text-white p-4">
        <div className="flex justify-end">
          <button onClick={onClose} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col space-y-4 mt-8">
          <Link to="/" className="hover:text-yellow-200 transition-colors py-2" onClick={onClose}>Home</Link>
          <Link to="/menu" className="hover:text-yellow-200 transition-colors py-2" onClick={onClose}>Menu</Link>
          <a href="/order" className="hover:text-yellow-200 transition-colors py-2">Order Now</a>
          <a href="/login" className="hover:text-yellow-200 transition-colors py-2">Staff Login</a>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu; 