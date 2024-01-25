// функція, яка відправляє листа
const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "chalayaolga222@meta.ua",
    pass: META_PASSWORD,
  },
};
const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: "chalayaolga222@meta.ua" };
  await transport.sendMail(email);
  return true;
};
// const email = {
//   to: "sakar73632@rentaen.com",
//   from: "chalayaolga222@meta.ua",
//   subject: "Test ",
//   http: "<p>Test email from host: 3000</p>",
// };
module.exports = sendEmail;
