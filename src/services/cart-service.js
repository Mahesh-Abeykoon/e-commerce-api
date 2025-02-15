const Cart = require("../models/Cart");

class CartService {
  // Get user cart
  static async getCart(userId) {
    return await Cart.findOne({ userId }).populate("items.productId");
  }

  // Add item to cart
  static async addItemToCart(userId, productId, quantity) {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    return await cart.save();
  }

  // Remove item from cart
  static async removeItemFromCart(userId, productId) {
    const cart = await Cart.findOne({ userId });

    if (!cart) return null;

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    return await cart.save();
  }

  // Update item quantity in cart
  static async updateItemQuantity(userId, productId, quantity) {
    const cart = await Cart.findOne({ userId });

    if (!cart) return null;

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (item) item.quantity = quantity;

    return await cart.save();
  }

  // Clear cart
  static async clearCart(userId) {
    return await Cart.findOneAndDelete({ userId });
  }
}

module.exports = CartService;
