const router = require("express").Router();
const { register, login, logout, forgotPassword, resetPassword } = require("../Controllers/auth");

router.post("/login", login);

router.get("/logout", logout);

router.post("/register", register);

router.put("/reset_password", resetPassword);

router.post("/forgot_password", forgotPassword);

module.exports = router;