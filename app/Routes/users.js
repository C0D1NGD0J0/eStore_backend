const router = require("express").Router();
const { getCurrentUser, updateAccount, deleteAccount } = require("../Controllers/users");

router.get("/currentuser", getCurrentUser);

router.put("/:id", updateAccount);

router.delete("/:id/delete_account", deleteAccount);

module.exports = router;