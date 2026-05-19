import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === product._id);
      if (existing) return prev.map(i => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i._id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart(prev => prev.map(i => i._id === id ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setCart([]);
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);
  const productsTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryTotal = [...new Set(cart.map(i => i._id))].reduce((s, id) => {
    const item = cart.find(i => i._id === id);
    return s + (item?.deliveryPrice || 0);
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, itemCount, productsTotal, deliveryTotal }}>
      {children}
    </CartContext.Provider>
  );
}