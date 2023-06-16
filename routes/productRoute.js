const express = require('express');
const { createProduct, getProduct } = require('../controller/productCtrl');
const Router = express.Router();

Router.post('/', createProduct)
Router.get('/:id', getProduct)

module.exports = Router;