const express = require('express')
const route = express.Router();
const { createCoupon, getAllCoupon, updateCoupon, deleteCoupon } = require('../controller/couponCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
route.post('/', authMiddleware, isAdmin, createCoupon);
route.get('/', authMiddleware, isAdmin, getAllCoupon)
route.put('/:id', authMiddleware, isAdmin, updateCoupon)
route.delete('/:id', authMiddleware, isAdmin, deleteCoupon)


module.exports = route;