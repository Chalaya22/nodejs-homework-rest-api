const express = require("express");
const { validateBody, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/user");
const ctrl = require("../../controlers/auth");
const router = express.Router(); // обьект где мы будем записывать регистр, авториз...

// sigh up
router.post("/register", validateBody(schemas.registerSchema), ctrl.register);
// sing in
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);
// current
router.get("/current", authenticate, ctrl.getCurrent);
module.exports = router;
