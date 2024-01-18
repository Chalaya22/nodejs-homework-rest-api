const { User } = require("../models/user");

const { HttpError, ctrlWrapper } = require("../helpers");

const bcrypt = require("bcrypt");

// avatars
const Jimp = require("jimp");
const gravatar = require("gravatar");
const path = require("path");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");
const fs = require("fs/promises");

// token
const jwt = require("jsonwebtoken");

// const { path } = require("../app");

const { SECRET_KEY } = process.env;

// register
const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
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
  await User.findByIdAndUpdate(user._id, { token });

  res.status(201).json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};
// getCurrent
const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({
    email,
    subscription,
  });
};
// logout
const logout = async (req, res) => {
  const { _id: id } = req.user;
  const user = await User.findById(id);
  if (!user) {
    throw HttpError(401, "Not authorized");
  }
  await User.findByIdAndUpdate(id, { token: " " });
  res.status(204).json();
};
// updateSubscription
const updateSubscription = async (req, res) => {
  const { id: _id } = req.user;
  const { subscription } = req.body;
  const result = await User.findByIdAndUpdate(
    { _id },
    { subscription },
    { new: true }
  );
  if (!result) {
    throw HttpError(404, "Not found");
  } else {
    res.status(200).json(result);
  }
};
// updateAvatar;
const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tmpUpload, originalname } = req.file;
  const fileName = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, fileName);
  await fs.rename(tmpUpload, resultUpload);
  const avatarURL = path.join("avatars", fileName);

  // const image = await Jimp.read(tmpUpload);
  // await image.resize(250, 250).writeAsync(tmpUpload);

  const user = await User.findByIdAndUpdate(_id, { avatarURL });
  if (!user) {
    throw HttpError(401, "Not authorized");
  }

  res.status(200).json({ avatarURL: user.avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
