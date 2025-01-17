const express = require("express");
const { validateBody, authenticate, upload } = require("../../middlewares");
const { schemas } = require("../../models/user");
const ctrl = require("../../controlers/auth");
const router = express.Router(); // обьект где мы будем записывать регистр, авториз...

// sigh up
router.post("/register", validateBody(schemas.registerSchema), ctrl.register);
router.get("/verify/:verificationToken", ctrl.verifyEmail);
router.post(
  "/verify",
  validateBody(schemas.emailShema),
  ctrl.resendVerifyEmail
);
// sing in
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);
// current
router.get("/current", authenticate, ctrl.getCurrent);
// logout
router.post("/logout", authenticate, ctrl.logout);
// subscription
router.patch(
  "/subscription",
  authenticate,
  validateBody(schemas.subscriptionSchema),
  ctrl.updateSubscription
);
// avatars
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateAvatar
);

module.exports = router;
