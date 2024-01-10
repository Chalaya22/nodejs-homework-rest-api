const { User } = require("../models/user");

const { HttpError, ctrlWrapper } = require("../helpers");

const bcrypt = require("bcrypt");

// token
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = process.env;

// register
const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    password: newUser.password,
    email: newUser.email,
  });
};

// login
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  res.status(201).json({ token });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
};
