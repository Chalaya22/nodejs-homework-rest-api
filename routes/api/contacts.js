const express = require("express");
const router = express.Router();
const ctrl = require("../../controlers/contacts");

const {
  validateBody,
  isEmptyBody,
  isValidId,
  isEmptyBodyFavorite,
} = require("../../middlewares");

const { schemas } = require("../../models/contact");

router.get("/", ctrl.listContacts);

router.get("/:id", isValidId, ctrl.getContactById);

router.post("/", validateBody(schemas.addSchema), ctrl.addContact);

router.patch(
  "/:id/favorite",
  isEmptyBodyFavorite,
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateStatusContact
);
router.delete("/:id", isValidId, ctrl.removeContact);

router.put(
  "/:id",
  isEmptyBody,
  isValidId,
  validateBody(schemas.updateSchema),
  ctrl.updateContact
);

module.exports = router;
