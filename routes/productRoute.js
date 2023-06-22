const express = require('express');
const { createProduct, getProduct, getProducts, updateProduct, deleteProduct } = require('../controller/productCtrl');
const Router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
Router.post('/', authMiddleware, isAdmin, createProduct)
Router.get('/', getProducts);
Router.get('/:id', getProduct);
Router.put('/:id', authMiddleware, isAdmin, updateProduct);
Router.delete('/:id', authMiddleware, isAdmin, deleteProduct);
module.exports = Router;