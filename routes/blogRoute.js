const express = require('express');
const { createBlog, getBlogs, updateBlog, getBlog, deleteBlog, likeBlog } = require('../controller/blogCtrl');
const { isAdmin, authMiddleware, isAuthor } = require('../middlewares/authMiddleware');
const { route } = require('./authRoute');
const router = express.Router();

router.get('/', authMiddleware, getBlogs);
router.get('/:id', getBlog);
router.post('/', authMiddleware, isAdmin, createBlog)
router.put('/likes', authMiddleware, likeBlog)
router.put('/:id', authMiddleware, isAdmin, updateBlog)
router.delete('/:id', authMiddleware, isAuthor, deleteBlog);

module.exports = router;