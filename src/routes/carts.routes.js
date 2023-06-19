import express from 'express';
import MongoDBCarts from "../services/dbcarts.service.js";
const dbCarts = new MongoDBCarts();
const cartsRouter = express.Router()

cartsRouter.post("/", async (req, res) => {
try {
  const newCart = await dbCarts.createOne();
  res.status(201).json(newCart);
} catch (error) {
  console.log(error);
  res.status(500).json({ message: "Error interno del servidor" });
}
});

cartsRouter.get("/:cid", async (req, res) => {
try {
  const cartId = req.params.cid;
  const cart = await dbCarts.get(cartId);
  res.status(200).json(cart);
} catch (error) {
  res.status(404).json({ message: error.message });
}
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
try {
  const { cid, pid } = req.params;
  const cart = await dbCarts.addProductToCart(cid, pid);
  res.status(200).json(cart);
} catch (error) {
  res.status(404).json({ error: error.message });
}
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
try {
  const { cid, pid } = req.params;
  const cart = await dbCarts.removeProduct(cid, pid);
  res
    .status(200)
    .json({ status: "success", message: "Producto removido del carrito", cart });
} catch (error) {
  console.error(error);
  res.status(500).json({ status: "error", message: "Error interno del servidor" });
}
});

cartsRouter.put("/:cid", async (req, res) => {
try {
  const { cid } = req.params;
  const { products } = req.body;
  const cart = await dbCarts.updateCart(cid, products);
  res
    .status(200)
    .json({ status: "success", message: "Carrito actualizado exitosamente", cart });
} catch (error) {
  console.error(error);
  res.status(500).json({ status: "error", message: "Error interno del servidor" });
}
});

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
try {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const cart = await dbCarts.updateProductQuantity(cid, pid, quantity);
  res
    .status(200)
    .json({ status: "success", message: "Product quantity updated", cart });
} catch (error) {
  console.error(error);
  res.status(500).json({ status: "error", message: "Error interno del servidor" });
}
});

cartsRouter.delete("/:cid", async (req, res) => {
try {
  const { cid } = req.params;
  await dbCarts.clearCart(cid);
  res
    .status(200)
    .json({ status: "success", message: "Carrito limpiado exitosamente" });
} catch (error) {
  console.error(error);
  res.status(500).json({ status: "error", message: "Error interno del servidor" });
}
});

export default cartsRouter;