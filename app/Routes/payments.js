const router = require("express").Router();
const { isAuthorized } = require("../Utils/middlewares");
const { getBraintreeToken, handlePayment } = require("../Controllers/payment");

router.get("/generate_client_token", isAuthorized, getBraintreeToken);

router.post("/", isAuthorized, handlePayment);

module.exports = router;