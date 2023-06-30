const express = require("express");
const router = express.Router();
const { createUser, loginUserCtrl, getAllUsers, getSingleUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress, userCart, getUserCart, emptyCart, applyCoupon, createOrder, getOrders, updateOrderStatus } = require('../controller/userCtrl');
const { authMiddleware } = require("../middlewares/authMiddleware");
const { isAdmin } = require('../middlewares/authMiddleware')
router.post('/register', createUser);
router.put('/password', authMiddleware, updatePassword)
router.post('/forgot-password-token', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword);
router.post('/login', loginUserCtrl)
router.post('/admin-login', loginAdmin)
router.post('/cart', authMiddleware, userCart)
router.get('/cart', authMiddleware, getUserCart);
router.post('/cart/apply-coupon', authMiddleware, applyCoupon)
router.post('/cart/cash-order', authMiddleware, createOrder)
router.get('/get-orders', authMiddleware, getOrders)
router.put('/update-order/:id', authMiddleware, isAdmin, updateOrderStatus)
router.get('/all-users', getAllUsers);
router.get('/wishlist', authMiddleware, getWishlist);
router.get('/refresh', handleRefreshToken)
router.get('/logout', logout)
router.delete('/empty-cart', authMiddleware, emptyCart);
router.get('/:id', authMiddleware, isAdmin, getSingleUser);
router.delete('/:id', deleteUser);
router.put('/edit-user', authMiddleware, updateUser)
router.put('/save-address', authMiddleware, saveAddress);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser)
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser)











module.exports = router;