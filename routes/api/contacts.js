const express = require("express");
const router = express.Router();
const ctrl = require("../../controlers/contacts");

const {
  validateBody,
  isEmptyBody,
  isValidId,
  isEmptyBodyFavorite,
  authenticate,
} = require("../../middlewares");

const { schemas } = require("../../models/contact");

router.get("/", authenticate, ctrl.listContacts);

router.get("/:id", isValidId, authenticate, ctrl.getContactById);

router.post(
  "/",
  validateBody(schemas.addSchema),
  authenticate,
  ctrl.addContact
);

router.patch(
  "/:id/favorite",
  isEmptyBodyFavorite,
  isValidId,
  authenticate,
  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateStatusContact
);
router.delete("/:id", isValidId, ctrl.removeContact);

router.put(
  "/:id",
  isEmptyBody,
  isValidId,
  authenticate,
  validateBody(schemas.updateSchema),
  ctrl.updateContact
);

module.exports = router;
