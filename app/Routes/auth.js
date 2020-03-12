const router = require("express").Router();
const { register, login, logout, forgotPassword, resetPassword } = require("../Controllers/auth");
const { validateLogin, validateRegister, execValidations } = require("../Utils/validations");

router.get("/logout", logout);

router.post("/login", validateLogin(), execValidations, login);

router.post("/register", validateRegister(), execValidations, register);

router.put("/reset_password", resetPassword);

router.post("/forgot_password", forgotPassword);

module.exports = router;