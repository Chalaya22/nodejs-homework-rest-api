const { User } = require("../models/user");

const { HttpError, ctrlWrapper, sendEmail } = require("../helpers");

const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

// avatars
const Jimp = require("jimp");
const gravatar = require("gravatar");
const path = require("path");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");
const fs = require("fs/promises");

// token
const jwt = require("jsonwebtoken");

const { SECRET_KEY, BASE_URL } = process.env;

// REGISTER
const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  // створюємо еmail на підтвердження
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target= "_blank" href = "${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
  };
  //  відсилаємо еmail на підтвердження
  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
};

// VERYFY
const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, " User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.status(200).json({ message: "Verification successful" });
};

// RESENDVERIFYEMAIL
const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!req.body.email) {
    throw HttpError(400, "missing required field email");
  }

  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (!user.verify) {
    throw HttpError(400, "Verification email sent");
  }
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target= "_blank" href = "${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`,
  };
  await sendEmail(verifyEmail);

  res.status(200).json({ message: " Verification has already been passed" });
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(404, "User not found");
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
// GETCURRENT
const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({
    email,
    subscription,
  });
};
// LOGOUT
const logout = async (req, res) => {
  const { _id: id } = req.user;
  const user = await User.findById(id);
  if (!user) {
    throw HttpError(401, "Not authorized");
  }
  await User.findByIdAndUpdate(id, { token: " " });
  res.status(204).json();
};
// UPDATESUBSRUBTION
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
// UPDATEAVATAR
const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  if (!req.file) {
    throw HttpError(400, "missing  field avatar");
  }
  const { path: tempUpload, originalname } = req.file;

  const fileName = `${_id}_${originalname}`;

  const resultUpload = path.join(avatarsDir, fileName);

  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", fileName);

  const image = await Jimp.read(resultUpload);
  await image.resize(250, 250).writeAsync(resultUpload);

  const user = await User.findByIdAndUpdate(_id, { avatarURL }, { new: true });

  if (!user) {
    throw HttpError(401, "Not authorized");
  }

  res.status(200).json({ avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};
