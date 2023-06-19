import  CartModel from '../DAO/models/cart.model.js';
import ProductModel from '../DAO/models/product.model.js';

class MongoDBCarts {
  async createOne() {
    const cartCreated = await CartModel.create({});
    return cartCreated;
  }

  async get(cartId) {
    const cart = await CartModel.findById(cartId).populate("products.product").lean()
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }
    return cart;
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      const product = await ProductModel.findById(productId);
      if (!cart) {
        throw new Error("Carrito no encontrado");
      }
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      const existingProductIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        cart.products.push({ product: product._id, quantity: 1 });
      }
      await cart.save();
      return cart;
    } catch (error) {
      throw error;
    }
  }

  async updateCart(cartId, products) {
    try {
      const cart = await CartModel.findByIdAndUpdate(
        cartId,
        { products },
        { new: true }
      );
      return cart;
    } catch (error) {
      throw new Error("Error al actualizar el carrito en la base de datos");
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await CartModel.findById(cartId);
      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (productIndex === -1) {
        throw new Error("Producto no encontrado en el carrito");
      }
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error al actualizar las cantidades del producto en el carrito");
    }
  }

  async removeProduct(cartId, productId) {
    try {
      const cart = await CartModel.findById(cartId);
      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (productIndex === -1) {
        throw new Error("Producto no encontrado en el carrito");
      }
      cart.products.splice(productIndex, 1);
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error("Error al quitar el producto del carrito");
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      cart.products = [];
      await cart.save();
    } catch (error) {
      throw new Error("Error al limpiar el carrito");
    }
  }
}

export default MongoDBCarts;
