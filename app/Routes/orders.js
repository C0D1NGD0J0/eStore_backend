const router = require("express").Router();
const { isAuthorized } = require("../Utils/middlewares");
const { createOrder, getAllOrders, getSingleOrder, updateOrderStatus, deleteOrder } = require("../Controllers/order");

router.route("/")
  .get(isAuthorized, getAllOrders)
  .post(isAuthorized, createOrder);

router.get("/:id", isAuthorized, getSingleOrder);
router.put("/:id/update_status", isAuthorized, updateOrderStatus);
router.delete("/:id", isAuthorized, deleteOrder);

module.exports = router;