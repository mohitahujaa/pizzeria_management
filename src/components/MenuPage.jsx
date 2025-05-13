import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import SizeSelectionModal from './SizeSelectionModal';
import { useCart } from '../context/CartContext';

const MenuPage = () => {
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch menu items and categories when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:5000/api/items/categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(['All', ...categoriesData]);

        // Fetch all items
        const itemsResponse = await fetch('http://localhost:5000/api/items');
        const itemsData = await itemsResponse.json();
        console.log('Menu items data:', itemsData);
        
        // Transform the data to ensure all size properties are present
        const transformedItems = itemsData.map(item => ({
          ...item,
          regular_id: item.regular_id || null,
          large_id: item.large_id || null,
          regular_price: item.regular_price || null,
          large_price: item.large_price || null
        }));
        
        console.log('Transformed items:', transformedItems);
        setMenuItems(transformedItems);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load menu items');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToOrder = (item) => {
    console.log('Selected item for order:', item);
    setSelectedItem(item);
    setModalOpen(true);
  };

  const filteredItems = selectedCategory === "All"
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading menu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-red-700 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">Pizzeria Delizioso</div>
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-yellow-200 transition-colors">Home</Link>
            <Link to="/menu" className="hover:text-yellow-200 transition-colors">Menu</Link>
            <button 
              onClick={() => navigate('/cart')}
              className="relative hover:text-yellow-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {getCartCount()}
                </span>
              )}
            </button>
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

      {/* Menu Content */}
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Our Menu</h1>
        
        {/* Category Filter */}
        <div className="flex justify-center mb-8 space-x-4 flex-wrap">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition-colors duration-200 mb-2`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.regular_id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2">{item.name}</h2>
                <p className="text-gray-600 mb-4">{item.description || item.category}</p>
                <div className="flex justify-between items-center">
                  <div className="text-red-600">
                    {item.regular_price && (
                      <div>Regular: ${item.regular_price.toFixed(2)}</div>
                    )}
                    {item.large_price && item.category === 'Pizza' && (
                      <div>Large: ${item.large_price.toFixed(2)}</div>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddToOrder(item)}
                    className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors transform hover:scale-105 duration-200"
                  >
                    Add to Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Size Selection Modal */}
      <SizeSelectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        item={selectedItem}
      />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
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

export default MenuPage; 