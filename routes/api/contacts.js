const express = require("express");
const router = express.Router();
const ctrl = require("../../controlers/contacts");

const { validateBody, isEmptyBody, isValidId } = require("../../middlewares");

const { schemas } = require("../../models/contact");

router.get("/", ctrl.listContacts);

router.get("/:id", isValidId, ctrl.getContactById);

router.post("/", validateBody(schemas.addSchema), ctrl.addContact);

// router.delete("/:id", ctrl.removeContact);

// router.put(
//   "/:id",
//   isEmptyBody,
//   validateBody(schemas.updateSchema),
//   ctrl.updateContact
// );

module.exports = router;
