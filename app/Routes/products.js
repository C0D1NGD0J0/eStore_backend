const router = require("express").Router();
const { validateProduct, execValidations } = require("../Utils/validations");
const { getAllProducts, createProduct, getCategoryProducts, featuredProducts, addToWishlist, getProduct, updateProduct, deleteProduct } = require("../Controllers/product.js");

router.route("/")
  .get(getAllProducts)
  .post(validateProduct(), execValidations, createProduct);

router.get("/categories/:id", getCategoryProducts);

router.get("/featured", featuredProducts);

router.put("/:id/add_to_wishlist", addToWishlist);

router.route("/:id")
  .get(getProduct)
  .put(validateProduct(), execValidations, updateProduct)
  .delete(deleteProduct);

module.exports = router;