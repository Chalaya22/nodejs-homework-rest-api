const validateBody = require("./validateBody");
const { isEmptyBody, isEmptyBodyFavorite } = require("./emtyBody");
const isValidId = require("./isValidId");
const authenticate = require("./authenticate");

module.exports = {
  validateBody,
  isEmptyBody,
  isValidId,
  isEmptyBodyFavorite,
  authenticate,
};
