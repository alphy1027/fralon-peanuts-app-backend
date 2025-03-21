const ErrorResponse = require('../middleware/errorResponse');
const Cart = require('../models/cart');

class cartService {
    constructor(cartModel) {
        this.Cart = cartModel;
    }

    async findOrCreateCart(clientId) {
        let cart = await this.getCartByClient({ client: clientId });
        if (!cart) {
            cart = await this.createCart(clientId)
        }
        return cart;
    }

    async createCart(clientId) {
        return this.Cart.create({
            items: [],
            client: clientId
        })
    }

    async getCartByClient(clientId) {
        return await this.Cart.findOne({ client: clientId }).exec();
    }

    async addItemToCart(clientId, productId) {
        const cart = await this.getCartByClient(clientId);
        if (!cart)
            return null;

        const existingCartItem = cart.items.find(item => item.product.toString() === productId.toString());
        if (existingCartItem) {
            existingCartItem.quantity += 1;
        } else {
            cart.items.push({ product: productId })
        }
        await cart.save();
        return cart;
    }

    async removeItemFromCart(clientId, productId) {
        const cart = await this.getCartByClient(clientId);
        if (!cart)
            return null;
        if (cart.items.length === 0)
            throw new ErrorResponse('No items in the cart', 404)
        const productInCart = cart.items.find(item => item.product.toString() === productId.toString());
        if (!productInCart)
            throw new ErrorResponse('Product not in cart', 404)
        cart.items = cart.items.filter(item => item.product.toString() !== productId.toString());
        await cart.save();
        return cart;
    }
}

module.exports = new cartService(Cart);