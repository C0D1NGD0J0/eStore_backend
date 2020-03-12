const router = require("express").Router();
const { getCurrentUser, updateAccount, deleteAccount } = require("../Controllers/users");

router.get("/currentuser", getCurrentUser);

router.put("/currentuser/updateAccount", updateAccount);

router.delete("/currentuser/delete_account", deleteAccount);

module.exports = router;