const express = require('express');
const { createProduct, getProduct, getProducts, updateProduct, deleteProduct, addToWishlist, rating, uploadImages, deleteImages } = require('../controller/productCtrl');
const Router = express.Router();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')
const { productImgResize, uploadPhoto } = require('../middlewares/uploadImg')

Router.post('/', authMiddleware, isAdmin, createProduct)
Router.get('/', getProducts);
Router.get('/:id', getProduct);
Router.put('/upload', authMiddleware, isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImages)
Router.put('/wishlist', authMiddleware, addToWishlist)
Router.put('/rating', authMiddleware, rating)
Router.put('/:id', authMiddleware, isAdmin, updateProduct);
Router.delete('/:id', authMiddleware, isAdmin, deleteProduct);
Router.delete('/delete-image/:id', authMiddleware, isAdmin, deleteImages);
module.exports = Router;