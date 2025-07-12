const ErrorResponse = require("../middleware/errorResponse");
const Cart = require("../models/cart");

class cartService {
  constructor(cartModel) {
    this.Cart = cartModel;
  }

  async findOrCreateCart(clientId) {
    let cart = await this.getCartByClient({ client: clientId });
    if (!cart) {
      cart = await this.createCart(clientId);
    }
    return cart;
  }

  async createCart(clientId) {
    return this.Cart.create({
      items: [],
      client: clientId,
    });
  }

  async getCartByClient(clientId) {
    return await this.Cart.findOne({ client: clientId })
      .populate({
        path: "items.product",
        populate: {
          path: "category",
          model: "Category",
          select: "name",
        },
      })
      .exec();
  }

  async addItemToCart(clientId, productId) {
    const cart = await this.getCartByClient(clientId);
    if (!cart) return null;
    console.log("cart ::", cart);
    const existingCartItem = cart.items.find((item) => item.product._id.toString() === productId.toString());
    if (existingCartItem) {
      console.log("existing cart item ::", existingCartItem);
      existingCartItem.quantity += 1;
    } else {
      cart.items.push({ product: productId });
    }
    await cart.save();
    return cart;
  }

  async updateItemQuantity(clientId, productId, quantity) {
    const cart = await this.getCartByClient(clientId);
    if (!cart) return null;
    const existingCartItem = cart.items.find((item) => item.product._id.toString() === productId.toString());
    if (existingCartItem) {
      console.log("updating cart item ::", existingCartItem);
      if (quantity <= 0) {
        cart.items = cart.items.filter((item) => item.product._id.toString() !== productId.toString());
      } else {
        existingCartItem.quantity = quantity;
      }
    } else {
      throw new ErrorResponse("Product does not exist in your cart", 404);
    }
    await cart.save();
    return cart;
  }

  async removeItemFromCart(clientId, productId) {
    if (!productId) throw new ErrorResponse("Product ID is not provided");
    const cart = await this.getCartByClient(clientId);
    if (!cart) return null;
    console.log("remove cart ::", cart);
    if (cart.items.length === 0) throw new ErrorResponse("No items in the cart", 404);
    const productInCart = cart.items.find((item) => item.product._id.toString() === productId.toString());
    console.log("product in cart ::", productInCart);
    if (!productInCart) throw new ErrorResponse("Product not in cart", 404);
    cart.items = cart.items.filter((item) => item.product._id.toString() !== productId.toString());
    await cart.save();
    return cart;
  }
}

module.exports = new cartService(Cart);
