const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");
// const emailRegExpression = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const subscriptionList = ["starter", "pro", "business"];

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    email: {
      type: String,
      // match: emailRegExpression,
      required: true,
      unique: true,
    },
    subscription: {
      type: String,
      enum: subscriptionList,
      default: "starter",
    },
    token: String,
  },
  { versionKey: false, timestamps: true }
);
userSchema.post("save", handleMongooseError); // якщо валідація не пройдена то викидаємо помилку

const registerSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().required(),
  subscription: Joi.string().validate(...subscriptionList),
});

const loginSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().required(),
});
const schemas = { registerSchema, loginSchema };
const User = model("user", userSchema);

module.exports = { User, schemas };
