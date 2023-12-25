const express = require("express");
const contacts = require("../../models/contacts");

const router = express.Router(); // метод Router() создаал страницу web-serverа с маршрутами контактов

router.get("/", async (req, res) => {
  try {
    const result = await contacts.listContacts();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ massage: "Server error" });
  }
});

router.get("/:contactId", async (req, res, next) => {
  res.json(contacts[0]);
});

router.post("/", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.delete("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

router.put("/:contactId", async (req, res, next) => {
  res.json({ message: "template message" });
});

module.exports = router; // Экспорт страницы
