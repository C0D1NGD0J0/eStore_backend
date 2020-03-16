const router = require("express").Router();
const { isAuthorized } = require("../Utils/middlewares");
const { getCurrentUser, updateAccount, deleteAccount } = require("../Controllers/users");

router.get("/currentuser", isAuthorized, getCurrentUser);

router.put("/currentuser/updateAccount", isAuthorized, updateAccount);

router.delete("/currentuser/delete_account", isAuthorized, deleteAccount);

module.exports = router;