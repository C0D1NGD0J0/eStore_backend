const router = require("express").Router();
const { validateProduct, execValidations } = require("../Utils/validations");
const { getAllProducts, createProduct, getCategoryProducts, featuredProducts, addToWishlist, getProduct, updateProduct, deleteProduct, removeWishlistItem } = require("../Controllers/product.js");

router.route("/")
  .get(getAllProducts)
  .post(validateProduct(), execValidations, createProduct);

router.get("/categories/:categoryId", getCategoryProducts);

router.get("/featured", featuredProducts);

router.put("/:id/add_to_wishlist", addToWishlist);

router.put("/:id/remove_wishlist_item", removeWishlistItem);

router.route("/:id")
  .get(getProduct)
  .put(validateProduct(), execValidations, updateProduct)
  .delete(deleteProduct);

module.exports = router;