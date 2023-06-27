const express = require('express');
const router = express.Router();
const { createCatgory, updateCategory, deleteCategory, getAllCategory, getCategory } = require('../controller/blogCatCtrl')
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware')


router.post('/', authMiddleware, isAdmin, createCatgory)
router.put('/:id', authMiddleware, isAdmin, updateCategory)
router.delete('/:id', deleteCategory);
router.get('/:id', getCategory)
router.get('/', getAllCategory);
module.exports = router