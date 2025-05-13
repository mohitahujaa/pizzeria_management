import React from 'react';
import { useCart } from '../context/CartContext';

const SizeSelectionModal = ({ isOpen, onClose, item }) => {
  const { addToCart } = useCart();

  if (!isOpen || !item) return null;

  console.log('Modal item data:', item);

  // Only pizzas have multiple sizes (regular and large)
  const isPizza = item.category?.toLowerCase() === 'pizza';

  // For non-pizza items, only show regular size
  const sizes = isPizza 
    ? [
        { name: 'Regular', id: item.regular_id, price: item.regular_price },
        { name: 'Large', id: item.large_id, price: item.large_price }
      ].filter(size => size.id !== null && size.price !== null)
    : [{ name: 'Regular', id: item.regular_id, price: item.regular_price }];

  console.log('Available sizes:', sizes);

  const handleAddToCart = (size) => {
    const cartItem = {
      menu_item_id: size.id,
      name: item.name,
      size: size.name,
      price: size.price,
      quantity: 1,
      category: item.category
    };
    console.log('Adding to cart:', cartItem);
    addToCart(cartItem);
    onClose();
  };

  // Show modal for all items
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">
          {isPizza ? 'Select Pizza Size' : 'Add to Cart'}
        </h2>
        <p className="mb-4">{item.name}</p>
        
        <div className="space-y-4 mb-6">
          {sizes.map((size) => (
            <button
              key={size.id}
              onClick={() => handleAddToCart(size)}
              className="w-full py-3 px-4 bg-white border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors flex justify-between items-center"
            >
              <span>{isPizza ? size.name : 'Add to Cart'}</span>
              <span>${size.price.toFixed(2)}</span>
            </button>
          ))}
        </div>
        
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SizeSelectionModal; 