const express = require("express");
const router = express.Router();
const { createUser, loginUserCtrl, getAllUsers, getSingleUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword } = require('../controller/userCtrl');
const { authMiddleware } = require("../middlewares/authMiddleware");
const { isAdmin } = require('../middlewares/authMiddleware')
router.post('/register', createUser);
router.put('/password', authMiddleware, updatePassword)
router.post('/forgot-password-token', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword);
router.post('/login', loginUserCtrl)
router.get('/all-users', getAllUsers);
router.get('/refresh', handleRefreshToken)
router.get('/logout', logout)
router.get('/:id', authMiddleware, isAdmin, getSingleUser);
router.delete('/:id', deleteUser);
router.put('/edit-user', authMiddleware, updateUser)
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser)
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser)











module.exports = router;