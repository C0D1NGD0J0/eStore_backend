const router = require("express").Router();
const { isAuthorized } = require("../Utils/middlewares");
const { validateProduct, execValidations } = require("../Utils/validations");
const { getAllProducts, createProduct, getCategoryProducts, featuredProducts, addToWishlist, getProduct, updateProduct, toggleProductStatus, deleteProduct, removeWishlistItem, relatedProducts } = require("../Controllers/product.js");
const reviewRouter = require("./reviews");

router.route("/")
  .get(getAllProducts)
  .post(validateProduct(), execValidations, createProduct);
  
router.get("/categories/:categoryId", getCategoryProducts);
router.get("/featured", featuredProducts);
router.put("/:id/add_to_wishlist", isAuthorized, addToWishlist);
router.put("/:id/remove_wishlist_item", isAuthorized, removeWishlistItem);
router.put("/:id/toggle_product_status", isAuthorized, toggleProductStatus);
router.get("/:id/related_products/category/:categoryId", relatedProducts);
router.route("/:id")
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

router.use("/:id/reviews", reviewRouter);

module.exports = router;