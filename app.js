const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const app = express(); // це є наш веб сервер
const contactsRouter = require("./routes/api/contacts"); // импортируем страницу с контактавми ( часть веб-сервера)

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter); // коти прийде запит з /api/contacts,шукай його обробник тут

app.use((err, req, res, next) => {
  const { status = 400, message = " " } = err;
  res.status(status).json({ message });
});

app.use((err, req, res, next) => {
  const { status = 500, massage = "Server error" } = err;
  res.status(status).json({ massage });
});

module.exports = app;
