const CartService = require("../services/cart-service");

// Get user cart
const getCart = async (req, res) => {
  try {
    const cart = await CartService.getCart(req.user._id);
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add item to cart
const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await CartService.addItemToCart(req.user._id, productId, quantity);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove item from cart
const removeItemFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await CartService.removeItemFromCart(req.user._id, productId);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update item quantity
const updateItemQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await CartService.updateItemQuantity(req.user._id, productId, quantity);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    await CartService.clearCart(req.user._id);
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCart, addItemToCart, removeItemFromCart, updateItemQuantity, clearCart };
