const express = require("express");
const { validateBody } = require("../../middlewares");
const { schemas } = require("../../models/user");
const ctrl = require("../../controlers/auth");
const router = express.Router(); // обьект где мы будем записывать регистр, авториз...

// sigh up
router.post("/register", validateBody(schemas.registerSchema), ctrl.register);
// sing in
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

module.exports = router;
