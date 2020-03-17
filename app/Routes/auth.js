const router = require("express").Router();
const { register, login, logout, forgotPassword, resetPassword, activateAccount } = require("../Controllers/auth");
const { validateLogin, validateRegister, execValidations } = require("../Utils/validations");

router.get("/logout", logout);

router.post("/login", validateLogin(), execValidations, login);

router.post("/register", validateRegister(), execValidations, register);

router.get("/account_activation/:token", activateAccount);

router.put("/reset_password/:token", resetPassword);

router.post("/forgot_password", forgotPassword);

module.exports = router;