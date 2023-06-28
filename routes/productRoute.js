const express = require('express');
const { createProduct, getProduct, getProducts, updateProduct, deleteProduct, addToWishlist, rating } = require('../controller/productCtrl');
const Router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
Router.post('/', authMiddleware, isAdmin, createProduct)
Router.get('/', getProducts);
Router.get('/:id', getProduct);
Router.put('/wishlist', authMiddleware, addToWishlist)
Router.put('/rating', authMiddleware, rating)
Router.put('/:id', authMiddleware, isAdmin, updateProduct);
Router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

module.exports = Router;