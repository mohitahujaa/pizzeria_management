import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    console.log('Adding to cart:', item);
    
    setCartItems(prev => {
      // Find existing item
      const existingItem = prev.find(i => 
        i.menu_item_id === item.menu_item_id && 
        i.size === item.size
      );
      
      console.log('Existing item:', existingItem);
      
      if (existingItem) {
        // Update quantity of existing item
        const updated = prev.map(i => 
          i.menu_item_id === item.menu_item_id && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
        console.log('Updated cart (existing):', updated);
        return updated;
      }
      
      // Add new item
      const newCart = [...prev, { ...item, quantity: 1 }];
      console.log('Updated cart (new):', newCart);
      return newCart;
    });
  };

  const removeFromCart = (itemId, size) => {
    console.log('Removing from cart:', { itemId, size });
    setCartItems(prev => 
      prev.filter(item => !(item.menu_item_id === itemId && item.size === size))
    );
  };

  const updateQuantity = (itemId, size, newQuantity) => {
    console.log('Updating quantity:', { itemId, size, newQuantity });
    if (newQuantity < 1) return;
    
    setCartItems(prev => 
      prev.map(item => 
        item.menu_item_id === itemId && item.size === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    console.log('Clearing cart');
    setCartItems([]);
  };

  const getCartCount = () => {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    console.log('Cart count:', count);
    return count;
  };

  const getCartTotal = () => {
    const total = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    console.log('Cart total:', total);
    return total;
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext; 