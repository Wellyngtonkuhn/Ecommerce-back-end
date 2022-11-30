const express = require("express");
const route = express.Router();
const productsController = require("../controllers/productsShop");

// Rota para obter todos os produtos
route.get("/shop", productsController.products);

module.exports = route;
