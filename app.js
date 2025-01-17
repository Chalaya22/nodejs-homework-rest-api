const express = require("express");
const logger = require("morgan");
const cors = require("cors");

require("dotenv").config();

const app = express(); // це є наш веб сервер
const authRouter = require("./routes/api/auth");
const contactsRouter = require("./routes/api/contacts"); // импортируем страницу с контактавми ( часть веб-сервера)

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
// avatar
app.use(express.static("public"));

app.use("/api/users", authRouter); // коти прийде запит з /api/auth,треба оброблювати його authRouter
app.use("/api/contacts", contactsRouter); // коти прийде запит з /api/contacts,треба оброблювати його contactsRoute

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
