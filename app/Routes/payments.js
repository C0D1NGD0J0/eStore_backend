const router = require("express").Router();
const { isAuthorized } = require("../Utils/middlewares");
const { getBraintreeToken } = require("../Controllers/payment");

router.get("/generate_client_token", isAuthorized, getBraintreeToken);

module.exports = router;