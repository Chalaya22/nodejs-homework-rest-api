const nodemailers = require("nodemailers");
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
const transport = nodemailers.createTransport(nodemailerConfig);
const email = {
  to: "xahit80553@rentaen.com",
  from: "chalayaolga222@meta.ua",
  subject: "Test ",
  http: "<p>Test email from host: 3000</p>",
};
