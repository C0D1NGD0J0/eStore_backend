const router = require("express").Router();
const { execValidations } = require("../Utils/validations");
const { getAllProducts, createProduct, getCategoryProducts, featuredProducts, addToWishlist, getProduct, updateProduct, deleteProduct } = "../Controllers/product";

router.route("/")
  .get(getAllProducts)
  .post(createProduct);

router.get("/categories", getCategoryProducts);

router.get("/featured", featuredProducts);

router.put("/:id/add_to_wishlist", addToWishlist);

router.route("/:id")
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);


module.exports = router;