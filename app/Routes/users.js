const router = require("express").Router();
const { getCurrentUser, updateAccount } = require("../Controllers/users");

router.get("/currentuser", getCurrentUser);

router.put("/", updateAccount);

module.exports = router;