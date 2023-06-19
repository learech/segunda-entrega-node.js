import ProductManager from "../DAO/appManager/productManager.js";
const path = "src/DAO/db/products.json";
const newProductManager = new ProductManager(path);

const checkRequest = (req, res, next) => {
  const keysBody = Object.keys(req.body);
  const requiredKeys = [
    "title",
    "description",
    "code",
    "price",
    "status",
    "stock",
    "category",
    "thumbnail",
  ];
  const validRequest = requiredKeys.every((key) => keysBody.includes(key));
  if (!validRequest) {
    res.status(400).json({
      status: "Error",
      payload: "Petición no válida. Faltan completar campos",
    });
    return;
  }
  next();
};

const checkCodeNotRepeated = async (req, res, next) => {
  const { code } = req.body;
  const allProducts = await newProductManager.getAllProducts();
  const product = allProducts.find((product) => product.code == code);
  if (product) {
    res.status(400).json({
      status: "Error",
      payload: "Error!! El código ya existe" + code,
    });
    return;
  }
  next();
};

const checkNumberParams = (req, res, next) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    res.status(400).json({
      status: "error",
      payload: "El id no es válido: " + id,
    });
    return;
  }
  next();
};

export { checkRequest, checkNumberParams, checkCodeNotRepeated, };